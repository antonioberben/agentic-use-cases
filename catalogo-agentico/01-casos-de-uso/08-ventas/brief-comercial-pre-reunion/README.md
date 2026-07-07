# T10 — Brief comercial pre-reunión

## Identificación

- **Rol principal**: AE, SDR, CSM, KAM.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline (+ analítico).
- **Madurez recomendada**: nivel 1 piloto sobre cuentas asignadas; nivel 3 antes de extender a toda la cartera.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

El AE entra a reuniones con cuentas estratégicas sin preparar porque no le da tiempo a leer 6 meses de correos + notas CRM + últimas llamadas grabadas. Resultado: pregunta cosas que ya se hablaron, no detecta señales de compra/riesgo, queda peor con el cliente. El agente genera brief de 1 página antes de cada reunión.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre export del CRM + transcripciones de calls. Prompt: *"Brief de 1 página: estado de relación, últimos 3 contactos relevantes con fecha, asuntos abiertos, tema previsto de la reunión, 3 puntos a plantear, 3 preguntas a esperar, riesgos. Cita la fuente (correo/call/nota)."*

### 2.2 Copilot

Copilot M365 + conector Salesforce/Dynamics + Outlook + Teams. Sensibilidad `Confidential / Sales`.

### 2.3 Claude Code

Repo `briefings/` con `AGENTS.md` que define formato y prohíbe inventar contactos pasados.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-salesforce` | Salesforce MCP | `vault://sales/${USER}-ro` | `accounts:read,opportunities:read,activities:read` solo cuentas asignadas |
| `mcp-gong` | Gong MCP | `vault://sales/gong-ro` | `calls:read` solo del AE |
| `mcp-mail` | Graph MCP | `Mail.Read`, **nunca** `Mail.Send` | buzón propio |

### 2.5 Alternativas

Claude Projects con export sanitizado.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo de preparación por reunión | 30 min | 3 min |
| % reuniones con brief al día | 30% | 95% |
| Tasa de conversión a siguiente etapa | base | base × 1,15 |

Fórmula: *27 min × 8 reuniones/semana × 44 sem = ≈ 160 h/año por AE. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de Salesforce va con scope amplio (toda la cartera), el agente ve cuentas que no son mías — fuga interna."*
- *"Si Gong se conecta con scope completo, el agente puede acceder a llamadas de compañeros (datos personales del cliente sin consentimiento renovado)."*
- *"Si el brief incluye dato sensible del interlocutor (familia, salud) extraído de notas, problema GDPR de minimización."*

**Riesgos típicos:** scope creep en CRM, acceso indebido a calls ajenas, sobre-inclusión de datos personales en brief, follow-up automático no supervisado.

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `deal-brief-builder` agrega CRM (`mcp-salesforce`), correo (`mcp-mail`) y llamadas grabadas (`mcp-gong`) de la cuenta asignada y produce un brief de 1 página que el AE lee antes de la reunión; un validador `source-validator` (A2A) verifica que cada dato del brief resuelve a su fuente. Sin escrituras en el brief; el único envío posible es el follow-up de correo, que exige HITL y OBO del AE.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Scope creep en CRM: el agente ve cuentas no asignadas (fuga interna) | agentgateway + Istio | `mcp-salesforce` con scope `accounts:read,opportunities:read,activities:read` limitado a cuentas del AE; `AuthorizationPolicy` L7 filtra por el SPIFFE del AE |
| Acceso a llamadas de compañeros vía Gong (datos del cliente sin consentimiento renovado) — GDPR art. 6 | agentgateway | `mcp-gong` con scope `calls:read` restringido a las calls del propio AE; el resto queda fuera de la allowlist |
| Sobre-inclusión de datos personales del interlocutor (familia, salud) en el brief — GDPR minimización, art. 9 | agentgateway | prompt guard de salida detecta categorías especiales y las redacta antes de componer el brief |
| Follow-up automático disparado desde el brief sin supervisión | agentgateway + kagent (OBO) | `mcp-mail` con scope `Mail.Read` sin `Send`; cualquier acción de correo exige HITL y OBO del AE |
| Cifra de la cuenta presentada sin fuente | agentevals | cada dato del brief lleva referencia clicable (correo/call/nota); `agentevals` verifica que la referencia resuelve |

## Referencias

- GDPR (minimización), normativa de grabación de llamadas (consentimiento). *Citas T1.*
