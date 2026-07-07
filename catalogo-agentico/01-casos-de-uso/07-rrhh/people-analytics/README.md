# People analytics

> **Rol:** rrhh · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Entender rotación, ausentismo, equidad retributiva, *engagement* por unidad. Hoy: extracts ETL manuales + Excel + dashboards estáticos.

**Cómo resolverlo.**

- *Local:* Ollama sobre extract anonimizado y agregado (mínimo 5 personas/celda).
- *Copilot Power BI:* dashboard del HRIS con Copilot Q&A. *"Análisis rotación por unidad y antigüedad últimos 24 meses. Identifica unidades con rotación > media + 1σ. Factores correlacionados (no causales): comp ratio, manager, distancia, cambios. No infieras causalidad."*
- *Claude Code:* repo `people-analytics/` con queries y `AGENTS.md` que prohíbe scoring individual.
- *Plataformas:* **Visier AI**, **Workday Prism**, **One Model**, **Crunchr**.
- *MCPs:*

| MCP | Comando | Scopes |
|-----|---------|--------|
| `mcp-visier` | `npx mcp-visier`, `vault://visier/people-ro` | `analytics:read` agregado |
| `mcp-workday-prism` | oficial | `report:read` con agregación |
| `mcp-snowflake` | sobre `vw_hr_agg_*` | `HR_READ_AGG` |

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por análisis ad-hoc | 5 | 1 |
| % decisiones plantilla con análisis | 30% | 75% |
| Cobertura unidades con análisis trimestral | 40% | 100% |

*Fórmula:* `(4 días × 8h) × 20 análisis/año = 640 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el extract baja a nivel individual y la "anonimización" deja rasgos reidentificables, la promesa de anonimato es ficción.*
- *Si el modelo cruza salud/ausencias con desempeño, tratamiento de datos especialmente protegidos sin base.*
- *Si una predicción de "riesgo de fuga" se usa para decisiones, decisión automatizada sobre personas + sesgo casi garantizado.*

Cubierto en la **arquitectura de remediación (bloque 5)** con agregación mínima impuesta, prohibición de scoring individual, DPIA y información a comité de empresa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico* (variante read-only, sin write-back) (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-people-analytics` consulta datos agregados de plantilla (rotación, ausentismo, equidad) sobre `mcp-visier`, `mcp-workday-prism` y `mcp-snowflake` — **nunca puntúa a un individuo ni escribe al HRIS**; el analista firma la lectura del informe.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Extract a nivel individual con anonimización reidentificable | agentgateway | scope `HR_READ_AGG` limitado a vistas agregadas `vw_hr_agg_*`; enforcement de agregación mínima (celdas ≥5); el nivel individual queda fuera de la allowlist |
| Cruce de salud/ausencias con desempeño (GDPR art. 9 categorías especiales) | agentgateway | prompt guard perfil `art.9` bloquea columnas de salud/baja antes de la query a `mcp-visier`/`mcp-snowflake` |
| Predicción de "riesgo de fuga" individual usada para decisiones (GDPR art. 22) | agentgateway + agentevals | prompt guard bloquea scoring individual; `agentevals` con rubric que prohíbe salida a nivel de persona |
| Alucinación numérica (rotación o comp ratio fabricados) | agentevals | comprobaciones deterministas (cuadres, sumas) contra dataset golden antes del handoff al analista |
| Consulta masiva a `mcp-snowflake` que dispara la factura cloud | agentgateway | rate limit por tokens y segundos de compute; semantic caching de queries agregadas repetidas |

## Referencias

- GDPR art. 9 (categorías especiales), art. 22 (decisiones automatizadas), Ley Rider (información al comité de empresa). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
