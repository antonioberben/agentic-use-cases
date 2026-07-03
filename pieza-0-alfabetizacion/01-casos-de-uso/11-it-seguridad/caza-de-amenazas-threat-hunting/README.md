# Caza de amenazas (*threat hunting*)

> **Rol:** it-seguridad · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Hipótesis vaga ("posible C2 saliente desde finanzas") → consultas concretas a la telemetría.

**Cómo resolverlo.**

- *Plataformas:* Sentinel KQL Copilot, Splunk SPL AI Assistant, Chronicle YARA-L assist.
- *Local:* Ollama + Qwen2.5-Coder 32B (KQL, SPL, SQL).
- *Claude Code:* repo `hunting/` con libreria de queries y `AGENTS.md`.
- *MCPs:* `mcp-sentinel-kql` o `mcp-splunk-spl` (validación de sintaxis sobre schema, sin ejecutar).

**Prompt:** *"Genera consultas KQL (o SPL) para detectar [hipótesis]. Cada una con: descripción, fuente requerida, umbrales, FPs conocidos. NO combines hipótesis en una consulta."*

Valida cada query antes de ejecutar; sintaxis correcta + semántica equivocada = miles de FPs o ocultar TPs.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por hunt | 12 h | 3 h |
| Queries operacionalizadas/trim | 4 | 20 |
| % hunts con detección nueva | 15% | 40% |

*Fórmula:* `(9) h × 20 hunts/año = 180 h/año por hunter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si ejecutas query semánticamente equivocada, sobrecarga el SIEM o pierde TPs.*
- *Si la hipótesis del hunt contiene IOC interno embargado y va a LLM público, expones inteligencia.*

Cubierto en **Pieza 2** con validación obligatoria pre-ejecución y allow-list de modelos para IOCs internos.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
