# Resumen y *next steps* de llamadas

> **Rol:** ventas · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 30 llamadas/semana cuyas notas nunca llegan al CRM. Información perdida, follow-ups olvidados, manager sin visibilidad.

**Cómo resolverlo.**

- *Plataformas nativas (la vía principal):* **Gong**, **Chorus**, **Avoma**, **Fireflies**, **Clari Copilot**. Resumen automático, detección de objeciones, *next steps*.
- *Teams / Zoom con Copilot / AI Companion:* transcripción + resumen + acciones. Atención al consentimiento (España/UE: aviso previo y derecho a oponerse).
- *Local:* Granola u Otter para captura local; después prompt sobre transcript: *"Extrae dolor del cliente, próximos pasos con responsable y fecha, objeciones, decisores mencionados, competencia. No inventes acuerdos no verbalizados."*
- *Claude Code:* repo `llamadas/` con transcripts; el agente genera el resumen y propone update CRM como diff.
- *MCPs:* `mcp-gong` o `mcp-chorus` (transcripts y *insights* en lectura), `mcp-salesforce` (update con gate humano), `mcp-graph-teams` (transcripciones).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| % llamadas con resumen en CRM | 30% | 95% |
| Tiempo de update post-llamada | 15 min | 2 min |
| Next steps con responsable y fecha | 50% | 100% |
| Forecast accuracy (Q-end) | ±15% | ±5% |

*Fórmula:* `(13) min × 30 llamadas/sem × 48 = 312 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si grabo sin consentimiento, infracción GDPR + LOPDGDD + posible nulidad de la prueba si hay disputa.*
- *Si subo transcript a chat genérico, expongo contenido cubierto por NDA del cliente.*
- *Si el agente tiene `update:write` sobre Salesforce y registra mal un compromiso del cliente, contaminas la fuente única del pipeline.*

Cubierto en **Pieza 2** con consentimiento gestionado por la plataforma, allow-list de proveedores con cláusulas NDA-friendly, gate humano antes de update y identidad propia del agente.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
