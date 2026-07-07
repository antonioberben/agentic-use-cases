# Gestión de calendario y comunicación operativa

> **Rol:** ejecutivo · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Ochenta correos sin contestar, decisiones de calendario en conflicto, *follow-ups* que se pierden. Hoy: chief of staff hace lo que puede.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre export de bandeja para triage local. *"Resume el hilo en 5 líneas, indica decisión pendiente y de quién."*
- **Copilot M365:** triage por prioridad (Superhuman AI / Shortwave equivalentes). **Sin respuesta automática a temas sensibles.**
- **Claude Code:** `AGENTS.md` que enumere temas que nunca se contestan sin tu revisión (consejero, regulador, M&A, RRHH).
- **MCPs:**

| MCP | Servidor + arranque | Scopes mínimos |
|---|---|---|
| `mcp-mail` | Microsoft Graph MCP con `vault://exec/mail-ro` | `Mail.Read` (jamás `Mail.Send`) |
| `mcp-calendar` | Microsoft Graph MCP | `Calendars.Read`; escritura solo del chief of staff humano |
| `mcp-tasks` | Microsoft To Do / Asana MCP | `tasks:read,tasks:write` solo sobre tu lista personal |

```json
{
  "mcpServers": {
    "mail": {
      "command": "npx",
      "args": ["-y", "@microsoft/graph-mcp"],
      "env": {"GRAPH_TOKEN": "${vault://exec/mail-ro}"}
    }
  }
}
```

- **Alternativa:** asistente humano + IA como herramienta del asistente, no del ejecutivo.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Correos pendientes a final de día | 80 | 20 |
| *Follow-ups* perdidos | 20% | 5% |
| Conflictos de calendario | 3/semana | 0,5/semana |

Fórmula: *60 min/día × 220 días = 220 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el agente tiene scopes `Mail.Send` y contesta correos del CEO automáticamente, vincula a la sociedad sin gate humano. Si el agente lee mi bandeja con scopes amplios, accede a correos del consejo, asesores externos, asuntos personales del CEO — sin minimización. Si el chief of staff usa el agente con su token personal y se va de la empresa, los accesos quedan sin trazabilidad. Riesgos típicos: respuesta automática sensible, sobre-permisos del agente sobre bandeja del C-level, ausencia de identidad propia del agente (uso de token humano). **Cubierto en la arquitectura de remediación (bloque 5)** (identidad de agente, scopes mínimos, gate humano sobre envío).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)), con acción sensible gated. Agente `agente-inbox-triage` resume bandeja y calendario en RO; el envío y la agenda van con HITL y OBO del chief of staff.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| `Mail.Send` que contesta correos del CEO automáticamente y vincula a la sociedad | agentgateway + kagent (OBO) | allowlist restringe a `Mail.Read`; cualquier envío exige HITL y OBO del chief of staff, nunca del agente |
| Sobre-permisos sobre la bandeja del C-level (consejo, asesores, asuntos personales) — minimización (GDPR art. 5) | agentgateway | prompt guard con perfil PII; el scope excluye carpetas marcadas `board`/`personal` |
| Chief of staff usa su token personal; al salir, accesos sin trazabilidad | agentregistry + kagent (OBO) | el agente tiene identidad SPIFFE propia; el OBO liga cada acción al humano vivo, no a un token embebido |
| Temas sensibles (regulador, M&A, RRHH) contestados sin revisión | agentgateway | policy `deny-auto-reply` sobre remitentes/asuntos de la allowlist crítica; ruteo obligatorio a HITL |
| Prompt injection desde un correo entrante que instruye al agente | agentgateway | cuerpo del correo marcado `untrusted`; spotlighting antes del LLM |

## Referencias

- GDPR (Reg. UE 2016/679), art. 5 (minimización); MAR/CNMV para asuntos MNPI. *Citas T1.*
- Marco técnico: OWASP LLM06 (Excessive Agency).
