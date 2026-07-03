# T02 — Triage de tickets de soporte

## Identificación

- **Rol principal**: agente de soporte L1/L2, knowledge manager.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 2 — agente de triage de eventos.
- **Madurez recomendada**: nivel 1 piloto (clasificación sin auto-acción); nivel 3 antes de auto-ruteo y respuesta sin revisión humana.

> Aviso permanente: ficha de adopción. Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

El equipo de soporte recibe cientos de tickets/día por Zendesk/ServiceNow/Jira. Tareas repetitivas: clasificar por producto/categoría/severidad, asignar al equipo correcto, detectar duplicados, sugerir artículo de KB. Hoy lo hace L1 con reglas estáticas y experiencia personal — tickets mal clasificados pierden horas hasta llegar al equipo correcto y la satisfacción del cliente baja.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 8B sobre export JSON de últimos 90 días de tickets sanitizados (sin PII del cliente). Prompt: *"Clasifica producto, categoría, severidad. Detecta duplicados con tickets abiertos. Sugiere KB. No respondas al cliente; solo clasifica."*

### 2.2 Copilot

Microsoft Copilot Studio + Dynamics 365 Customer Service: clasificador entrenado sobre histórico interno. Procesamiento UE.

### 2.3 Claude Code u otro agente de escritorio

Repo con `AGENTS.md` que define taxonomía cerrada, formato de salida JSON (categoría, severidad, equipo destino, KB candidata, confianza 0-1). Allowlist sin permisos de escritura.

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-zendesk` | Zendesk MCP | `vault://support/triage-ro` | `tickets:read,kb:read`; clasificación vía API write con **gate humano** |
| `mcp-servicenow` | ServiceNow MCP | `vault://support/sn-ro` | `incidents:read` |
| `mcp-jira` | Atlassian MCP | `vault://support/jira-ro` | `issues:read` |

### 2.5 Alternativas

Claude Projects con CSV de tickets sanitizados. Solo piloto.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Tiempo medio de triage por ticket | seg | 90 s | 10 s |
| % tickets reasignados después de L1 | error | 25% | 8% |
| % duplicados detectados al alta | calidad | 30% | 80% |
| MTTR primer toque | min | 20 min | 7 min |

Fórmula: *80 s × 800 tickets/día × 220 días = ≈ 4.900 h/año a nivel red de soporte. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si conecto Zendesk con scope `tickets:write` y el agente clasifica + responde automáticamente, una incidencia regulatoria (queja formal) se cierra sin pasar por humano — incumplimiento de procedimiento de gestión de reclamaciones."*
- *"Si el ticket contiene PII del cliente (DNI, dirección, historial médico) y el modelo va a un endpoint no aprobado, fuga sin base jurídica."*
- *"Si el prompt injection viene en el cuerpo del ticket (cliente con texto adversarial) y consigue reclasificar `severidad:low` un incidente crítico, daño operacional."*

**Riesgos típicos:** respuesta automática a queja regulatoria, fuga de PII del cliente, prompt injection desde texto del ticket, sesgo de clasificación por idioma/región.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR (PII del cliente), ISO/IEC 27001 (gestión de incidentes). *Citas exactas pendientes T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection), LLM06 (Sensitive Info Disclosure).
