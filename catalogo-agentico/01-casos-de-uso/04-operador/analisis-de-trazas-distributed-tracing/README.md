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

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* (variante read-only sobre APM, ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `trace-analyzer` identifica top-K spans por latencia y propone paralelizaciones candidatas. **No aplica cambios** al código: solo señala; el desarrollador valida invariantes.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Traza con IDs de cliente, payloads, headers de autenticación → fuga a LLM externo (**GDPR art. 32 · PCI-DSS**) | agentgateway | `pii-redact` sobre atributos de span: `http.request.body`, `Authorization`, `Cookie`, `user.id` sustituidos por tokens tipados; DB queries con parámetros → parámetros redactados, estructura preservada |
| Sugerencia de paralelizar spans que mantienen invariante (orden de escritura DB) → bug de consistencia grave | agentevals | eval determinista sobre grafo de dependencias del span: si dos spans comparten `db.instance` con `db.operation=write`, la sugerencia de paralelizar se rechaza automáticamente |
| Consulta APM con identidad humana → auditoría contaminada (**SOX ITGC · DORA**) | Istio ambient (SPIFFE) | mTLS `spiffe://.../ns/ops/sa/svc-trace-analyzer`; token APM obtenido por OBO desde SA; audit trail Datadog/Jaeger distingue quién ejecutó la query |
| Costo de contexto: trazas de 80+ spans consumen ventana del LLM | agentgateway | preprocesamiento local: top-K por latencia, colapsar spans idénticos, resumen ejecutivo antes del LLM; presupuesto por análisis con corte automático |
| Falsa optimización sobre span crítico para SLO no señalado | agentevals | eval "SLO-awareness": cada sugerencia se cruza contra el catálogo de SLOs (`mcp-slo-registry`); span dentro de un SLO crítico → sugerencia marcada `[SLO-CRITICAL - REVISAR IMPACTO]` |
