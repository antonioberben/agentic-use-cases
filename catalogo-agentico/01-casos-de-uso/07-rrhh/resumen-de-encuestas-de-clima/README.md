# Resumen de encuestas de clima

> **Rol:** rrhh · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 2.000 respuestas abiertas de la encuesta anual. Hoy: equipo de 3 personas, 2 semanas codificando manualmente.

**Cómo resolverlo.**

- *Local:* Ollama sobre corpus anonimizado (sin nombre, departamento ni manager directo). *"Identifica 10 temas más mencionados. Por cada uno: % menciones, sentimiento (pos/neutro/neg), 3 citas representativas literales. No infieras causas."*
- *Copilot M365:* corpus en SharePoint, Copilot Chat con el prompt.
- *Plataformas nativas:* **Qualtrics XM Discover**, **Peakon AI**, **Glint**, **Culture Amp**. Diseñadas para esto.
- *Claude Code:* repo `clima/` con corpus exportado y plantillas de reporte.
- *MCPs:* `mcp-qualtrics`, `mcp-peakon`, `mcp-graph-files`. Solo lectura.
- *Alternativa:* Claude.ai con corpus anonimizado adjunto.

**Regla de anonimización seria:** sin nombres, sin departamento, sin manager directo si la muestra es < 10 personas. Agregación mínima de 5.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días para primer informe | 14 | 2 |
| Temas identificados | 8-10 | 15-20 |
| Tasa de re-codificación por sesgo | 15% | < 3% |
| Cobertura sentimiento por unidad | 60% | 100% |

*Fórmula:* `(12 días × 8h × 3 personas) − (2 días × 8h × 1) = 272 h/año ahorradas por encuesta`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la anonimización es débil y los comentarios se cruzan con datos demográficos, la promesa de anonimato se rompe → ruptura de confianza + posible breach GDPR.*
- *Si el modelo etiqueta sentimiento de un empleado y eso se asocia a su unidad, decisión sobre personas con efectos colaterales.*
- *Si el corpus se sube a herramienta que retiene para entrenamiento, tratamiento adicional sin base.*

Cubierto en la **arquitectura de remediación (bloque 5)** con DPIA de encuestas, allow-list de plataformas con retención cero y validación de agregación.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico* (variante read-only, sin write-back) (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-climate-survey` clasifica y resume respuestas abiertas anonimizadas sobre `mcp-qualtrics`/`mcp-peakon` con agregación mínima — **nunca re-identifica ni puntúa a una persona**; el analista firma el informe.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Anonimización débil cruzada con datos demográficos rompe el anonimato (GDPR art. 5) | agentgateway | scope `surveys:read`/`responses:read` limitado a encuestas anonimizadas; enforcement de agregación mínima (k≥5); datos demográficos fuera de la allowlist |
| Cita literal que contiene un nombre propio → re-identificación | agentgateway | prompt guard NER + redaction de nombres antes de emitir la cita |
| Etiquetado de sentimiento asociado a una unidad usado para decisiones (GDPR art. 22) | agentgateway | prompt guard bloquea salida a nivel de individuo o de unidad con < k respuestas |
| Corpus subido a plataforma que lo retiene para entrenar (tratamiento sin base) | agentgateway + Istio | allowlist de plataformas con retención cero; política `no-train`; egress a modelo aprobado vía ztunnel |
| Sesgo del modelo que invisibiliza el problema (clasifica "sesgo de género en compensación" como "compensación") | agentevals | LLM-as-judge con rubric de clasificación; bloquea el handoff si el taxonomizado colapsa categorías sensibles |

## Referencias

- GDPR art. 5 (minimización), art. 9 (categorías especiales), art. 22 (decisiones automatizadas). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
