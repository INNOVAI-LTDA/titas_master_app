# ADR-001: Monolito Modular Customizavel

## Contexto

Sistemas por cliente, escala moderada, alta customizacao e dados sensiveis.

## Decisao

Usar monolito modular com front-end feature-based, back-end em camadas e configuracao por cliente.

## Consequencias

- Menor complexidade operacional que microservicos.
- Boa manutencao por modulo.
- Deploy pode ser separado por cliente.
- Exige disciplina para manter limites entre modulos.
