# Análisis exploratorio inicial (EDA)

> **Rol:** analista · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Llega un dataset nuevo. Dos horas de *"¿qué tengo aquí?"* (distribuciones, outliers, correlaciones). Se busca un EDA estructurado en 5-10 minutos con hallazgos y, sobre todo, marcado claro de qué es señal vs ruido.

## 2. Cómo resolverlo

**Local.** Notebook + Llama 70B sobre muestra. Prompt: *"EDA: distribuciones numéricas (hist + estadísticos), top 10 categóricas, correlaciones, hallazgos con hipótesis. No inventes. Si una columna tiene poco dato, dilo."*

**Copilot (Fabric / Power BI / Databricks Assistant).** EDA nativo sobre el dataset cargado.

**ChatGPT Advanced Data Analysis / Claude.** Subes muestra anonimizada, ejecuta y devuelve plots + texto.

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| Warehouse | `mcp-snowflake`/`mcp-bigquery` | `SELECT` sobre vistas curadas, **no** tablas crudas |
| Catálogo | `mcp-atlan` | `catalog:read` (detección de cuasi-identificadores) |
| Notebook | `mcp-databricks` | `workspace:read`; `notebook:write` con HITL |

Identidad propia (`svc-analyst-eda-agent`); lectura sobre warehouse/catálogo, escritura del notebook con aprobación humana. Validador de señal `stats-validator` (A2A, agentevals).

**Alternativa.** `pandas-profiling` / `ydata-profiling` local.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-EDA | *2 h* | *15-20 min* |
| Hallazgos accionables/EDA | *1-2* | *3-5* |
| Correlaciones espurias reportadas como reales | *frecuente* | *raro si el prompt insiste en "no inventes"* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × datasets_nuevos_mes × 11`. Ejemplo: 100 min × 4 datasets × 11 ≈ **73 h/año**.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el EDA cruza columnas con datos personales (edad + código postal + género), el modelo puede revelar identificación indirecta de individuos. Es PII por agregación."*
- *"Si el modelo reporta una correlación espuria como hallazgo, una decisión de negocio se toma sobre ruido."*
- *"Si el dataset está bajo NDA con cliente y se sube a asistente no aprobado, hay riesgo contractual."*

**Riesgos típicos:** identificación por agregación, correlación espuria con tono autoritativo, fuga por NDA, sesgo del muestreo no detectado.

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* aplicado a EDA (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-eda-agent` recorre distribuciones/correlaciones sobre muestra curada y devuelve hallazgos con marcador señal/ruido. Sin escritura.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Identificación por agregación (edad + CP + género) → cuasi-identificador (**GDPR art. 4.1 · LOPDGDD · AEPD guía k-anonimato**) | agentgateway | k-anonimato ≥ 5 sobre columnas cuasi-id detectadas por catálogo dbt/Atlan; tuple con `k<5` filtrada; salida agregada obligatoria en `zip3` en vez de `zip5` |
| Correlación espuria con tono autoritativo → decisión de negocio sobre ruido | agentevals | rúbrica de salida: cada correlación reportada debe incluir `p_value`, `n` y `bootstrap CI`; ausencia → línea marcada `[NO CONCLUYENTE]`; eval set con 30 datasets con correlaciones espurias etiquetadas |
| Dataset bajo NDA a asistente público → ruptura contractual | agentgateway | clasificación `client-nda` (heredada del catálogo) fuerza modelo on-prem; egress externo deny; DLP scan de nombres de cliente/proyecto en samples |
| Sesgo del muestreo no detectado (train/test leak, muestreo por conveniencia) | agentevals | validador A2A: reporta `sample_bias_score` cruzando muestra vs población; eval set con 15 datasets con sesgo conocido |
| Uso del rol personal del analista en el warehouse (sin identidad de agente) | Istio ambient + agentgateway | SPIFFE `svc-analyst-eda-agent`; JWT propio; auditoría Snowflake muestra usuario distinto para el agente |
