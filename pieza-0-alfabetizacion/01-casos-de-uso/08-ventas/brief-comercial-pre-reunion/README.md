# T10 — Brief comercial pre-reunión

## Identificación

- **Rol principal**: AE, SDR, CSM, KAM.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline (+ analítico).
- **Madurez recomendada**: nivel 1 piloto sobre cuentas asignadas; nivel 3 antes de extender a toda la cartera.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR (minimización), normativa de grabación de llamadas (consentimiento). *Citas T1.*
