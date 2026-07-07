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

Cubierto en la **arquitectura de remediación (bloque 5)** con scope `Mail.ReadWrite` sin `Send`, gate humano y allow-list NDA-friendly.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `redactor-respuesta` compone un borrador empático de correo al cliente a partir del histórico del ticket y la política aplicable; el agente humano revisa y envía.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Envío directo de un borrador con compromiso no autorizado | agentgateway + kagent (OBO) | `mcp-graph-mail` con scope `Mail.ReadWrite` (draft), nunca `Send`; el envío es HITL con OBO del agente humano |
| Promesa de refund/crédito SLA sin autorización en la salida | agentgateway | prompt guard de salida con patrones de compromiso; marca `[REVISAR]` y bloquea el envío hasta aprobación |
| PII del histórico del ticket al proveedor del modelo (GDPR) | agentgateway | `mcp-zendesk` RO; detección y redaction de PII antes del request |
| Política aplicada incorrecta o inventada | kagent (A2A) + agentevals | validador contrasta la política citada contra `mcp-confluence`; agentevals bloquea el handoff si la cita no resuelve |

## Referencias

- GDPR, normativa de protección del consumidor. *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
