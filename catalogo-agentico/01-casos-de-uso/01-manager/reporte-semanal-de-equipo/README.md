# Reporte semanal de equipo

> **Rol:** manager · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Cada viernes (o cada lunes a primera hora) te toca producir el reporte de equipo para tu jefe o para dirección. Hitos cumplidos, bloqueos, riesgos, próximos pasos. La materia prima está dispersa: tickets cerrados en Jira/Linear/Asana, hilos clave en Slack/Teams, decisiones en actas de reunión, datos del OKR. Hoy tú recoges, lees, sintetizas, escribes y reescribes en dos tonos (uno para arriba, otro para tu equipo). Entre 60 y 120 minutos de tu semana; el contenido no es difícil, lo costoso es el copia-pega y el cambio de contexto.

Lo que se persigue: que el agente recoja la materia prima, te entregue un borrador estructurado con citas, y tú dediques el tiempo a la narrativa y a decidir qué se queda fuera.

## 2. Cómo resolverlo

**Local (laboratorio personal, sin datos reales).** Ollama + Llama 3.1 8B + cliente como Open WebUI o LM Studio. Exportas a `.csv`/`.md` los tickets y las actas de la semana **anonimizados** (sin nombres reales, sin clientes). Prompt base: *"Recibes tres bloques: (A) tickets cerrados, (B) decisiones de reunión, (C) hilos del canal de equipo. Devuelve reporte con secciones hitos / bloqueos / próximos pasos. Cita la fuente de cada punto. No inventes; si una sección no tiene material, dilo."* Sirve para afinar prompt y formato; no para producción.

**Copilot (Microsoft 365).** Camino más corto si tu organización ya tiene M365 E3/E5 con Copilot licenciado:

1. Conectores activos en el tenant: Microsoft Graph (mail, calendar, Teams), Jira *connector* (vía Power Platform o Graph connectors), SharePoint si las actas están ahí.
2. Abre Copilot Chat (en Teams o en el panel lateral). Prompt: *"Genera reporte semanal de mi equipo. Combina: tickets cerrados en Jira proyecto PAY-, mensajes destacados de mi canal de Teams 'pagos-core' de los últimos 7 días, y reuniones marcadas con 'sync' en mi calendario. Estructura: hitos / bloqueos / próximos pasos. Cita la fuente de cada item. Tono: ejecutivo para mi VP."*
3. Variante para tu equipo: *"Reescribe el mismo contenido en tono cercano, segunda persona del plural."*
4. Procesamiento queda en el tenant (Microsoft data boundary). Revisar región y EU Data Boundary si vuestra organización lo exige.

**Claude Code (o agente de escritorio equivalente).** Camino para quien quiera control del prompt y de los MCPs:

- Repo `weekly-report-agent/` con `AGENTS.md` que fija misión, alcance (solo lectura), tono y formato.
- `mcp.json` con MCPs de Jira, Slack/Teams, Calendar, Drive/SharePoint (ver tabla abajo).
- Comando: *"Genera el reporte del equipo PAY de esta semana. Sigue la plantilla en `templates/weekly.md`. Cita fuentes."*
- La herramienta lee, sintetiza, escribe en `out/weekly-YYYY-WW.md`. Tú revisas y publicas.

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Jira | `@modelcontextprotocol/server-atlassian` *(propuesto, comprobar GA)* | `npx @modelcontextprotocol/server-atlassian` | `read:jira-work`, *no* `write` |
| Calendar (Graph) | `mcp-graph-calendar` | `npx mcp-graph-calendar --tenant ${TENANT_ID}` | `Calendars.Read` |
| Teams (Graph) | `mcp-graph-teams` | `npx mcp-graph-teams` | `Channel.ReadBasic.All`, `ChannelMessage.Read.All` |
| Drive/SharePoint | `mcp-graph-files` | `npx mcp-graph-files` | `Files.Read.All` |

Snippet `mcp.json` (Claude Code / Cursor):

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-atlassian"],
      "env": { "ATLASSIAN_TOKEN_REF": "vault://manager/jira" }
    },
    "graph": {
      "command": "npx",
      "args": ["mcp-graph", "--scopes", "Calendars.Read,Channel.ReadBasic.All,Files.Read.All"],
      "env": { "AZURE_CLIENT_ID": "${AGENT_APP_ID}", "AZURE_CLIENT_SECRET_REF": "vault://manager/graph" }
    }
  }
}
```

Identidad propia del agente (`svc-manager-report-agent`), nunca tu cuenta personal. Secretos vía *vault*.

**Alternativa sin integración.** Si aún no hay MCPs disponibles: exportas a CSV/markdown la materia prima, la pegas a Claude/ChatGPT/Gemini con el prompt anterior. Solo con datos sanitizados y solo para piloto.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-reporte | Tiempo de producir el reporte de principio a fin | *60-120 min/semana* | *15-25 min/semana* (revisión y narrativa) |
| Latencia de publicación | Días entre cierre de semana y reporte en bandeja del VP | *1-3 días* | *< 1 día* |
| Cobertura de fuentes | % de items con cita a fuente verificable | *50-70%* (recuerdo manual) | *> 95%* (agente cita siempre) |
| Iteraciones por reporte | Veces que reabres y reescribes antes de enviar | *2-3* | *1* tras afinar plantilla |

**Fórmula simple:**

```
Ahorro_anual_min ≈ (TT_base − TT_nuevo) × 50 semanas
```

Ejemplo razonado: (90 − 20) min × 50 = **3 500 min/año ≈ 58 h/año** por manager. En una organización con 200 managers que produzcan reporte semanal: *11 600 h/año*, equivalente a varios FTE redirigidos a trabajo de mayor valor.

> *Estimaciones cualitativas pendientes de T1. Sustituir por cifras del piloto.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si trabajo desde Copilot y conecto un MCP de Jira con scope amplio (`read:jira-work` sobre todos los proyectos del tenant), el agente puede leer tickets de proyectos sensibles (M&A, RRHH, legal) que yo no debería ver. Sin nadie que vigile ese scope ni que registre qué pidió el agente, basta una sola pregunta mal formulada para sacar información a la que no estoy autorizado."*
- *"Si conecto un MCP comunitario de Slack/Teams sin auditar, los mensajes de mi canal viajan a un endpoint del que no sé dónde almacena, si entrena con ellos, ni si cumple GDPR. Mi canal contiene discusiones de personas, clientes y proveedores."*
- *"Si el agente usa mi token personal para publicar el reporte en SharePoint, cada acción queda firmada con mi nombre. Si el agente alucina una cifra y la publica, mi VP la lee como mía. Sin identidad propia del agente, no hay no repudio ni segregación de funciones."*
- *"Si pego transcripciones de reuniones en Claude/ChatGPT público, los nombres de empleados, las decisiones sobre personas y la información de clientes mencionados salen del perímetro. Para datos de personas, hay base jurídica GDPR aplicable que el `Copy & Paste` no respeta."*

**Riesgos típicos aplicables:** MCP no auditado (Jira/Slack/Drive de terceros), agente sin identidad propia, *prompt injection* desde mensajes del canal de equipo (un compañero pega contenido externo con instrucciones), *shadow AI* (Copilot personal del manager con datos del equipo), coste descontrolado si se invoca al modelo en cada update de ticket, fuga de PII en actas, decisión automatizada (mover ticket, cerrar épica) sin gate humano.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-report-agent` recoge Jira + Teams + Calendar + SharePoint, sintetiza con cita a fuente y escribe borrador en `out/weekly-YYYY-WW.md`. Publicación es humana.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MCP Jira con scope amplio sobre proyectos sensibles (M&A, RRHH, legal) → lectura no autorizada | agentregistry + agentgateway | `mcp-atlassian` publicado con lista blanca `project_key`; `read:jira-work` limitado por scope-per-tool; queries hacia proyectos fuera de la lista deny en waypoint |
| MCP comunitario de Slack/Teams no auditado → mensajes salen sin DPA (**GDPR art. 28**) | agentregistry | catálogo solo admite MCPs con DPA verificado y proveedor en lista blanca de la org; MCPs de la comunidad marcados `unvetted` no publicables |
| Sin identidad propia del agente → no repudio y firmas indistinguibles del manager | Istio ambient + agentgateway | identidad SPIFFE `svc-manager-report-agent`; OIDC/JWT propio; SharePoint/Jira ven usuario distinto en audit log |
| Prompt injection desde mensajes del canal de equipo (compañero pega contenido externo con instrucciones) | agentgateway | prompt guards Envoy: sandbox del contenido de canal con delimitadores; strip de patrones `ignora las instrucciones`; eval set con 20 hilos con injection real |
| Coste descontrolado en tenant grande × cientos de managers | agentgateway | rate-limit por `manager_id`; cache TTL 7d de resúmenes semanales; budget cap semanal por role con corte automático |
| Fuga de PII en actas (**GDPR art. 5** minimización) | agentgateway | pii-redact antes de LLM externo; salida en modelo on-prem cuando el canal contiene tags `hr`, `client` o `legal` |
| Publicación del reporte al VP/SharePoint sin control → borrador con datos sin verificar publicado bajo la firma del manager | agentgateway (MCP Gateway) + kagent | `mcp-graph-files` con scope `files:write` restringido a la biblioteca del reporte; **HITL obligatorio antes de publicar**; OBO del manager |
