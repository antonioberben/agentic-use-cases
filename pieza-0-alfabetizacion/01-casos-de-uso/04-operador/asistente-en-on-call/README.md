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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

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

## 4. Cinco hábitos clave

1. **Lectura por defecto, escritura por excepción.** El agente lee siempre, escribe casi nunca, y solo con gate humano explícito.
2. **Contexto antes de cada turno.** Cluster, namespace, versión, ventana temporal. Sin esto, la respuesta es genérica e inútil.
3. **Pide hipótesis ordenadas, no diagnóstico único.** Tres opciones con probabilidad relativa te hacen pensar; una sola respuesta te hace seguidor.
4. **Versiona runbooks generados.** Si el agente te ayuda a redactar un runbook, va al repo. La próxima vez no lo regeneras, lo ejecutas.
5. **Postmortem del agente.** Cuando un agente recomienda mal, anótalo. La memoria del equipo sobre fallos del agente vale tanto como los runbooks.

## 5. Qué evitar

- Pegar logs con credenciales, tokens, IPs internas, datos de cliente, o cabeceras de autenticación en un asistente público no aprobado. Redacta antes.
- Aceptar un manifiesto YAML del modelo sin revisar `resources`, `securityContext`, `RBAC` y `NetworkPolicy`. Los defaults son permisivos.
- Dejar al agente con permiso de escritura sobre producción "para automatizar". Esa decisión se toma en el Plan Director, no en el día a día.
- Confiar en troubleshooting steps que el modelo describe con tono autoritativo. Verifica en docs oficiales antes de ejecutar en prod.
- Conectar MCPs de terceros desconocidos al cluster. El MCP es la API del agente con tu infra: trátalo como integración con TPRM, no como plugin de navegador.

## 6. Cómo seguir

- Lab base **"agente de triage de eventos"** del catálogo: el patrón de 2.1.
- Lab base **"agente operacional read-only"**: el patrón seguro de 2.8.
- Lab base **"agente sobre código (AGENTS.md/MCP)"**: el patrón de 2.6 y 2.7.
- Guías de estándares operativos: `agents-md.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
