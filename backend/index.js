import { exec } from 'child_process';
// Executa init.sql via psql se as tabelas não existirem
async function ensureDatabaseInitialized() {
  try {
    const result = await pool.query("SELECT to_regclass('public.users') AS users_table");
    if (!result.rows[0].users_table) {
      console.log('Tabelas não encontradas. Executando init.sql via psql...');
      const sqlPath = path.resolve(process.cwd(), '../database/init.sql');
      const dbUrl = process.env.DATABASE_URL;
      const match = dbUrl.match(/postgres:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);
      if (match) {
        const [, user, pass, host, port, db] = match;
        const cmd = `psql -U ${user} -h ${host} -p ${port} -d ${db} -f \"${sqlPath}\"`;
        exec(cmd, { env: { ...process.env, PGPASSWORD: pass } }, (err, stdout, stderr) => {
          if (err) {
            console.error('Falha ao executar init.sql:', stderr);
          } else {
            console.log('init.sql executado com sucesso!');
          }
        });
      }
    }
  } catch (err) {
    console.warn('Erro ao verificar tabelas:', err.message);
  }
}
import path from 'path';
import { readFile } from 'fs/promises';
// Executa init.sql automaticamente no Postgres
async function runInitSql() {
  try {
    const sqlPath = path.resolve(process.cwd(), '../database/init.sql');
    const sql = await readFile(sqlPath, 'utf-8');
    // Divide comandos por ';' e executa cada um
    for (const cmd of sql.split(/;\s*\n/)) {
      if (cmd.trim()) await pool.query(cmd);
    }
    console.log('init.sql executado com sucesso!');
  } catch (err) {
    console.warn('Falha ao executar init.sql:', err.message);
  }
}
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { parse } from 'csv-parse/sync';
import { sendToPortal } from './src/integration/portalUnico/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = Number(process.env.PORT || 3001);
const LOCAL_USERS_FILE = new URL('./.local-users.json', import.meta.url);
const LOCAL_SETTINGS_FILE = new URL('./.local-settings.json', import.meta.url);

let dbAvailable = false;
let localUsers = [];
let localSettingsByUser = {};

// Validação automática da conexão com o Postgres
async function validatePostgresConnection() {
  try {
    await pool.query('SELECT 1');
    dbAvailable = true;
    console.log('Conexão com Postgres: OK');
    await ensureDatabaseInitialized();
    await runInitSql();
  } catch (err) {
    dbAvailable = false;
    console.log('Conexão com Postgres: FALHOU');
    console.log('Motivo:', err.message);
  }
}

validatePostgresConnection();

function generateJwt(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

async function saveLocalUsers() {
  await writeFile(LOCAL_USERS_FILE, JSON.stringify(localUsers, null, 2), 'utf-8');
}

async function ensureLocalUsers() {
  try {
    const content = await readFile(LOCAL_USERS_FILE, 'utf-8');
    localUsers = JSON.parse(content);
  } catch {
    const defaultUser = {
      id: 1,
      name: 'Admin Local',
      email: 'admin@local.dev',
      role: 'admin',
      password: await bcrypt.hash('admin123', 10)
    };
    localUsers = [defaultUser];
    await saveLocalUsers();
  }
}

function defaultSettings() {
  return {
    companyName: 'Pyramid Diamantados',
    notificationEmail: 'ti@pyramiddiamantados.com.br',
    defaultWorkflow: 'automatico',
    aiAutoClassify: true,
    requireApproval: true,
    portalIntegration: true
  };
}

async function saveLocalSettings() {
  await writeFile(LOCAL_SETTINGS_FILE, JSON.stringify(localSettingsByUser, null, 2), 'utf-8');
}

async function ensureLocalSettings() {
  try {
    const content = await readFile(LOCAL_SETTINGS_FILE, 'utf-8');
    localSettingsByUser = JSON.parse(content);
  } catch {
    localSettingsByUser = {};
    await saveLocalSettings();
  }
}

async function ensureDatabaseObjects() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(128) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      company_name VARCHAR(200) NOT NULL DEFAULT 'Pyramid Diamantados',
      notification_email VARCHAR(200) NOT NULL DEFAULT 'ti@pyramiddiamantados.com.br',
      default_workflow VARCHAR(30) NOT NULL DEFAULT 'automatico',
      ai_auto_classify BOOLEAN NOT NULL DEFAULT TRUE,
      require_approval BOOLEAN NOT NULL DEFAULT TRUE,
      portal_integration BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function getMailTransport() {
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (hasSmtp) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
}

async function sendResetEmail(to, token) {
  const transporter = getMailTransport();
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@classificacaofiscal.local',
    to,
    subject: 'Recuperação de senha - Classificação Fiscal',
    html: `
      <p>Olá,</p>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este link expira em 30 minutos.</p>
    `
  });

  if (!process.env.SMTP_HOST) {
    console.log('Email de recuperação (modo desenvolvimento):', info.message);
    console.log('Link de recuperação (modo desenvolvimento):', resetLink);
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!dbAvailable) {
      if (!normalizedEmail || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }
      if (localUsers.some((entry) => entry.email === normalizedEmail)) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hash = await bcrypt.hash(password, 10);
      const nextId = localUsers.length ? Math.max(...localUsers.map((entry) => entry.id)) + 1 : 1;
      const user = {
        id: nextId,
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: hash,
        role: role || 'analista'
      };

      localUsers.push(user);
      await saveLocalUsers();

      const token = generateJwt(user);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, normalizedEmail, hash, role || 'analista']
    );

    const user = result.rows[0];
    const token = generateJwt(user);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha para continuar.' });
    }

    if (!dbAvailable) {
      const user = localUsers.find((entry) => entry.email === normalizedEmail);
      if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });

      const token = generateJwt(user);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });

    const token = generateJwt(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(400).json({ error: 'Erro ao processar login. Verifique os dados e tente novamente.' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    if (!dbAvailable) {
      const user = localUsers.find((entry) => entry.id === req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }

    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/auth/forgot-password', async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 OR expires_at < NOW()', [user.id]);
      await pool.query(
        "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 minutes')",
        [user.id, tokenHash]
      );

      await sendResetEmail(user.email, rawToken);
    }

    res.json({ message: 'Se o email existir, você receberá um link de recuperação.' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenResult = await pool.query(
      `SELECT prt.id, prt.user_id
       FROM password_reset_tokens prt
       WHERE prt.token_hash = $1
         AND prt.used = FALSE
         AND prt.expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    );

    const resetToken = tokenResult.rows[0];
    if (!resetToken) return res.status(400).json({ error: 'Token inválido ou expirado' });

    const hash = await bcrypt.hash(password, 10);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, resetToken.user_id]);
    await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [resetToken.id]);

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/settings', authMiddleware, async (req, res) => {
  try {
    if (!dbAvailable) {
      const key = String(req.user.id);
      if (!localSettingsByUser[key]) {
        localSettingsByUser[key] = defaultSettings();
        await saveLocalSettings();
      }
      return res.json(localSettingsByUser[key]);
    }

    const result = await pool.query(
      `SELECT company_name, notification_email, default_workflow, ai_auto_classify, require_approval, portal_integration
       FROM app_settings
       WHERE user_id = $1`,
      [req.user.id]
    );

    let settings = result.rows[0];

    if (!settings) {
      const created = await pool.query(
        `INSERT INTO app_settings (user_id)
         VALUES ($1)
         RETURNING company_name, notification_email, default_workflow, ai_auto_classify, require_approval, portal_integration`,
        [req.user.id]
      );
      settings = created.rows[0];
    }

    res.json({
      companyName: settings.company_name,
      notificationEmail: settings.notification_email,
      defaultWorkflow: settings.default_workflow,
      aiAutoClassify: settings.ai_auto_classify,
      requireApproval: settings.require_approval,
      portalIntegration: settings.portal_integration
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/settings', authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      notificationEmail,
      defaultWorkflow,
      aiAutoClassify,
      requireApproval,
      portalIntegration
    } = req.body;

    const allowedWorkflows = ['automatico', 'manual', 'hibrido'];
    if (!allowedWorkflows.includes(defaultWorkflow)) {
      return res.status(400).json({ error: 'Fluxo padrão inválido' });
    }

    if (!dbAvailable) {
      const key = String(req.user.id);
      localSettingsByUser[key] = {
        companyName: companyName || defaultSettings().companyName,
        notificationEmail: notificationEmail || defaultSettings().notificationEmail,
        defaultWorkflow,
        aiAutoClassify: Boolean(aiAutoClassify),
        requireApproval: Boolean(requireApproval),
        portalIntegration: Boolean(portalIntegration)
      };
      await saveLocalSettings();
      return res.json(localSettingsByUser[key]);
    }

    const upsert = await pool.query(
      `INSERT INTO app_settings (
        user_id,
        company_name,
        notification_email,
        default_workflow,
        ai_auto_classify,
        require_approval,
        portal_integration,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        company_name = EXCLUDED.company_name,
        notification_email = EXCLUDED.notification_email,
        default_workflow = EXCLUDED.default_workflow,
        ai_auto_classify = EXCLUDED.ai_auto_classify,
        require_approval = EXCLUDED.require_approval,
        portal_integration = EXCLUDED.portal_integration,
        updated_at = NOW()
      RETURNING company_name, notification_email, default_workflow, ai_auto_classify, require_approval, portal_integration`,
      [
        req.user.id,
        companyName,
        notificationEmail,
        defaultWorkflow,
        Boolean(aiAutoClassify),
        Boolean(requireApproval),
        Boolean(portalIntegration)
      ]
    );

    const settings = upsert.rows[0];

    res.json({
      companyName: settings.company_name,
      notificationEmail: settings.notification_email,
      defaultWorkflow: settings.default_workflow,
      aiAutoClassify: settings.ai_auto_classify,
      requireApproval: settings.require_approval,
      portalIntegration: settings.portal_integration
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/catalog/ncm', authMiddleware, async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().toLowerCase();
    const limit = Math.min(Number(req.query.limit || 200), 1000);

    const result = await pool.query(
      `SELECT id, code, description
       FROM ncm_codes
       WHERE ($1 = '' OR LOWER(code) LIKE '%' || $1 || '%' OR LOWER(description) LIKE '%' || $1 || '%')
       ORDER BY code
       LIMIT $2`,
      [search, limit]
    );

    const totalResult = await pool.query('SELECT COUNT(*)::int AS total FROM ncm_codes');
    res.json({
      total: totalResult.rows[0].total,
      items: result.rows
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/catalog/import', authMiddleware, async (req, res) => {
  try {
    const csvContent = String(req.body.csvContent || '');
    const delimiter = String(req.body.delimiter || ';');

    if (!csvContent.trim()) {
      return res.status(400).json({ error: 'Conteúdo CSV vazio' });
    }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter
    });

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Nenhuma linha válida encontrada no CSV' });
    }

    let imported = 0;
    let skipped = 0;

    for (const row of records) {
      const rawCode = String(row.code || row.codigo || row.ncm || row.CODIGO || row.CODE || '').trim();
      const rawDescription = String(
        row.description || row.descricao || row.DESCRIPTION || row.DESCRICAO || row.descr || ''
      ).trim();

      const normalizedCode = rawCode.replace(/\D/g, '').slice(0, 8);

      if (!normalizedCode || !rawDescription) {
        skipped += 1;
        continue;
      }

      await pool.query(
        `INSERT INTO ncm_codes (code, description)
         VALUES ($1, $2)
         ON CONFLICT (code)
         DO UPDATE SET description = EXCLUDED.description`,
        [normalizedCode, rawDescription]
      );
      imported += 1;
    }

    res.json({
      message: 'Tabela importada com sucesso',
      imported,
      skipped
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/products', authMiddleware, async (req, res) => {
  try {
    const { descricao, marca, modelo, pais_origem } = req.body;
    const result = await pool.query(
      'INSERT INTO products (descricao, marca, modelo, pais_origem, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [descricao, marca, modelo, pais_origem, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/products', authMiddleware, async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/products/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const product = result.rows[0];
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/classify/:productId', authMiddleware, async (req, res) => {
  try {
    const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.productId]);
    const product = productResult.rows[0];
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    const ncmResult = await pool.query('SELECT id, code, description FROM ncm_codes ORDER BY id LIMIT 1');
    const ncm = ncmResult.rows[0];
    if (!ncm) return res.status(400).json({ error: 'Base NCM não carregada' });

    const insertResult = await pool.query(
      `INSERT INTO product_classifications (product_id, ncm_code_id, confidence, justification, status)
       VALUES ($1, $2, $3, $4, 'pendente')
       RETURNING id, product_id, ncm_code_id, confidence, justification, status`,
      [product.id, ncm.id, 88, `Classificação sugerida para ${product.descricao}`]
    );

    const classification = insertResult.rows[0];
    res.json({ ...classification, code: ncm.code });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/classification/:productId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pc.id, pc.product_id, pc.ncm_code_id, pc.confidence, pc.justification, pc.status, ncm.code
       FROM product_classifications pc
       JOIN ncm_codes ncm ON ncm.id = pc.ncm_code_id
       WHERE pc.product_id = $1
       ORDER BY pc.created_at DESC
       LIMIT 1`,
      [req.params.productId]
    );

    const classification = result.rows[0];
    if (!classification) return res.json(null);
    res.json(classification);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/approve/:classificationId', authMiddleware, async (req, res) => {
  try {
    const status = req.body.status || 'aprovado';
    const result = await pool.query(
      'UPDATE product_classifications SET status = $1, reviewed_by = $2 WHERE id = $3 RETURNING *',
      [status, req.user.id, req.params.classificationId]
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Classificação não encontrada' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/integration/send/:productId', authMiddleware, async (req, res) => {
  try {
    const product = (await pool.query('SELECT * FROM products WHERE id = $1', [req.params.productId])).rows[0];
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    const classification = (await pool.query(
      `SELECT pc.*, ncm.code
       FROM product_classifications pc
       JOIN ncm_codes ncm ON pc.ncm_code_id = ncm.id
       WHERE pc.product_id = $1 AND pc.status = 'aprovado'
       ORDER BY pc.created_at DESC
       LIMIT 1`,
      [req.params.productId]
    )).rows[0];

    if (!classification) return res.status(400).json({ error: 'Produto não possui classificação aprovada' });
    const result = await sendToPortal(product, classification);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

async function bootstrap() {
  try {
    await ensureDatabaseObjects();
    dbAvailable = true;
    console.log('Banco PostgreSQL conectado com sucesso.');
  } catch (err) {
    dbAvailable = false;
    console.warn('PostgreSQL indisponível. Iniciando em modo local sem Docker.');
    console.warn('Usuário padrão local: admin@local.dev / admin123');
    console.warn(`Motivo: ${err.message}`);
    await ensureLocalUsers();
    await ensureLocalSettings();
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao inicializar backend:', err);
  process.exit(1);
});
