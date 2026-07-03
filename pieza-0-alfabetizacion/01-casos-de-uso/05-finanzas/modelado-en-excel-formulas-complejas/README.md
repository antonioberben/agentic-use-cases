# Modelado en Excel (fórmulas complejas)

> **Rol:** finanzas · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Fórmula con 15 SI anidados que nadie entiende y que da un resultado raro. O necesidad de una fórmula nueva que combine BUSCARX, LET, SUMAR.SI.CONJUNTO y referencias estructuradas.

**Cómo resolverlo.**

- *Copilot Excel:* *"Explica esta fórmula paso a paso. Reescríbela con LET, más legible. Conserva la lógica."*
- *Local:* pegar la fórmula y headers en Ollama/Claude local. La sintaxis ES/EN cambia; especifícalo.
- *Claude Code:* en repo con macros VBA o Python-xlwings, el agente refactoriza el script entero.
- *Alternativa:* Claude/ChatGPT con la fórmula y los headers, sin importes reales.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de depuración por fórmula | 45 min | 10 min |
| Fórmulas legibles (con LET) | 20% | 80% |
| Errores tras refactor | 5% | < 1% |

*Fórmula:* `(35 min) × 50 fórmulas/año = 29 h/año por modeller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si pegas la fórmula con headers que revelan estructura comercial (nombres de clientes, líneas de producto), filtras estructura interna.*
- *Si el modelo refactoriza y cambia silenciosamente la lógica, tu modelo financiero queda mal calibrado.* Test antes y después.

Cubierto en **Pieza 2** con perímetro aprobado para modelado y disciplina de test de regresión sobre modelos críticos.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
