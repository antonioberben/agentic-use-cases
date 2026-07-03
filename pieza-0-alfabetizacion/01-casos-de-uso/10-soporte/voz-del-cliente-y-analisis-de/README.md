# Voz del cliente y análisis de sentimiento

> **Rol:** soporte · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Entender qué rompe la experiencia más allá de los P1. Patrones débiles, tendencias trimestrales, voz del cliente al equipo de producto.

**Cómo resolverlo.**

- *Local:* Ollama sobre corpus exportado (tickets + CSAT + reviews) anonimizado.
- *Plataformas:* **Medallia AI**, **Qualtrics XM Discover**, **Sprinklr Insights**, **Thematic**.
- *Copilot M365:* Copilot Chat sobre datasets en SharePoint.
- *Claude Code:* repo `voc/` con scripts y `AGENTS.md` que prohíbe identificación individual.
- *MCPs:* `mcp-zendesk` (tickets cerrados, agregado), `mcp-qualtrics` o `mcp-medallia` (encuestas), `mcp-graph-files` (reviews públicas).

**Prompt:** *"Agrupa por tema, sentimiento y categoría. Identifica patrones: problema de producto vs soporte vs comunicación. Top 10 con frecuencia y cita representativa. Marca tendencias del último trimestre."*

Anonimización seria: sin nombres, sin cuenta identificable, agregación mínima 5.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por análisis VoC | 10 | 1 |
| % insights accionados por producto | 30% | 80% |
| CSAT global | medida base | +15pp |
| Tiempo detección problema sistémico | 6 sem | 1 sem |

*Fórmula:* `(72) h × 4 análisis/año = 288 h/año por CS ops`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la anonimización es débil (queda cuenta + plan + país), reidentificación trivial.*
- *Si el extract sale a herramienta no aprobada, expones voz del cliente y problemas del producto.*
- *Si el modelo "infiere" causas sin evidencia, persigues problema equivocado.*

Cubierto en **Pieza 2** con anonimización validada, allow-list con DPA y validación de hipótesis con datos primarios antes de actuar.

## 3. MCPs: cómo enchufar tus fuentes al agente

| MCP | Para qué lo usas |
|-----|------------------|
| Ticketing (Zendesk, Salesforce SC, Freshdesk, ServiceNow) | Tickets, histórico, SLA |
| KB (Confluence, Guru, Document360, Notion) | Artículos resolutorios, runbooks de soporte |
| Producto (logs del cliente, instancia, telemetría) | Diagnóstico en contexto |
| CRM (Salesforce, HubSpot) | Datos de cuenta, contrato, *entitlement* |
| Observabilidad (Datadog, Splunk, Dynatrace) | Estado del producto y métricas |
| Comunicación (Slack, Teams) | Escalado interno, war room |
| Encuestas (CSAT / NPS) | Voz del cliente |

**Reglas adicionales para soporte:**

- **Sanitización de adjuntos.** Logs, capturas y dumps que el cliente envía contienen credenciales, tokens y PII. Sanitiza antes de pasarlos al modelo.
- **Disclosure obligatoria en chatbots cara al cliente** (EU AI Act art. 50).
- **Sin compromisos automatizados.** Compensaciones, cambios contractuales, bajas, reclamaciones formales: humano.
- **SLA y trazabilidad.** Toda interacción del agente con cliente queda registrada (input, modelo y versión, output, decisión humana).
- **Lectura por defecto** en sistemas del cliente. Acción sobre cuenta (reset, refund, cambio de plan) → gate humano.

## 4. Cinco hábitos clave

1. **Sanitiza antes de pegar.** Logs y capturas pasan por filtro de credenciales/PII.
2. **Verifica la respuesta de la KB.** El modelo combina artículos contradictorios. Lee el citado.
3. **Tono empático sin perder firmeza.** Pide *"empático y firme"*, no *"empático"* a secas.
4. **No prometas lo que no puedes cumplir.** Marca [REVISAR] cualquier compromiso.
5. **Sesión por ticket o por swarm.** No cruces tickets distintos en la misma sesión.

## 5. Qué evitar

- Pegar logs, dumps o capturas del cliente sin sanitizar.
- Enviar respuestas generadas por el modelo sin revisar contenido y promesas.
- Chatbots cara al cliente sin disclosure, sin salida humana, o que aprueben compensaciones.
- Cerrar tickets automáticamente con respuesta de IA sin verificar resolución real.
- Asumir que la traducción es válida para compromisos contractuales.
- Mezclar datos de cliente en sesiones cruzadas.

## 6. Cómo seguir

- Lab base **"asistente al empleado frontline"**: patrón de sugerencia KB y respuesta (2.2, 2.4).
- Lab base **"agente de triage"**: patrón de clasificación de tickets (2.1).
- Lab base **"agente analítico sobre datos"**: patrón de voz del cliente (2.8).
- Guías: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
