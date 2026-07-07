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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de fuentes, validación cita-fuente obligatoria, identidad propia y gate humano antes de difundir alertas.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `reg-watcher` hace barrido semanal sobre allow-list oficial (BOE, DOUE, EBA, ESMA, BdE, CNMV, AEPD). Un sub-agente `source-validator` (A2A) comprueba que cada novedad resuelve a URL oficial + fecha antes del handoff. Sin URL oficial resoluble, la novedad no aparece en el resumen: no se "suaviza".

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Cita de norma o sentencia inventada en dictamen (**Estatuto General de la Abogacía · deontología · casos documentados de sanción a despachos**) | agentevals | validador determinista: cada cita debe resolver a URL oficial (BOE.es, EUR-Lex, CENDOJ); miss → línea eliminada, no *rewritten* |
| Prompt injection desde sitio externo sesgando el resumen semanal | agentgateway | `mcp-web-fetch` con allow-list estricta de dominios oficiales (`.boe.es`, `europa.eu`, `bde.es`, `cnmv.es`, `aepd.es`); todo lo demás bloqueado en el gateway antes de llegar al LLM |
| Publicación automática de alerta falsa a SharePoint moviliza al negocio sin causa | kagent | política `publish:decide=deny`; el agente escribe a `drafts/` con visibilidad limitada; publicar a `alerts/` requiere revisor con `role=compliance-lead` |
| Corpus con versión antigua de la norma (cambio consolidado no reflejado) | agentgateway | `mcp-vlex`/`mcp-aranzadi` obligados a devolver `version_date + consolidated_flag`; versión no vigente → rechazo en gateway |
| Sensibilidad pre-publicación (info recibida de reguladores bajo NDA) filtrada a LLM público | agentgateway | tag `pre-publication=true` en el input → routing forzado a modelo on-prem; salida a proveedor externo bloqueada |
