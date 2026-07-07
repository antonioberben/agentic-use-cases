# T07 — Voz del empleado / encuesta de clima

## Identificación

- **Rol principal**: RRHH / people analytics.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 1 — agente analítico sobre datos.
- **Madurez recomendada**: nivel 1 piloto sobre respuestas anonimizadas; nivel 3 con agregación mínima y sin re-identificación.

> Aviso permanente: capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Cada año (o trimestre) se lanza encuesta de clima con miles de respuestas: cerradas (NPS, escalas) y abiertas (texto libre). Analizar las abiertas a mano lleva semanas y se acaba leyendo una muestra. La gente percibe la encuesta como ruido si no se actúa sobre lo que dice. El agente clasifica, agrega y resume las respuestas abiertas respetando anonimato.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B sobre export CSV de respuestas abiertas con identificadores eliminados. Prompt: *"Clasifica cada respuesta en temas (autonomía, mánager, compensación, carga, propósito, herramientas, otros). Agrega por equipo solo si el equipo tiene ≥5 respuestas. Resume sentimiento. **No re-identifiques. Si una respuesta contiene nombres propios, eliminalos antes de citar.**"*

### 2.2 Copilot

Viva Insights + Copilot for HR. Procesamiento UE.

### 2.3 Claude Code u otro agente de escritorio

Repo `hr-survey/` con `AGENTS.md` que define umbrales de agregación (mínimo k=5), prohibe re-identificación, fija formato de salida (tabla por tema × equipo + 3-5 citas anonimizadas representativas).

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-qualtrics` | Qualtrics MCP | `vault://hr/qualtrics-ro` | `surveys:read,responses:read` solo encuestas anonimizadas |
| `mcp-workday` | Workday MCP (estructura org) | `vault://hr/workday-ro` | `organization:read` solo agregado |

### 2.5 Alternativas

Claude Projects con CSV anonimizado. Solo si k≥5 por equipo.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Tiempo a informe de clima | semanas | 4 sem | 3 días |
| % respuestas abiertas analizadas | cobertura | 20% (muestra) | 100% |
| Acciones derivadas de la encuesta | nº | 5-10 | 20-30 |
| Engagement en siguiente encuesta | tasa respuesta | 60% | 75% |

Fórmula: *3 semanas × 1 analista FTE × 2 encuestas/año = 240 h/año. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si trabajo desde Copilot conectado al HRIS sin DPIA y el modelo cita una respuesta que contiene nombre de mánager y dato sensible (salud, baja, conflicto), re-identifico al empleado — incumplimiento art. 9 GDPR (categorías especiales)."*
- *"Si agrego por equipo con k<5, en equipos pequeños es trivial inferir quién dijo qué — represalia posible, ruptura de confianza."*
- *"Si el modelo extrae 'temas' que en realidad reflejan sesgo (categoriza como 'queja por compensación' lo que era 'queja por sesgo de género en compensación'), se invisibiliza el problema real."*

**Riesgos típicos:** re-identificación por agregación insuficiente, fuga de categorías especiales (salud, opinión política, sindical), sesgo de modelo en clasificación de temas, decisión automatizada sobre personas (art. 22 GDPR).

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico* (variante read-only, sin write-back) (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-voz-empleado` clasifica respuestas abiertas por tema y agrega el sentimiento por equipo con umbral k=5 sobre `mcp-qualtrics` y `mcp-workday` — **nunca re-identifica ni decide sobre una persona**; el analista firma el informe agregado.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Agregación con k<5 en equipos pequeños permite inferir quién dijo qué → represalia | agentgateway | enforcement del umbral k=5 sobre `mcp-workday` (`organization:read`); los agregados por debajo del umbral se bloquean |
| Cita que contiene categorías especiales (salud, baja, afiliación sindical) (GDPR art. 9) | agentgateway | prompt guard perfil `art.9` + redaction antes de citar; scope `responses:read` solo sobre encuestas anonimizadas |
| Re-identificación por cita con nombre de mánager + dato sensible | agentgateway | prompt guard NER: elimina nombres propios de la respuesta antes de que llegue al LLM |
| Sesgo del modelo en la clasificación de temas (invisibiliza sesgo de género) | agentevals | LLM-as-judge con rubric de clasificación; bloquea el handoff si colapsa categorías sensibles |
| Decisión automatizada sobre personas derivada del análisis (GDPR art. 22, EU AI Act Anexo III) | agentgateway | prompt guard bloquea scoring individual; la salida se limita a agregados por encima del umbral |

## Referencias

- GDPR art. 9 (categorías especiales), art. 22 (decisiones automatizadas), EU AI Act Anexo III (sistemas en empleo = alto riesgo). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Info Disclosure), evaluación de sesgo.
