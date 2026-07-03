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

Si el agente tiene scopes `Mail.Send` y contesta correos del CEO automáticamente, vincula a la sociedad sin gate humano. Si el agente lee mi bandeja con scopes amplios, accede a correos del consejo, asesores externos, asuntos personales del CEO — sin minimización. Si el chief of staff usa el agente con su token personal y se va de la empresa, los accesos quedan sin trazabilidad. Riesgos típicos: respuesta automática sensible, sobre-permisos del agente sobre bandeja del C-level, ausencia de identidad propia del agente (uso de token humano). **Cubierto en la Pieza 2 — Plan Director de IA** (identidad de agente, scopes mínimos, gate humano sobre envío).

## 3. Reglas adicionales para el ejecutivo

- **Datos máximos sensibles solo en entorno corporativo aprobado.** Resultados pre-publicación, M&A, reestructuración, planes de despido, salarios del comité: **nunca** en chats públicos.
- **Información material no pública (MNPI).** En cotizadas, materiales que afectan a la cotización son MNPI. Tratamiento conforme a **MAR**, **CNMV**, política interna de información privilegiada.
- **Chief of staff o secretaría como gate.** Comunicaciones externas significativas pasan por gabinete o asesoría antes de salir.
- **Trazabilidad de decisiones.** Si la decisión se apoyó parcialmente en IA, queda en acta o nota interna. Auditoría interna y gobierno corporativo lo agradecerán.
- **Sed el modelo.** El resto de la empresa replicará vuestro comportamiento.

## 4. Cinco hábitos clave

1. **Confidencialidad antes del prompt.** ¿Esta información puede salir del perímetro? Si no, herramienta aprobada y nada más.
2. **Tres niveles de resumen.** 5 líneas / 1 página / 3 páginas. Pide los tres.
3. **El modelo como sparring, no como oráculo.** Para contraargumentar, no para decidir.
4. **Revisa lo que firmas con tu nombre.** La IA es borrador, no firma.
5. **Documenta cuándo y cómo usas IA.** Para decisiones materiales, queda escrito.

## 5. Qué evitar

- Pegar materiales de comité, planes estratégicos, M&A o resultados pre-publicación en chats no aprobados.
- Enviar comunicaciones a empleados, accionistas o mercado generadas por IA sin revisión humana.
- Apoyarse en análisis competitivo sin verificar las cifras citadas.
- Tratar la salida del modelo como conclusión. Es input para discusión, no decisión.
- Aprobar tácitamente el uso laxo de IA en el resto de la organización.
- Olvidar que MAR, CNMV, GDPR, NIS2, DORA y EU AI Act os aplican personalmente como administradores.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"** (2.2, 2.4, 2.7).
- Lab base **"agente regulatorio/legal sobre documentos"** (2.1, 2.3).
- Lab base **"asistente al empleado frontline"** (2.5, 2.8).
- **Pieza 1 — Resumen ejecutivo** del kit: lectura corta para tu rol.
- **Pieza 2 — Plan Director de IA**: la otra mitad. Sois patrocinadores y firmantes.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
