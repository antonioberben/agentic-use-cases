# Investigación de audiencia y mensajes

> **Rol:** marketing · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Entender qué le duele al buyer persona antes de escribir nada. Hoy: 1-2 días de research, riesgo de basarse en suposiciones.

**Cómo resolverlo.**

- *Local:* Ollama con RAG sobre transcripts de discovery y entrevistas.
- *Copilot M365:* Copilot Chat con web grounding sobre dominios técnicos del sector.
- *Plataformas con citación:* **Perplexity Deep Research**, **Claude/ChatGPT con búsqueda**, **Sparktoro**, **AnswerThePublic**.
- *Claude Code:* repo `audience/[persona]/` con `AGENTS.md` que prohíbe inventar evidencia.
- *MCPs:*

| MCP | Para qué | Scopes |
|-----|----------|--------|
| `mcp-web-fetch` con allow-list (Reddit, HN, foros sectoriales) | Captura de menciones | dominios públicos |
| `mcp-gong` o `mcp-chorus` | Voz del cliente real | `transcript:read` agregado |
| `mcp-graph-files` | Estudios internos previos | `Files.Read.All` |

- *Alternativa:* Perplexity con prompt directo + 3 entrevistas reales antes de publicar.

**Prompt:** *"Investiga al rol [X] en empresas de [sector y tamaño]. Foros, comunidades, vídeos, papers. Por hallazgo: pain point, evidencia con fuente, frecuencia aparente. No inventes; si la evidencia es débil, dilo."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por research de persona | 5 | 1 |
| Pain points con evidencia citada | 50% | 95% |
| Mensajes con resonancia (test A/B) | medida base | +30% |

*Fórmula:* `(32) h × 6 personas/año = 192 h/año por PMM`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo inventa una estadística "según Gartner X dijo Y", publicas falsedad citada y daño reputacional.*
- *Si el MCP de web-fetch no tiene allow-list, prompt injection desde foro manipulado sesga conclusiones.*
- *Si subes transcripts de cliente con NDA a herramienta no aprobada, breach NDA.*

Cubierto en **Pieza 2** con allow-list de fuentes, validación cita-fuente y allow-list de herramientas NDA-friendly.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
