# Titãs Master App

Aplicação web do **Titãs Master**, adaptada para o padrão de repositório da **Innovai**.

## O que está neste repositório

```text
titas_master_app/
  apps/
    web/                  # React + TanStack Start + Vite + Tailwind
    api/                  # reservado para futura API FastAPI
  config/
    clients/titas-master/ # configuração do cliente/app
    environments/         # exemplos de ambiente
  infra/
    database/supabase/    # migrations SQL importadas do protótipo
    local/                # infraestrutura local
    deploy/               # receitas de deploy
  scripts/                # comandos operacionais padronizados
  docs/                   # notas técnicas
```

## O que foi removido do gerador anterior

- pasta interna do gerador anterior;
- pacote de configuração proprietário do gerador anterior;
- referências, URLs de preview e metatags do gerador anterior;
- lockfile gerado com cache interno do gerador anterior;
- arquivo `env` com valores concretos de Supabase.

## Rodando localmente

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
python scripts/env_check.py --env-file .env
cd apps/web
npm install
npm run dev
```

Também funciona com Bun ou PNPM, desde que o lockfile seja regenerado fora do gerador anterior.

## Variáveis mínimas do front-end

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-publica
VITE_SUPABASE_PROJECT_ID=seu-project-id
```

## Build

```bash
cd apps/web
npm run build
npm run preview
```

## Nota prática

O protótipo ainda usa Supabase diretamente no front-end. Isso preserva o comportamento original com o mínimo de risco. O próximo passo natural, quando a dor aparecer, é mover regras sensíveis para `apps/api` e deixar o front-end só consumindo a API. Uma ponte de madeira antes da ponte estaiada — menos bonito no PowerPoint, mais útil na operação.
