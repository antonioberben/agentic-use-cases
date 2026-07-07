# Memoria personal del trabajo

> **Rol:** manager · **Caso 2.10** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Cada semana pierdes 1-3 horas en preguntas internas: *"¿qué dijimos sobre X hace dos meses?"*, *"¿quién me pidió esto?"*, *"¿qué prometí en la reunión con Y en abril?"*. Hoy buscas en correo, en Slack, en Notion, en tu libreta. Lo que se busca: una memoria personal del trabajo (correo + calendario + chat + drive + tracker + notas) consultable en lenguaje natural, con cita a la fuente original.

## 2. Cómo resolverlo

**Local.** Volcado periódico de exports a Obsidian o similar + LLM local sobre ese volumen con RAG (LM Studio + AnythingLLM, o LangChain personalizado). Más fricción, máxima privacidad. Sirve para perfiles que tratan información muy sensible.

**Copilot (Microsoft 365).** Camino natural si tu organización ya está en M365: Copilot indexa correo, Teams, OneDrive y SharePoint nativamente. Las preguntas *"¿qué decidimos con cliente X en abril?"* se responden sin configurar nada adicional. Limitación: solo M365; lo que esté en Jira/Notion/Slack queda fuera salvo conectores.

**Claude Code (o agente de escritorio).** Repo `personal-memory/` con `AGENTS.md` que **prohíbe escribir** en cualquier sistema (solo consulta) y obliga a citar fuente. Comando: *"Cronología de decisiones sobre el proveedor X desde marzo, citando fuente de cada punto."* Recomendado si quieres lógica de consulta propia o agregar fuentes que Copilot no cubre.

**Segunda memoria dedicada.** Mem.ai, Reflect, Granola, ChatGPT Memory, Claude Projects, Notion AI. Vuelcas actas y decisiones clave. Cerebro paralelo. Útil pero suma proveedor.

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Correo + calendario | `mcp-graph-mail` + `mcp-graph-calendar` | `npx mcp-graph-mail` | `Mail.Read`, `Calendars.Read` |
| Chat | `mcp-graph-teams` | `npx mcp-graph-teams` | `ChatMessage.Read`, `Channel.ReadBasic.All` |
| Drive | `mcp-graph-files` | `npx mcp-graph-files` | `Files.Read.All` (mis archivos + compartidos conmigo) |
| Tracker | `@modelcontextprotocol/server-atlassian` | `npx @modelcontextprotocol/server-atlassian` | `read:jira-work` (proyectos del equipo) |
| Notion / Confluence | `@notionhq/mcp` / `mcp-confluence` | `npx -y @notionhq/mcp` | lectura del espacio propio |

Identidad propia (`svc-manager-memory-agent`). **Crítico:** solo lectura en todos los MCPs. Es memoria de consulta, nunca de acción.

**Alternativa.** Para una investigación puntual: exportas la materia prima y la pegas a Claude/ChatGPT/Gemini con prompt de reconstrucción cronológica. Sirve cuando lo necesitas una vez; no sustituye a la memoria continua.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-recuperación | Minutos para responder "¿qué dijimos hace X?" | *15-30 min* (muchas veces no se encuentra) | *< 2 min* |
| % preguntas internas respondidas con cita | Trazabilidad | *20%* | *> 80%* |
| Promesas a cliente olvidadas | Compromisos sin seguimiento | *10-20%* | *< 5%* |
| Decisiones revisitadas sin saber el contexto previo | Reuniones que repiten discusión | base | reducción significativa |

**Fórmula simple:**

```
Ahorro_anual_h ≈ TT_ahorrado_por_consulta × consultas_semana × 50
```

Ejemplo: 20 min × 5 consultas/semana × 50 = 5 000 min ≈ **83 h/año** por manager.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si conecto MCPs sobre todas mis fuentes y mañana cambio de equipo o de empresa, esa memoria (con datos de personas, clientes y decisiones internas) viaja conmigo en el cliente del agente. Sin política de borrado al offboarding, hay fuga estructural."*
- *"Si la memoria persistente del agente almacena pares pregunta-respuesta y un día pregunto algo cuya respuesta contiene PII, esa PII queda en cache del proveedor. Si el proveedor entrena con conversaciones, la PII puede salir."*
- *"Si la memoria cubre correos de hace un año y el dato debería haberse borrado por política de retención (datos de candidatos rechazados, datos de cliente terminado), estoy re-creando una copia fuera del ciclo de borrado oficial."*
- *"Si el MCP de Jira lee proyectos del tenant más allá del equipo (scope amplio), la memoria personal acumula información de equipos vecinos que el manager no necesita y no debería tener indexada."*

**Riesgos típicos:** retención más allá de la política corporativa, derecho de supresión GDPR no cumplido por la memoria del proveedor, datos de personas indexados sin DPIA, transferencia internacional, *shadow AI* (memoria personal de terceros con datos corporativos), fuga al offboarding.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 3. MCPs: cómo enchufar tus datos al agente

Un **MCP** (Model Context Protocol) es un conector estándar entre tu agente y una fuente de datos. Cuando enchufas un MCP de Jira a tu agente, este puede leer (y a veces escribir) en Jira sin que tú copies y pegues nada.

**Para un manager, estos cinco MCPs cubren el 80% del trabajo:**

| MCP | Para qué lo usas |
|-----|------------------|
| Calendario (Google / Outlook) | Reuniones de la semana, agenda del 1:1, conflictos |
| Email (Gmail / Outlook) | Resúmenes de bandeja, borradores, follow-ups |
| Chat de equipo (Slack / Teams) | Hilos relevantes, decisiones tomadas en canal |
| Tracker (Jira / Linear / Asana) | Tickets de tu equipo, progreso, bloqueos |
| Documentos (Drive / SharePoint / Notion) | OKRs, planes, actas, plantillas |

**Cómo se configura (patrón general):**

1. En tu herramienta (Claude Desktop, Cursor, Copilot Studio, etc.) entras en *Settings → Connectors* o *MCP servers*.
2. Eliges el conector. Te pide autenticarte con la cuenta corporativa.
3. Defines el **alcance**: solo lectura vs lectura+escritura, qué carpetas/proyectos/canales, ventana temporal.
4. Pruebas con una consulta segura ("¿qué reuniones tengo mañana?") antes de pedirle nada que ejecute acciones.

**Reglas mínimas antes de conectar nada:**

- Pregunta a tu IT/seguridad qué MCPs están **aprobados**. No actives uno por tu cuenta si tocan datos sensibles.
- Empieza por **solo lectura**. La escritura (enviar correos, cerrar tickets) es un paso aparte y requiere control.
- Si el MCP lo da un tercero desconocido, no lo instales. Es el equivalente a meter una extensión del navegador random con acceso a tu correo.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* aplicado a memoria personal (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-memory-agent` indexa correo + calendario + chat + drive + tracker y responde con cita a la fuente. **Solo lectura en todos los MCPs.**

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Memoria persistente cachea PII → salida por entrenamiento del proveedor (**GDPR art. 22 · LOPDGDD · derecho de supresión art. 17**) | agentgateway | egress LLM externo con header `x-no-train`; contratos DPA obligatorios en agentregistry; alternativa on-prem para clasificación `hr-sensitive` |
| Re-creación de datos fuera del ciclo de borrado corporativo (candidatos rechazados, cliente terminado) | agentgateway + agentregistry | TTL de índice sincronizado con política de retención por fuente; job diario de purga con `subject_id` desde IAM (offboarding, GDPR erasure requests) |
| Scope amplio de `mcp-jira` sobre proyectos ajenos al equipo | agentregistry | `mcp-jira` publicado con lista explícita de `project_key` del manager; queries cross-project denegadas en waypoint |
| Fuga al offboarding (memoria viaja al cambiar de empresa) | Istio ambient + agentgateway | identidad SPIFFE `svc-manager-memory-<uid>` revocada por IAM al offboarding; sin credenciales largas en el cliente; keys rotadas 90d |
| Ausencia de DPIA para memoria que indexa datos de personas (**EU AI Act Anexo III · GDPR art. 35**) | agentregistry | ficha del agente exige DPIA firmada antes de publicación; sin ella el agente no aparece en catálogo |
| Cita inventada a una fuente inexistente (respuesta sin anclaje real) | agentevals | validador A2A `source-validator` cruza cada cita contra el `source_id`/mensaje original; miss → línea marcada `[FUENTE NO VERIFICADA]` |
