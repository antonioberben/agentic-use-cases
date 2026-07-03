# Borrador de informe para comité o auditoría

> **Rol:** finanzas · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 10 páginas de informe trimestral o nota técnica al auditor, en el último día. Cifras ya calculadas, falta narrarlas con tono adecuado.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre KPIs cerrados en CSV. Genera estructura y prosa; tú validas cifras.
- *Copilot Word / PowerPoint:* tabla de KPIs en Excel + Copilot redactando narrativa en Word. Cada cifra cita su celda fuente.
- *Claude Code:* repo `reports/` con template del informe y un `AGENTS.md` con el tono (comité vs auditor).
- *MCPs:* `mcp-graph-files` (papeles de trabajo), `mcp-confluence` (informes anteriores).
- *Alternativa:* prompt en Claude/ChatGPT con cifras ya públicas o redondeadas.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas para primer borrador | 8 h | 2 h |
| Iteraciones hasta firma | 5 | 2-3 |
| Cifras con cita-fuente | 60% | 100% |

*Fórmula:* `(8 − 2) h × 4 trim = 24 h/año por controller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" una cifra que no le diste, firmas un informe con datos inventados.* Riesgo de auditoría y, en cotizadas, de mercado.
- *Si el borrador del trimestre se sube a una herramienta no aprobada antes de publicación, MNPI fuera del perímetro → MAR/CNMV.*
- *Si el agente escribe directamente en SharePoint compartido con auditoría externa, mezclas borradores con final.*

Cubierto en **Pieza 2** con perímetro de herramientas aprobadas pre-publicación, identidad del agente y workflow de aprobación.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
