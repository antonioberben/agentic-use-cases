# Borrador de comunicación a stakeholders

> **Rol:** manager · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tienes que anunciar un cambio (reorganización, cambio de prioridades, retraso, decisión de presupuesto) a tres audiencias distintas: tu equipo, tus pares, tu VP. Cada una espera un tono y un nivel de detalle. Hoy te bloqueas ante la página en blanco, tardas 45-60 minutos en producir tres versiones, dejas para mañana lo que tendrías que enviar hoy y la noticia llega por el pasillo. Lo que se busca: brief de 5 líneas → tres borradores adaptados en 5 minutos → tú reescribes el 30% que importa (mensaje, matices) y envías el mismo día.

## 2. Cómo resolverlo

**Local.** Ollama + Llama 3.1 8B. Prompt base: *"Recibes un brief de cambio organizativo. Genera tres versiones: (A) anuncio a equipo, tono cercano, 150 palabras; (B) nota a pares, tono colegial, 100 palabras; (C) update a VP, ejecutivo, 80 palabras. Incluye qué cambia, qué no cambia, próximos pasos y a quién preguntar."* Bueno para afinar tono.

**Copilot (Microsoft 365).** Camino más corto:

1. Copilot en Outlook o Word: pegas el brief y pides las tres versiones.
2. Si tienes el `Brand Voice` configurado en Copilot (algunas organizaciones lo tienen), respeta el estilo corporativo.
3. Si la noticia es sensible (despidos, reorganización), no la redactes en Copilot personal sin haber pasado por RRHH y Comunicación.

**Claude Code (o agente de escritorio).** Repo `comms-drafts/` con `AGENTS.md` que prohíbe enviar nada automáticamente (solo deja borradores en `out/`). Plantillas en `templates/`. Comando: *"Borradores del cambio descrito en `brief.md`. Tres audiencias."*

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Outlook (borradores) | `mcp-graph-mail` | `npx mcp-graph-mail` | `Mail.ReadWrite` (solo crear *draft* en mi buzón, no enviar) |
| Teams (canal de equipo) | `mcp-graph-teams` | `npx mcp-graph-teams` | `ChannelMessage.Send` *únicamente con confirmación humana explícita* |
| Plantillas corporativas (SharePoint) | `mcp-graph-files` | `npx mcp-graph-files` | `Files.Read.All` sobre la biblioteca de plantillas |

Identidad propia (`svc-manager-comms-agent`). **Crítico:** el scope de Outlook se queda en *Mail.ReadWrite* (crear borrador), nunca *Mail.Send*. La acción de enviar es exclusivamente del manager.

**Alternativa.** Sin MCPs: brief manual → Claude/ChatGPT/Gemini → copia-pega a Outlook. Cuidado con datos de personas si el cambio nombra a alguien específico.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-comunicado | Minutos desde decisión a borrador enviado | *45-90 min* | *10-15 min* (revisión + envío) |
| Cobertura de audiencias | % comunicados con versión adaptada por audiencia | *30%* | *> 80%* |
| Retraso medio en comunicar | Días entre decisión y comunicación | *1-3 días* | *< 1 día* |
| Reescrituras antes de enviar | Iteraciones | *2-3* | *1* |

**Fórmula simple:**

```
Ahorro_anual_min ≈ (TT_base − TT_nuevo) × comunicados_mes × 11 meses
```

Ejemplo: (60 − 12) min × 6 comunicados/mes × 11 = **3 168 min/año ≈ 53 h/año** por manager. El valor mayor no es el ahorro de horas sino la velocidad y la cobertura de audiencias.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si pido al agente un comunicado sobre una reorganización que aún no es pública (afecta a personas concretas que no han sido informadas todavía), y la herramienta retiene o entrena con el prompt, la información de personas con consecuencias laborales graves sale del perímetro **antes** de que se les haya comunicado a ellas. Vulnera GDPR y, en empresas cotizadas, puede ser información privilegiada (MAR / CNMV)."*
- *"Si el agente envía automáticamente el borrador como email o como mensaje de canal, una alucinación del modelo (un nombre cambiado, una cifra mal copiada, un tono ofensivo no detectado) sale firmada con mi nombre y a toda la audiencia. Sin gate humano, el daño reputacional es inmediato."*
- *"Si el MCP tiene scope `Mail.Send` en lugar de solo `Mail.ReadWrite`, basta una instrucción mal redactada para que el agente envíe sin que yo lo apruebe. La defensa en profundidad no existe."*
- *"Si copio el brief en un asistente público no aprobado, los datos del cambio (nombres, organigrama, número de personas afectadas) quedan en un sistema sin contrato de procesamiento de datos. Si la noticia se filtra, hay obligación de notificación a la AEPD en 72 h."*

**Riesgos típicos:** información privilegiada (MAR, MiCA en cotizadas), filtración pre-comunicación, *prompt injection* desde el brief si lo redactó alguien externo, agente con scope de envío automático, falta de DPIA cuando hay datos de personas.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-comms-agent` genera **borradores** en tres tonos, los deposita en `Drafts` y **nunca envía**. La acción de envío es humana y firmada por el manager.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Comunicación de reorganización con nombres antes del anuncio a afectados (**GDPR art. 6/13 · LOPDGDD · ET art. 64** derechos de información) | agentgateway | pii-redact obligatorio del brief antes de LLM; nombres sustituidos por `<PERSONA_N>`; rehidratación en el borrador final solo si el prompt trae flag `hr-approved=true` firmado por RRHH |
| Info privilegiada en cotizadas (reorg materialmente relevante) → **MAR art. 7/14 · MiCA · CNMV** | agentgateway | clasificación `market-sensitive` fuerza modelo on-prem; ventana blackout T-30/T+2 con audit trail; egress LLM externo deny |
| Scope `Mail.Send` en MCP Graph → envío automático de alucinación firmada por el manager | agentregistry + agentgateway | `mcp-graph-mail` publicado con **solo** `Mail.ReadWrite`; endpoint `/send` no aparece en catálogo; `Teams.ChannelMessage.Send` deny sin token de confirmación humana |
| Prompt injection desde brief externo (ponente adjunta doc con instrucciones ocultas) | agentgateway | prompt guards Envoy: strip de instrucciones tipo "ignora las anteriores"; sandbox del contenido del brief (delimitadores explícitos); eval set con 20 briefs con injection |
| Alucinación, sesgo o tono ofensivo no detectado antes de publicar → daño reputacional firmado por el manager | agentgateway (AgentGateway) + agentevals | validador A2A `comms-validator` (identidad SPIFFE separada) revisa sesgo, compliance y tono de cada borrador antes del gate de envío |
| Falta de trazabilidad para AEPD si se filtra la noticia (**GDPR art. 33** 72h) | agentgateway + OTel | log por invocación con `manager_id`, hash del brief, modelo usado, timestamp, retención 12m |
