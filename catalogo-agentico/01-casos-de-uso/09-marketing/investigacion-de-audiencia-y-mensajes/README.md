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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de fuentes, validación cita-fuente y allow-list de herramientas NDA-friendly.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `audience-research-agent`: agrega foros/CRM/voz-de-cliente en insights citados; el PMM valida antes de que alimenten la mensajería.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Estadística inventada citada a fuente real ("según Gartner...") que alimenta claims (Dir. 2005/29/CE) | kagent (A2A) + agentevals | validador comprueba cada cita contra la URL/fuente; `citations_verified < 100%` bloquea el handoff |
| `mcp-web-fetch` sin allowlist deja entrar un foro manipulado que sesga conclusiones | agentgateway | allowlist estrecha de dominios de research (Reddit, HN, foros sectoriales); contenido de foro `untrusted` + spotlighting |
| Transcripts de cliente con NDA subidos a herramienta no aprobada (breach NDA) | agentgateway + agentregistry | `mcp-gong`/`mcp-chorus` scope `transcript:read` agregado; sólo herramientas NDA-friendly allowlisted; redaction de nombres de cuenta |
| PII de cliente en transcripts hacia el LLM proveedor (GDPR art. 5/9) | agentgateway | detección y redaction de identificadores antes del request |
| Insight con evidencia débil presentado como hecho para decidir mensajería | agentevals | el output marca `evidencia: fuerte/débil` y `fecha de fuente`; bloqueo si presenta evidencia débil como concluyente |

## Referencias

- GDPR (art. 5/9, minimización y categorías especiales), Directiva 2005/29/CE (prácticas comerciales desleales), obligaciones contractuales de NDA. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
