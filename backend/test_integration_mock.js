// Teste automático do fluxo de integração mock
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

async function run() {
  // 1. Registrar usuário
  const user = {
    name: 'Teste Mock',
    email: 'mocktest@fiscal.com',
    password: '123456',
    role: 'admin'
  };
  await api.post('/auth/register', user).catch(() => {}); // ignora se já existe
  const login = await api.post('/auth/login', { email: user.email, password: user.password });
  api.defaults.headers.common['Authorization'] = `Bearer ${login.data.token}`;

  // 2. Criar produto
  const prod = await api.post('/products', {
    descricao: 'Produto Mock Integração',
    marca: 'MarcaMock',
    modelo: 'ModeloMock',
    pais_origem: 'Brasil'
  });

  // 3. Classificar
  const classif = await api.post(`/classify/${prod.data.id}`);

  // 4. Aprovar
  await api.post(`/approve/${classif.data.id}`, { status: 'aprovado' });

  // 5. Enviar integração mock
  const resp = await api.post(`/integration/send/${prod.data.id}`);
  console.log('Resposta integração mock:', resp.data);
}

run().catch(e => {
  console.error('Erro no teste:', e.response?.data || e.message);
  process.exit(1);
});
