# SP02 — Respuesta a RFP / cuestionario

## Identificación

- **Rol principal**: sales engineer, bid manager, proposal writer.
- **Sectores**: servicios profesionales, software, integradores.
- **Patrón técnico**: Lab 5 — frontline + Lab 1 — analítico.
- **Madurez recomendada**: nivel 1 piloto; nivel 3 antes de enviar respuesta firmada.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `rfp-responder` busca en el repositorio de respuestas previas y el trust center, propone respuesta con cita y marca `[REVISAR]`; un validador comprueba cada afirmación de cumplimiento antes de que legal/seguridad firmen el envío.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Certificación afirmada que no se tiene ("cumplimos SOC 2 Type II") → declaración falsa en contrato | kagent (A2A) + agentevals | validador cruza cada claim de compliance contra `mcp-trust-center` (`controls:read`); `agentevals` bloquea el handoff si el control no está vigente |
| Compromiso de SLA o feature de roadmap fuera del oficial | agentgateway + kagent (OBO) | scope RO sobre `mcp-loopio`/`mcp-confluence`; toda respuesta sobre compromisos nuevos se marca `[REVISAR]` y exige HITL + OBO de producto/legal |
| RFP con NDA del prospect subido a servicio público | agentgateway + agentregistry | allow-list de MCPs registrados; el contenido del RFP no puede salir a destinos fuera del perímetro; redaction de datos del prospect |
| Fuga de respuestas previas con información de clientes históricos | agentgateway | `mcp-loopio` con scope `answers:read,library:read`; detección y redaction de nombres de cliente histórico antes del request |
| Coste en RFPs de 200-1.500 preguntas | agentgateway | rate limit por RFP y semantic caching de respuestas boilerplate reutilizadas |

## Referencias

- NDA estándar, normativa de contratación pública (LCSP en España) si cliente es AAPP. *Citas T1.*
