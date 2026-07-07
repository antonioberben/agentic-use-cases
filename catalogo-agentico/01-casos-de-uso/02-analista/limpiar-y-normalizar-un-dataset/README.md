# Limpiar y normalizar un dataset

> **Rol:** analista · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Recibes un CSV sucio: fechas mezcladas (`2026-06-30`, `30/6/26`, `Jun 30`), nulls como `"NA"`, `""` y `None`, monedas en `€` y `EUR`, columnas con espacios al final. Hoy 3-4 h con `pandas`/Excel. Lo que se busca: informe de calidad → script de limpieza reproducible → dataset limpio con `__quality_flag`.

## 2. Cómo resolverlo

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

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-limpieza | *3-4 h* | *30-45 min* |
| Reglas documentadas | *raro* | *> 90%* (script comentado) |
| Errores por re-ejecución | *15-20%* | *< 5%* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × datasets_mes × 11`. Ejemplo: 3 h × 6 datasets × 11 ≈ **200 h/año** por analista.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si subo un CSV con DNI/email/IBAN sin enmascarar a un asistente público, hay fuga PII a un endpoint sin contrato. Notificación obligatoria a la AEPD."*
- *"Si el script genera una columna 'limpia' que en realidad asume reglas (todos los `"NA"` como `null`, pero algunos eran 'North America'), pierdo información sin saberlo."*
- *"Si el dataset es de clientes y mañana ejerzen derecho de supresión, la versión 'limpia' subida al asistente no se borra automáticamente."*

**Riesgos típicos:** fuga de PII, pérdida silenciosa de datos por mala normalización, copias persistentes fuera del ciclo de borrado, falta de linaje del dato limpio.

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* aplicado a limpieza (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-clean-agent` inspecciona muestra + genera script `pandas` reproducible con `__quality_flag`. La ejecución sobre dataset completo la hace el notebook con identidad propia.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| CSV con DNI/email/IBAN sin enmascarar a LLM externo → notificación AEPD 72h (**GDPR art. 33 · LOPDGDD**) | agentgateway | DLP scan pre-envío detecta patrones DNI/IBAN/email; regla `sample_size <= 200` con hash pseudonimizado obligatorio; alternativa modelo on-prem si patrón detectado |
| Pérdida silenciosa por mala normalización (`"NA"` como null cuando era "North America") | agentevals | rúbrica de salida obligatoria: `unique_values_before/after` por columna; validador A2A detecta cardinalidad reducida > 50% → flag `[REVISAR PÉRDIDA]`; eval set con 15 datasets con nulls ambiguos |
| Copia persistente fuera del ciclo de borrado (dataset cliente que ejerce supresión) | agentgateway | TTL 24h en cache del proveedor via header `x-no-train + x-retention-hours=24`; DPA verificado en agentregistry; log de `dataset_id` → `subject_ids` para borrado forzado |
| Falta de linaje del dato limpio | agentgateway + OTel | script generado incluye `provenance_hash` del input + `agent_run_id`; commits al repo con trace ID; retención 24m |
| MCP storage con scope al bucket completo | agentregistry | `mcp-s3`/`mcp-gcs` publicado con path prefix del proyecto; queries fuera del prefix deny en waypoint |
