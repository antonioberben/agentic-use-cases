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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
