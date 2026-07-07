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

Cubierto en la **arquitectura de remediación (bloque 5)** con perímetro aprobado para modelado y disciplina de test de regresión sobre modelos críticos.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* aplicado a Excel/VBA (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `excel-model-agent` refactoriza fórmulas anidadas a `LET` legibles o reescribe macros VBA a Python; un validador A2A `formula-validator` cuadra la integridad del modelo antes del handoff. Nunca sustituye la fórmula "en caliente" sobre el modelo vivo — trabaja sobre copia sandbox y devuelve diff. Lee el libro y los actuals en lectura (`mcp-graph-files` `workbook:read`, `mcp-erp` `actuals:read`) y la escritura de celdas (`mcp-excel` `cells:write`) pasa por gate humano.

### Particularizaciones de este caso

| Riesgo específico | Componente | Mecanismo específico |
|---|---|---|
| Refactor cambia silenciosamente la lógica (mismo output para casos ejemplo, distinto en edge cases) | agentevals | eval set con **golden tests** del modelo antes del refactor; si algún resultado diverge >0,01% el handoff se bloquea |
| Headers con nombres reales de cliente / línea de producto en el prompt | agentgateway | prompt guard con perfil `commercial-schema`: sustituye nombres por handles (`cliente_1`, `producto_A`) antes del LLM |
| Persistencia del descuento/margen en el cache del modelo | agentgateway | disable prompt caching en requests marcadas `commercial-sensitive`; TTL cero |
| Escritura directa sobre el `.xlsx` productivo | agentgateway + kagent (OBO) | filesystem sandbox: agente escribe en `modelos/proposals/`; el pegado al productivo requiere HITL del modeller con OBO |
