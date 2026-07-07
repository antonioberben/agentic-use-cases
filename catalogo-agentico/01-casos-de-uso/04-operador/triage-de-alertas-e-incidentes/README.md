# Triage de alertas e incidentes

> **Rol:** operador · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

40 alertas en la última hora. La mitad son síntomas del mismo problema, otras son ruido por flapping y dos importan de verdad. Hoy las miras una a una. Se busca: agente agrupa por causa probable, marca raíz vs síntoma, sugiere runbook aplicable. Tú decides ataque.

## 2. Cómo resolverlo

**Local.** Inviable porque las alertas viven en SaaS.

**Copilot integrado.** Datadog Bits AI, Dynatrace Davis CoPilot, New Relic AI, PagerDuty AIOps, Sentinel Copilot: ya agrupan y correlacionan. Camino más corto.

**Claude Code / agente de operaciones.** Repo `oncall-triage/` con `AGENTS.md` que prohíbe mitigación automática y obliga a citar evidencia. Comando: *"Triage de alertas activas en prod-eu. Agrupa, marca raíz, propone runbook."*

**MCPs:**

| MCP | Servidor | Scopes mínimos |
|-----|----------|----------------|
| PagerDuty / Opsgenie | `mcp-pagerduty` | lectura de incidentes activos |
| Métricas | `mcp-datadog` / `mcp-prometheus` | lectura sobre servicios del equipo |
| Kubernetes | `mcp-kubernetes` | **solo** `get`/`describe`/`logs` |

Identidad propia (`svc-ops-triage-agent`). Read-only siempre.

**Alternativa.** `holmesgpt`, `kubectl-ai`, `k9s` con plugin de IA.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-triage de tormenta de alertas | *30-60 min* | *5-10 min* |
| % alertas correctamente agrupadas | *50%* | *> 80%* |
| MTTA | base | reducción significativa |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × tormentas_mes × 11 / 60`. Ejemplo: 45 min × 12 × 11 / 60 ≈ **99 h/año** por operador.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente tiene `delete`/`apply` y mitiga automáticamente con escalado o restart, una *prompt injection* en una alerta puede desencadenar acciones masivas. DORA y NIS2 exigen control de cambios documentado."*
- *"Si las alertas incluyen detalles de cliente (`order_id`, IPs) y se mandan a modelo externo, hay tratamiento sin base jurídica."*
- *"Si el modelo correlaciona mal y descarta la alerta real como ruido, hay incidente no escalado que viola SLA."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `ops-triager` agrupa alertas por causa probable, marca raíz vs síntoma y sugiere runbook aplicable. **Read-only estricto**: no ejecuta mitigación, no crea incidentes en PagerDuty, no silencia alertas.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Agente con `delete`/`apply` → prompt injection desde alerta desencadena outage (**DORA · NIS2 art. 21 control de cambios**) | agentregistry + kagent | scopes k8s limitados a `get,list,watch`; verbos `create,delete,patch,exec` **no publicados**; `mcp-pagerduty` solo `incidents:read`, no `resolve` ni `ack` masivo |
| Alertas con `order_id`, IPs de cliente enviadas a LLM externo (**GDPR art. 6**) | agentgateway | `pii-redact` sobre payload de alertas: `order_id` → hash, IPs → `10.x.x.x/24`, JWT → `[REDACTED]` antes del LLM |
| Modelo descarta alerta real como ruido → incidente no escalado viola SLA (**DORA art. 19**) | agentevals | eval set de 200 tormentas históricas con `root_cause` conocida; el agente propone; disagreement > 10% con clasificación golden → sin auto-agrupación, fallback a lista plana |
| Coste explosivo cuando llegan tormentas de 1000+ alertas por hora | agentgateway | rate-limit por alerta única (dedup por fingerprint antes del LLM); cache TTL 15min de agrupaciones; presupuesto por operador con corte automático |
| Suscripción SSO humana en vez de identidad de agente → SoD roto | Istio ambient (SPIFFE) | mTLS `spiffe://.../ns/ops/sa/svc-ops-triage-agent`; PagerDuty/Datadog tokens obtenidos por OBO desde la SA, no del operador |
