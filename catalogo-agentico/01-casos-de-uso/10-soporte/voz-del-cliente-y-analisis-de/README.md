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

Cubierto en la **arquitectura de remediación (bloque 5)** con anonimización validada, allow-list con DPA y validación de hipótesis con datos primarios antes de actuar.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `voc-analista` agrega tickets, CSAT y reviews anonimizados y sintetiza patrones para producto; sin escrituras en sistemas de cliente ni identificación individual. Un validador A2A `evidence-validator` (identidad SPIFFE separada) exige que cada tema resuelva a una cita de origen antes del handoff; la publicación del informe VoC pasa por gate humano.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Anonimización débil (cuenta+plan+país) que permite reidentificación (GDPR) | agentgateway | redaction previa + regla de agregación mínima (k≥5); nombres reemplazados por handle antes del request |
| Publicación del informe VoC sin revisión humana | agentgateway + kagent (OBO) | `mcp-confluence` con `report:write` bajo gate HITL + OBO; nunca automático |
| Extract del corpus (tickets + CSAT + reviews) a herramienta no aprobada | agentgateway + Istio | allowlist de destinos con DPA; egress a otros bloqueado en ztunnel |
| Causas "inferidas" por el modelo sin evidencia primaria | agentevals | eval set con "trap questions"; cada patrón lleva cita representativa que resuelve a la fuente |
| Coste por análisis sobre corpus grande | agentgateway | rate limit + semantic caching de consultas repetidas |

## Referencias

- GDPR (anonimización y reidentificación). *Citas T1.*
- Marco técnico: OWASP LLM06 (Divulgación de información sensible), LLM09 (Desinformación).
