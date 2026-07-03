# Borrador de comunicación interna o externa

> **Rol:** ejecutivo · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Nota al equipo sobre resultados, mensaje tras reestructuración, columna del CEO, comunicación al mercado. Hoy: borrador a mano un domingo por la noche o delegado a gabinete con poco contexto.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B con tus 10 últimas comunicaciones para fijar tono propio. *"Redacta comunicación para [audiencia]. Tono [calmo / firme / cercano]. Estructura: contexto, qué cambia, por qué, qué hacemos, dónde preguntar. Sin frases vacías. Sin promesas no acordadas. Marca con [REVISAR] cualquier cifra o compromiso."*
- **Copilot M365:** desde Outlook del CEO. Sensibilidad `Confidential / All Employees` antes de enviar.
- **Claude Code:** `AGENTS.md` del estilo de comunicación corporativo (vocabulario aprobado, palabras prohibidas, palabras que vinculan a la sociedad).
- **MCPs:** `mcp-confluence` para acceder a guías de comunicación, `mcp-historic-comms` (interno) para coherencia con mensajes anteriores. Scopes `documents:read` solo sobre el espacio de comunicación corporativa.
- **Alternativa:** Claude con plantillas. Para **comunicaciones reguladas** (hecho relevante, comunicación al supervisor): **borrador conjunto con asesoría jurídica y comunicación. La IA es punto de partida, no envío.**

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a primer borrador | 90 min | 15 min |
| Iteraciones hasta versión final | 4-5 | 2-3 |
| Coherencia con tono histórico del CEO | media | alta |

Fórmula: *(75 min × 50 comunicaciones/año) = 62,5 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si envío sin revisión un comunicado a empleados generado por IA y contiene una promesa sobre indemnización o futuro de un centro, **vinculo a la sociedad por escrito**. Si la comunicación es a accionistas o mercado y no pasa por asesoría jurídica + comunicación, riesgo de **información engañosa** (MAR art. 12) o de hecho relevante mal calificado. Si la IA mete cifra incorrecta y va al regulador, riesgo de expediente. Riesgos típicos: compromiso no autorizado, MAR/transparencia, suplantación de tono (deepfake de estilo) usada para fraude. **Cubierto en la Pieza 2 — Plan Director de IA** (gates de revisión, trazabilidad, identidad de comunicaciones firmadas).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
