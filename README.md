# Classificação Fiscal NCM com IA

## Descrição
Sistema completo para classificação fiscal de produtos importados usando IA, busca vetorial (pgvector), integração OpenAI, catálogo JSON, aprovação humana, e integração futura com Portal Único.

## Estrutura

/classificacao-fiscal
 ├── backend
 ├── frontend
 ├── database
 ├── docker-compose.yml
 └── README.md

## Requisitos
- Node.js
- (Opcional) PostgreSQL com pgvector
- (Opcional) Docker
- OpenAI API Key

## Como rodar

### Modo Local (sem Docker/Postgres)
**Não é necessário Docker nem Postgres!**

1. Configure as variáveis de ambiente no arquivo `.env` do backend:
   - OPENAI_API_KEY
   - JWT_SECRET
   - **Não defina DATABASE_URL** (ou remova/comment do .env)

2. Execute o backend localmente:
   - Abra o terminal na pasta `backend` e rode:
     ```
     npm install
     npm start
     ```
   - O backend irá automaticamente usar o modo local/fallback (arquivos `.local-users.json` e `.local-settings.json`).

3. Execute o frontend:
   - Abra o terminal na pasta `frontend` e rode:
     ```
     npm install
     npm run dev
     ```

4. O sistema estará disponível em:
   - Backend: http://localhost:3001
   - Frontend: http://localhost:3000

**Usuário padrão:**
   - Email: `admin@local.dev`
   - Senha: `admin123`

### Modo Postgres Local (sem Docker)
Você pode usar um banco Postgres instalado localmente, sem Docker:

1. Instale o PostgreSQL em sua máquina (https://www.postgresql.org/download/).
2. Crie um banco de dados e usuário, por exemplo:
   - Banco: `fiscal`
   - Usuário: `postgres` (ou outro de sua escolha)
   - Senha: `sua_senha`
3. No arquivo `.env` do backend, defina:
   - `DATABASE_URL=postgres://usuario:senha@localhost:5432/fiscal`
4. Execute as migrações e seeds:
   - Na pasta `database`, rode os scripts SQL (`init.sql` e outros).
5. Inicie o backend normalmente:
   ```
   npm install
   npm start
   ```
6. O backend irá conectar ao seu Postgres local.

### Modo Docker/Postgres (opcional)
Se quiser usar Docker/Postgres, siga as instruções originais abaixo.

## Importação NCM
- Para importar a tabela oficial NCM, coloque o CSV em `database/ncm.csv`.
- O script de importação será executado automaticamente ao subir o banco (modo Docker/Postgres).

## Testes
- O sistema já possui seed com 3 produtos mock e 10 NCM mock.
- No modo local, usuários e configurações são salvos em arquivos `.local-users.json` e `.local-settings.json` no backend.
## Testes multiusuário na rede

Para permitir que outras pessoas testem o sistema na sua rede local:

1. Certifique-se de que o backend está rodando e acessível na porta 3001.
2. Descubra o IP local do seu computador (ex: 192.168.1.100).
3. Peça para o usuário acessar pelo navegador:
   - Frontend: `http://SEU_IP_LOCAL:3000`
   - Backend: `http://SEU_IP_LOCAL:3001`
4. Se necessário, libere as portas 3000 e 3001 no firewall do Windows.
5. Para acesso remoto (fora da rede), utilize um serviço de túnel como [ngrok.com](https://ngrok.com/) ou [localtunnel.me](https://localtunnel.me/).
6. Usuários podem se registrar normalmente ou usar o login local padrão:
   - Email: `admin@local.dev`
   - Senha: `admin123`

## Variáveis de ambiente
- Veja `.env.example` no backend.
- Para modo local, `DATABASE_URL` pode ser omitido.

## Integração com Portal Único (Modo Mock)

O sistema suporta integração simulada (mock) com o Portal Único:

- Defina `INTEGRATION_MODE=mock` no backend/.env
- O envio para o Portal Único será simulado, gerando protocolo e status fictícios.
- Endpoint: `POST /integration/send/:productId`
- Resposta exemplo:
   {
      "protocolo": "PU202600012345",
      "status": "RECEBIDO",
      "mensagem": "Documento recebido com sucesso"
   }

Pronto para extensão futura para integração real com certificado digital.

## Documentação
- Todos endpoints e fluxos estão documentados no backend.

## Catálogo Portal Único
- JSON gerado e salvo no banco para cada produto classificado.

## Segurança
- JWT obrigatório
- Hash de senha
- Controle de perfil (admin/analista)
- Fallback local: dados salvos em arquivos, apenas para testes/desenvolvimento.

## Deploy no Render
- Serviço web: aponte para o branch `main`, diretório raiz `backend`, build `npm install` e start `npm start` (o Dockerfile já usa Node 20).
- Adicione um Postgres gerenciado ao mesmo projeto e defina `DATABASE_URL` (via "Adicionar a partir de .env") com a string que o Render fornece.
- Inclua as demais variáveis de `[backend/.env.example](backend/.env.example#L1-L14)` (OPENAI key, JWT_SECRET, IMPORT_NCM, INTEGRATION_MODE, FRONTEND_URL, SMTP_*) para que o backend conecte à base e aos serviços externos.
- Após salvar, o Render executa o build/start automaticamente e expõe o endpoint em `https://<seu-servico>.onrender.com/health`.

## Contato
Dúvidas ou sugestões: [Seu email ou contato]
