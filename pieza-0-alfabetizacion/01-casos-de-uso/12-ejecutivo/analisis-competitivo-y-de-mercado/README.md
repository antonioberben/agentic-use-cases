# Análisis competitivo y de mercado

> **Rol:** ejecutivo · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Movimiento del competidor, cambio regulatorio, anuncio sectorial. Hoy: pides al director de unidad que lo analice y llega tres días tarde.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre dossiers internos + recortes de prensa filtrados. *"Analiza el anuncio de [X]. Implicaciones para nuestro posicionamiento, precios, propuesta de valor. Tres hipótesis sobre por qué lo han hecho. Tres escenarios de respuesta con pros/contras. Cita fuentes; sin datos inventados; sin inferencias sobre estrategia futura del competidor más allá del hecho público."*
- **Copilot M365:** con conector a Bing/news enterprise filtrado por fuente.
- **Claude Code:** carpeta `competitive/` con un `AGENTS.md` que prohíbe inferir de fuentes no citadas.
- **MCPs:** `mcp-news` (Bloomberg/Reuters MCP) con scopes `articles:read`, `mcp-crm` (Salesforce/Dynamics) con `accounts:read` sobre cuentas estratégicas, `mcp-market-intel` (Gartner/Forrester) con `vault://exec/analyst-ro`.
- **Alternativa:** Claude con dossier subido + búsqueda web supervisada.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a posición preliminar | 2-3 días | 4 h |
| % movimientos analizados a tiempo | 50% | 85% |

Fórmula: *4 movimientos/mes × ahorro 12 h = 576 h/año a nivel de comité. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si actúo sobre análisis del modelo sin triangular con el director de unidad (que tiene contexto cualitativo del mercado), decido sobre dato superficial. Si el modelo se apoya en rumores no verificados y vinculo nuestra respuesta pública, riesgo de **competencia desleal** o de **información engañosa**. Riesgos típicos: alucinación de movimientos, mezcla de fuentes (rumor con dato verificado), filtración de nuestra reacción si el análisis circula. **Lo que escribe el modelo es punto de partida para discusión, no conclusión. Cubierto en la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
