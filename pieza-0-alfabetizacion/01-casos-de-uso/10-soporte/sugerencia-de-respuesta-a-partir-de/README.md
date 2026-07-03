# Sugerencia de respuesta a partir de KB

> **Rol:** soporte · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Respuesta ya está en la base de conocimiento pero cuesta encontrar. Agente nuevo no conoce la KB; agente senior tampoco se acuerda.

**Cómo resolverlo.**

- *Plataformas KB con IA:* **Zendesk Guide AI**, **Guru AI**, **Document360 Eddy**, **Notion AI**, **Confluence Atlassian Intelligence**.
- *Local:* Ollama + RAG sobre export de la KB.
- *Copilot M365:* Copilot Chat conectado a SharePoint con KB indexada.
- *Claude Code:* repo `kb-export/` con artículos en markdown.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-confluence` | KB principal |
| `mcp-guru` | KB de respuestas verificadas |
| `mcp-zendesk` | KB del producto + tickets pasados resueltos |

**Prompt:** *"Para este ticket, busca artículos relevantes en la KB. Devuelve top 3 con título, sección y párrafo aplicable. Si ninguno encaja al 80%, dilo y propón redactar nuevo. NO combines artículos contradictorios."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo a primera respuesta (FRT) | 35 min | 10 min |
| % tickets resueltos con artículo KB | 50% | 80% |
| Tasa de re-apertura | 12% | < 5% |
| Onboarding time agente L1 | 8 sem | 3 sem |

*Fórmula:* `(25) min × 60 tickets/agente × 200 días = 5 000 h/año por equipo de 50`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" un paso que no está en la KB, envías un procedimiento inventado al cliente.*
- *Si el MCP de KB tiene retención y entrena con tickets, expones datos del cliente.*
- *Si el agente responde directamente al cliente sin gate, se compromete a algo no aprobado.*

Cubierto en **Pieza 2** con validación cita-fuente, gate humano en envío y allow-list de KB con retención cero.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
