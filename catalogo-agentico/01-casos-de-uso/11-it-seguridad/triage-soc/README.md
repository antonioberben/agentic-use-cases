# T06 — Triage de eventos SOC

## Identificación

- **Rol principal**: analista SOC L1/L2, threat hunter.
- **Sectores**: transversal (intensivo en banca, telco, sector público).
- **Patrón técnico**: Lab 2 — agente de triage de eventos.
- **Madurez recomendada**: nivel 2 piloto (read-only sobre SIEM); nivel 3 antes de cualquier acción sobre IdP/EDR.

> Aviso permanente: capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

El SOC recibe miles de alertas/día del SIEM (Sentinel/Splunk/QRadar). El analista L1 dedica el turno a triage: descartar falsos positivos, enriquecer con threat intel, decidir escalar a L2. La fatiga de alertas hace que se pierdan TP (true positives) entre el ruido. El agente clasifica, enriquece y propone playbook — el humano decide y ejecuta.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B sobre export anonimizado de alertas. Prompt: *"Clasifica: falso positivo / sospechoso / confirmado. Enriquece con MITRE ATT&CK táctica/técnica. Lista IOCs. Propón pasos de validación (no acciones). **No bloquees nada, no aísles nada.**"*

### 2.2 Copilot

Microsoft Security Copilot conectado a Sentinel + Defender XDR. Promptbooks para casos típicos (phishing, beacon, exfil). Procesamiento UE con commercial data boundary.

### 2.3 Claude Code u otro agente de escritorio

Repo `soc-playbooks/` con `AGENTS.md` que define taxonomía MITRE, fuentes de inteligencia, formato de salida JSON (clasificación, confianza, IOCs, recomendación). Allowlist sin permisos de ejecución sobre infra.

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-sentinel` | Sentinel/Defender MCP | `vault://soc/sentinel-ro` | `Alerts.Read,Incidents.Read`; KQL `read-only` |
| `mcp-splunk` | Splunk MCP | `vault://soc/splunk-ro` | `search:read`; nunca `admin` |
| `mcp-virustotal` | VT MCP | `vault://soc/vt-ro` | `lookup`; sin upload de samples |
| `mcp-misp` | MISP MCP | mTLS al MISP interno | `events:read` |

### 2.5 Alternativas

Claude/ChatGPT Enterprise con alerta sanitizada (sin nombre de usuario, IPs internas mapeadas). Solo formación, no operación.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Tiempo medio de triage por alerta | min | 8 min | 1 min |
| % falsos positivos cerrados sin escalar | volumen | 70% | 90% |
| % TPs detectados (recall) | calidad | 70% | 92% |
| Coste por SOC analyst hora | € | base | base × 0,5 |

Fórmula: *7 min × 400 alertas/turno × 3 turnos × 220 días = ≈ 31.000 h/año por SOC mediano. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de Sentinel tiene `SecurityAlert.ReadWrite` y un prompt injection desde el cuerpo de un email phishing reclasifica alerta crítica como benigno, el atacante usa el agente para esconderse."*
- *"Si conecto el agente a EDR con permisos de aislamiento y un falso positivo dispara aislar el portátil del CFO, outage en plena reunión de mercado."*
- *"Si los logs contienen credenciales en claro (mal logging de la app) y van al LLM externo, fuga de secretos al proveedor del modelo."*

**Riesgos típicos:** prompt injection desde email/log adversarial, acción sobre IdP/EDR sin gate humano (NIS2/DORA críticos), fuga de credenciales en logs, sesgo del modelo que invisibiliza TTPs nuevos.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)): triage multi-señal a alta cadencia con acciones sensibles gated a SOAR. El agente `soc-triage` correlaciona señales de SIEM + threat intel en modo **read-only** y produce una propuesta de playbook. Cualquier acción sobre EDR/IdP (aislar host, revocar sesión, deshabilitar cuenta) sale del scope del agente: se ejecuta desde SOAR con OBO del analista L2/L3 tras HITL. Multi-tenant estricto: un agente por tenant, aislado en la malla.

### Mapeo riesgo → componente → mecanismo

| Riesgo (bloque 4) | Componente Solo | Mecanismo — dónde / cómo |
|-------------------|-----------------|--------------------------|
| Prompt injection desde cuerpo de email adversarial que reclasifica alerta crítica como benigna | agentgateway | prompt guard con **spotlighting**: el contenido del email/alerta se marca `untrusted-content` y el LLM lo describe, no lo obedece; reglas de jailbreak + patrones "reclassify as benign" |
| Acción sobre EDR sin gate humano (aislar CFO por FP) | agentgateway + kagent (OBO) | `mcp-edr` **no está en la allowlist del agente** (ni read ni write); toda acción va vía SOAR, `kagent` enruta por severidad y exige HITL de L2/L3 antes del OBO del analista |
| Credenciales/secretos en claro en logs enviados al LLM | agentgateway | prompt guard con perfil `secrets`: JWT, API keys por regex, hashes, cookies de sesión; redaction antes de que la request salga hacia el LLM externo |
| Sesgo del modelo que invisibiliza TTPs nuevos | agentevals | eval set con TTPs MITRE de últimos 90 días (curado por threat intel); si `recall < umbral` la versión del modelo no pasa a producción y se dispara alerta al SOC leader |
| Tormenta de alertas dispara coste descontrolado | agentgateway | rate limit por tokens **por analista y tenant**; semantic caching de patrones repetidos (mismo IOC contra 500 hosts colapsa a 1 llamada); model failover a Haiku cuando la severidad clasificada es `low` |
| Shadow copilot (analista con ChatGPT personal en su portátil) | agentregistry + Istio ambient | sin registro no hay identidad SPIFFE; `AuthorizationPolicy` en ztunnel deniega egress desde subredes SOC hacia `api.openai.com` u otros LLM no aprobados |
| Trazabilidad NIS2/DORA de cada decisión del agente | agentgateway + agentevals | OTel per-invocation al SIEM (hash del input, tools invocados, output, decisión HITL, latencia); `agentevals` mantiene un golden dataset auditado para el regulador |
| Multi-tenant: el agente de la subsidiaria A ve alertas de B | Istio ambient + kagent | `AuthorizationPolicy` L7 en waypoint filtra por SPIFFE ID del tenant antes de que `mcp-sentinel` devuelva resultados; `kagent` instancia un agente por tenant, sin credenciales compartidas |

### Cómo se consigue la identidad

`soc-triage-agent` recibe SPIFFE `spiffe://soc.acme.com/triage/<tenant>` en **ztunnel** vía mTLS. **agentgateway** valida además el OIDC/JWT del analista L1 que invoca el triage (JWKS del IdP corporativo). En un escalado a acción sobre EDR/IdP, **kagent** hace **OBO** con el token del analista L2/L3 aprobado tras HITL: **la acción en EDR se firma con el token del analista, no con una service account del agente**. Esto preserva la cadena de responsabilidad exigida por NIS2 art. 21 y DORA capítulo III.

### Dónde se aplican las políticas

En el **plano de datos de agentgateway** vía `AgentgatewayPolicy`: allowlist de tools RO (Sentinel/Splunk/VT/MISP; nada de `write`, nada de `admin`), prompt guard con perfil `soc-adversarial` (secretos + patrones de injection + spotlighting de contenido de alertas), rate limit por analista+tenant, semantic caching, model failover por severidad. En la **malla Istio** vía `AuthorizationPolicy`: L4 en ztunnel restringe egress SOC a endpoints del SIEM, feeds de TI y el LLM en la región regulatoria correcta; L7 en waypoint filtra las respuestas de `mcp-sentinel` por tenant antes de que salgan al agente. **agentregistry** inventaría agente, sub-agentes y MCPs; lo no registrado (copilot personal, MCP no auditado) queda fuera de allowlist y sin egress.

## Referencias

- NIS2 (incidentes de seguridad), DORA (sector financiero), ISO/IEC 27035, MITRE ATT&CK, OWASP LLM Top 10. *Citas T1.*
- Input cliente: `inputs-cliente/01-ciso-triage-incidencias.md`.
