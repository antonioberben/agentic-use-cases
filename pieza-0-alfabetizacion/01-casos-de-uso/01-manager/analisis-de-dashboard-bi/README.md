# Análisis de dashboard / BI

> **Rol:** manager · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tu equipo tiene un dashboard en Power BI / Tableau / Looker con 30-40 métricas. Cada lunes te toca mirar y decidir qué tres cosas merecen acción. Hoy lo abres, miras 5 minutos, escoges intuitivamente. Pierdes señales débiles y a veces persigues falsos positivos. Lo que se busca: el agente lee el dashboard, compara con la semana/mes anterior, te entrega tres variaciones prioritarias con hipótesis de causa y citas a la métrica concreta. Tú decides qué investigar.

## 2. Cómo resolverlo

**Local.** Exportas a CSV las métricas (anonimizadas). Ollama + Llama 3.1 8B. Prompt base: *"Recibes una serie temporal de KPIs. Compara último periodo con anteriores. Devuelve las tres variaciones más significativas (> 1 sigma), con hipótesis de causa basada en los datos, no en suposiciones. Cita la métrica y la magnitud del cambio. No inventes."* Bueno para afinar prompt; lectura de tablas es donde más alucinan los modelos pequeños, doble verificación obligatoria.

**Copilot (Microsoft 365 / Power BI).** Camino más corto si el dashboard está en Power BI:

1. Activa **Copilot in Power BI** (requiere licencia y modelo semántico habilitado).
2. En el dashboard: *"Identifica las tres variaciones más significativas de esta semana frente a la anterior. Excluye estacionalidad esperada. Dame hipótesis de causa basada en los datos del modelo, no en suposiciones."*
3. Pide siempre la **cita a la métrica y al valor**, no aceptes resúmenes sin números.

**Claude Code (o agente de escritorio).** Útil cuando los datos están en CSV/Parquet o un data warehouse. Repo `bi-digest/` con `AGENTS.md` que **prohíbe inventar correlaciones** y obliga a citar el dato fuente. Comando: *"Análisis semanal de `data/kpis-week-NN.csv`. Tres variaciones top con hipótesis."* Útil combinarlo con un MCP de BigQuery / Snowflake / Databricks para que el agente consulte directamente.

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Power BI | `mcp-powerbi` *(propuesto)* | `npx mcp-powerbi --workspace ${WS_ID}` | `Dataset.Read.All` (solo workspaces autorizados) |
| Data warehouse | `mcp-snowflake` / `mcp-bigquery` | `npx mcp-snowflake` | rol de solo lectura sobre vistas curadas, **no** sobre tablas crudas con PII |
| Documentación de métricas | `@notionhq/mcp` o `mcp-confluence` | `npx mcp-confluence` | lectura del espacio de definiciones |

Identidad propia (`svc-manager-bi-agent`) con rol de solo lectura sobre **vistas curadas**, no sobre tablas crudas. Quien define las vistas curadas es Data Engineering.

**Alternativa.** Captura el dashboard como imagen y pásala a Claude/ChatGPT/Gemini (los tres leen imágenes). Cuidado: los modelos siguen leyendo mal valores numéricos en gráficos, contrasta toda cifra antes de actuar.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-revisión semanal | Minutos dedicados a leer el dashboard | *15-30 min* | *5-10 min* (revisión de hipótesis) |
| Señales débiles detectadas | Variaciones relevantes no obvias | *0-1/semana* | *2-3/semana* |
| Falsos positivos perseguidos | Hipótesis investigadas que no llevan a nada | *30%* | *10-15%* (mejor hipótesis con datos) |
| Tiempo a la acción correctiva | Días entre detección y acción | *5-10 días* | *2-3 días* |

**Fórmula simple:** difícil cuantificar en horas; el valor está en captar señales débiles que generan acciones correctivas tempranas. Métrica útil: *value at stake* evitado por detección temprana (estimación cualitativa pendiente de T1).

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si el MCP de Power BI / data warehouse tiene scope amplio (lectura de todas las tablas), el agente puede leer datos de cliente con PII, datos financieros pre-anuncio o información de RRHH que no debería ver. Una pregunta inocente ('¿qué pasa con churn?') puede sacar nombres y datos personales del datalake."*
- *"Si el modelo alucina una cifra (lectura incorrecta de un gráfico, mezcla de columnas, mala interpretación de un percentil) y yo escalo esa hipótesis a mi VP sin verificar, tomo decisiones sobre datos inventados. En decisiones materiales (precio, plantilla, presupuesto), el daño puede ser significativo."*
- *"Si la información financiera (revenue, churn, márgenes) sale a un asistente público no aprobado antes del anuncio trimestral, en empresa cotizada es **información privilegiada** y vulnera MAR. La AEPD también puede sancionar por tratamiento de datos personales sin base jurídica."*
- *"Si la conexión del MCP usa mi cuenta personal de Power BI/Snowflake en lugar de un servicio dedicado, queda firmada como mi actividad. Auditoría no puede distinguir qué consulté yo y qué consultó el agente."*

**Riesgos típicos:** lectura de PII sin base jurídica, alucinación numérica en decisiones materiales, información privilegiada pre-anuncio (MAR), uso de modelos no aprobados sobre datos regulados, falta de segregación entre vistas curadas y tablas crudas.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
