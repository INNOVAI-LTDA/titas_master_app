# Customizacao por Cliente

Use `config/clients/<client-code>/` para customizacoes controladas.

## Tipos de customizacao

| Tipo | Onde fica |
|---|---|
| Nome, logo, tema | branding.json / client.json |
| Textos | copy.json |
| Telas e funcoes habilitadas | features.json |
| Permissoes | permissions.json |
| Regras simples | configuracao ou banco |
| Regras complexas | service/strategy por modulo |

## Evite

Evite espalhar `if client_code == ...` pelo sistema. Prefira factories, strategies ou configuracao.
