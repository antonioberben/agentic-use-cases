# De pregunta de negocio a SQL

> **Rol:** analista · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Te llega *"¿cuánto vendimos por región el último trimestre comparado con el anterior?"*. Hoy abres DBeaver, buscas el esquema, recuerdas que `fact_sales` tiene tres columnas de fecha distintas, dudas cuál usar, abres el catálogo, pruebas tres versiones, descartas dos. 30-45 minutos antes de la primera cifra. Lo que se busca: la pregunta de negocio entra como lenguaje natural, sale como SQL ejecutable con CTEs comentados, JOINs explícitos y filtros temporales claros. Tú revisas, ejecutas, validas.

## 2. Cómo resolverlo

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

## 3. KPIs y mejora de rendimiento

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

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si el MCP del warehouse tiene rol con `SELECT *` sobre tablas crudas (donde hay DNI, email, IBAN, datos de salud), una pregunta inocente saca PII al contexto del modelo. Si ese modelo es de proveedor externo y entrena con prompts, hay fuga estructural con notificación obligatoria a la AEPD."*
- *"Si el agente puede ejecutar `DELETE` o `UPDATE` porque no se restringió el rol, una *prompt injection* en el catálogo de datos o un error de razonamiento puede borrar histórico. La AEPD y, en banca, **DORA**, exigen integridad y trazabilidad del dato."*
- *"Si firmo un dashboard con una cifra que el agente calculó mal por un JOIN cruzado y la presento al comité, decisiones de negocio se toman sobre dato erróneo. La responsabilidad sigue siendo del analista, no del modelo."*
- *"Si la query incluye datos pre-anuncio (revenue del trimestre, churn no publicado) y se envía a un asistente público, en cotizada es información privilegiada (MAR)."*

**Riesgos típicos:** acceso a PII sin enmascarado, ejecución de DDL/DML por agente, alucinación de cifras en decisiones materiales, información privilegiada, falta de linaje (no se sabe qué prompt → qué query → qué resultado → qué dashboard).

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
