# Client System Template

Template full-stack para sistemas web customizaveis por cliente, com foco em:

- execucao local reprodutivel;
- transicao local -> deploy remoto por configuracao;
- arquitetura modular;
- dados sensiveis;
- manutencao recorrente;
- escala moderada por cliente, na faixa de centenas ate poucos milhares de usuarios.

## Arquitetura proposta

**Monolito modular customizavel por cliente**:

- `apps/web`: front-end React/Vite/TypeScript;
- `apps/api`: back-end FastAPI/Python;
- `config/clients`: configuracoes por cliente;
- `infra/local`: ambiente local com Docker Compose;
- `infra/deploy`: receitas de deploy por provedor;
- `scripts`: comandos operacionais padronizados;
- `docs`: decisoes, arquitetura e operacao.

## Regra principal

Local e producao devem ser o mesmo sistema com configuracoes diferentes.

Nao altere codigo para sair do local e ir para remoto. Altere variaveis de ambiente, secrets, URLs, banco e configuracoes de deploy.

## Inicio rapido

```bash
cp .env.example .env
python scripts/env_check.py --env-file .env
python scripts/dev.py --client cliente-demo
```

## Contrato de ambiente minimo

```env
APP_ENV=local
DEPLOY_TARGET=local
CLIENT_CODE=cliente-demo
DATABASE_URL=postgresql://app:app@localhost:5432/app
API_BASE_URL=http://localhost:8000
WEB_BASE_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=change-me-local
STORAGE_BACKEND=local
FILE_STORAGE_PATH=./storage
```

## Estrutura

```text
client-system-template/
  apps/
    api/
    web/
  config/
    clients/
    environments/
  infra/
    local/
    deploy/
    database/
  scripts/
  docs/
```

## Quando usar este template

Use para sistemas por cliente com alta customizacao, dados sensiveis e necessidade de manutencao controlada.

Evite usar como base para produto multi-tenant massivo ou arquitetura de microservicos desde o dia zero.
