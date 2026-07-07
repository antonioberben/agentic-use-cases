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

Si trabajo desde Copilot y subo el board pack a un chat sin sensibilidad etiquetada, el material —que es **MNPI** en cotizada— queda en logs accesibles a admins TI generales y entra en flujos de retención no compatibles con la política del comité. Si uso un MCP no aprobado contra el portal del consejo, abro un canal de exfiltración con mi token de secretaria. Si comparto el resumen por correo sin clasificar, replica el riesgo aguas abajo. Riesgos típicos: violación de MAR/CNMV por circulación indebida de MNPI, ruptura de confidencialidad fiduciaria, evidencia perdida para auditor. **Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, clasificación de datos y observabilidad de la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-board-pack` lee el board pack, resume por niveles con cita de sección/página y valida cifras; sin escrituras, el consejero decide.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MNPI del board pack en logs y retención no compatibles con la política del comité (MAR, Reg. UE 596/2014; CNMV) | agentgateway | clasificación `Highly Confidential`; prompt logging con la retención del comité; sin persistir en cache compartida |
| MCP no aprobado contra el portal del consejo con token de secretaría | agentregistry + kagent (OBO) | solo `mcp-board-portal` registrado obtiene SPIFFE; acceso con OBO de la secretaría, `documents:read` a tu board, no `members:read` |
| Cifra sin respaldo citada en comité (marcada `[VERIFICAR]`) | kagent (A2A) + agentevals | sub-agente validador comprueba cada cifra contra la sección/página de origen; bloquea handoff si `citations_verified < 100%` |
| Inconsistencia entre documentos del pack no detectada | agentevals | eval set con board packs golden; verifica el cross-check entre documentos antes del resumen |
| Resumen reenviado por correo sin clasificar (fuga fiduciaria aguas abajo) | agentgateway + kagent (OBO) | salida etiquetada `Highly Confidential`; el agente no tiene `Mail.Send`; el reenvío va con OBO humano |

## Referencias

- MAR (Reg. UE 596/2014) y CNMV; deberes fiduciarios del consejo (LSC). *Citas T1.*
- Marco técnico: OWASP LLM02 (Sensitive Information Disclosure).
