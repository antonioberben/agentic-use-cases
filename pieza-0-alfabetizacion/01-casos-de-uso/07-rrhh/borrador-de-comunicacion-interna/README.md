# Borrador de comunicación interna

> **Rol:** rrhh · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Nota sobre nuevo plan retributivo, circular de cambio de oficina, mensaje sobre reestructuración. Tono adecuado, claridad legal, calendario realista.

**Cómo resolverlo.**

- *Local:* Ollama con hechos + audiencia + tono + restricciones legales.
- *Copilot Word:* mismo input. *"Genera comunicación para [audiencia]. Tono [empático/neutro/formal]. Estructura: contexto, qué cambia, cuándo, qué hacer, dónde preguntar. No prometas plazos no confirmados."*
- *Claude Code:* repo `comunicaciones/` con histórico y `AGENTS.md` con estilo de la compañía.
- *MCPs:* `mcp-graph-files` (comunicaciones previas), `mcp-confluence` (políticas vigentes).

Para ERE, reestructuración, sanción → redacción con asesoría laboral. La IA es punto de partida, no envío.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por comunicación | 3 h | 45 min |
| Iteraciones con legal | 4 | 2 |
| % preguntas reactivas tras envío | 25% | 10% |

*Fórmula:* `(2,25) h × 40 comunicaciones/año = 90 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la comunicación filtra detalles aún no aprobados (ERE en preparación, salidas), conflicto laboral inmediato y posible MNPI en cotizadas.*
- *Si el modelo "redondea" un plazo, promesa indebida con efecto contractual.*
- *Si la comunicación se envía vía agente con permiso `Mail.Send`, un error de prompt manda algo no validado.*

Cubierto en **Pieza 2** con scope `Mail.ReadWrite` (no `Send`), gate humano en envío y revisión legal obligatoria pre-publicación.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
