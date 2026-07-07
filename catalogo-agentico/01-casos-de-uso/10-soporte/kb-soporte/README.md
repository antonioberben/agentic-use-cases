# T14 — Generación y mantenimiento de KB de soporte

## Identificación

- **Rol principal**: knowledge manager, soporte L2/L3.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 1 (analítico) + Lab 5 (frontline).
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de auto-publicar KB pública.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `kb-builder` detecta gaps de KB sobre tickets cerrados y propone artículo nuevo o actualización; el knowledge manager revisa y publica (PR).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| PII del cliente citada literalmente en KB pública (GDPR) | agentgateway | detección y redaction de PII antes de componer el artículo; `mcp-zendesk` con `kb:draft`, nunca `kb:publish` |
| Auto-publicación de artículo no revisado | agentgateway + kagent (OBO) | scope `kb:draft`/`pages:draft`; el `publish` requiere HITL y OBO del knowledge manager |
| Workaround temporal extraído como solución oficial | kagent (A2A) + agentevals | validador contrasta los pasos contra tickets con cierre verificado; agentevals bloquea si el origen no está resuelto |
| Cita de tickets no rastreable para auditoría | agentgateway | OTel per-invocation con los IDs de ticket de origen de cada artículo |

## Referencias

- GDPR (PII en tickets), ISO/IEC 27001 (gestión del conocimiento). *Citas T1.*
