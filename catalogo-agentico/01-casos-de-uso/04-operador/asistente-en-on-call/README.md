# Asistente en on-call

> **Rol:** operador · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

3 AM. Alerta que no habías visto. Servicio en CrashLoopBackOff. Se busca: agente lee estado del cluster, propone tres hipótesis ordenadas con verificación rápida y mitigación. Tú decides y ejecutas.

## 2. Cómo resolverlo

**Local.** Inviable; el contexto del cluster vive remoto.

**Copilot integrado (Datadog Bits AI, New Relic AI).** Camino más corto.

**Claude Code.** Repo `oncall-assistant/` con `AGENTS.md` que **prohíbe** `kubectl apply/delete/scale`. Solo `get`/`describe`/`logs`/`events`. Comando: *"Pod `checkout-api-xyz` en CrashLoopBackOff hace 8 min en `prod-eu-west-1`/`payments`. Tres hipótesis ordenadas. Cómo verificar cada una. Cómo mitigar."*

**MCPs:**

| MCP | Servidor | Scopes mínimos |
|-----|----------|----------------|
| Kubernetes | `mcp-kubernetes` | rol `view` cluster-wide, **NUNCA** `edit`/`admin` |
| Logs / métricas | `mcp-datadog` / `mcp-loki` | lectura |
| PagerDuty | `mcp-pagerduty` | lectura del incidente |

Identidad propia (`svc-ops-oncall-agent`) con perfil **read-only**. La acción correctiva la ejecuta el ingeniero con su identidad humana.

**Alternativa.** `kubectl-ai` con allowlist de comandos read-only.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-diagnóstico inicial | *20-40 min* | *3-8 min* |
| % primer comando ejecutado correcto | *60%* | *> 85%* |
| MTTR p50 / p95 | base | reducción significativa |
| Errores de operador en escritura por urgencia | base | reducción notable |

**Fórmula:** ≈ (30 − 5) min × 20 alertas on-call/mes × 11 / 60 ≈ **92 h/año** por operador on-call.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente tiene `edit` o `admin` en cluster de producción, una *prompt injection* desde un log o una alerta puede desencadenar `kubectl delete` masivo. Pérdida de disponibilidad y datos."*
- *"Si el comando sugerido tiene un flag inventado por el modelo y lo ejecuto a las 3 AM sin verificar, tiro el servicio."*
- *"Si el agente entra al cluster con identidad humana (mi kubeconfig), auditoría no distingue mis acciones de las suyas. Sin no repudio."*
- *"Si los logs leídos contienen PII de cliente y se envían a modelo externo, fuga GDPR durante el incidente."*

**Riesgos típicos:** acceso de escritura en producción, alucinación de comandos, identidad compartida, fuga de PII durante triage, *prompt injection* desde la propia infraestructura.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 3. MCPs: cómo enchufar tu plataforma al agente

Para un operador, estos MCPs son los rentables. Conéctalos uno a uno, empezando por lectura.

| MCP | Para qué lo usas |
|-----|------------------|
| Kubernetes (`kubectl` MCP) | Consulta de estado, eventos, logs. Lectura primero, escritura nunca sin gate. |
| Observabilidad (Prometheus / Datadog / Grafana / Loki / Splunk) | Métricas, alertas, queries PromQL/LogQL generadas |
| Incident management (PagerDuty / Opsgenie / Statuspage) | Contexto del incidente actual, histórico |
| Source of truth (GitHub / GitLab) | Lectura de IaC, runbooks, commits asociados a un cambio |
| Cloud (AWS / GCP / Azure) | Estado de recursos, billing, IAM. Solo lectura. |
| Ticketing (Jira / ServiceNow) | Tickets del equipo, change requests |
| Docs internas (Confluence / Notion / repo de runbooks) | Recuperación de procedimiento documentado |

**Reglas adicionales para operador:**

- **Identidad propia del agente** en cada cluster/cloud, con RBAC mínimo. Nunca uses tu identidad personal con permisos de cluster-admin para que el agente "herede".
- **Auditoría obligatoria.** Todo comando que el agente ejecute queda en logs con marca de quién lo aprobó.
- **Gate humano en escritura.** Ninguna acción mutativa (apply, delete, scale, restart, change IAM) sin confirmación explícita en el momento. La automatización viene **después** del plan de gobierno, no antes.
- **Perímetro por entorno.** Agente con permisos en dev no es agente con permisos en prod. Identidades y MCPs separados.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `oncall-assistant` propone 3 hipótesis ordenadas con comandos de verificación read-only y mitigación candidata. **El humano ejecuta**: el agente no hace `apply`/`delete`/`scale`/`restart`.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Agente con `edit`/`admin` en producción + prompt injection desde log/alerta → `kubectl delete` masivo | agentregistry + kagent | RBAC restringido a `cluster-role: view`; verbos `create,delete,patch,exec,scale` **no publicados**; separación por entorno (`svc-oncall-agent-prod` != `svc-oncall-agent-dev`) |
| Comando con flag inventado ejecutado a las 3 AM sin verificar → outage | agentevals | validador determinista sobre `kubectl help` y CRDs conocidas antes de proponer; flags inexistentes → comando eliminado, no *inventado*; librería de comandos golden por escenario |
| Identidad humana en el cluster → auditoría no distingue humano vs agente (**DORA · SOX ITGC · NIS2 art. 21**) | Istio ambient (SPIFFE) | mTLS `spiffe://.../ns/ops/sa/svc-oncall-agent`; kubeconfig separado, jamás herencia del kubeconfig humano; audit trail k8s con `User=svc-oncall-agent` distinguible |
| Logs con PII del cliente enviados a LLM externo durante el triage (**GDPR art. 6 · GDPR art. 33 breach notification**) | agentgateway | `pii-redact` sobre payload de log antes del prompt; tag `during-incident=true` fuerza modelo on-prem para no ampliar el alcance del incidente |
| Coste explosivo por incidente prolongado a las 3 AM | agentgateway | rate-limit por `incident_id`; presupuesto por sesión on-call con corte automático; cache TTL 5min de queries repetitivas al cluster |
