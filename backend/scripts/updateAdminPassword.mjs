import 'dotenv/config';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const targetUsers = ['admin@fiscal.com', 'admin@local.dev'];

try {
  const hash = await bcrypt.hash('admin123', 10);
  await Promise.all(targetUsers.map((email) => pool.query('UPDATE users SET password = $1 WHERE email = $2', [hash, email])));
  console.log('Senha dos administradores atualizada para admin123.');
} catch (err) {
  console.error('Falha ao atualizar senha:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
