# Visualizaciones rápidas

> **Rol:** analista · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tienes un DataFrame, necesitas gráfico publicable. Reaprender Matplotlib cada vez. Se busca: pides en lenguaje natural y recibes código o gráfico con ejes etiquetados, sin 3D, sin pie charts.

## 2. Cómo resolverlo

**Local.** Notebook + Llama 70B con prompt fijo *"código Plotly. Etiqueta ejes con unidad, título descriptivo, sin pie chart, paleta sobria."*

**Copilot (Excel / Power BI / Fabric).** Lenguaje natural directo.

**Claude Code / ChatGPT.** Mismo prompt → código → tú ejecutas.

**Tableau / Looker / Lightdash con IA integrada.** Lenguaje natural sobre dataset conectado.

**MCPs:** warehouse + BI (`mcp-tableau` / `mcp-powerbi`).

**Alternativa.** Templates propios en `viz/` reutilizables.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-gráfico | *20-40 min* | *3-5 min* |
| % gráficos con ejes y unidad | *60%* | *> 95%* |
| Iteraciones de formato | *3-4* | *1* |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × graficos_semana × 50`. Ejemplo: 25 min × 8 × 50 / 60 ≈ **167 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el gráfico oculta un eje con escala truncada (default que el modelo a veces aplica), comunico una variación falsa."*
- *"Si subo dataset con clientes nominados al asistente público, fuga PII."*
- *"Si el gráfico se publica externamente sin disclosure de generación con IA y representa datos de personas, EU AI Act art. 50."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código* aplicado a visualización (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-viz-agent` genera código Plotly/Matplotlib con reglas de accesibilidad y honestidad estadística (ejes con unidad, sin escala truncada, sin pie chart, sin 3D).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Escala truncada por defecto → comunicación de variación falsa (**engaño estadístico · MAR** si es cifra materialmente relevante) | agentevals | validador A2A parsea AST del código: rechaza `set_ylim` con rango que excluye 0 sin flag `annotate_zero_baseline=true`; eval set con 20 datasets donde escala truncada engaña |
| Dataset con clientes nominados subido a asistente público → PII fuga | agentgateway | el agente recibe solo `schema + sample_stats`, nunca filas con `customer_id`/`email`; DLP scan pre-envío |
| Publicación externa sin disclosure IA representando personas (**EU AI Act art. 50** transparencia) | agentgateway | pipeline añade watermark C2PA `ai-generated=true` al SVG/PNG; metadata obligatoria si el gráfico contiene ejes con datos personales |
| Pie chart o gráfico engañoso publicado internamente | agentgateway | política de salida: `chart_type in {pie, 3d, dual_axis}` → línea marcada `[NO PUBLICABLE]`; reemplazo automático por bar chart |
| Coste × 8 gráficos/semana × 50 semanas × analistas | agentgateway | cache por `hash(prompt + schema)`; rate-limit por analista |
