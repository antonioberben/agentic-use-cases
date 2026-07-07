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

Cubierto en la **arquitectura de remediación (bloque 5)** con identidad de agente, scopes mínimos read-only y allow-list de plataformas con DPA conformes.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `triage-tickets` clasifica la cola por categoría/gravedad/idioma y marca escalados; no responde ni escribe, solo clasifica. Un validador A2A `priority-validator` (identidad SPIFFE separada) verifica la gravedad asignada antes de proponer el enrutado.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Escritura en Zendesk que altera la prioridad de tickets reales | agentgateway + kagent (OBO) | `mcp-zendesk` con `tickets:read,users:read`, nunca `tickets:write`; la reclasificación/enrutado va por `mcp-zendesk-route` (`tickets:assign`) solo tras HITL + OBO |
| Batch con PII de clientes a plataforma no aprobada (GDPR) | agentgateway | detección y redaction de PII antes del request; allowlist de plataformas con DPA |
| Prompt injection en el cuerpo del ticket que degrada un P1 a P3 | agentgateway | cuerpo del ticket marcado `untrusted`; spotlighting antes del LLM |
| Acceso con usuario personal en vez de `svc-triage-ro` (sin traza segregada) | Istio + kagent | SPIFFE propio del agente; `AuthorizationPolicy` y OTel atribuyen cada invocación al agente, no al humano |
| Palabras de escalado (caída, fuga, RGPD, regulador, prensa) no detectadas | agentevals | eval set de escalados; `recall < umbral` bloquea el release del modelo |

## Referencias

- GDPR (PII del cliente en tickets). *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection), LLM06 (Divulgación de información sensible).
