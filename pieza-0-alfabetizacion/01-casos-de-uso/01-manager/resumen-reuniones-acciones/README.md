# T11 — Resumen de reuniones + extracción de acciones

## Identificación

- **Rol principal**: manager, cualquier rol que asista a reuniones.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de uso con cliente externo.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR (grabación, base jurídica), comité de empresa, art. 90 LOPDGDD (intimidad). *Citas T1.*
