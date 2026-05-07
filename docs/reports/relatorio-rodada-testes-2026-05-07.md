# Relatório de Rodada de Testes (Unitário, Modular, Integração e Sistema)

**Projeto:** Titãs Master App  
**Data:** 2026-05-07 (UTC)  
**Responsável:** Codex

## 1) Escopo da rodada

Foi executada uma rodada abrangente de validações em múltiplos níveis:

- **Unitário (proxy):** validação isolada de script utilitário (`env_check.py`).
- **Modular:** verificação de preflight de deploy (`deploy_check.py`) que encadeia checks de ambiente.
- **Integração:** instalação determinística de dependências front-end (`npm ci`) com lockfile.
- **Sistema:** build completo da aplicação web (cliente + SSR) com Vite.

> Observação: não há suíte de testes automatizados explícita (ex.: `pytest`, `vitest`, `jest`) configurada no repositório até esta rodada.

---

## 2) Execuções realizadas e resultados

### 2.1 Unitário (proxy)

**Comando:** `python scripts/env_check.py --env-file .env.example`  
**Resultado:** ✅ **PASSOU** (`Ambiente OK.`)

### 2.2 Modular

**Comando:** `cp .env.example .env && python scripts/deploy_check.py && rm .env`  
**Resultado:** ✅ **PASSOU** (`[ OK ] deploy preflight passed`)

### 2.3 Integração

**Comando:** `npm ci` (em `apps/web`)  
**Resultado:** ✅ **PASSOU COM ALERTAS**

Alertas identificados:
- `EBADENGINE`: dependências TanStack exigem Node `>=22.12.0`; ambiente atual está em Node `v20.20.2`.
- `1 high severity vulnerability` (auditoria npm).

### 2.4 Sistema

**Comando:** `npm run build` (em `apps/web`)  
**Resultado:** ✅ **PASSOU**

Detalhes relevantes:
- Build de cliente concluído.
- Build SSR concluído.
- Warnings não bloqueantes de imports não utilizados em módulos externos.

### 2.5 Qualidade estática (suporte de cobertura)

**Comando:** `npm run lint` (em `apps/web`)  
**Resultado:** ❌ **FALHOU**

Resumo da falha:
- `471` problemas (`464` erros, `7` warnings), majoritariamente de formatação/prettier e alguns de tipagem (`no-explicit-any`).
- Indica baixa “saúde de baseline” para estabilização de cobertura de testes front-end.

---

## 3) Diagnóstico por nível de cobertura

## Unitário
- **Status:** Parcial.
- **Situação atual:** ausência de testes unitários formais para backend/frontend.
- **Risco:** regressões locais não detectadas cedo.

## Modular
- **Status:** Parcial.
- **Situação atual:** scripts utilitários de ambiente/deploy funcionam, mas sem suíte própria de testes automatizados.
- **Risco:** mudanças em scripts quebram pipeline operacional sem detecção prévia.

## Integração
- **Status:** Moderado.
- **Situação atual:** cadeia de dependências e build funcionam no estado atual.
- **Risco:** mismatch de engine Node pode gerar falhas intermitentes em ambientes diferentes.

## Sistema
- **Status:** Moderado.
- **Situação atual:** aplicação compila em produção, porém baseline de lint está quebrada.
- **Risco:** débitos de qualidade acumulados dificultam evolução e introdução de testes E2E confiáveis.

---

## 4) Backlog de tarefas para próximas interações (com isolamento e semáforo)

Abaixo, cada tarefa foi desenhada para **execução isolada** (branch/PR própria, escopo delimitado), evitando interferência cruzada e **Condição de Parada (Semáforo) indevida**.

## Semáforo global de execução
- 🟢 **Pode iniciar:** tarefa independente, sem pré-requisito pendente.
- 🟡 **Atenção:** possui dependência explícita de outra tarefa.
- 🔴 **Parar:** detectado bloqueio crítico; não avançar para tarefas dependentes.

## T1 — Padronização de ambiente Node
- **Tipo:** Infra/Toolchain
- **Semáforo inicial:** 🟢
- **Objetivo:** Fixar Node `>=22.12.0` (ex.: `.nvmrc`, docs, CI) para eliminar `EBADENGINE`.
- **Saída esperada:** instalação e build sem aviso de engine.
- **Critério de pronto:** `npm ci` sem warnings de engine.
- **Isolamento:** não altera lógica de negócio.

## T2 — Correção de baseline de lint/formatação
- **Tipo:** Qualidade de código
- **Semáforo inicial:** 🟢
- **Objetivo:** zerar erros do `eslint/prettier` no front-end.
- **Saída esperada:** `npm run lint` passando.
- **Critério de pronto:** 0 errors no lint.
- **Isolamento:** alterações apenas de estilo e typing seguro superficial.

## T3 — Testes unitários de utilitários front-end
- **Tipo:** Unitário
- **Semáforo inicial:** 🟡 (depende de T2)
- **Objetivo:** cobrir `src/lib` (ex.: `competencia.ts`, `utils.ts`, `excel.ts`) com Vitest.
- **Saída esperada:** suíte unitária inicial com cobertura mínima acordada (ex.: 70%).
- **Critério de pronto:** `npm test`/`vitest` verde + relatório de cobertura.
- **Isolamento:** somente arquivos de utilitários e testes associados.

## T4 — Testes unitários de módulos backend (API)
- **Tipo:** Unitário/Modular
- **Semáforo inicial:** 🟢
- **Objetivo:** criar base `pytest` para `patients/service.py`, `repository.py`, validações de schema.
- **Saída esperada:** testes com mocks de camada de dados.
- **Critério de pronto:** `pytest` verde no pacote `apps/api`.
- **Isolamento:** sem tocar frontend.

## T5 — Testes de integração API + banco (container local)
- **Tipo:** Integração
- **Semáforo inicial:** 🟡 (depende de T4)
- **Objetivo:** validar fluxo real de persistência (migrations + operações principais).
- **Saída esperada:** suite de integração com setup/teardown idempotente.
- **Critério de pronto:** testes repetíveis em execução sequencial e paralela.
- **Isolamento:** banco de teste dedicado (schema/DB separado).

## T6 — Testes de sistema (E2E) no front-end
- **Tipo:** Sistema
- **Semáforo inicial:** 🟡 (depende de T1 e T2)
- **Objetivo:** implementar E2E (Playwright/Cypress) para fluxos críticos.
- **Saída esperada:** cenário mínimo: autenticação, cadastro, consulta e exportação.
- **Critério de pronto:** pipeline E2E estável em CI.
- **Isolamento:** dados de teste próprios + reset entre cenários.

## T7 — Matriz de cobertura e quality gate em CI
- **Tipo:** Governança
- **Semáforo inicial:** 🟡 (depende de T3, T4, T5, T6)
- **Objetivo:** consolidar relatório único (unitário/modular/integração/sistema) e thresholds.
- **Saída esperada:** gate de cobertura por camada e falha automática abaixo do limite.
- **Critério de pronto:** PR bloqueado quando cobertura/regressão violar política.
- **Isolamento:** apenas workflows e configuração de reporte.

---

## 5) Estratégia para evitar interferência entre tarefas

1. **1 tarefa = 1 branch = 1 PR.**
2. **Escopo fechado por diretório** (ex.: `apps/web/src/lib` vs `apps/api/src/modules`).
3. **Dados de teste isolados** (fixtures próprias, DB de teste separado).
4. **Execução idempotente** (setup e teardown sempre reversíveis).
5. **Ordem de merge guiada por semáforo**:
   - Primeiro: T1, T2, T4
   - Depois: T3, T5, T6
   - Por fim: T7
6. **Condição de parada (Semáforo 🔴):**
   - Quebra de baseline (`lint` ou `build`) em branch de tarefa;
   - Instabilidade de teste > 5% em 10 reexecuções;
   - Dependência não satisfeita marcada como obrigatória.

---

## 6) Próxima interação sugerida

Priorizar **T1 (Node)** e **T2 (lint)** para estabilizar o baseline técnico; em seguida iniciar paralelização controlada de **T3** e **T4**.

---

## 7) Andamento do backlog (execução em 2026-05-07)

- ✅ **T1 concluída (parcialmente aplicada):**
  - Inclusão de `.nvmrc` na raiz com Node `22.12.0`.
  - Declaração de `engines.node >=22.12.0` em `apps/web/package.json`.
  - README atualizado com orientação de uso de `nvm use`.
- ✅ **T2 concluída (baseline de erro):**
  - Rodado `npm run format` em `apps/web`.
  - Rodado `npm run lint` com **0 erros** e **7 warnings** restantes (não bloqueantes para o build).

- 🟡 **Próximo passo objetivo:** iniciar T3 (unitários de utilitários front-end) e T4 (base `pytest` backend) em branches separados.
