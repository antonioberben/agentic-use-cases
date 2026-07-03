# Apoyo en evaluación del desempeño

> **Rol:** rrhh · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Calibración del ciclo anual, comentarios escritos del manager, resumen de logros del año.

**Cómo resolverlo.**

- *Casos válidos:* *"Resume estos 12 informes mensuales en 1 página de logros."* / *"Reescribe este feedback en tono constructivo, manteniendo el mensaje."* / *"Compara distribución de calificaciones entre equipos y señala outliers para revisar (no corregir)."*
- *Casos NO válidos:* *"Decide la calificación final."* / *"Recomienda promociones."*
- *Copilot M365 / Workday AI / SuccessFactors:* la decisión y la justificación las hace el manager con HR business partner. La IA estructura material.
- *MCPs:* `mcp-workday` (informes y objetivos en lectura), `mcp-graph-files` (notas del manager). Nunca scope de calificación.

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

Cubierto en **Pieza 2** con prohibición técnica de scopes de calificación, gate humano obligatorio, DPIA y registro EU AI Act.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
