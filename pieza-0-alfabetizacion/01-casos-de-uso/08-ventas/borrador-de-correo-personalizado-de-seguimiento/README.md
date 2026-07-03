# Borrador de correo personalizado de seguimiento

> **Rol:** ventas · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Correo post-meeting a las 21h con prisa. Hoy: genérico o con detalles olvidados.

**Cómo resolverlo.**

- *Local:* Ollama con notas del meeting + propuesta de valor + next step.
- *Copilot Outlook:* notas en OneNote + Copilot drafting en Outlook. *"Redacta correo seguimiento. Tono profesional cercano. Estructura: agradecimiento concreto, recap 3 puntos clave, próximos pasos con fecha, pregunta de cierre. Sin marketing-speak. Sin 'esperando con interés'."*
- *Claude Code:* repo `outreach/` con plantillas por persona y `AGENTS.md` con estilo del AE.
- *Plataformas sales engagement:* **Outreach**, **Salesloft**, **Apollo**, **Lavender**. Con AI nativa para personalización 1:1.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-graph-mail` | Histórico de correos con el cliente (lectura), draft (NO `Send`) |
| `mcp-salesforce` | Notas de meeting y contexto |
| `mcp-gong` | Recap del meeting |

Scope crítico: `Mail.ReadWrite` (draft), NUNCA `Mail.Send` automático.

- *Alternativa:* Claude.ai con notas y plantilla pegadas.

**Test:** si el correo podría enviarse a cualquier cliente, no es personalizado. Vuelve atrás.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por correo seguimiento | 20 min | 5 min |
| Tasa de respuesta | 25% | 45% |
| Correos enviados < 24h post-meeting | 50% | 95% |

*Fórmula:* `(15) min × 30 correos/sem × 48 = 360 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene `Mail.Send` automático, envía un borrador no revisado con tu firma.*
- *Si las notas del meeting incluyen NDA y se procesan en herramienta no aprobada, breach contractual.*
- *Si el modelo "rellena" un compromiso del cliente que no diste ("según comentaste, comprarás 100 licencias"), contradicción legal del cliente.*

Cubierto en **Pieza 2** con scope `Mail.ReadWrite` sin `Send`, gate humano y allow-list de herramientas para datos NDA.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
