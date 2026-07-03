# *Knowledge mining*: generar y mantener KB

> **Rol:** soporte · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** KB nunca al día. Tickets se resuelven 200 veces sin documentarse. Conocimiento en cabezas, no en sistema.

**Cómo resolverlo.**

- *Local:* Ollama sobre export de tickets resueltos último trimestre.
- *Copilot M365:* sobre cola de tickets en Excel.
- *Plataformas con knowledge mining:* **Guru AI Knowledge Sync**, **Document360 AI Article Generator**, **Zendesk Content Cues**.
- *Claude Code:* repo `kb-mining/` con scripts y `AGENTS.md` con criterios de cobertura.
- *MCPs:* `mcp-zendesk` o `mcp-salesforce-sc` (tickets cerrados, lectura), `mcp-guru` o `mcp-confluence` (publicación con gate).

**Prompt:** *"Identifica 10 patrones de incidente recurrentes NO en la KB. Por cada uno: síntoma, causa frecuente, pasos de resolución, criterios de cierre. Marca [VALIDAR] lo que requiera revisión de producto."*

Periodicidad: mensual o por sprint.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Artículos KB nuevos/mes | 2-3 | 15-20 |
| % volumen cubierto por KB | 50% | 85% |
| Deflection rate (sin agente) | 15% | 35% |
| Tiempo de creación de artículo | 2 h | 25 min |

*Fórmula:* `(95) min × 15 artículos/mes × 12 = 285 h/año por content manager`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si publicas un artículo que el modelo "redondea" con un paso inventado, agentes lo aplican como verdad.*
- *Si la KB pasa a entrenar el modelo del proveedor sin DPA, expones procedimientos internos.*
- *Si el agente publica directamente sin gate, artículo no revisado va a producción.*

Cubierto en **Pieza 2** con gate humano de publicación, allow-list con DPA y revisión de producto obligatoria para artículos técnicos.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
