# Deploy Seamless

A passagem local -> remoto deve mudar configuracao, nao codigo.

## Pode mudar

- `.env`
- secrets
- `DATABASE_URL`
- `API_BASE_URL`
- `WEB_BASE_URL`
- `CORS_ALLOWED_ORIGINS`
- comandos de build/start
- arquivos em `infra/deploy/<provider>`

## Nao deve mudar

- rotas
- services
- repositories
- componentes
- hooks
- models
- regras de negocio

## Checklist

- [ ] `scripts/env_check.py` passa.
- [ ] `GET /health` responde.
- [ ] `GET /runtime-info` nao vaza segredo.
- [ ] migrations aplicadas.
- [ ] CORS aponta para o dominio correto.
- [ ] secrets nao estao versionados.
