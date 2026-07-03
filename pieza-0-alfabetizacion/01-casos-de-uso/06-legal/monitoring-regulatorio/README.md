# *Monitoring* regulatorio

> **Rol:** legal · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Seguir BOE, DOUE, EBA, ESMA, BdE, CNMV, AEPD, CNMC, Eur-Lex y feeds sectoriales semanalmente. Identificar lo relevante para tu ámbito sin perder cambios y sin ahogarse en irrelevante.

**Cómo resolverlo.**

- *Local:* Ollama + RAG sobre PDFs descargados de fuentes oficiales. Sin nube cuando es información pre-publicación sensible.
- *Copilot M365:* Copilot Chat con web grounding sobre dominios oficiales. *"Resume novedades de la última semana en [ámbito]. Solo desde fuentes en allow-list."*
- *Claude Code:* repo `regulatorio/` con `AGENTS.md` definiendo ámbitos y fuentes. Agente ejecuta el barrido semanal y publica markdown.
- *Plataformas especializadas:* **Thomson Reuters Regulatory Intelligence**, **LexisNexis Regulatory Compliance**, **vLex Vincent**, **Aranzadi Indexa**. Datos verificados, no LLM puro.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-web-fetch` con allow-list (BOE, DOUE, AEPD, CNMV...) | Captura oficial |
| `mcp-vlex` o `mcp-aranzadi` | Normativa consolidada con cita |
| `mcp-graph-files` | Archivo histórico interno |

- *Alternativa:* Claude.ai con PDFs adjuntos manualmente.

**Prompt:** *"Resume desarrollos normativos relevantes para [ámbito] de la última semana. Distingue: norma publicada / consulta pública / guidance / sentencia. Para cada uno: fuente con URL oficial, fecha, impacto. No comentario de prensa. Si no tienes URL oficial, no lo cites."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas/semana de monitoring | 6 h | 1,5 h |
| Cobertura de novedades relevantes | 85% | 98% |
| Tiempo de respuesta a cambio crítico | 5 días | < 24 h |
| % citas verificables (URL oficial) | 70% | 100% |

*Fórmula:* `(6 − 1,5) h × 48 semanas = 216 h/año por compliance officer`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo cita una norma o sentencia inventada y se incorpora a un dictamen, riesgo profesional alto (casos documentados de sanción a despachos).*
- *Si el MCP de web-fetch no tiene allow-list, prompt injection desde un sitio externo puede sesgar el resumen.*
- *Si el agente publica directamente en SharePoint sin revisión, un alerta falsa moviliza al negocio sin causa.*

Cubierto en **Pieza 2** con allow-list de fuentes, validación cita-fuente obligatoria, identidad propia y gate humano antes de difundir alertas.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
