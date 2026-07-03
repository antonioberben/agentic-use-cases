# Análisis de trazas (distributed tracing)

> **Rol:** operador · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Traza de 80 spans. ¿Dónde se va el tiempo? Se busca: identificación de spans con mayor latencia y oportunidades de paralelización.

## 2. Cómo resolverlo

**Local.** Inviable a escala; el contexto de la traza es grande.

**Copilot (Datadog APM, New Relic, Honeycomb AI).** Ya integran análisis automatizado.

**Claude Code.** Exporta traza Jaeger/Tempo a JSON, agente analiza: *"Top 3 spans por latencia. % del tiempo total. Hipótesis. Spans en serie paralelizables."*

**MCPs:** `mcp-datadog-apm`, `mcp-jaeger`, `mcp-tempo` (todos lectura).

**Alternativa.** Vista en flame graph y análisis manual.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-análisis traza | *30-60 min* | *5-10 min* |
| % cuellos de botella reales identificados | *60%* | *> 85%* |

**Fórmula:** ≈ (45 − 7) min × 6 trazas/semana × 50 / 60 ≈ **190 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si la traza contiene IDs de cliente, datos del payload o headers de autenticación, fuga al modelo externo."*
- *"Si el agente sugiere paralelizar dos spans que mantienen invariantes (orden de escritura en DB), introduce bug grave."*
- *"Si el agente consulta APM con identidad humana, cualquier consulta queda firmada como mía."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
