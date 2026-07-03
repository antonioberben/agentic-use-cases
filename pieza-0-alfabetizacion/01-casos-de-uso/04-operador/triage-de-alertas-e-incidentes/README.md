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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
