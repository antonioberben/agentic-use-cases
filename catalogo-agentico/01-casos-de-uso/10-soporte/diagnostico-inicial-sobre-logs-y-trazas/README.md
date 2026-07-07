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

Cubierto en la **arquitectura de remediación (bloque 5)** con pipeline de sanitización automática, prompt-injection scanning sobre logs, scopes read-only y gate humano en acción.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (combinado con *A5 — Operacional* en la costura de acción sobre el sistema del cliente; ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `diagnostico-logs` clasifica errores en los logs adjuntos y propone hipótesis de causa raíz; un validador A2A `diagnosis-validator` (identidad SPIFFE separada) verifica las hipótesis antes del handoff; ninguna acción sobre el sistema del cliente sin gate humano.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Credenciales/tokens/PII del cliente en el log que llegan al LLM (GDPR) | agentgateway | prompt guard perfil `secrets`+`pii`; sanitización obligatoria antes del request (pipeline del bloque 2) |
| Prompt injection embebido en líneas de log adversariales | agentgateway | contenido del log marcado `untrusted`; spotlighting antes del LLM |
| Correlaciones/hipótesis inventadas por el modelo | agentevals + kagent (A2A) | validador `diagnosis-validator` con identidad separada + eval set con logs golden; comprobaciones deterministas de frecuencia antes del handoff al humano |
| Acción sobre el sistema del cliente (restart, redeploy) ejecutada por el agente (costura A5) | agentgateway + kagent (OBO) | MCPs de observabilidad RO (`mcp-datadog`, `mcp-splunk`, `mcp-loki`); toda acción va por `mcp-remediation` (restart/redeploy) fuera de la allowlist → HITL + OBO |
| Coste por escaneo masivo de logs (50 MB) | agentgateway | rate limit por segundos de log escaneado; scoping temporal obligatorio en la query |

## Referencias

- GDPR (PII y credenciales en logs), ISO/IEC 27001 (gestión de incidentes). *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection), LLM06 (Divulgación de información sensible).
