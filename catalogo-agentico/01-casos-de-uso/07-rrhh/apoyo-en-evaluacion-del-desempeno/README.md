# Apoyo en evaluación del desempeño

> **Rol:** rrhh · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Calibración del ciclo anual, comentarios escritos del manager, resumen de logros del año.

**Cómo resolverlo.**

- *Casos válidos:* *"Resume estos 12 informes mensuales en 1 página de logros."* / *"Reescribe este feedback en tono constructivo, manteniendo el mensaje."* / *"Compara distribución de calificaciones entre equipos y señala outliers para revisar (no corregir)."*
- *Casos NO válidos:* *"Decide la calificación final."* / *"Recomienda promociones."*
- *Copilot M365 / Workday AI / SuccessFactors:* la decisión y la justificación las hace el manager con HR business partner. La IA estructura material.
- *MCPs:* `mcp-workday` (informes y objetivos en lectura), `mcp-graph-files` (notas del manager), `mcp-review-draft` (`review:write`, con gate humano para publicar el borrador). Nunca scope de calificación.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas/manager en ciclo de evaluación | 12 h | 4 h |
| Calidad del feedback (encuesta empleado) | medida base | +20% |
| % evaluaciones entregadas a tiempo | 70% | 95% |

*Fórmula:* `(8) h × N managers × ciclos/año`. Para 100 managers, 2 ciclos: `1 600 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo decide la calificación, decisión automatizada con efecto en retribución y permanencia → art. 22 GDPR + EU AI Act alto riesgo.*
- *Si los inputs incluyen datos sensibles (salud, embarazo, conflictos), tratamiento sin base jurídica clara.*
- *Si el agente publica la evaluación sin gate, el empleado recibe un texto no validado por su manager.*

Cubierto en la **arquitectura de remediación (bloque 5)** con prohibición técnica de scopes de calificación, gate humano obligatorio, DPIA y registro EU AI Act.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails* aplicado a feedback (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-hr-evaluation-agent` estructura logros y reescribe feedback; **nunca decide calificación ni promociones**.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Decisión automatizada de calificación con efecto retributivo/permanencia (**GDPR art. 22 · EU AI Act Anexo III Alto Riesgo empleo · ET art. 20.3 · Ley Rider**) | agentregistry + agentgateway | ficha del agente declara `no_calificacion=true`; `mcp-workday` publicado sin `performance:write`, `rating:write`, `promotion:write`; tools `set_rating`/`recommend_promotion` fuera del catálogo |
| Inputs con datos sensibles (salud, embarazo, conflictos) → tratamiento sin base (**GDPR art. 9 categorías especiales**) | agentgateway | pii-redact filtra términos médicos, embarazo, discapacidad, orientación sexual, sindicación antes del LLM; si detectado → línea marcada `[NO PROCESABLE]` y alerta a DPO |
| Publicación de evaluación sin gate humano | kagent + agentgateway | tool `publish_review` deny; salida escribe borrador en drive personal del manager; publicación en Workday requiere firma del manager y del HR business partner |
| Sesgo diferencial entre grupos protegidos (género, edad, origen) | agentevals | eval set adversarial con 50 pares de informes idénticos con nombres/pronombres cambiados; drift entre tonos por grupo > 5% → bloqueo; DPIA firmada exige registro trimestral de bias testing |
| Consulta al comité de empresa ausente (**ET art. 64.4** información y consulta previa sobre IA laboral) | agentregistry | ficha exige constancia de acuerdo/consulta con RLT antes de publicación productiva |
