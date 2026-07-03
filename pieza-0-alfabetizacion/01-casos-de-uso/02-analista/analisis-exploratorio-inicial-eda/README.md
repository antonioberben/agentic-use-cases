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
| Notebook | `mcp-databricks` | acceso al workspace |

Identidad propia (`svc-analyst-eda-agent`), solo lectura.

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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
