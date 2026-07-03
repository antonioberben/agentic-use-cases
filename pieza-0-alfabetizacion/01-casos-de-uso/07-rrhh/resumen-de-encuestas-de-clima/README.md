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

Cubierto en **Pieza 2** con DPIA de encuestas, allow-list de plataformas con retención cero y validación de agregación.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
