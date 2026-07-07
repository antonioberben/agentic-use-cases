# T05 — Diagnóstico de incidente operacional

## Identificación

- **Rol principal**: SRE, DevOps, ingeniero de plataforma.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 4 — agente operacional read-only.
- **Madurez recomendada**: nivel 1 piloto en read-only sobre staging; nivel 3 antes de producción.

> Aviso permanente: capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

A las 03:00 entra una alerta: la latencia P99 del checkout sube. El SRE de guardia tiene que correlacionar dashboards, leer logs de 4-5 servicios, mirar trazas, repasar deploys recientes, plantear hipótesis y decidir mitigación. Hoy se pierden minutos navegando entre consolas. El agente correlaciona y propone hipótesis ordenadas, pero **no ejecuta cambios**.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B con export de logs/trazas anonimizados. Prompt: *"Sobre el incidente [ID]: correlaciona alertas con deploys de las últimas 4h, lista hipótesis ordenadas por probabilidad y por evidencia, indica qué información falta para confirmar. **No propongas acciones**, solo diagnóstico."*

### 2.2 Copilot

Microsoft Security Copilot (incident view) + Azure Copilot. Para incidentes operacionales no de seguridad, mejor Datadog Bits AI / New Relic AI / Grafana LLM features.

### 2.3 Claude Code u otro agente de escritorio

Repo `runbooks/` con `AGENTS.md` que enumera servicios, dependencias, métricas SLO. Allowlist `Bash: kubectl get|describe|logs` (nunca `apply|delete`), `Read` sobre runbooks. Prohibir `kubectl exec`.

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-datadog` | Datadog MCP | `vault://sre/dd-ro` | `metrics:read,logs:read,monitors:read`; jamás `monitors:write` |
| `mcp-prometheus` | Prometheus MCP | endpoint interno mTLS | `query:read` |
| `mcp-kubernetes` | Kubernetes MCP | kubeconfig de SA `viewer` con `cluster-role: view` | `get,list,watch`; nunca `create,delete,patch` |
| `mcp-pagerduty` | PagerDuty MCP | `vault://sre/pd-ro` | `incidents:read` |

```json
{"mcpServers":{"k8s":{"command":"npx","args":["-y","@kubernetes/mcp"],"env":{"KUBECONFIG":"/etc/sre/kubeconfig-viewer"}}}}
```

### 2.5 Alternativas

Claude/ChatGPT Enterprise con dump sanitizado de logs (sin IPs, sin tokens). Solo post-mortem, no en vivo.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| MTTD (detección a hipótesis útil) | min | 25 min | 5 min |
| MTTR | min | 60 min | 35 min |
| % hipótesis correctas top-3 | calidad | 50% | 80% |
| Tiempo a post-mortem completo | h | 8 h | 2 h |

Fórmula: *25 min × 200 incidentes/año = 83 h/año por SRE en MTTD. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de Kubernetes tiene `cluster-admin` 'por comodidad' y un prompt injection desde un log (`# ROLLBACK NOW`) consigue ejecutar `kubectl delete deploy`, outage por agente."*
- *"Si conecto el agente a la consola de producción con mi sesión SSO en vez de identidad de agente, no hay trazabilidad de qué hizo el bot vs qué hice yo."*
- *"Si los logs contienen datos del cliente (carrito, tarjeta enmascarada parcial) y se envían a LLM externo sin redaction, fuga de PII."*

**Riesgos típicos:** privilegios excesivos del agente sobre el cluster, prompt injection desde logs, uso de sesión humana en vez de identidad de agente, fuga de PII en logs.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `sre-diagnoser` correlaciona alertas + logs + trazas + deploys recientes y propone hipótesis ordenadas. **No propone acciones**, solo diagnóstico. Mitigación la ejecuta el SRE de guardia.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MCP k8s con `cluster-admin` + prompt injection desde log (`# ROLLBACK NOW`) → outage por agente | agentregistry + agentgateway | SA `viewer` con `cluster-role: view` únicamente; verbos `create,delete,patch,exec` **no publicados**; contenido de logs marcado `untrusted-content` con spotlighting; patrones de comando embebido → OTel `injection.attempted=true` |
| Sesión SSO humana en la consola de producción → no-repudio roto (**DORA · SOX ITGC**) | Istio ambient (SPIFFE) | mTLS `spiffe://.../ns/sre/sa/svc-sre-diagnoser`; kubeconfig del agente separado del humano; audit trail distingue humano vs agente en cada acción sobre el cluster |
| Logs con datos de cliente (carrito, tarjeta enmascarada) enviados a LLM externo (**GDPR art. 6 · PCI-DSS req 3**) | agentgateway | `pii-redact` sobre payload de log antes del prompt; patrones PAN/CVV/email/JWT sustituidos por tokens tipados; PCI-scope forzado a modelo on-prem |
| Diagnóstico inventa causa plausible pero incorrecta → SRE persigue causa fantasma | agentevals | eval "hypothesis-grounding": cada hipótesis debe citar spans/logs/deploys concretos con `trace_id`/`log_id` verificables; hipótesis sin evidencia → marcada `[SPECULATIVE - REVISAR]` |
| Coste descontrolado a las 03:00 con incidente prolongado | agentgateway | rate-limit por incidente (`incident_id` en OTel); presupuesto por diagnóstico con corte automático; cache TTL 5min sobre queries repetitivas al SIEM |

## Referencias

- NIS2 (gestión de incidentes), ISO/IEC 27035. *Citas T1.*
- Marco técnico: OWASP LLM01 (logs adversariales), MITRE ATLAS.
