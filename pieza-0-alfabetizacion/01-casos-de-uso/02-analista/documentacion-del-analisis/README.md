# Documentación del análisis

> **Rol:** analista · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

La doc que nunca escribes y que el de al lado necesita seis meses después. Se busca documentación estructurada (pregunta, fuentes, transformaciones, supuestos, limitaciones, resultado, próximos pasos) generada desde queries + notas.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre el repo del análisis.

**Copilot (Microsoft 365).** En OneNote/SharePoint con el material adjunto.

**Claude Code.** Repo `analyses/YYYY-XX/` con `AGENTS.md`, plantilla `templates/analysis.md`. Comando: *"Documenta `notebooks/2026-Q3-churn.ipynb` siguiendo plantilla. Cita queries y fuentes."*

**MCPs:** Git + docs (Notion/Confluence) + dbt para incorporar linaje.

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
