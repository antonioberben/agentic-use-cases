# Briefs creativos y de agencia

> **Rol:** marketing · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Briefs a agencia/equipo creativo incompletos generan 3-4 iteraciones. Hoy: 30-60 min de brief, días perdidos en revisiones.

**Cómo resolverlo.**

- *Copilot Word:* template + Copilot estructura.
- *Local:* Ollama con plantilla y stakeholders inputs.
- *Claude Code:* repo `briefs/` con templates por tipo (campaña, landing, evento, asset).
- *MCPs:* `mcp-graph-files` (briefs previos), `mcp-asana` o `mcp-monday` (gestión de proyecto).

**Prompt:** *"Genera brief creativo para [campaña/asset]. Estructura: objetivo de negocio, KPI, audiencia e insight, mensaje único, qué decir y qué NO, deliverables, plazos, restricciones de marca. Marca [REVISAR] lo que requiera validación con stakeholder."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min por brief | 45 | 15 |
| Iteraciones agencia hasta v1 aprobada | 4 | 2 |
| Briefs con KPI definido | 60% | 100% |

*Fórmula:* `(30) min × 80 briefs/año + (10h ahorradas iteración × 80) = 40 + 800 = 840 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el brief incluye estrategia confidencial (lanzamiento no anunciado, M&A) y se sube a herramienta no aprobada, breach.*
- *Si el modelo "rellena" un KPI sin pedírtelo, persigues métrica equivocada.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list y gate humano de validación de stakeholders.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `creative-brief-drafter`: estructura briefs a agencia marcando `[REVISAR]` lo no validado; el stakeholder firma antes de enviarlo a la agencia externa.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Estrategia confidencial (lanzamiento no anunciado, M&A) en brief subido a herramienta no aprobada (breach; MAR si cotizada) | agentgateway + agentregistry | detección `internal-project-codename`/`MNPI` + redaction; sólo MCPs registrados; egress bloqueado a destinos no allowlisted |
| El modelo "rellena" un KPI inventado sin marcarlo | agentevals | rubric que exige `[REVISAR]` en todo dato no aportado por el humano; bloqueo si presenta un KPI fabricado |
| Envío del brief a agencia externa sin validación de stakeholder | agentgateway + kagent (OBO) | `mcp-asana`/`mcp-monday` scope RO/`draft`; el share externo requiere HITL + OBO |
| Claim de marca no aprobado que se propaga a la creatividad (Dir. 2005/29/CE) | agentgateway | prompt guard contra la biblioteca de claims; marca lo no aprobado como `[REVISAR]` |
| Coste por briefs largos con múltiples adjuntos | agentgateway | rate limit por proyecto; semantic caching de plantillas por tipo de brief |

## Referencias

- Reglamento (UE) 596/2014 (MAR) y CNMV si cotizada, Directiva 2005/29/CE (prácticas comerciales desleales). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
