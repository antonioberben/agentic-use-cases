# Forecast y presupuesto

> **Rol:** finanzas · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Hoja en blanco. Hay que producir un forecast a 12 meses por línea de ingreso y categoría de gasto, con tres escenarios y supuestos defendibles. Hoy se hace pegando histórico en Excel y rellenando con intuición.

**Cómo resolverlo.**

- *Local:* Ollama + Qwen2.5 32B sobre histórico CSV. Genera la estructura del modelo, no el dato final.
- *Copilot Excel + Microsoft Fabric:* serie temporal con Copilot, sensitividad con tablas de datos. No proyectes sobre series con menos de 6 puntos.
- *Plataformas FP&A con IA nativa:* **Anaplan PlanIQ**, **Pigment AI**, **Workday Adaptive AI**, **Cube AI**, **Mosaic**. Todas con conectores ERP/CRM auditados.
- *Claude Code:* el repo de modelado contiene `forecast/` con notebooks; el agente revisa supuestos y consistencia entre escenarios.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-snowflake` / `mcp-bigquery` | Histórico de ventas, costes, headcount |
| `mcp-anaplan` o `mcp-pigment` | Modelo de planificación |
| `mcp-graph-files` | Asunciones y memorias previas |

- *Alternativa:* exportar histórico anonimizado y trabajar en ChatGPT/Claude para la estructura.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo primer borrador forecast | 5 días | 1-2 días |
| Iteraciones hasta validación CFO | 4-6 | 2-3 |
| Cobertura de drivers documentados | 50% | 90% |
| Tiempo en sensitividad | 8 h | 1-2 h |

*Fórmula:* `(5 − 1,5) días × 8 h × 4 ciclos/año = 112 h/año por planner`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" supuestos sin marcarlo, firmas un forecast inventado.* Pide siempre: *"si no tienes dato, dilo, no extrapoles"*.
- *Si subes el forecast a una herramienta no aprobada, los planes y las cifras pre-board son MNPI.* En cotizadas, riesgo MAR.
- *Si el agente tiene escritura sobre Anaplan/Pigment con tu usuario, una propuesta aceptada en bloque sobreescribe escenarios.*

Cubierto en **Pieza 2** con identidad de agente, allow-list de escritura, observabilidad del prompt-to-cifra y control de coste de tokens.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
