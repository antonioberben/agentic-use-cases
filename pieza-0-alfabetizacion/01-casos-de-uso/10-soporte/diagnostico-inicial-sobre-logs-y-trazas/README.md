# Diagnóstico inicial sobre logs y trazas

> **Rol:** soporte · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 50 MB de log adjunto por el cliente. Nadie quiere leerlos. Errores únicos enterrados entre miles de líneas de noise.

**Cómo resolverlo.**

- *Plataformas observabilidad con IA:* **Datadog Bits AI**, **Splunk AI Assist**, **Dynatrace Davis**, **New Relic AI**, **Sumo Logic Mo Copilot**.
- *Local:* Ollama + Qwen2.5-Coder 32B sobre log sanitizado (sin credenciales, sin PII, sin tokens).
- *Copilot M365:* Copilot Chat sobre log en SharePoint.
- *Claude Code:* repo `diagnostico/` con scripts de sanitización y patrones conocidos.
- *MCPs:* `mcp-datadog`, `mcp-splunk`, `mcp-loki` (lectura), `mcp-filesystem` (log local sanitizado).

**Pipeline obligatorio:**
1. Sanitizar log (regex contra credenciales, tokens, PII).
2. Cargar al modelo.
3. Validar hipótesis antes de comunicar al cliente.

**Prompt:** *"Identifica errores únicos, frecuencia, primera y última aparición. Marca cadenas causa-efecto. 3 hipótesis de causa raíz ordenadas por probabilidad. NO inventes correlaciones."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de primer diagnóstico | 90 min | 15 min |
| % tickets con RCA documentada | 40% | 85% |
| MTTR (mean time to resolve) | 8 h | 2,5 h |
| Hipótesis correcta en primer intento | 60% | 85% |

*Fórmula:* `(75) min × 25 tickets/agente/sem × 48 = 1 500 h/año por agente L3`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si subo log sin sanitizar, expongo credenciales del cliente y posiblemente las mías → breach.*
- *Si el modelo invente correlaciones falsas, persigues una hipótesis equivocada y el cliente espera.*
- *Si el agente actúa sobre el sistema del cliente (restart, redeploy) automáticamente, riesgo de empeorar.*

Cubierto en **Pieza 2** con pipeline de sanitización automática, prompt-injection scanning sobre logs, scopes read-only y gate humano en acción.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
