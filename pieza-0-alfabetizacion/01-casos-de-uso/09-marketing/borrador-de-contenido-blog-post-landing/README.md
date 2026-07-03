# Borrador de contenido (blog, post, landing)

> **Rol:** marketing · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Página en blanco para post de 1.500 palabras, email de campaña o landing. Hoy: 4-6 horas para primer borrador.

**Cómo resolverlo.**

- *Local:* Ollama con brief + guía de estilo + ejemplos propios.
- *Copilot Word / Outlook:* drafting con brief en SharePoint.
- *Plataformas content:* **Jasper**, **Copy.ai**, **Writer** (con brand voice), **HubSpot AI**, **Marketo AI**.
- *Claude Code:* repo `content/` con `AGENTS.md` incluyendo guía de estilo, tono prohibido y ejemplos canónicos.
- *MCPs:* `mcp-graph-files` (guías de marca, contenido previo), `mcp-confluence` (mensajería aprobada), `mcp-cms-wordpress` o `mcp-contentful` (publicación con gate).

**Prompt:** *"Genera borrador de [formato] para [audiencia]. Mensaje central: [X]. Tono [marca]. Estructura: gancho, problema, propuesta, prueba, CTA. Sin clichés. Cita fuentes externas si las hay; si no, no cites."*

**Test:** léelo en voz alta. Si suena a comunicado corporativo genérico, vuelve atrás.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por borrador | 5 h | 1 h |
| Posts publicados/mes | 4 | 12 |
| Tiempo medio en página | medida base | +25% |
| Tasa de re-trabajo editorial | 40% | 15% |

*Fórmula:* `(4) h × 100 piezas/año = 400 h/año por content writer`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si publicas sin verificar estadísticas, errores en público no se borran y se viralizan.*
- *Si el agente publica directamente en el CMS sin gate, una variante mala llega al público.*
- *Si el contenido se genera sin disclosure y es promocional, posible infracción EU AI Act + prácticas leales.*

Cubierto en **Pieza 2** con gate humano editorial, disclosure de uso de IA y allow-list de CMS con workflow de aprobación.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
