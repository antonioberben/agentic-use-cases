# Detección de anomalías

> **Rol:** analista · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Octubre se disparó. Pierdes una semana buscando por qué. Se busca lista de anomalías con magnitud, fecha, hipótesis técnicas (pipeline, hueco) y de negocio (campaña, evento), ordenadas por probabilidad.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre serie temporal. Prompt: *"Anomalías en esta serie. Para cada una: fecha, magnitud, hipótesis técnica, hipótesis de negocio. Ordena por probabilidad. No inventes causa."*

**Copilot (Power BI / Fabric).** Anomaly detection nativo.

**Claude Code / ChatGPT.** Subes la serie y aplicas el prompt.

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| Warehouse | `mcp-snowflake` etc. | `SELECT` sobre vistas |
| Monitoring (Datadog/New Relic) | `mcp-datadog` | métricas técnicas para correlacionar |

**Alternativa.** Algoritmos clásicos (`prophet`, `isolation forest`) + modelo solo para hipótesis.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-explicación de anomalía | *4-8 h* | *30-60 min* |
| % anomalías con hipótesis verificable | *50%* | *> 80%* |
| Falsos positivos perseguidos | *30%* | *< 10%* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × anomalias_mes × 11`. Ejemplo: 5 h × 6 × 11 ≈ **330 h/año**.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si la hipótesis del agente apunta a un cliente concreto ('cliente X dejó de comprar') y se actúa sin verificar, la decisión comercial se basa en correlación accidental."*
- *"Si el agente cruza la anomalía con datos de RRHH (rotación) para 'explicar' una caída, accede a datos laborales sin necesidad."*
- *"Si la anomalía es financiera y pre-anuncio, su análisis fuera del perímetro es información privilegiada."*

**Riesgos típicos:** decisiones automatizadas sobre cliente, acceso lateral a datos no necesarios, fuga MAR.

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* aplicado a series temporales (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-anomaly-agent` cruza métrica de negocio + monitoring técnico y devuelve anomalías ordenadas por probabilidad. **Solo señala; no actúa sobre cliente ni pipeline.**

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Hipótesis del agente señala cliente concreto → acción comercial sobre correlación accidental (**GDPR art. 22 · LOPDGDD**) | agentgateway | prompt guard bloquea nombres propios de cliente en hipótesis; salida agregada por segmento (`cohort_id`), no por `customer_id`; tool `notify_account_manager` deny automático |
| Cruce lateral con datos de RRHH (rotación) para "explicar" caída → categoría especial | agentregistry + agentgateway | `mcp-hris` fuera del catálogo del agente; queries hacia tablas `hr_*` deny; solo métricas de negocio + monitoring técnico publicados |
| Anomalía financiera pre-anuncio analizada fuera de perímetro → **MAR art. 7/14 · CNMV** | agentgateway | clasificación por presencia de columnas del `fact_revenue`/`fact_guidance` con `snapshot_date` posterior a último cierre publicado → modelo on-prem; egress deny |
| Alucinación de causa técnica sin correlación real con Datadog | agentevals | validador A2A: cada hipótesis técnica debe tener `signal_id` real en Datadog/New Relic con ventana temporal solapada; ausencia → línea marcada `[SIN SEÑAL CORRELACIONADA]`; eval set con 25 anomalías con causa conocida |
| Coste elevado con series diarias × cientos de métricas | agentgateway | cache 24h por `metric_id + snapshot`; batch de análisis nocturno; rate-limit por analista |
