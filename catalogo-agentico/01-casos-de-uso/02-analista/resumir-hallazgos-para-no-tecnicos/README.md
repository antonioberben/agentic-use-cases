# Resumir hallazgos para no-técnicos

> **Rol:** analista · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Análisis cerrado, hay que contarlo a un VP/cliente. Se busca resumen ejecutivo de 5 líneas con la cifra primero, causa después, recomendación al final. Y versiones de 30 s / 3 min / 15 min no contradictorias.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre el bloque de resultados.

**Copilot.** En Word/PowerPoint con el análisis adjunto.

**Claude Code / ChatGPT.** Prompt: *"Resumen de 5 líneas. Cifra primero, causa más probable después, recomendación al final. Sin jerga. Si la confianza es baja, dilo. Luego variantes de 3 min y 15 min, coherentes entre sí."*

**MCPs:** análisis/notebook (`mcp-notebook`) + warehouse (`mcp-warehouse`, resultados) + BI (`mcp-bi`, dashboards) en lectura + docs (`mcp-confluence`/Notion, publicación versionada con HITL). Agente `svc-analyst-summary-agent`, validador de cifras `figure-validator` (A2A, agentevals).

**Alternativa.** Plantilla propia en Markdown, prompt corto.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-resumen | *45-90 min* | *10-15 min* |
| % resúmenes con cifra + recomendación | *60%* | *> 90%* |
| Iteraciones por audiencia | *2-3* | *1* |

**Fórmula:** ≈ (60 − 12) min × 20 análisis/mes × 11 / 60 ≈ **176 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el resumen incluye una causa que el modelo afirma con confianza pero no está demostrada, el VP toma decisión sobre certeza falsa."*
- *"Si pego resultados con datos pre-anuncio en asistente público, MAR."*
- *"Si el resumen va a cliente bajo NDA, transferencia internacional sin contrato si el proveedor está fuera del EEE."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails* aplicado a comunicación ejecutiva (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-summary-agent` produce resumen (5 líneas + 3 min + 15 min) coherentes con expresión explícita de confianza.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Causa afirmada con confianza sin evidencia → decisión ejecutiva sobre certeza falsa | agentevals | política de salida: cada afirmación causal debe llevar `confidence: low/med/high` + `p_value` o `n`; ausencia → sustituida por `[HIPÓTESIS NO VERIFICADA]`; eval set con 20 análisis con y sin evidencia |
| Datos pre-anuncio en resumen a asistente público → **MAR art. 7/14 · CNMV** | agentgateway | clasificación `pre-announcement` fuerza modelo on-prem; ventana blackout T-30/T+2; egress externo deny |
| Resumen a cliente bajo NDA con proveedor fuera del EEE → **GDPR art. 44** transferencia internacional sin garantías | agentgateway + agentregistry | DPA + SCC verificados en catálogo; egress limitado a proveedores con residencia EEE para clasificación `client-nda`; retención `x-no-train` |
| Versión 30s/3min/15min contradictorias entre sí | agentevals | validador A2A cruza cifras y conclusiones entre versiones; discrepancia → regeneración; eval set de 15 análisis con las tres versiones coherentes |
| Coste × VP × cliente × análisis | agentgateway | cache de resumen por `analysis_id + audience_scope`; rate-limit por analista |
