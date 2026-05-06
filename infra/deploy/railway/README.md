# Deploy Railway

Use esta pasta para configuracoes especificas do Railway.

Variaveis obrigatorias:

- APP_ENV=production
- DEPLOY_TARGET=railway
- CLIENT_CODE
- DATABASE_URL
- JWT_SECRET
- API_BASE_URL
- WEB_BASE_URL
- CORS_ALLOWED_ORIGINS

Comandos sugeridos:

- API build: `pip install -r apps/api/requirements.txt`
- API start: `cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port $PORT`
- WEB build: `cd apps/web && npm ci && npm run build`
