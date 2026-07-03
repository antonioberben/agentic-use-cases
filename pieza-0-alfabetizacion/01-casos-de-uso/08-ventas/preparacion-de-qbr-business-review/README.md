# Preparación de QBR / business review

> **Rol:** ventas · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 15 slides del QBR trimestral. Datos de uso, casos abiertos, NPS, roadmap. Hoy: recopilación manual de 8 fuentes en 6 horas.

**Cómo resolverlo.**

- *Copilot PowerPoint:* tabla de KPIs en Excel + Copilot redacta narrative.
- *Claude Code:* repo `qbr/[cliente]/` con datos exportados y plantilla.
- *Local:* Ollama sobre data extract anonimizado.
- *Plataformas CS:* **Gainsight AI**, **ChurnZero AI**, **Catalyst** generan QBR templates.
- *MCPs:* `mcp-salesforce` (oportunidades, casos), `mcp-zendesk` o `mcp-jira-servicedesk` (incidencias del cliente), `mcp-product-analytics` (uso real).

**Prompt:** *"Genera estructura QBR 10 slides: estado relación, valor entregado este trimestre (cifras), incidencias y resolución, plan próximo trimestre, peticiones pendientes, riesgos. Tono ejecutivo. Marca [DATO PENDIENTE] lo que rellene manualmente."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por QBR | 6 h | 1,5 h |
| % QBRs entregados a tiempo | 70% | 95% |
| NRR de cuentas con QBR ejecutado | medida base | +10pp |

*Fórmula:* `(4,5) h × 8 cuentas × 4 trim = 144 h/año por CSM`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si compartes el QBR pre-publicación a herramienta no aprobada, expones métricas internas del cliente.*
- *Si el modelo "inventa" un valor entregado, el QBR pierde credibilidad y pone en riesgo la renovación.*
- *Si el agente accede al sistema del cliente con tu usuario, no hay segregación.*

Cubierto en **Pieza 2** con identidad propia, allow-list NDA-friendly y validación cita-fuente.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
