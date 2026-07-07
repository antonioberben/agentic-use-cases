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

Cubierto en la **arquitectura de remediación (bloque 5)** con scope `Mail.ReadWrite` sin `Send`, gate humano y allow-list de herramientas para datos NDA.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `sales-followup-writer` redacta el borrador de correo post-meeting a partir de notas Salesforce y del recap de Gong; el AE lo revisa, lo firma y lo envía **a mano** — el agente nunca dispara `Send`.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Envío automático con la firma del AE sin revisión (compromiso comercial no autorizado) | agentgateway + kagent (OBO) | `mcp-graph-mail` con scope `Mail.ReadWrite` (draft); `Mail.Send` fuera de la allowlist — el envío exige HITL y token OBO del AE |
| Compromiso del cliente inventado ("según comentaste, comprarás 100 licencias") — contradicción legal | kagent (A2A) + agentevals | validador cruza cada afirmación contra el recap de `mcp-gong` (RO); `agentevals` bloquea el handoff si aparece un acuerdo ausente en la transcripción |
| Datos NDA del meeting (notas, precios negociados) enviados al LLM del proveedor | agentgateway | detección de cláusulas/importes y redaction antes del request; el borrador recompone el texto tras la respuesta |
| Correo genérico reenviable a cualquier cuenta (sin personalización real) | agentevals | LLM-as-judge con rubric de personalización 1:1; bloquea el handoff si el borrador no cita ningún hecho específico de la cuenta |
| Coste por volumen (30 correos/sem por AE) | agentgateway | rate limit por AE y semantic caching de bloques boilerplate (firma, next steps recurrentes) |

## Referencias

- NDA con cliente; GDPR (minimización de datos personales del interlocutor en el borrador). *Citas T1.*
- Marco técnico: OWASP LLM08 (Excessive Agency).
