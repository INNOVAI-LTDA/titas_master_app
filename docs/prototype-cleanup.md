# Limpeza do protótipo → Innovai

## Removido

- arquivos internos do gerador anterior.
- Dependência de configuração proprietária do gerador anterior.
- `bun.lock` contaminado por pacotes/cache do gerador anterior.
- Metatags apontando para preview externo do gerador anterior.
- Mensagens instruindo conectar Supabase no ambiente proprietário do gerador anterior.
- Asset antigo de banner gerado automaticamente.

## Substituído

- Logo local em `apps/web/src/assets/innovai-logo.png` e `apps/web/public/innovai-logo.png`.
- Metadados de autoria para Innovai.
- Configuração Vite explícita com plugins oficiais.
- `.env.example` sem credenciais reais.

## Mantido por decisão técnica

- Stack React/TanStack Start, para evitar reescrever rotas e estado sem necessidade.
- Integração Supabase, porque o protótipo já depende das tabelas/migrations.
- Tema escuro/dourado do Titãs Master, agora com marca Innovai como provedora.
