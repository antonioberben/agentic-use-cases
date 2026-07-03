# T14 — Generación y mantenimiento de KB de soporte

## Identificación

- **Rol principal**: knowledge manager, soporte L2/L3.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 1 (analítico) + Lab 5 (frontline).
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de auto-publicar KB pública.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

La KB envejece: tickets resueltos no se convierten en artículos, lo que sí está se desactualiza. El agente analiza tickets cerrados, detecta gaps (tickets recurrentes sin artículo), propone artículo nuevo o actualización del existente. El humano revisa y publica.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre export tickets últimos 90 días + KB actual. Prompt: *"Detecta los 10 temas con más tickets sin artículo en KB. Para cada uno: título sugerido, problema, pasos de resolución (extraídos de tickets exitosos), categoría. **Cita los IDs de ticket de origen.**"*

### 2.2 Copilot

Copilot for Service / Dynamics 365 KB AI.

### 2.3 Claude Code

Repo `kb/` con `AGENTS.md` que fija plantilla de artículo, prohíbe publicar (solo PR a la KB).

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-zendesk` | Zendesk MCP | `vault://support/kb-rw` | `tickets:read,kb:draft` (nunca `kb:publish`) |
| `mcp-confluence` | Atlassian MCP | `vault://support/conf-draft` | `pages:draft` |

### 2.5 Alternativas

Glean, Stack AI con conector a tickets.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Cobertura KB sobre tickets | 60% | 90% |
| Tiempo a artículo nuevo | 1 sem | 1 día |
| % tickets resueltos por self-service | 20% | 40% |
| Deflexión (tickets evitados) | base | +30-50% |

Fórmula: *deflexión × coste medio ticket = ahorro directo. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si los tickets contienen datos del cliente y el agente cita el ticket directamente en KB pública, fuga de PII."*
- *"Si el agente publica directamente (scope `publish`), artículo erróneo llega a la cara pública del cliente."*
- *"Si el modelo extrae 'solución' de un ticket que tuvo workaround temporal, KB enseña mala práctica como oficial."*

**Riesgos típicos:** fuga de PII en cita de ticket, auto-publicación, KB con workarounds como solución oficial.

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR (PII en tickets), ISO/IEC 27001 (gestión del conocimiento). *Citas T1.*
