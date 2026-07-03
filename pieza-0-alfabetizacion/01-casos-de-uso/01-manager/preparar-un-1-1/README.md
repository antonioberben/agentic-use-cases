# Preparar un 1:1

> **Rol:** manager · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tienes 1:1 con cada uno de tus 8 reports cada dos semanas. Quieres llegar con contexto: en qué tickets se ha movido, dónde la/lo han citado en chat, qué objetivo del OKR está bloqueado, qué viene del último 1:1. Hoy lo "preparas" mirando Jira a vuela pluma 5 minutos antes; o no lo preparas. Lo que se busca: tres minutos antes del 1:1, un brief de una página con lo que ha hecho, lo que está bloqueando y dos o tres temas sugeridos de conversación.

## 2. Cómo resolverlo

**Local.** Te exportas los tickets de la persona, los enlaces a hilos donde se la cita y el último 1:1, sanitizados. Ollama + Llama 3.1 8B con prompt: *"Genera brief de 1:1: resumen de actividad, dos bloqueos visibles, tres temas de conversación. Tono neutral, sin juicio de desempeño."* Bueno para afinar tono; no para datos reales de personas.

**Copilot (Microsoft 365).** Camino más corto:

1. Conectores activos: Graph (mail, calendar, Teams), Jira *connector* o equivalente, OKR si está en SharePoint/Viva Goals.
2. Copilot Chat: *"Prepárame el 1:1 con [persona] de mañana. Mira: tickets en su nombre las últimas 2 semanas en proyecto PAY, mensajes donde se la haya citado en mi canal, su último 1:1 si está en mi OneNote. Devuelve: hitos / bloqueos / tres temas de conversación. Sin juicios."*
3. Cuidado: pídelo en sesión privada, no en chat compartido.

**Claude Code (o agente de escritorio).** Repo `one-on-one-prep/` con `AGENTS.md` que prohíbe explícitamente sacar conclusiones sobre desempeño y obliga a citar fuentes. Plantilla `templates/1on1.md`. Comando: *"Brief para 1:1 con [persona] del [fecha]. Sigue plantilla."*

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Jira | `@modelcontextprotocol/server-atlassian` *(propuesto)* | `npx @modelcontextprotocol/server-atlassian` | `read:jira-work` (solo lectura, solo proyectos del equipo) |
| Teams / chat | `mcp-graph-teams` | `npx mcp-graph-teams` | `Channel.ReadBasic.All`, `ChannelMessage.Read.All` (solo mis canales) |
| OneNote / Notion (notas de 1:1) | `mcp-graph-onenote` / `@notionhq/mcp` | `npx mcp-graph-onenote` | lectura del notebook personal del manager |
| OKR / Viva Goals | `mcp-graph-goals` *(propuesto)* | `npx mcp-graph-goals` | `Goals.Read` |

Identidad propia (`svc-manager-1on1-agent`). El alcance se restringe al perímetro del equipo: nada de leer tickets de proyectos donde la persona no participa, nada de leer canales privados de terceros.

**Alternativa.** Sin MCPs: exportas tú los tickets de la persona y se los pegas a Claude/ChatGPT/Gemini. Solo con metadata (títulos, estados, fechas), no con descripciones que puedan contener PII de clientes.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-preparación | Minutos invertidos por 1:1 | *0-15 min* (muchas veces 0) | *3-5 min* (revisión) |
| % 1:1 con brief previo | Disciplina | *20-30%* | *> 80%* |
| Temas no triviales por 1:1 | Más allá de "¿qué tal?" | *0-1* | *2-3* sugeridos |
| Satisfacción del report con el 1:1 | Encuesta corta cualitativa | base | mejora moderada |

**Fórmula simple:**

```
Ahorro_anual_min ≈ (TT_base − TT_nuevo) × reports × 1on1_al_año
```

Donde una mejora similar de **cobertura** (de 25% a 80% de 1:1 con brief) cuenta más que el ahorro de minutos: hay un efecto multiplicador difícil de cuantificar en calidad de gestión.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si pido al agente que evalúe el desempeño de la persona ('¿está rindiendo bien?', '¿debería preocuparme?'), estoy delegando un juicio sobre un trabajador en un modelo. El **EU AI Act clasifica como alto riesgo los sistemas usados para evaluación de personas en el ámbito laboral** (Anexo III). Si no hay DPIA y supervisión humana documentada, hay incumplimiento."*
- *"Si el MCP de chat lee canales privados o DMs donde la persona habla con terceros, estoy invadiendo correspondencia. Aunque sea técnicamente posible, no me corresponde leerlo y tampoco al agente que actúa en mi nombre."*
- *"Si guardo los briefs de 1:1 en una memoria persistente del agente y mañana cambio de equipo, esa memoria viaja con perfiles de personas que ya no gestiono. Sin política de borrado, queda un dataset sombra de RRHH."*
- *"Si el agente extrae sentimientos o estados de ánimo a partir del chat ('parece desmotivado'), entro en categorías especiales de datos (datos de salud / psicológicos) sin base jurídica."*

**Riesgos típicos:** decisión automatizada sobre trabajador (GDPR art. 22), uso de IA de alto riesgo sin DPIA (EU AI Act), MCP con scope excesivo sobre canales privados, retención no controlada de información sobre personas, falta de comunicación al comité de empresa cuando aplica.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
