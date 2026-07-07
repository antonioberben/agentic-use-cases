# T11 — Resumen de reuniones + extracción de acciones

## Identificación

- **Rol principal**: manager, cualquier rol que asista a reuniones.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de uso con cliente externo.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Reuniones de equipo, 1:1, comités: cada uno produce decisiones y acciones que se pierden si no hay un secretario humano. Hoy se confía en la memoria. El agente transcribe (con consentimiento), resume, extrae acciones con responsable + fecha y deja todo en el sistema de tareas. El humano valida y publica.

## 2. Cómo resolverlo

### 2.1 Local

Whisper local + Ollama + Llama 3.1 70B sobre grabación con consentimiento. Prompt: *"Resume la reunión: contexto, decisiones, acciones (responsable, fecha límite, dependencias). Marca lo no concluido. **Si alguien dice 'esto no se transcribe' o 'off the record', elimina ese tramo.**"*

### 2.2 Copilot

Copilot in Teams (recap, notes, actions). Procesamiento UE. Activar consentimiento explícito al inicio.

### 2.3 Claude Code

Repo con `AGENTS.md` que define formato (decisiones, acciones tabla, no-conclusiones) y prohíbe transcribir sin marca de consentimiento.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-teams` | Graph MCP | `vault://prod/teams-ro` | `OnlineMeetings.Read`, transcripts solo si consentidas |
| `mcp-asana` / `mcp-jira` | tareas | `vault://prod/tasks-rw` | `tasks:write` solo en proyecto propio |

### 2.5 Alternativas

Otter.ai, Fireflies con cláusula de no entrenamiento.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| % reuniones con acta | 30% | 95% |
| Tiempo a acta publicada | 24 h | 5 min |
| Acciones perdidas (sin responsable/fecha) | 50% | 10% |

Fórmula: *25 min × 10 reuniones/semana × 44 sem = ≈ 180 h/año por manager. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si grabo reunión con cliente sin consentimiento explícito, incumplimiento GDPR + posible nulidad probatoria."*
- *"Si la transcripción contiene comentarios privados sobre compañeros (evaluaciones informales) y queda en sistema accesible, conflicto laboral."*
- *"Si el modelo extrae como 'acción' una broma o un sarcasmo, compromiso inventado para alguien."*

**Riesgos típicos:** grabación sin consentimiento, sobre-conservación de transcripciones, alucinación de acciones, fuga de comentarios sobre personas.

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* aplicado a transcripciones (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-meetings-agent` recibe transcript consentido → resumen + acciones (dueño+fecha) → escribe en Asana/Jira. Publicación en sistema de tareas requiere confirmación humana.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Grabación sin consentimiento del cliente (**GDPR art. 6/13 · LOPDGDD art. 90 intimidad · nulidad probatoria**) | agentgateway + agentregistry | header `consent-flag=explicit` obligatorio; llamadas sin flag deny; ficha en agentregistry exige DPIA firmada; agente rechaza transcripts sin token de consentimiento del OnlineMeeting |
| Off-the-record no eliminado del transcript (compromiso a los asistentes) | agentgateway + agentevals | prompt guard detecta marcadores (`off the record`, `esto no se transcribe`) y elimina tramo ±2 min; validador A2A verifica ausencia de marcadores en el resumen final |
| Comentarios evaluativos sobre compañeros en transcripción → conflicto laboral (**GDPR art. 9** categorías especiales) | agentgateway | pii-redact filtra comentarios evaluativos hacia terceros; salida a Asana con nombres solo si mencionados en context de asignación de tareas |
| Alucinación de acción desde broma/sarcasmo → compromiso inventado a un dueño | agentevals | validador A2A cruza cada acción con timestamp del transcript y verbo imperativo explícito; eval set con 20 transcripts que contienen bromas etiquetadas |
| Sobre-conservación de transcripts más allá de la política | agentgateway | TTL 90d por transcript; job de purga ligado a política del calendario del owner; retención extendida solo si `legal-hold=true` |
| Escritura automática en Jira/Asana sin gate | kagent + agentgateway | tool `create_task` requiere aprobación humana (`approval_required=true`); write-back gated en L7 waypoint |

## Referencias

- GDPR (grabación, base jurídica), comité de empresa, art. 90 LOPDGDD (intimidad). *Citas T1.*
