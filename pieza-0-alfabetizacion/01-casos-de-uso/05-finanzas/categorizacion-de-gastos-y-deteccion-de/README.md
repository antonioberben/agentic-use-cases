# Categorización de gastos y detección de duplicados

> **Rol:** finanzas · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Extracto de tarjeta corporativa o AP file con 2.000 líneas. Hay que categorizar, detectar duplicados (mismo proveedor + mismo importe ±7 días), y marcar lo raro.

**Cómo resolverlo.**

- *Local:* Ollama sobre el CSV enmascarado (sin nombres reales si no aprobado). Categorización por regex + LLM.
- *Copilot Excel:* fórmulas de categorización asistida.
- *Plataformas nativas:* **Brex AI**, **Ramp AI**, **Spendesk**, **SAP Concur con AI**. Ya integran detección de duplicados, fraude y categorización.
- *MCPs:* `mcp-concur`, `mcp-coupa`, `mcp-graph-files`. Solo lectura.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de categorización | 6 h/mes | 1 h |
| % duplicados detectados antes de pago | 60% | 95% |
| Errores de categorización contable | 8% | < 2% |

*Fórmula:* `(6 − 1) h × 12 = 60 h/año por contable`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene escritura sobre Concur/Coupa, un "marcar como pagado" mal ejecutado libera pagos.*
- *Si subes el AP file con proveedores reales a una herramienta no aprobada, expones la red de proveedores y sus condiciones (información comercial sensible).*
- *Si el modelo categoriza mal sistemáticamente, los reportes a hacienda salen sesgados.*

Cubierto en **Pieza 2** con gate humano antes de pagos, identidad propia del agente, scopes de lectura y observabilidad.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
