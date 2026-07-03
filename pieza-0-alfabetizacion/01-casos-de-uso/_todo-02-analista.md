# Analista — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: data analyst, business analyst, financial analyst, BI specialist. Perfil con manejo de SQL, hojas de cálculo y herramientas de BI; no necesariamente programador.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, herramientas, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Y es la verdaderamente crítica. Adoptar estos casos sin un marco de gobierno significa:

- Datos de clientes, transacciones o información regulada saliendo del perímetro de tu organización por una herramienta no aprobada.
- Incumplimiento del **Reglamento Europeo de IA (EU AI Act)**, **GDPR**, **NIS2**, **DORA** y la normativa de la **AEPD**.
- Queries y resultados que firmas pero no puedes trazar: ¿qué modelo? ¿qué fuente? ¿qué versión del esquema?
- Agentes con acceso a warehouses sin perímetro, sin enmascarado de PII, sin auditoría de quién consulta qué.
- Coste descontrolado y dependencia de un proveedor que mañana cambia los precios o la política.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA** de este mismo kit. No actives un caso de uso de esta ficha sobre datos reales de tu organización sin haber leído antes la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

Antes pasabas el 70% del tiempo preparando datos y el 30% pensando. La IA invierte el ratio: te escribe el SQL, te limpia el dataset, te describe lo que ve. Tú dedicas el tiempo a la pregunta que importa, a validar y a explicar. Lo que no cambia: la responsabilidad de las cifras. Si firmas un número, es tuyo, lo haya calculado un modelo o no.

## 2. Ocho casos típicos (con el cómo)

### 2.1 De pregunta de negocio a SQL

#### 1) Caso de uso

Te llega *"¿cuánto vendimos por región el último trimestre comparado con el anterior?"*. Hoy abres DBeaver, buscas el esquema, recuerdas que `fact_sales` tiene tres columnas de fecha distintas, dudas cuál usar, abres el catálogo, pruebas tres versiones, descartas dos. 30-45 minutos antes de la primera cifra. Lo que se busca: la pregunta de negocio entra como lenguaje natural, sale como SQL ejecutable con CTEs comentados, JOINs explícitos y filtros temporales claros. Tú revisas, ejecutas, validas.

#### 2) Cómo resolverlo

**Local.** Ollama + Llama 3.1 70B (los 8B se equivocan demasiado con SQL no trivial). Le pegas un `CREATE TABLE` y el catálogo de descripciones de columna. Prompt: *"Genera SQL ANSI para [pregunta]. Comenta cada CTE. No asumas columnas que no aparezcan en el esquema. Marca [SUPUESTO] cualquier elección que requiera validación."* Bueno para iterar prompts; no toques producción desde aquí.

**Copilot (Microsoft Fabric / Power BI / SSMS).** Camino más corto si tu warehouse vive en el ecosistema Microsoft:

1. Editor de query con Copilot activado. El esquema lo conoce ya.
2. *"Ventas por región Q3 vs Q2 2026. Devuelve región, total Q2, total Q3, variación absoluta y %. Ordena por variación descendente."*
3. Revisa JOINs y filtros antes de ejecutar.

**Claude Code (o agente de escritorio).** Repo `analyst-sql/` con `AGENTS.md` que **prohíbe DDL** (`DROP`, `TRUNCATE`, `ALTER`) y **DML** (`INSERT`, `UPDATE`, `DELETE`) generados por el agente. Solo `SELECT`. Plantilla de queries comentadas. Útil cuando quieres versionar las queries en Git y trazar prompts.

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Warehouse | `mcp-snowflake` / `mcp-bigquery` / `mcp-databricks` | `npx mcp-snowflake` | rol `ANALYST_READ` (solo `SELECT` sobre vistas curadas, **no** sobre tablas con PII cruda) |
| Catálogo de datos | `mcp-dbt` / `mcp-atlan` *(propuesto)* | `npx mcp-dbt` | lectura del modelo dbt o catálogo |
| Git | `mcp-github` | `npx mcp-github` | lectura del repo de queries del equipo |

Identidad propia (`svc-analyst-sql-agent`) con rol de solo lectura. Cualquier escritura (carga de resultados a tabla, materialización) la hace otro proceso con identidad distinta y revisión humana.

**Alternativa.** Sin MCPs: pegas esquema (`CREATE TABLE` + descripciones) a Claude/ChatGPT/Gemini. Para warehouses específicos: **Snowflake Cortex**, **Databricks Genie**, **BigQuery Data Insights** ya integrados.

#### 3) KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-query | Tiempo desde pregunta a query ejecutable | *30-60 min* | *5-10 min* |
| Iteraciones hasta la query correcta | Versiones que rebotan | *3-5* | *1-2* |
| % queries con JOINs verificados | Disciplina | *60%* | *> 90%* (agente comenta cada CTE) |
| Ad-hoc atendidos por semana | Throughput | *5-8* | *15-25* |

**Fórmula simple:**

```
Ahorro_anual_h ≈ (TT_base − TT_nuevo) × queries_semana × 50 ÷ 60
```

Ejemplo: (40 − 8) min × 20 queries/semana × 50 ÷ 60 ≈ **533 h/año** por analista.

> *Estimaciones cualitativas pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si el MCP del warehouse tiene rol con `SELECT *` sobre tablas crudas (donde hay DNI, email, IBAN, datos de salud), una pregunta inocente saca PII al contexto del modelo. Si ese modelo es de proveedor externo y entrena con prompts, hay fuga estructural con notificación obligatoria a la AEPD."*
- *"Si el agente puede ejecutar `DELETE` o `UPDATE` porque no se restringió el rol, una *prompt injection* en el catálogo de datos o un error de razonamiento puede borrar histórico. La AEPD y, en banca, **DORA**, exigen integridad y trazabilidad del dato."*
- *"Si firmo un dashboard con una cifra que el agente calculó mal por un JOIN cruzado y la presento al comité, decisiones de negocio se toman sobre dato erróneo. La responsabilidad sigue siendo del analista, no del modelo."*
- *"Si la query incluye datos pre-anuncio (revenue del trimestre, churn no publicado) y se envía a un asistente público, en cotizada es información privilegiada (MAR)."*

**Riesgos típicos:** acceso a PII sin enmascarado, ejecución de DDL/DML por agente, alucinación de cifras en decisiones materiales, información privilegiada, falta de linaje (no se sabe qué prompt → qué query → qué resultado → qué dashboard).

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.2 Limpiar y normalizar un dataset

#### 1) Caso de uso

Recibes un CSV sucio: fechas mezcladas (`2026-06-30`, `30/6/26`, `Jun 30`), nulls como `"NA"`, `""` y `None`, monedas en `€` y `EUR`, columnas con espacios al final. Hoy 3-4 h con `pandas`/Excel. Lo que se busca: informe de calidad → script de limpieza reproducible → dataset limpio con `__quality_flag`.

#### 2) Cómo resolverlo

**Local.** Notebook + Ollama 70B sobre muestra de 200 filas anonimizadas. Prompt: *"Inspecciona: tipos, % nulls, formatos inconsistentes, outliers. Luego script Python con `pandas` que aplique correcciones; no borres filas, marca `__quality_flag`."*

**Copilot.** Excel/Power BI Copilot directamente sobre el archivo; útil para inspección y normalización ligera.

**Claude Code / ChatGPT Advanced Data Analysis.** Subes el CSV → inspección automatizada → script. Ejecuta el script tú sobre el dataset completo, no sobre la muestra.

**MCPs:**

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| Storage (S3/GCS/Azure Blob) | `mcp-s3` / `mcp-gcs` | `npx mcp-s3` | lectura del bucket del proyecto |
| Notebook (Jupyter/Databricks) | `mcp-databricks` | `npx mcp-databricks` | acceso al workspace del analista |

Identidad propia (`svc-analyst-clean-agent`). El script se ejecuta con identidad del notebook, no la del agente.

**Alternativa.** OpenRefine si la herramienta IA no está aprobada.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-limpieza | *3-4 h* | *30-45 min* |
| Reglas documentadas | *raro* | *> 90%* (script comentado) |
| Errores por re-ejecución | *15-20%* | *< 5%* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × datasets_mes × 11`. Ejemplo: 3 h × 6 datasets × 11 ≈ **200 h/año** por analista.

> *Estimaciones cualitativas pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si subo un CSV con DNI/email/IBAN sin enmascarar a un asistente público, hay fuga PII a un endpoint sin contrato. Notificación obligatoria a la AEPD."*
- *"Si el script genera una columna 'limpia' que en realidad asume reglas (todos los `"NA"` como `null`, pero algunos eran 'North America'), pierdo información sin saberlo."*
- *"Si el dataset es de clientes y mañana ejerzen derecho de supresión, la versión 'limpia' subida al asistente no se borra automáticamente."*

**Riesgos típicos:** fuga de PII, pérdida silenciosa de datos por mala normalización, copias persistentes fuera del ciclo de borrado, falta de linaje del dato limpio.

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.3 Análisis exploratorio inicial (EDA)

#### 1) Caso de uso

Llega un dataset nuevo. Dos horas de *"¿qué tengo aquí?"* (distribuciones, outliers, correlaciones). Se busca un EDA estructurado en 5-10 minutos con hallazgos y, sobre todo, marcado claro de qué es señal vs ruido.

#### 2) Cómo resolverlo

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

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-EDA | *2 h* | *15-20 min* |
| Hallazgos accionables/EDA | *1-2* | *3-5* |
| Correlaciones espurias reportadas como reales | *frecuente* | *raro si el prompt insiste en "no inventes"* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × datasets_nuevos_mes × 11`. Ejemplo: 100 min × 4 datasets × 11 ≈ **73 h/año**.

> *Estimaciones cualitativas pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el EDA cruza columnas con datos personales (edad + código postal + género), el modelo puede revelar identificación indirecta de individuos. Es PII por agregación."*
- *"Si el modelo reporta una correlación espuria como hallazgo, una decisión de negocio se toma sobre ruido."*
- *"Si el dataset está bajo NDA con cliente y se sube a asistente no aprobado, hay riesgo contractual."*

**Riesgos típicos:** identificación por agregación, correlación espuria con tono autoritativo, fuga por NDA, sesgo del muestreo no detectado.

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.4 Detección de anomalías

#### 1) Caso de uso

Octubre se disparó. Pierdes una semana buscando por qué. Se busca lista de anomalías con magnitud, fecha, hipótesis técnicas (pipeline, hueco) y de negocio (campaña, evento), ordenadas por probabilidad.

#### 2) Cómo resolverlo

**Local.** Llama 70B sobre serie temporal. Prompt: *"Anomalías en esta serie. Para cada una: fecha, magnitud, hipótesis técnica, hipótesis de negocio. Ordena por probabilidad. No inventes causa."*

**Copilot (Power BI / Fabric).** Anomaly detection nativo.

**Claude Code / ChatGPT.** Subes la serie y aplicas el prompt.

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| Warehouse | `mcp-snowflake` etc. | `SELECT` sobre vistas |
| Monitoring (Datadog/New Relic) | `mcp-datadog` | métricas técnicas para correlacionar |

**Alternativa.** Algoritmos clásicos (`prophet`, `isolation forest`) + modelo solo para hipótesis.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-explicación de anomalía | *4-8 h* | *30-60 min* |
| % anomalías con hipótesis verificable | *50%* | *> 80%* |
| Falsos positivos perseguidos | *30%* | *< 10%* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × anomalias_mes × 11`. Ejemplo: 5 h × 6 × 11 ≈ **330 h/año**.

> *Estimaciones cualitativas pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si la hipótesis del agente apunta a un cliente concreto ('cliente X dejó de comprar') y se actúa sin verificar, la decisión comercial se basa en correlación accidental."*
- *"Si el agente cruza la anomalía con datos de RRHH (rotación) para 'explicar' una caída, accede a datos laborales sin necesidad."*
- *"Si la anomalía es financiera y pre-anuncio, su análisis fuera del perímetro es información privilegiada."*

**Riesgos típicos:** decisiones automatizadas sobre cliente, acceso lateral a datos no necesarios, fuga MAR.

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.5 Visualizaciones rápidas

#### 1) Caso de uso

Tienes un DataFrame, necesitas gráfico publicable. Reaprender Matplotlib cada vez. Se busca: pides en lenguaje natural y recibes código o gráfico con ejes etiquetados, sin 3D, sin pie charts.

#### 2) Cómo resolverlo

**Local.** Notebook + Llama 70B con prompt fijo *"código Plotly. Etiqueta ejes con unidad, título descriptivo, sin pie chart, paleta sobria."*

**Copilot (Excel / Power BI / Fabric).** Lenguaje natural directo.

**Claude Code / ChatGPT.** Mismo prompt → código → tú ejecutas.

**Tableau / Looker / Lightdash con IA integrada.** Lenguaje natural sobre dataset conectado.

**MCPs:** warehouse + BI (`mcp-tableau` / `mcp-powerbi`).

**Alternativa.** Templates propios en `viz/` reutilizables.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-gráfico | *20-40 min* | *3-5 min* |
| % gráficos con ejes y unidad | *60%* | *> 95%* |
| Iteraciones de formato | *3-4* | *1* |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × graficos_semana × 50`. Ejemplo: 25 min × 8 × 50 / 60 ≈ **167 h/año**.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el gráfico oculta un eje con escala truncada (default que el modelo a veces aplica), comunico una variación falsa."*
- *"Si subo dataset con clientes nominados al asistente público, fuga PII."*
- *"Si el gráfico se publica externamente sin disclosure de generación con IA y representa datos de personas, EU AI Act art. 50."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.6 Resumir hallazgos para no-técnicos

#### 1) Caso de uso

Análisis cerrado, hay que contarlo a un VP/cliente. Se busca resumen ejecutivo de 5 líneas con la cifra primero, causa después, recomendación al final. Y versiones de 30 s / 3 min / 15 min no contradictorias.

#### 2) Cómo resolverlo

**Local.** Llama 70B sobre el bloque de resultados.

**Copilot.** En Word/PowerPoint con el análisis adjunto.

**Claude Code / ChatGPT.** Prompt: *"Resumen de 5 líneas. Cifra primero, causa más probable después, recomendación al final. Sin jerga. Si la confianza es baja, dilo. Luego variantes de 3 min y 15 min, coherentes entre sí."*

**MCPs:** docs (Notion/Confluence) para guardar resúmenes versionados.

**Alternativa.** Plantilla propia en Markdown, prompt corto.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-resumen | *45-90 min* | *10-15 min* |
| % resúmenes con cifra + recomendación | *60%* | *> 90%* |
| Iteraciones por audiencia | *2-3* | *1* |

**Fórmula:** ≈ (60 − 12) min × 20 análisis/mes × 11 / 60 ≈ **176 h/año**.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el resumen incluye una causa que el modelo afirma con confianza pero no está demostrada, el VP toma decisión sobre certeza falsa."*
- *"Si pego resultados con datos pre-anuncio en asistente público, MAR."*
- *"Si el resumen va a cliente bajo NDA, transferencia internacional sin contrato si el proveedor está fuera del EEE."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.7 Segunda opinión sobre tu propio análisis

#### 1) Caso de uso

Antes de presentar, dudas: *"¿se me ha escapado algo?"*. Se busca un revisor crítico que cuestione supuestos, identifique sesgos del muestreo y proponga métricas alternativas.

#### 2) Cómo resolverlo

**Local.** Llama 70B con prompt explícito de revisión adversarial.

**Copilot.** Funciona pero tiende a validar; hay que forzar el rol crítico.

**Claude Code / ChatGPT.** Prompt: *"Critica este análisis como revisor adversarial. Supuestos implícitos. Sesgos. Preguntas no hechas. Métricas alternativas que cambiarían la conclusión. Si no encuentras debilidades, dilo."*

**MCPs:** acceso al repo de análisis previos para comparar metodologías.

**Alternativa.** Pedir revisión humana a un par; el modelo no sustituye a un peer review formal.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % análisis con segunda opinión antes de presentar | *20%* | *> 80%* |
| Errores detectados pre-presentación | base | mejora moderada |
| TT-revisión | *60-120 min* (peer humano, si hay) | *15-20 min* (agente) |

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo no detecta un sesgo grave porque está fuera de su training, yo presento con falsa seguridad."*
- *"Si subo el análisis completo (con datos) al asistente, fuga del dataset."*
- *"Si el modelo sugiere métrica alternativa que apunta a otra conclusión y la adopto sin validar, decisión sobre métrica no probada."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.8 Documentación del análisis

#### 1) Caso de uso

La doc que nunca escribes y que el de al lado necesita seis meses después. Se busca documentación estructurada (pregunta, fuentes, transformaciones, supuestos, limitaciones, resultado, próximos pasos) generada desde queries + notas.

#### 2) Cómo resolverlo

**Local.** Llama 70B sobre el repo del análisis.

**Copilot (Microsoft 365).** En OneNote/SharePoint con el material adjunto.

**Claude Code.** Repo `analyses/YYYY-XX/` con `AGENTS.md`, plantilla `templates/analysis.md`. Comando: *"Documenta `notebooks/2026-Q3-churn.ipynb` siguiendo plantilla. Cita queries y fuentes."*

**MCPs:** Git + docs (Notion/Confluence) + dbt para incorporar linaje.

**Alternativa.** Plantilla en Markdown + rellenado manual asistido por modelo.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % análisis documentados | *20-30%* | *> 80%* |
| TT-documentación | *2-3 h* | *15-25 min* |
| Tiempo de onboarding de nuevo analista | base | reducción significativa |

**Fórmula:** ≈ (150 − 20) min × 30 análisis/año / 60 ≈ **65 h/año** por analista. Mayor valor: el conocimiento queda en la organización.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si la doc se publica en wiki abierta a toda la organización con detalle de tablas crudas, expongo el modelo de datos a quien no debería verlo."*
- *"Si el agente alucina una fuente o un supuesto, el siguiente analista lo da por bueno y propaga el error."*
- *"Si la doc se genera sobre un análisis con datos sensibles y se queda residual en cache del proveedor del modelo, retención fuera de política."*

**Riesgos típicos:** sobreexposición de modelo de datos, propagación de error documentado, retención no controlada.

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 3. MCPs: cómo enchufar tus datos al agente

Para un analista, estos MCPs son los que más rentabilizan el flujo:

| MCP | Para qué lo usas |
|-----|------------------|
| Warehouse (Snowflake / BigQuery / Databricks / Redshift) | Consulta directa, generación de SQL contra el esquema real |
| Catálogo de datos (dbt / Atlan / Collibra) | Que el modelo conozca el linaje, descripciones, owners |
| BI (Tableau / Power BI / Looker) | Lectura de dashboards existentes para no reinventar |
| Docs (Confluence / Notion / Drive) | Documentar y recuperar análisis pasados |
| Git (GitHub / GitLab) | Versionar queries, scripts de limpieza, notebooks |
| Chat (Slack / Teams) | Recibir peticiones ad-hoc y devolver resultados sin salir del flujo |

**Patrón de configuración:** igual que para el manager (ver ficha de manager, sección 3). Reglas adicionales para analista:

- **Permisos de solo lectura** en el warehouse durante la fase de exploración. La capacidad de ejecutar DDL (drop, truncate) se da después y a otra identidad.
- **Restringe el dataset accesible** al perímetro del análisis. No es lo mismo "todo el data lake" que "schema `analytics_sales`".
- **Datos personales (PII)** en columnas: pide al MCP del catálogo que enmascare antes de exponer al modelo. Si el MCP no lo soporta, no conectes esas tablas.

## 4. Cinco hábitos clave

1. **Empieza por la pregunta, no por el dato.** *"¿Qué decisión depende de esto?"* antes que *"¿qué tablas tengo?"*.
2. **Trata al modelo como junior con prisas.** Genera rápido y a veces se equivoca. Tú revisas como un senior.
3. **Pide que muestre incertidumbre.** *"Si no tienes datos suficientes, dilo. No inventes."* es el prompt más rentable.
4. **Valida toda cifra crítica contra la fuente original** antes de mandarla arriba. La factura de un error de cifra es siempre tuya.
5. **Versiona queries y prompts.** Si una query del modelo te funciona, guárdala (Git, dbt, Notion). El prompt también: la próxima vez ahorras horas.

## 5. Qué evitar

- Pegar datos de clientes, transacciones reales o información regulada en una herramienta no aprobada.
- Confiar en una query del modelo sin entender qué hace cada `JOIN`. Si no lo entiendes, no la firmas.
- Generar gráficos sin escala, sin unidad o con ejes truncados. La IA hace eso por defecto.
- Aceptar correlaciones como causalidad porque el modelo las describe con tono autoritativo.
- Dejar que el modelo decida qué métrica usar. Tú eliges la métrica; él calcula.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"** del catálogo: el patrón completo.
- Lab base **"agente regulatorio/legal sobre documentos"**: útil para análisis sobre documentación no estructurada.
- Guías de estándares operativos: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
