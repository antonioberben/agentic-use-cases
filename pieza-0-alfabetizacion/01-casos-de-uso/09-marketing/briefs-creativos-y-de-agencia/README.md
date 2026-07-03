# Briefs creativos y de agencia

> **Rol:** marketing · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Briefs a agencia/equipo creativo incompletos generan 3-4 iteraciones. Hoy: 30-60 min de brief, días perdidos en revisiones.

**Cómo resolverlo.**

- *Copilot Word:* template + Copilot estructura.
- *Local:* Ollama con plantilla y stakeholders inputs.
- *Claude Code:* repo `briefs/` con templates por tipo (campaña, landing, evento, asset).
- *MCPs:* `mcp-graph-files` (briefs previos), `mcp-asana` o `mcp-monday` (gestión de proyecto).

**Prompt:** *"Genera brief creativo para [campaña/asset]. Estructura: objetivo de negocio, KPI, audiencia e insight, mensaje único, qué decir y qué NO, deliverables, plazos, restricciones de marca. Marca [REVISAR] lo que requiera validación con stakeholder."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min por brief | 45 | 15 |
| Iteraciones agencia hasta v1 aprobada | 4 | 2 |
| Briefs con KPI definido | 60% | 100% |

*Fórmula:* `(30) min × 80 briefs/año + (10h ahorradas iteración × 80) = 40 + 800 = 840 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el brief incluye estrategia confidencial (lanzamiento no anunciado, M&A) y se sube a herramienta no aprobada, breach.*
- *Si el modelo "rellena" un KPI sin pedírtelo, persigues métrica equivocada.*

Cubierto en **Pieza 2** con allow-list y gate humano de validación de stakeholders.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
