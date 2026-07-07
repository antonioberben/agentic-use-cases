# T02 — Triage de tickets de soporte

## Identificación

- **Rol principal**: agente de soporte L1/L2, knowledge manager.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 2 — agente de triage de eventos.
- **Madurez recomendada**: nivel 1 piloto (clasificación sin auto-acción); nivel 3 antes de auto-ruteo y respuesta sin revisión humana.

> Aviso permanente: ficha de adopción. Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `triage-tickets` clasifica producto/categoría/severidad, detecta duplicados y sugiere KB; sin auto-respuesta ni cierre.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Auto-respuesta/cierre de una queja regulatoria sin humano | agentgateway + kagent (OBO) | `mcp-zendesk`/`mcp-servicenow` RO; clasificación vía write con HITL + OBO; quejas reguladas ruteadas obligatoriamente a humano |
| PII del ticket (DNI, dirección, historial médico) a endpoint no aprobado (GDPR art. 9) | agentgateway | detección de PII y datos de categoría especial + redaction; allowlist con DPA |
| Prompt injection que reclasifica `severidad:low` un incidente crítico | agentgateway | cuerpo del ticket marcado `untrusted`; spotlighting; policy `deny-tool-if-prompt-injected` |
| Sesgo de clasificación por idioma/región | agentevals | eval set multilingüe; `recall` por idioma como puerta de release del modelo |

Las filas base del arquetipo (spotlighting, MCP de acción fuera de allowlist, redaction de secretos, coste por tormenta de eventos, aislamiento multi-tenant) se dan por incluidas.

## Referencias

- GDPR (PII del cliente), ISO/IEC 27001 (gestión de incidentes). *Citas exactas pendientes T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection), LLM06 (Sensitive Info Disclosure).
