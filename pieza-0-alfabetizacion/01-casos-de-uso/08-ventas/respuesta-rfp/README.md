# SP02 — Respuesta a RFP / cuestionario

## Identificación

- **Rol principal**: sales engineer, bid manager, proposal writer.
- **Sectores**: servicios profesionales, software, integradores.
- **Patrón técnico**: Lab 5 — frontline + Lab 1 — analítico.
- **Madurez recomendada**: nivel 1 piloto; nivel 3 antes de enviar respuesta firmada.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

RFPs grandes (200-1.500 preguntas) sobre seguridad, capacidades, referencias, compliance, SLAs. Hoy: equipo grande lee, busca en respuestas anteriores, redacta, revisa con producto/legal/seguridad. Semanas de esfuerzo. El agente busca en el repositorio de respuestas previas, propone respuesta con cita y marca preguntas que requieren revisión humana (legal, seguridad, compromisos nuevos).

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre repo de RFPs históricas. Prompt: *"Para cada pregunta del RFP: busca respuestas previas similares (cita RFP de origen y fecha), propón respuesta adaptada, asigna confianza. Marca [REVISAR] cualquier respuesta sobre compromisos legales, seguridad, capacidades nuevas o roadmap."*

### 2.2 Copilot

Loopio + Microsoft 365 Copilot. Sensibilidad `Confidential / Sales`.

### 2.3 Claude Code

Repo `rfps/` con `AGENTS.md` que prohíba inventar capacidades y obligue cita a respuesta previa o derive.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-loopio` | Loopio MCP | `vault://sales/loopio-ro` | `answers:read,library:read` |
| `mcp-confluence` | Atlassian MCP | `vault://sales/conf-ro` | `pages:read` espacio producto |
| `mcp-trust-center` | Trust portal MCP (Vanta/Drata) | `vault://sales/trust-ro` | `controls:read` |

### 2.5 Alternativas

Claude Projects con repositorio subido.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo medio por RFP grande | 4 sem | 1 sem |
| % preguntas respondidas en primer borrador | 50% | 85% |
| Tasa de adjudicación (win rate) | base | base × 1,10-1,20 |
| Capacidad de RFPs paralelos | base | base × 2-3 |

Fórmula: *3 sem × 1 FTE × 20 RFPs/año = ≈ 2.400 h/año por equipo de bid. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo afirma una certificación que no tenemos (`'cumplimos SOC 2 Type II'`) y firmamos, **declaración falsa** en contrato con consecuencias."*
- *"Si el RFP contiene NDA específico y subo a servicio público para acelerar, ruptura del NDA."*
- *"Si el agente promete SLA o feature de roadmap fuera del oficial, compromiso comercial no autorizado."*

**Riesgos típicos:** declaración falsa de cumplimiento/certificación, ruptura de NDA del prospect, compromiso de roadmap no aprobado, fuga de respuestas previas con info del cliente histórico.

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- NDA estándar, normativa de contratación pública (LCSP en España) si cliente es AAPP. *Citas T1.*
