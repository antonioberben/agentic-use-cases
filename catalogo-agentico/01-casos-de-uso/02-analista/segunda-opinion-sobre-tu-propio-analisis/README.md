# Segunda opinión sobre tu propio análisis

> **Rol:** analista · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Antes de presentar, dudas: *"¿se me ha escapado algo?"*. Se busca un revisor crítico que cuestione supuestos, identifique sesgos del muestreo y proponga métricas alternativas.

## 2. Cómo resolverlo

**Local.** Llama 70B con prompt explícito de revisión adversarial.

**Copilot.** Funciona pero tiende a validar; hay que forzar el rol crítico.

**Claude Code / ChatGPT.** Prompt: *"Critica este análisis como revisor adversarial. Supuestos implícitos. Sesgos. Preguntas no hechas. Métricas alternativas que cambiarían la conclusión. Si no encuentras debilidades, dilo."*

**MCPs:** repo de análisis previos (`mcp-github`) para comparar metodologías + análisis actual (`mcp-notebook`, solo metadata/methodology, nunca filas crudas); las anotaciones de la revisión se escriben al notebook con HITL. Agente `svc-analyst-critic-agent`, validador de supuestos `assumption-validator` (A2A, agentevals).

**Alternativa.** Pedir revisión humana a un par; el modelo no sustituye a un peer review formal.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % análisis con segunda opinión antes de presentar | *20%* | *> 80%* |
| Errores detectados pre-presentación | base | mejora moderada |
| TT-revisión | *60-120 min* (peer humano, si hay) | *15-20 min* (agente) |

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo no detecta un sesgo grave porque está fuera de su training, yo presento con falsa seguridad."*
- *"Si subo el análisis completo (con datos) al asistente, fuga del dataset."*
- *"Si el modelo sugiere métrica alternativa que apunta a otra conclusión y la adopto sin validar, decisión sobre métrica no probada."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* en modo revisor adversarial (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-analyst-critic-agent` cuestiona supuestos, sesgos de muestreo y propone métricas alternativas. **No sustituye peer review humano.**

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Sesgo grave fuera del training del modelo no detectado → falsa seguridad | agentevals | eval set adversarial con 25 análisis con sesgo conocido (Simpson, supervivencia, selección); si el agente no lo detecta, output incluye `[REVISOR HUMANO OBLIGATORIO]`; DPIA firmada exige registro de casos donde el peer humano encontró lo que el agente no |
| Subida del análisis completo con datos → fuga dataset | agentgateway | modo revisor recibe solo `metadata + methodology + summary_stats`, nunca filas crudas; DLP scan bloquea envío de datasets |
| Métrica alternativa adoptada sin validar → decisión sobre métrica no probada | agentgateway | política de salida: cada métrica alternativa debe incluir `formula + fuente teórica + supuestos`; adoption requiere firma humana en repo (`peer_reviewed=true`); tool `apply_metric` no existe |
| Sustitución del peer humano en decisiones fiduciarias | agentregistry | ficha del agente declara `no_human_replacement=true`; políticas del equipo de data exigen firma de peer humano para análisis marcados `board-material` |
| Consulta con análisis histórico completo → coste elevado | agentgateway | rate-limit por analista; cache por hash del análisis + prompt de crítica |
