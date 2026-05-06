# Visao de Arquitetura

Este template usa um monolito modular customizavel por cliente.

## Decisao principal

- Um codigo-base unico.
- Configuracao por cliente.
- Deploy separado por cliente quando dados sensiveis exigirem isolamento.
- Banco relacional por ambiente/cliente.
- Front-end e back-end desacoplados por API HTTP.

## Fluxo do back-end

```text
Route -> Service/Use Case -> Repository -> Database
```

## Fluxo do front-end

```text
Page -> Module Service -> shared/api/httpClient -> API
```

## Local para remoto

A aplicacao nao deve saber se roda local ou remoto. Ela deve consumir `Settings/env`.
