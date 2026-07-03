# Preparación de comité

> **Rol:** ejecutivo · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Doscientas páginas de board pack que tienes que leer entre dos vuelos. Hoy: lectura diagonal, anotación manual, llegada al comité con preparación irregular. Pierdes inconsistencias entre documentos, omisiones y preguntas críticas.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre PDFs descifrados del board pack. *"Resume cada documento en una página: tesis, datos clave con cifra, decisiones que se piden, riesgos señalados, omisiones evidentes. Identifica inconsistencias entre documentos. No interpretes intención; señala hechos. Genera 5 preguntas críticas que un consejero independiente debería hacer."*
- **Copilot M365:** sobre Teams del comité con DLP estricto y `Sensitivity = Highly Confidential`. Nunca chat público.
- **Claude Code:** `AGENTS.md` del board pack — *"Resúmenes en tres niveles (5 líneas / 1 página / 3 páginas). Cita siempre la sección y página de la cifra. Marca con [VERIFICAR] cualquier dato que no se respalde en el documento."*
- **MCPs:**

| MCP | Servidor + arranque | Scopes mínimos |
|---|---|---|
| `mcp-board-portal` | Diligent/Nasdaq Boardvantage MCP con `vault://board/secretaria-ro` | `documents:read` (solo a tu board), no `members:read` |
| `mcp-sharepoint` | Microsoft Graph MCP con `Sites.Selected` sobre el sitio del comité | Solo el site del board |

```json
{
  "mcpServers": {
    "board": {
      "command": "npx",
      "args": ["-y", "@diligent/mcp-board"],
      "env": {"DILIGENT_TOKEN": "${vault://board/secretaria-ro}"}
    }
  }
}
```

- **Alternativa:** Claude/ChatGPT Enterprise con pliego subido a workspace con retención cero. Nunca cuentas personales.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Horas de lectura previa al comité | 6-8 h | 2-3 h |
| Inconsistencias detectadas entre docs | bajas | medias-altas |
| Preguntas críticas preparadas | 2-3 | 6-10 |
| % decisiones con preparación completa | 60% | 90% |

Fórmula: *(7 − 2,5) h × 12 comités/año = 54 h/año por ejecutivo. Con 8 miembros del comité, 432 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si trabajo desde Copilot y subo el board pack a un chat sin sensibilidad etiquetada, el material —que es **MNPI** en cotizada— queda en logs accesibles a admins TI generales y entra en flujos de retención no compatibles con la política del comité. Si uso un MCP no aprobado contra el portal del consejo, abro un canal de exfiltración con mi token de secretaria. Si comparto el resumen por correo sin clasificar, replica el riesgo aguas abajo. Riesgos típicos: violación de MAR/CNMV por circulación indebida de MNPI, ruptura de confidencialidad fiduciaria, evidencia perdida para auditor. **Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, clasificación de datos y observabilidad de la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
