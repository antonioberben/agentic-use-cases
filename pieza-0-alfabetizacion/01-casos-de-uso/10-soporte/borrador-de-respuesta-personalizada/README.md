# Borrador de respuesta personalizada

> **Rol:** soporte · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Correo a cliente enfadado. Tono empático y firme, sin promesas no aprobadas, sin frases robóticas.

**Cómo resolverlo.**

- *Copilot Outlook:* histórico del ticket en Zendesk + Copilot drafting.
- *Local:* Ollama con histórico + política aplicable + posición que defiendes.
- *Claude Code:* repo `respuestas/` con plantillas por tono.
- *Plataformas:* **Zendesk AI Reply Suggestions**, **Intercom Fin**, **Front AI**.
- *MCPs:* `mcp-zendesk` (histórico, lectura), `mcp-graph-mail` (`Mail.ReadWrite` draft, NO `Send`), `mcp-confluence` (políticas aplicables).

**Prompt:** *"Redacta respuesta. Tono empático y firme. Estructura: reconocimiento del problema, qué hemos hecho, qué proponemos, próximos pasos con fecha, contacto directo. Sin frases robóticas. Sin compromisos no aprobados. Marca [REVISAR] cualquier promesa que requiera autorización."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min por respuesta personalizada | 25 | 7 |
| CSAT post-respuesta | 7/10 | 8,5/10 |
| % respuestas con tono apropiado (QA review) | 60% | 95% |
| Tasa de escalado por mala comunicación | 8% | < 2% |

*Fórmula:* `(18) min × 40 respuestas/sem × 48 = 576 h/año por agente`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene `Mail.Send`, envía un borrador con compromiso no autorizado.*
- *Si el modelo promete un refund o SLA crédito sin validar, vinculación contractual.*
- *Si el histórico del ticket contiene PII y se procesa en herramienta no aprobada, breach.*

Cubierto en **Pieza 2** con scope `Mail.ReadWrite` sin `Send`, gate humano y allow-list NDA-friendly.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
