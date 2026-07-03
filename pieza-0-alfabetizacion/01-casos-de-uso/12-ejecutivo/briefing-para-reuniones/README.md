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

Si el MCP del CRM va con scopes amplios (`Mail.ReadWrite` o `accounts:read` sobre toda la cartera), el agente puede inferir o extraer información de cuentas que no son tuyas. Si el brief incluye datos personales del interlocutor (familia, salud) extraídos del CRM, problema GDPR de minimización. Si delego en el modelo el envío del *follow-up* tras la reunión, vinculo a la sociedad sin revisión. Riesgos típicos: scope creep del MCP, inferencia GDPR sensible, *follow-up* automático no supervisado. **Cubierto en la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
