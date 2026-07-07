# Generación y mantenimiento de runbooks

> **Rol:** operador · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tras un incidente resuelto, el runbook se queda en la cabeza del que estuvo on-call. El próximo on-call lo redescubre. Se busca: agente sintetiza ticket + Slack + comandos + commits en un runbook accionable, versionado en repo.

## 2. Cómo resolverlo

**Local.** Llama 70B con material adjunto del incidente.

**Copilot.** En el cliente con MCPs de PagerDuty + Slack + Git.

**Claude Code.** Repo `runbooks/` con `AGENTS.md` y plantilla `templates/runbook.md`. Comando: *"Genera runbook a partir del incidente PD-INC-1234. Comandos exactos. Métricas de validación. Sin narrativa."*

**MCPs:** PagerDuty, Slack/Teams (sanitizado), Git (escritura solo en `runbooks/` con PR), Datadog (lectura).

**Alternativa.** Plantilla manual rellenada con asistente.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % incidentes con runbook posterior | *20-30%* | *> 80%* |
| TT-runbook | *2-4 h* | *20-30 min* |
| Runbooks actualizados/año | *raro* | *>5×* |

**Fórmula:** ≈ (180 − 25) min × 30 incidentes/año / 60 ≈ **77 h/año** por operador.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el runbook generado incluye nombres de personas ('contactar a Juan si el servicio X falla'), responsabilidad personal sin política. Cuando Juan se vaya, ruido."*
- *"Si el agente accede a Slack para leer el war room y el canal contiene info de cliente, mezcla en el runbook datos que no deberían quedar persistidos."*
- *"Si el runbook propone comandos que el agente inventó sin verificar (flags no existentes), siguiente on-call ejecuta a las 3 AM."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails* + *A8* aplicado a runbooks (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `runbook-generator` sintetiza incidente + Slack war-room + Git commits en un runbook accionable y abre PR en `runbooks/`. Sin nombres propios; con comandos verificados.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Runbook con nombres de personas ("contactar a Juan") → responsabilidad personal sin política; ruido cuando Juan se va | agentgateway | `pii-redact` sobre nombres propios de Slack/PagerDuty antes del prompt; sustituidos por roles (`sre-oncall`, `platform-lead`); prompt guard salida bloquea nombres |
| Slack war-room con info de cliente incorporada al runbook persistido | agentgateway | `mcp-slack` con `pii-redact` obligatorio: `customer_id`, `email`, `order_id` sustituidos por counts o hashes antes del LLM; runbook persistido no puede contener datos identificables |
| Comandos inventados con flags no existentes → siguiente on-call ejecuta a las 3 AM | agentevals | validador determinista contra `--help` de cada CLI citado (via `mcp-context7`); flags no resueltos → comando marcado `[VERIFICAR - FLAG DUDOSO]`; librería de comandos golden en `runbooks/tests/` |
| Runbook con datos de infra sensibles a LLM externo entrenamiento | agentregistry | procesamiento on-prem forzado para clase `runbook-draft`; consumer-tier deny; catálogo con opt-out de training contractual |
| Runbook sin criterios de éxito ni rollback | agentevals | eval determinista: cada paso debe tener `success_criteria` y `rollback_command`; miss → sección marcada `[REVISAR - PASO INCOMPLETO]`; PR bloqueado hasta cumplir |
