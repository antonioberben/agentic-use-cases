# Borrador de comunicación interna

> **Rol:** rrhh · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Nota sobre nuevo plan retributivo, circular de cambio de oficina, mensaje sobre reestructuración. Tono adecuado, claridad legal, calendario realista.

**Cómo resolverlo.**

- *Local:* Ollama con hechos + audiencia + tono + restricciones legales.
- *Copilot Word:* mismo input. *"Genera comunicación para [audiencia]. Tono [empático/neutro/formal]. Estructura: contexto, qué cambia, cuándo, qué hacer, dónde preguntar. No prometas plazos no confirmados."*
- *Claude Code:* repo `comunicaciones/` con histórico y `AGENTS.md` con estilo de la compañía.
- *MCPs:* `mcp-graph-files` (comunicaciones previas, `files:read`), `mcp-confluence` (políticas vigentes, `policies:read`), `mcp-graph-mail` (`Mail.ReadWrite`, nunca `Send`, con gate humano en publicación).

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

Cubierto en la **arquitectura de remediación (bloque 5)** con scope `Mail.ReadWrite` (no `Send`), gate humano en envío y revisión legal obligatoria pre-publicación.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-hr-comms` redacta un borrador de comunicación interna (plan retributivo, circular, reestructuración) a partir de `mcp-graph-files` y `mcp-confluence` — **el envío lo firma comms/legal; el agente nunca publica ni envía**.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Filtración de información no anunciada (ERE en preparación, salidas) que constituye MNPI en cotizadas (MAR, CNMV) | agentgateway | prompt guard de salida con lista de temas embargados (ERE, reestructuración no comunicada); si detecta, bloquea y escala a legal antes del handoff |
| Plazo o importe "redondeado" por el modelo con efecto contractual (Estatuto de los Trabajadores) | agentgateway | prompt guard de salida marca plazos/importes no confirmados; el borrador se devuelve para validación, no para envío |
| Envío autónomo de la comunicación sin validación humana | agentgateway + kagent (OBO, A2A) | `mcp-graph-mail` con scope `Mail.ReadWrite` (nunca `Send`); la publicación requiere HITL y OBO de comms/legal; un validador A2A `tone-compliance-validator` con identidad SPIFFE separada revisa tono y compliance antes del handoff |
| Comunicaciones internas previas confidenciales (`mcp-graph-files`) expuestas al proveedor del modelo | agentgateway | detección de `internal-project-codename` y datos de terceros + redaction antes del request al LLM |

## Referencias

- MAR / Reglamento (UE) 596/2014 (información privilegiada en cotizadas), CNMV, Estatuto de los Trabajadores. *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
