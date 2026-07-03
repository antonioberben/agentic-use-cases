# Investigación de incidente

> **Rol:** it-seguridad · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Línea de tiempo, TTPs y alcance que reconstruir en guardia. Hoy: horas pivotando entre 6 consolas.

**Cómo resolverlo.**

- *Plataformas:* Sentinel Copilot, Charlotte AI, XSIAM, Duet AI — todas con timeline asistido.
- *Local:* Ollama sobre export de eventos correlacionados.
- *Claude Code:* repo `ir-cases/[caso]/` con telemetría exportada y `AGENTS.md`.
- *MCPs (lectura):* `mcp-sentinel`, `mcp-crowdstrike-edr`, `mcp-entra-id`, `mcp-aws-cloudtrail`, `mcp-azure-activity-log`, `mcp-gcp-audit`. Nunca scope de aislamiento o reset.

**Prompt:** *"Reconstruye timeline desde [primera detección] con eventos relacionados con [activo/usuario/IOC]. Mapea a MITRE ATT&CK. Identifica activos potencialmente impactados. Marca lo que requiere acción humana inmediata. NO ejecutes ninguna acción."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas a primer timeline | 4 h | 30 min |
| Cobertura activos impactados | 70% | 98% |
| MTTR | 12 h | 3 h |
| Calidad del informe IR (peer review) | 7/10 | 9/10 |

*Fórmula:* `(3,5) h × 40 incidentes/año = 140 h/año por analista IR`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la salida del modelo se toma como evidencia forense sin validación, la cadena de custodia se rompe.*
- *Si el agente tiene `host:isolate`, un FP aísla un servidor productivo.*
- *Si el case se procesa en herramienta no aprobada, expones detalles del incidente y del atacante.*

Cubierto en **Pieza 2** con allow-list de herramientas IR, scope read-only, gate humano para acción y trazabilidad para informe regulador (NIS2 art. 23).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
