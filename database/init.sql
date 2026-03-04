-- Ativa extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'analista',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  pais_origem VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de códigos NCM
CREATE TABLE ncm_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  embedding vector(1536)
);

-- Tabela de classificações
CREATE TABLE product_classifications (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  ncm_code_id INTEGER REFERENCES ncm_codes(id),
  confidence INTEGER NOT NULL,
  justification TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pendente',
  reviewed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de integrações
CREATE TABLE integrations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tokens para recuperação de senha
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações do sistema por usuário
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL DEFAULT 'Pyramid Diamantados',
  notification_email VARCHAR(200) NOT NULL DEFAULT 'ti@pyramiddiamantados.com.br',
  default_workflow VARCHAR(30) NOT NULL DEFAULT 'automatico',
  ai_auto_classify BOOLEAN NOT NULL DEFAULT TRUE,
  require_approval BOOLEAN NOT NULL DEFAULT TRUE,
  portal_integration BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed de usuários
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@fiscal.com', '$2b$10$LivSiYol8hxl5wnDnE/6gupDLlN3Wvwq.gcTSkasf6dI7Asz3wj5q', 'admin'),
  ('Analista', 'analista@fiscal.com', '$2b$10$l2venlZHy6l7.fwDR9WIjeZbvUq.Cp/iu68zHJoy9Yqyi9gvbV0my', 'analista'),
  ('Admin Local', 'admin@local.dev', '$2b$10$K1wQwQwQwQwQwQwQwQwQwOeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', 'admin');

-- Seed de produtos
INSERT INTO products (descricao, marca, modelo, pais_origem, created_by) VALUES
  ('Smartphone importado', 'Xiaomi', 'Redmi Note 12', 'China', 1),
  ('Notebook importado', 'Dell', 'Inspiron 15', 'EUA', 1),
  ('Câmera digital', 'Canon', 'EOS M50', 'Japão', 2);

-- Seed de NCM mock
INSERT INTO ncm_codes (code, description) VALUES
  ('85171231', 'Aparelhos telefônicos celulares'),
  ('84713019', 'Máquinas automáticas para processamento de dados'),
  ('85258019', 'Câmeras digitais'),
  ('84714900', 'Outros computadores portáteis'),
  ('85285990', 'Outros aparelhos de vídeo'),
  ('85044090', 'Fontes de alimentação'),
  ('85423190', 'Circuitos integrados'),
  ('85366990', 'Tomadas e conectores'),
  ('84717010', 'Unidades de disco rígido'),
  ('84718000', 'Outros equipamentos de informática');
