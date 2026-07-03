# T05 — Diagnóstico de incidente operacional

## Identificación

- **Rol principal**: SRE, DevOps, ingeniero de plataforma.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 4 — agente operacional read-only.
- **Madurez recomendada**: nivel 1 piloto en read-only sobre staging; nivel 3 antes de producción.

> Aviso permanente: capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- NIS2 (gestión de incidentes), ISO/IEC 27035. *Citas T1.*
- Marco técnico: OWASP LLM01 (logs adversariales), MITRE ATLAS.
