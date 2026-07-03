# Triage de incidentes a partir de logs y trazas

> **Rol:** desarrollador · **Caso 3.3** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

3 AM. Alerta de PagerDuty. Servicio `checkout` con error rate al 8%. Hoy abres 5 dashboards (Datadog, Kibana, Grafana, Sentry, Jira), correlacionas, formulas hipótesis, descartas dos, tiras de una. 60-120 minutos antes de empezar a actuar. Se busca: agente cruza logs + métricas + deploys recientes + tickets relacionados, entrega hipótesis ordenadas por probabilidad con evidencia citada. Tú decides y actúas.

## 2. Cómo resolverlo

**Local.** Inviable a escala porque la materia prima vive en SaaS.

**Copilot (GitHub / Datadog Bits AI / New Relic AI).** Datadog Bits AI y New Relic AI ya hacen correlación automática y triage. Útiles cuando el stack está integrado.

**Claude Code / agente de operaciones.** Repo `incident-triage/` con `AGENTS.md` que **prohíbe ejecutar mitigación** (solo investigación, propone runbook). MCPs read-only. Comando: *"Triage del incidente activo en `checkout`. Hipótesis ordenadas, evidencia citada."*

**MCPs:**

| MCP | Servidor | Scopes mínimos |
|-----|----------|----------------|
| SIEM / logs (Datadog / Splunk / Elastic) | `mcp-datadog` / `mcp-splunk` | lectura sobre el servicio en cuestión |
| APM / trazas | `mcp-datadog-apm` / `mcp-newrelic` | lectura de trazas, últimas 24 h |
| Despliegues (ArgoCD / GitHub Actions) | `mcp-argocd` / `mcp-github` | lectura del historial de deploys |
| Tickets | `mcp-pagerduty` / `mcp-jira` | lectura de incidentes y tickets relacionados |
| Kubernetes | `mcp-kubernetes` | **solo** `get`/`describe`, **nunca** `delete`/`apply` |

Identidad propia (`svc-dev-triage-agent`) con perfil **read-only**. Cualquier acción correctiva (escalar pods, rollback) la ejecuta el ingeniero con su identidad.

**Alternativa.** Runbook tradicional + asistente con copia-pega de logs sanitizados.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-triage | *60-120 min* | *10-20 min* |
| % incidentes con hipótesis correcta en primer intento | *50%* | *> 75%* |
| MTTR | base | reducción significativa |
| Incidentes que requieren escalado a senior | *30%* | *15%* |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × incidentes_mes × 11 / 60`. Ejemplo: 75 min × 15 × 11 / 60 ≈ **206 h/año** por desarrollador on-call.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de Kubernetes tiene `delete`/`apply` y una alucinación del agente sugiere 'aplicar este manifiesto', el cluster cambia sin gate humano. En entornos críticos (banca, salud), DORA y NIS2 exigen control de cambios."*
- *"Si los logs incluyen datos personales (email del cliente que disparó el error, IDs internos, IPs) y se envían a modelo externo, fuga GDPR con notificación obligatoria si la confidencialidad se rompe."*
- *"Si el agente correlaciona el incidente con un commit reciente y nombra al autor, presento un sesgo sobre la persona ('el responsable es X') antes de tener evidencia. Cultura *blameless* destruida."*
- *"Si el agente entra con identidad humana (mi cuenta de Datadog), audita queda firmado como mío. Cualquier consulta queda atribuida al ingeniero, no al agente."*

**Riesgos típicos:** acceso de escritura en producción, PII en logs hacia proveedor externo, sesgo personal en post-mortem, identidad compartida, prompt injection desde logs (un log con instrucciones embebidas).

**Cierre:**

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 4. Qué evitar

- **No pegues credenciales, secretos o datos de cliente en asistentes públicos.** Aunque el contrato corporativo lo permita, las trazas internas pueden ser auditadas. Tu portátil no es el lugar para mover datos sensibles fuera del perímetro.
- **No confíes en cifras que te dé el agente sin verificar la fuente.** Las alucinaciones son sutiles cuando ya hablas técnicamente con la IA. Si te da una métrica, una versión de librería o una fecha, compruébala.
- **No dejes que el agente decida hacer cosas irreversibles sin revisión.** `git push --force`, `kubectl delete`, `DROP TABLE`. Configura tu MCP con allowlist o mantén ese tipo de comandos fuera del set disponible.
- **No conviertas la IA en muleta para evitar entender el código.** Si vas a mantenerlo, tienes que entenderlo. Si solo la usas para producir cosas que después no comprendes, has cambiado deuda técnica por deuda cognitiva.

## 5. Cómo seguir aprendiendo

- **Lab 3 — Agente sobre código y repositorios**. Te enseña a escribir un `AGENTS.md` útil, conectar MCPs básicos e iterar con la IA como crítico. Sin Solo todavía.
- **Lab 4 — Agente operacional con herramientas read-only**. Cuando tu agente empieza a ejecutar acciones más allá del repo (kubectl, APIs internas), aparece el problema de identidad y allowlist; ahí entran agentgateway y kagent.
- **Guías de estándares operativos** de la Pieza 0: `agents-md.md`, `gestion-contexto.md`, `gestion-sesiones.md`, `iteracion-critica.md`, `mcp-y-herramientas.md`.
- **Recursos externos como referencia, no como sustituto**: Anthropic documentation sobre tool use y MCP, DeepLearning.ai cursos cortos de agentes, especificación pública de `AGENTS.md`.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
