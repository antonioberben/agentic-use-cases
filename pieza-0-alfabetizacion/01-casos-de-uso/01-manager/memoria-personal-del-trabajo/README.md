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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

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

## 4. Cinco hábitos clave

1. **Da contexto antes de pedir.** "Soy manager de un equipo de 12 en banca, mi equipo lleva pagos. Quiero un reporte para mi VP." Sin esto, recibes algo genérico.
2. **Pide el formato de salida.** "Tres bullets, máximo 15 palabras cada uno." Si no lo pides, te lo invierte.
3. **Verifica los datos.** Toda cifra concreta que vaya a un VP o a un cliente: comprobada en la fuente original.
4. **Itera, no aceptes el primer borrador.** "Esto está bien, pero el tono es demasiado corporativo, hazlo más directo." Tres iteraciones suelen sobrar.
5. **Sesiones cortas y temáticas.** Una sesión para el reporte semanal, otra para el 1:1, otra para el email. No mezcles, el contexto se ensucia.

## 5. Qué evitar

- Pegar datos de personas (salarios, evaluaciones, performance) en una herramienta no aprobada por tu organización.
- Confiar en cifras que el modelo "ha calculado" sin enseñarte la fuente.
- Usar la IA para decisiones de personas (contratación, promoción, despido). La IA no firma; tú sí.
- Encadenar agentes que ejecutan acciones (enviar correos, mover tickets) sin gate humano hasta que el plan de gobierno lo permita.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"** del catálogo: cómo pedirle análisis útil sobre un dataset propio.
- Lab base **"asistente al empleado"**: el patrón detrás del Copilot.
- Guía de estándares operativos: `gestion-contexto.md` y `mcp-y-herramientas.md`.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
