# TL02 — Atención a cliente con plan estandarizado (contact center telco)

## Identificación

- **Rol principal**: agente de contact center telco (atención, retención, postventa).
- **Sectores**: telco (móvil, fijo, fibra, TV).
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de cualquier auto-acción contractual.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo B — Sectorial telco.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Reglamento (UE) 2022/612 (roaming), Ley General de Telecomunicaciones, CNMC, EU AI Act art. 50, GDPR. *Citas T1.*
