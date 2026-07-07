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

Cubierto en la **arquitectura de remediación (bloque 5)** con identidad de agente, allow-list de escritura, observabilidad del prompt-to-cifra y control de coste de tokens.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `fpa-forecast` genera la **estructura** del modelo (drivers, escenarios, sensitividad) sobre histórico del warehouse; un validador A2A `figure-validator` cuadra las cifras antes de cualquier propuesta de escritura. El dato final y las asunciones críticas los introduce el planner.

### Particularizaciones de este caso

| Riesgo específico | Componente | Mecanismo específico |
|---|---|---|
| MNPI (forecast pre-board, plan cotizada) al LLM externo — riesgo MAR/CNMV | agentgateway + Istio | egress restringido al modelo en tenant UE con no-training; `AuthorizationPolicy` L4 bloquea cualquier otro LLM; el dataset pre-board se etiqueta `mnpi=true` y el prompt guard lo bloquea si intenta salir |
| Escritura en bloque en Anaplan/Pigment sobrescribe escenarios firmados | agentgateway + kagent (OBO) | `mcp-anaplan` con scope `read+scenario:write-draft`; `commit` requiere HITL del planner con OBO — nunca el agente |
| El modelo "rellena" supuestos sin marcarlo | agentevals | rubric explícita: cada driver del output debe llevar `source: histórico | asunción | inferido`; `inferido > umbral` bloquea handoff |
| Ancla (anchoring): el agente lee el forecast anterior y lo replica | agentgateway | prompt guard elimina el forecast previo del contexto en la generación inicial; se enseña sólo en fase de comparación |
