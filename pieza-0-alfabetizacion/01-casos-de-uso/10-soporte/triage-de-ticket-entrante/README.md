# Triage de ticket entrante

> **Rol:** soporte · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 80 tickets en cola por la mañana, sin saber por dónde empezar. SLA presiona; perder un P1 entre P3 cuesta caro.

**Cómo resolverlo.**

- *Plataformas nativas (vía principal):* **Zendesk AI**, **Intercom Fin**, **Salesforce Service Cloud Einstein**, **Freshdesk Freddy AI**, **HubSpot Service Hub AI**, **ServiceNow Now Assist**.
- *Local:* Ollama sobre export de tickets sanitizado.
- *Copilot M365:* Copilot Chat sobre cola exportada a Excel.
- *Claude Code:* repo `triage/` con reglas y `AGENTS.md` que prohíbe respuesta automática.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-zendesk` | `npx mcp-zendesk`, `vault://zd/triage-ro` | `tickets:read`, `users:read` — nunca `tickets:write` |
| `mcp-salesforce-sc` | oficial | `case:read` |
| `mcp-graph-files` | M365 | `Files.Read.All` sobre SLA matrices |

**Prompt:** *"Clasifica por categoría (acceso/configuración/bug/facturación/consulta), gravedad (P1-P4 según SLA), idioma, complejidad técnica. Marca tickets con palabras de escalado (caída, fuga, datos, RGPD, regulador, prensa, abogado) para prioridad máxima. NO respondas; solo clasifica."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de triage por 80 tickets | 90 min | 10 min |
| % tickets con prioridad correcta | 70% | 95% |
| % P1 detectados en < 5 min | 60% | 98% |
| SLA cumplido | 85% | 98% |

*Fórmula:* `(80) min × 250 días = 333 h/año por agente de triage`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene scope de escritura en Zendesk, una mala clasificación cambia automáticamente prioridad de tickets reales.*
- *Si subo un batch con PII de clientes a chat no aprobado, breach GDPR.*
- *Si el agente accede con mi usuario y no `svc-triage-ro`, no hay traza segregada.*

Cubierto en **Pieza 2** con identidad de agente, scopes mínimos read-only y allow-list de plataformas con DPA conformes.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
