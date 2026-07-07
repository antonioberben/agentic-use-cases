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

Cubierto en la **arquitectura de remediación (bloque 5)** con validación cita-fuente, gate humano en envío y allow-list de KB con retención cero.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `sugeridor-kb` recupera los artículos de KB relevantes para un ticket y propone respuesta citada; el agente humano valida y envía.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Paso "rellenado" que no está en la KB enviado al cliente | kagent (A2A) + agentevals | validador cita-fuente: cada afirmación resuelve a un artículo real; agentevals bloquea si `citations_verified < 100%` |
| Combinación de artículos contradictorios | agentgateway | prompt guard: instrucción de no fusionar fuentes en conflicto; el output señala la fuente por afirmación |
| Retención/entrenamiento con tickets en el MCP de KB (GDPR) | agentgateway | `mcp-confluence`/`mcp-guru` con allowlist de retención cero; egress restringido por Istio |
| Respuesta enviada al cliente sin gate | agentgateway + kagent (OBO) | el agente sugiere en draft; el envío va por `mcp-zendesk-reply` (`reply:write`) con gate HITL y OBO del humano |

## Referencias

- GDPR (PII en tickets y KB). *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
