# T06 — Triage de eventos SOC

## Identificación

- **Rol principal**: analista SOC L1/L2, threat hunter.
- **Sectores**: transversal (intensivo en banca, telco, sector público).
- **Patrón técnico**: Lab 2 — agente de triage de eventos.
- **Madurez recomendada**: nivel 2 piloto (read-only sobre SIEM); nivel 3 antes de cualquier acción sobre IdP/EDR.

> Aviso permanente: capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- NIS2 (incidentes de seguridad), DORA (sector financiero), ISO/IEC 27035, MITRE ATT&CK, OWASP LLM Top 10. *Citas T1.*
- Input cliente: `inputs-cliente/01-ciso-triage-incidencias.md`.
