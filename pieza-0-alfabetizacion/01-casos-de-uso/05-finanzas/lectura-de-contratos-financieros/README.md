# Lectura de contratos financieros

> **Rol:** finanzas · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 40 páginas de un leasing, financiación, emisión de deuda o ISDA. Hay que extraer covenants, garantías, tipo de interés, eventos de incumplimiento, penalizaciones. Hoy es tarde-completa de lectura.

**Cómo resolverlo.**

- *Local:* Ollama sobre PDF (texto extraído). Cero envío a la nube si el contrato es confidencial.
- *Copilot M365:* el PDF en SharePoint, Copilot Chat. Extrae estructurado a Excel.
- *Claude Code + Claude Sonnet con contexto largo:* el contrato en `legal/contracts/`; el agente extrae campos a JSON contra un esquema.
- *MCPs:* `mcp-graph-files` (SharePoint), `mcp-icertis` o `mcp-docusign-clm` si hay CLM (solo lectura).
- *Alternativa:* subir el PDF anonimizado a Claude.ai para extracción asistida.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por contrato | 4 h | 1 h |
| Covenants extraídos | 80% | 100% |
| Errores en fechas/importes | 10% | < 2% |

*Fórmula:* `(4 − 1) h × 40 contratos/año = 120 h/año por analista de tesorería`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si subes el contrato a una herramienta no aprobada, expones contraparte, condiciones y covenants — sensible competitivamente y, en M&A, MNPI.*
- *Si el modelo malinterpreta una cláusula de incumplimiento ("ambigüedad"), tomas una decisión de tesorería mal informada.* Pide siempre revisión legal humana de lo extraído.
- *Si el agente tiene escritura en el CLM, puede modificar el master record.*

Cubierto en **Pieza 2** con perímetro de herramientas aprobadas para legal, identidad propia y workflow revisión legal antes de actuar.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
