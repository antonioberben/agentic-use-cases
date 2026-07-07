# Briefing para reuniones

> **Rol:** ejecutivo · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Reunión con cliente clave, regulador, consejero o socio en 20 minutos. Hoy: entras sin haber preparado o con un brief desactualizado.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B + exportación CRM + últimas notas/correos. *"Brief de 1 página antes de reunión con [persona] de [organización]. Estructura: estado de relación, últimos 3 contactos relevantes, asuntos abiertos, tema previsto, 3 puntos a plantear, 3 preguntas a esperar. Cita nota o correo de origen."*
- **Copilot M365:** integración Outlook + Teams + Salesforce.
- **Claude Code:** carpeta `briefings/` con `AGENTS.md` que prohíbe inventar contactos pasados.
- **MCPs:** `mcp-crm` (Salesforce/Dynamics) con `vault://exec/crm-ro` y scopes `accounts:read,opportunities:read,activities:read` sobre tus cuentas estratégicas (no toda la cartera); `mcp-mail` (Microsoft Graph) con `Mail.Read` sobre tu buzón, **no** `Mail.Send`; `mcp-calendar` `Calendars.Read`.

```json
{
  "mcpServers": {
    "crm": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp"],
      "env": {"SF_TOKEN": "${vault://exec/crm-ro}"}
    }
  }
}
```

- **Alternativa:** export manual + Claude con dossier.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de preparación | 45 min | 5 min |
| % reuniones con brief al día | 40% | 95% |

Fórmula: *40 min × 200 reuniones/año = 133 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el MCP del CRM va con scopes amplios (`Mail.ReadWrite` o `accounts:read` sobre toda la cartera), el agente puede inferir o extraer información de cuentas que no son tuyas. Si el brief incluye datos personales del interlocutor (familia, salud) extraídos del CRM, problema GDPR de minimización. Si delego en el modelo el envío del *follow-up* tras la reunión, vinculo a la sociedad sin revisión. Riesgos típicos: scope creep del MCP, inferencia GDPR sensible, *follow-up* automático no supervisado. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-briefing` agrega CRM, correo y calendario para producir el brief de 1 página; sin escrituras, el follow-up va con HITL del ejecutivo.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Scope creep del `mcp-crm` sobre toda la cartera | agentgateway | allowlist fija `accounts:read` restringido a cuentas estratégicas; el tenant se inyecta desde el OIDC del ejecutivo |
| Dato personal sensible del interlocutor (familia, salud) en el brief — minimización (GDPR art. 5 y 9) | agentgateway | prompt guard con perfil `special-category`; redaction de categorías del art. 9 antes de la salida |
| Follow-up automático tras la reunión que vincula a la sociedad | agentgateway + kagent (OBO) | `mcp-mail` con `Mail.Read`, nunca `Mail.Send`; el envío exige HITL y firma OBO del ejecutivo |
| Inferencia inventada de contactos o interacciones pasadas | agentevals | eval set verifica que cada contacto citado resuelve a una actividad real del CRM; bloquea si el agente inventa |
| Prompt injection desde el cuerpo de un correo del hilo | agentgateway | contenido de `mcp-mail` marcado `untrusted`; el LLM lo describe, no lo obedece |

## Referencias

- GDPR (Reg. UE 2016/679), art. 5 (minimización) y art. 9 (categorías especiales). *Citas T1.*
- Marco técnico: OWASP LLM06 (Excessive Agency).
