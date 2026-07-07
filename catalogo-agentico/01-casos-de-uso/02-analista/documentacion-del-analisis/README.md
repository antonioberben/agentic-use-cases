# Documentación del análisis

> **Rol:** analista · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

La doc que nunca escribes y que el de al lado necesita seis meses después. Se busca documentación estructurada (pregunta, fuentes, transformaciones, supuestos, limitaciones, resultado, próximos pasos) generada desde queries + notas.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre el repo del análisis.

**Copilot (Microsoft 365).** En OneNote/SharePoint con el material adjunto.

**Claude Code.** Repo `analyses/YYYY-XX/` con `AGENTS.md`, plantilla `templates/analysis.md`. Comando: *"Documenta `notebooks/2026-Q3-churn.ipynb` siguiendo plantilla. Cita queries y fuentes."*

**MCPs:** Git (`mcp-github`, repo del análisis) + notebook (`mcp-notebook`) + dbt (`mcp-dbt`, linaje) + docs (`mcp-confluence`/Notion, publicación con HITL). Agente `svc-analyst-doc-agent`, validador de fuentes `source-validator` (A2A, agentevals).

**Alternativa.** Plantilla en Markdown + rellenado manual asistido por modelo.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % análisis documentados | *20-30%* | *> 80%* |
| TT-documentación | *2-3 h* | *15-25 min* |
| Tiempo de onboarding de nuevo analista | base | reducción significativa |

**Fórmula:** ≈ (150 − 20) min × 30 análisis/año / 60 ≈ **65 h/año** por analista. Mayor valor: el conocimiento queda en la organización.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si la doc se publica en wiki abierta a toda la organización con detalle de tablas crudas, expongo el modelo de datos a quien no debería verlo."*
- *"Si el agente alucina una fuente o un supuesto, el siguiente analista lo da por bueno y propaga el error."*
- *"Si la doc se genera sobre un análisis con datos sensibles y se queda residual en cache del proveedor del modelo, retención fuera de política."*

**Riesgos típicos:** sobreexposición de modelo de datos, propagación de error documentado, retención no controlada.

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails* aplicado a documentación técnica (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-doc-agent` genera documentación estructurada desde queries + notas + linaje dbt, con cita a cada fuente.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Wiki abierta con detalle de tablas crudas → exposición del modelo de datos a toda la organización | agentgateway + agentregistry | política de salida: nombres de tabla `raw_*` filtrados a `<fuente>`; publica solo hacia `mcp-confluence` con espacio `data-docs` con ACL por rol; queries hacia espacios abiertos deny |
| Alucinación de fuente/supuesto → propagación de error a próximos analistas | agentevals | validador A2A: cada `source_id` citado debe existir en linaje dbt/Atlan; miss → línea marcada `[FUENTE NO VERIFICADA]`; eval set con 20 análisis con fuentes conocidas |
| Retención de análisis con datos sensibles en cache del proveedor | agentgateway | header `x-no-train` obligatorio; DPA verificado en agentregistry; modelo on-prem forzado para clasificación `hr-sensitive`/`client-nda` |
| Documentación de linaje que expone joins con PII | agentgateway | pii-redact en descripciones de columna: `email_hash`, `dni_partial` reemplazan valores ejemplo en la doc |
| Sin trazabilidad de qué prompt generó qué doc (auditoría del análisis) | agentgateway + OTel | `doc_id` en Confluence enlazado a trace ID del agente; log con hash de prompt, versión del notebook, retención 24m |
