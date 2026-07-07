# T15 — Lectura crítica de planes y business cases

## Identificación

- **Rol principal**: ejecutivo (CEO, COO, CFO, director general de unidad).
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio/legal (variante crítica).
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de basar decisión de inversión.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

A comité llegan business cases bien presentados pero con hipótesis ocultas, sensibilidades no testadas, dependencias críticas. El ejecutivo aprueba bajo presión de tiempo y a veces por relación con el ponente. El agente actúa como contrincante: enumera hipótesis no explicitadas, sensibilidades, dependencias y comparativa con benchmarks razonables.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre PDF del plan. Prompt: *"Lee crítico: hipótesis no explicitadas, sensibilidades no testadas, dependencias críticas, métricas que no defienden el caso si fallan, comparativa con benchmarks razonables. Tono de director general que ha visto fracasar planes parecidos. **No reescribas el plan; señala.**"*

### 2.2 Copilot

Copilot M365 con sensibilidad `Highly Confidential / Board`. Nunca chat público.

### 2.3 Claude Code

Repo `exec/cases/` con `AGENTS.md` que define rúbrica del ejecutivo (TAM realista, unit economics, supuestos macro, dependencias técnicas, plan B).

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-drive` | Google Drive/SharePoint MCP | `vault://exec/drive-ro` | `plans:read` (carpeta de business cases del comité) |
| `mcp-bi` | Power BI/Tableau MCP | `vault://exec/bi-ro` | `datasets:read` solo datos públicos internos |
| `mcp-research` | Gartner/Forrester MCP | `vault://exec/analyst-ro` | `reports:read` |
| `mcp-review` | Review writer | `vault://exec/review-rw` | `review:write` (guardar la revisión crítica, **solo con aprobación humana**) |

### 2.5 Alternativas

Claude Projects con rúbrica al inicio del prompt.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Hipótesis ocultas detectadas por plan | 1-2 | 5-8 |
| Planes aprobados que descarrilan a 12m | medio | bajo |
| Tiempo a análisis crítico | 4 h | 30 min |

Fórmula: *valor en planes evitados (orden 10⁵-10⁶ €/plan). (estimación cualitativa, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si subo el business case (con proyecciones M&A, mercados por entrar) a servicio no aprobado, filtración estratégica directa."*
- *"Si el modelo alucina benchmarks de mercado y rechazo el plan, decisión errónea + coste reputacional con el director que lo presentó."*
- *"Si delego en el modelo la decisión, sustituyo criterio fiduciario por output estadístico."*

**Riesgos típicos:** fuga estratégica, alucinación de benchmarks, delegación implícita en el modelo, sesgo del modelo a estructura "optimista".

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* en modo contrincante (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-exec-critic-agent` aplica rúbrica del ejecutivo sobre el business case y devuelve hipótesis ocultas + sensibilidades + comparativa con benchmarks. **No decide**; señala.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Filtración estratégica (M&A, entrada en mercados, proyecciones) a servicio no aprobado (**MAR art. 7 · MiCA · deber fiduciario art. 225 LSC**) | agentgateway | clasificación `board-material` fuerza modelo on-prem; egress LLM externo deny absoluto; ventana blackout con audit trail; retención logs 5 años para escrutinio del consejo |
| Alucinación de benchmarks Gartner/Forrester → rechazo erróneo del plan y coste reputacional | agentevals | validador A2A cruza cada benchmark citado contra `mcp-research` con `report_id`; miss → línea marcada `[BENCHMARK NO VERIFICADO]`; eval set con 30 planes históricos con benchmarks conocidos |
| Delegación implícita en el modelo (sustitución de criterio fiduciario) | agentgateway + kagent | plantilla de salida obligatoria "hipótesis · sensibilidades · dependencias · **no recomendación**"; cualquier respuesta que contenga verbos decisorios (`aprobar`, `rechazar`) es filtrada por prompt guard |
| Sesgo del modelo hacia estructura optimista (entrenamiento en pitchdecks) | agentevals | eval set adversarial con 20 planes históricamente fracasados; umbral mínimo de sensibilidades detectadas por plan |
| Fuga a través de MCP BI con datasets no públicos | agentregistry | `mcp-bi` publicado con scope solo a datasets etiquetados `board-shareable`; datos crudos del data warehouse fuera del catálogo del agente |
| Guardar la revisión crítica sin control → revisión con benchmarks sin verificar archivada como base de decisión | agentgateway (MCP Gateway) + kagent | `mcp-review` con scope `review:write`; **HITL obligatorio antes de guardar**; OBO del ejecutivo |

## Referencias

- Deber fiduciario del administrador, gobierno corporativo. *Citas T1.*
