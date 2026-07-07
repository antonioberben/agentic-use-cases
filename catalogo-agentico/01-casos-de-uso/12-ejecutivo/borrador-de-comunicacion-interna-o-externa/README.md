# Borrador de comunicación interna o externa

> **Rol:** ejecutivo · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Nota al equipo sobre resultados, mensaje tras reestructuración, columna del CEO, comunicación al mercado. Hoy: borrador a mano un domingo por la noche o delegado a gabinete con poco contexto.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B con tus 10 últimas comunicaciones para fijar tono propio. *"Redacta comunicación para [audiencia]. Tono [calmo / firme / cercano]. Estructura: contexto, qué cambia, por qué, qué hacemos, dónde preguntar. Sin frases vacías. Sin promesas no acordadas. Marca con [REVISAR] cualquier cifra o compromiso."*
- **Copilot M365:** desde Outlook del CEO. Sensibilidad `Confidential / All Employees` antes de enviar.
- **Claude Code:** `AGENTS.md` del estilo de comunicación corporativo (vocabulario aprobado, palabras prohibidas, palabras que vinculan a la sociedad).
- **MCPs:** `mcp-confluence` para acceder a guías de comunicación, `mcp-historic-comms` (interno) para coherencia con mensajes anteriores. Scopes `documents:read` solo sobre el espacio de comunicación corporativa. `mcp-cms` con `publish:write` (bajo gate humano) para publicar/enviar solo tras aprobación de asesoría jurídica + comunicación.
- **Alternativa:** Claude con plantillas. Para **comunicaciones reguladas** (hecho relevante, comunicación al supervisor): **borrador conjunto con asesoría jurídica y comunicación. La IA es punto de partida, no envío.**

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a primer borrador | 90 min | 15 min |
| Iteraciones hasta versión final | 4-5 | 2-3 |
| Coherencia con tono histórico del CEO | media | alta |

Fórmula: *(75 min × 50 comunicaciones/año) = 62,5 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si envío sin revisión un comunicado a empleados generado por IA y contiene una promesa sobre indemnización o futuro de un centro, **vinculo a la sociedad por escrito**. Si la comunicación es a accionistas o mercado y no pasa por asesoría jurídica + comunicación, riesgo de **información engañosa** (MAR art. 12) o de hecho relevante mal calificado. Si la IA mete cifra incorrecta y va al regulador, riesgo de expediente. Riesgos típicos: compromiso no autorizado, MAR/transparencia, suplantación de tono (deepfake de estilo) usada para fraude. **Cubierto en la arquitectura de remediación (bloque 5)** (gates de revisión, trazabilidad, identidad de comunicaciones firmadas).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-redactor-comms` genera el borrador en tono del CEO; la publicación o envío exige HITL de asesoría jurídica + comunicación y OBO del firmante.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Compromiso no autorizado en la salida (indemnización, futuro de un centro) que vincula a la sociedad | agentgateway | prompt guard de salida con patrones vinculantes (importes, plazos, promesas); marca `[REVISAR]` y bloquea la publicación |
| Información engañosa a mercado/accionistas (MAR art. 12, Reg. UE 596/2014; CNMV) | agentgateway + kagent (OBO) | CMS/`mcp-historic-comms` con scope `draft`; `publish/send` a mercado requiere HITL jurídico + comms y OBO del firmante |
| Cifra no auditada presentada como definitiva | agentevals | comprobación determinista contra fuente; `[REVISAR]` obligatorio en cualquier cifra sin respaldo antes del handoff |
| Suplantación de tono (deepfake de estilo del CEO) usada para fraude | agentgateway + agentregistry | solo el agente registrado con SPIFFE invoca el modelo de estilo; comunicaciones firmadas trazadas en OTel |
| Fuga de información material no pública en el brief subido | agentgateway | detección `MNPI`/nombre de proyecto interno + redaction antes del request al proveedor |
| Compromiso vinculante o cifra sin respaldo colado en el borrador antes de la revisión | kagent (A2A) | sub-agente `compliance-validator` verifica patrones MAR/compromisos y cifras contra fuente; bloquea el handoff si detecta salida vinculante sin respaldo |
| Publicación/envío a mercado sin aprobación (`mcp-cms` `publish:write`) | agentgateway (HITL) | gate humano: `publish/send` no se ejecuta hasta HITL jurídico + comms; toda publicación trazada |

## Referencias

- MAR art. 12 (Reg. UE 596/2014) y CNMV; Regulation FD. *Citas T1.*
- Marco técnico: OWASP LLM05 (Improper Output Handling).
