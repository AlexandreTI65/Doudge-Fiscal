# Site Estratégico

Site institucional desenvolvido com Next.js 14 (App Router), TypeScript e Tailwind CSS.

## Tecnologias

- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Framer Motion
- Lucide React (ícones)
- Radix UI + componentes utilitários locais

## Requisitos

- Node.js 20.19+ (recomendado Node 20 LTS)
- npm (ou yarn/pnpm/bun)

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

```text
http://localhost:3000
```

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera build de produção
- `npm run start` — inicia aplicação em modo produção
- `npm run lint` — executa lint do projeto

## Rotas principais

- `/` — Home
- `/obras`
- `/obras/antes-e-depois`
- `/obras/orcamento`
- `/obras/portfolio`
- `/obras/servicos`
- `/ssma`
- `/ssma/contato`
- `/ssma/normas-e-certificacoes`
- `/ssma/servicos`
- `/ssma/treinamentos`

## Estrutura resumida

```text
src/
	app/
		layout.tsx
		page.tsx
		obras/
		ssma/
	components/
		layout/
		sections/
		ui/
	lib/
```

## Convenções do projeto

- Alias de importação: `@/*` aponta para `src/*`
- Estilos globais em `src/app/globals.css`
- Componentes reutilizáveis em `src/components/ui`

## Deploy

O deploy recomendado é na Vercel, mas o projeto também pode ser hospedado em qualquer ambiente Node.js compatível com Next.js.

### Render (Node)

- Build Command: `npm ci && npm run build`
- Start Command: `npm run start`
- Node Version: `20.19.0` (via variável `NODE_VERSION`)
- Arquivo opcional já incluso: `render.yaml`

### Docker

- Arquivos já inclusos: `Dockerfile` e `.dockerignore`
- Build da imagem:

```bash
docker build -t site-estrategico .
```

- Executar container:

```bash
docker run -p 3000:3000 site-estrategico
```
