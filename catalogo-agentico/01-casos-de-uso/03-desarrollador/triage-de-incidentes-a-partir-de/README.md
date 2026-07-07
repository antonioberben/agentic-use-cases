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

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* en modo read-only (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-dev-triage-agent` cruza logs + APM + deploys + tickets y devuelve hipótesis ordenadas con evidencia citada. Un validador en cadena `root-cause-validator` con identidad separada contrasta cada hipótesis contra el código antes de presentarla. **Cualquier mitigación la ejecuta el on-call con su identidad.** La única escritura del agente es la creación del ticket de incidente en Jira (`issue:create`), sujeta a aprobación humana (HITL); el resto de MCPs son de solo lectura.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MCP Kubernetes con `delete`/`apply` → cambio en cluster sin gate (**DORA art. 9 integridad · NIS2 art. 21 control de cambios**) | agentregistry + agentgateway | `mcp-kubernetes` publicado con verbos `get`/`describe`/`logs` únicamente; RBAC del ServiceAccount SPIFFE-bound sin `create`/`patch`/`delete`; AuthorizationPolicy L7 en waypoint bloquea verbos mutables |
| Logs con PII (email cliente, IDs internos, IPs) a modelo externo (**GDPR art. 32/33 · LOPDGDD · notificación AEPD 72h**) | agentgateway | pii-redact en pipeline de ingesta de logs (email → hash, IP → /24); modelo on-prem forzado si el servicio maneja categorías especiales |
| Sesgo personal en post-mortem (agente nombra autor del commit "responsable") → cultura blameless rota | agentgateway | prompt guard: nombres de autor de commits reemplazados por `<committer_hash>` en salida; template blameless obligatorio; eval set con 10 incidentes donde el agente evita atribuir causa a persona |
| Identidad humana en Datadog/Splunk → audit atribuido al ingeniero, no al agente | Istio ambient + agentgateway | SPIFFE `svc-dev-triage-agent`; OIDC/JWT con `sub=agent` (no OBO del on-call); Datadog audit muestra `service_account` distinguible |
| Prompt injection desde logs (log con instrucciones embebidas) | agentgateway | prompt guards Envoy: strip de patrones `# IMPORTANT`, `ignore previous`, cadenas markdown en logs; eval set con 25 logs con injection real |
| MTTR mejorable con cache de hipótesis | agentgateway | cache por `service + error_signature`; TTL 1h; batch de correlación pre-alertada para servicios high-risk |
