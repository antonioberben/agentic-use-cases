# Lectura crítica de planes y propuestas

> **Rol:** ejecutivo · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Plan estratégico de unidad, business case que te traen a aprobar, propuesta de inversión. Hoy: lectura amable porque te lo presenta gente de confianza, aprobación con menos escrutinio del que merece.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B. *"Lee crítico del plan. Identifica: hipótesis no explicitadas, sensibilidades no testadas, dependencias críticas, métricas que no defienden el caso si fallan, comparativa con benchmarks razonables. Tono de director general que ha visto fracasar planes parecidos. No reescribas el plan; señala."*
- **Copilot M365:** sobre PDF del business case.
- **Claude Code:** `AGENTS.md` con tu rúbrica de revisión de planes (lo que siempre miras: TAM realista, unit economics, supuestos macro, dependencias técnicas, plan B).
- **MCPs:** `mcp-bi` (Power BI/Tableau MCP) con `vault://exec/bi-ro` y scopes `datasets:read` solo sobre datos públicos internos para benchmarkear, no para reescribir.
- **Alternativa:** Claude con PDF y rúbrica al inicio del prompt.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Hipótesis ocultas detectadas por plan | 1-2 | 5-8 |
| Planes aprobados que descarrilan a 12m | medio | bajo |

Fórmula: *valor en planes evitados (orden 10⁵-10⁶ €/plan descarrilado evitado). (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si comparto el business case (que contiene proyecciones de M&A, mercados que estamos por entrar o costes de unidad) con un servicio no aprobado, filtración estratégica directa. Si el modelo inventa benchmarks de mercado y rechazo el plan en base a ellos, decisión errónea con coste reputacional con el director que lo presentó. Riesgos típicos: filtración estratégica, alucinación de benchmarks, sesgo del modelo a estructura "demasiado optimista" sin contexto sectorial. **Cubierto en la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
