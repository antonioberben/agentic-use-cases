# TL02 — Atención a cliente con plan estandarizado (contact center telco)

## Identificación

- **Rol principal**: agente de contact center telco (atención, retención, postventa).
- **Sectores**: telco (móvil, fijo, fibra, TV).
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de cualquier auto-acción contractual.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

El agente atiende clientes con consultas sobre factura, cambio de plan, portabilidad, incidencias, reclamaciones. Catálogo amplio, normativa específica (derecho de portabilidad, periodo de permanencia, baja del servicio, derechos del consumidor de comunicaciones electrónicas). El asistente sugiere el plan/oferta aplicable según historial y políticas, redacta borrador de respuesta y abre flujos. El humano decide y ejecuta.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre catálogo + políticas. Prompt: *"Dada la consulta y el historial del cliente, propón: respuesta corta, oferta aplicable (si procede), pasos a ejecutar. **No prometas descuento fuera de la matriz aprobada. No prometas alta o baja sin firma del cliente.**"*

### 2.2 Copilot

Genesys Cloud AI, Talkdesk Copilot, NICE CXone con conectores al CRM y al billing.

### 2.3 Claude Code

Repo `cc-telco/` con `AGENTS.md`: matriz de ofertas aprobadas, prohibición de prometer fuera de matriz, formato de salida.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-billing` | Billing MCP (Amdocs/Ericsson) | `vault://cc/billing-ro` | `accounts:read,charges:read` cliente atendido |
| `mcp-crm` | Salesforce/Microsoft MCP | `vault://cc/crm-ro` | `customer:read,interaction:write` (interacciones, no contratos) |
| `mcp-offers` | Catálogo de ofertas MCP | `vault://cc/offers-ro` | `read` matriz aprobada |
| `mcp-account` | Provisioning/billing write MCP | `vault://cc/account-rw` | alta/cargo (**gate HITL + OBO**; nunca automático) |

### 2.5 Alternativas

Solo entornos corporativos por confidencialidad de cliente.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| AHT (tiempo medio de atención) | 7 min | 4,5 min |
| FCR (first call resolution) | 65% | 82% |
| Compromisos fuera de matriz | medio | 0 |
| Churn en cuentas retenidas | base | base × 0,8 |

Fórmula: *2,5 min × 60 llamadas/día × 220 días × 100 agentes = ≈ 55.000 h/año por contact center mediano. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente ofrece descuento fuera de la matriz por interpretación creativa del modelo, vinculo a la sociedad con un compromiso no autorizado."*
- *"Si el MCP de billing tiene scope `charges:write` y un prompt injection desde un texto del cliente consigue cargar un cargo o un alta de servicio, fraude por el lado del operador."*
- *"Si el chatbot atiende sin disclosure de IA (EU AI Act art. 50), infracción."*
- *"Si la conversación contiene MNPI sobre el operador (resultados pre-publicación citados por el cliente) y se procesa en LLM externo, riesgo CNMV."*

**Riesgos típicos:** compromiso fuera de matriz, acción no autorizada en billing, falta de disclosure art. 50 EU AI Act, fuga de información del cliente.

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo B — Sectorial telco.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `atencion-telco` sugiere plan/oferta y borrador de respuesta según historial; el agente de contact center decide y ejecuta; escala a humano ante reclamación regulada o compromiso fuera de matriz.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Descuento/oferta fuera de la matriz aprobada (compromiso no autorizado) | agentgateway | prompt guard de salida contrasta la oferta contra `mcp-offers` (matriz aprobada); fuera de matriz → bloqueo + escalado a humano |
| Cargo, alta o baja de servicio ejecutado por el agente | agentgateway + kagent (OBO) | `mcp-billing` con scope RO (`accounts:read,charges:read`); toda alta/cargo va por `mcp-account` con gate HITL y firma OBO del agente humano (nunca automático) |
| Prompt injection desde texto del cliente que fuerza acción en billing | agentgateway | turno del cliente marcado `untrusted`; policy `deny-tool-if-prompt-injected` |
| Falta de disclosure de IA (EU AI Act art. 50) | agentgateway | disclosure inyectado en el primer turno y auditado en la traza |
| MNPI del operador (resultados pre-publicación citados por el cliente) procesada en LLM externo (MAR/CNMV) | agentgateway | detección `MNPI/insider` + redaction o bloqueo antes del request |
| Ingress del canal de atención al cliente | kgateway | control de borde norte-sur del tráfico del contact center |

## Referencias

- Reglamento (UE) 2022/612 (roaming), Ley General de Telecomunicaciones, CNMC, EU AI Act art. 50, GDPR. *Citas T1.*
