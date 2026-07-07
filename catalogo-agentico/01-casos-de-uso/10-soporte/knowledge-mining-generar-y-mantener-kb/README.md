# *Knowledge mining*: generar y mantener KB

> **Rol:** soporte · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** KB nunca al día. Tickets se resuelven 200 veces sin documentarse. Conocimiento en cabezas, no en sistema.

**Cómo resolverlo.**

- *Local:* Ollama sobre export de tickets resueltos último trimestre.
- *Copilot M365:* sobre cola de tickets en Excel.
- *Plataformas con knowledge mining:* **Guru AI Knowledge Sync**, **Document360 AI Article Generator**, **Zendesk Content Cues**.
- *Claude Code:* repo `kb-mining/` con scripts y `AGENTS.md` con criterios de cobertura.
- *MCPs:* `mcp-zendesk` o `mcp-salesforce-sc` (tickets cerrados, lectura), `mcp-guru` o `mcp-confluence` (publicación con gate).

**Prompt:** *"Identifica 10 patrones de incidente recurrentes NO en la KB. Por cada uno: síntoma, causa frecuente, pasos de resolución, criterios de cierre. Marca [VALIDAR] lo que requiera revisión de producto."*

Periodicidad: mensual o por sprint.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Artículos KB nuevos/mes | 2-3 | 15-20 |
| % volumen cubierto por KB | 50% | 85% |
| Deflection rate (sin agente) | 15% | 35% |
| Tiempo de creación de artículo | 2 h | 25 min |

*Fórmula:* `(95) min × 15 artículos/mes × 12 = 285 h/año por content manager`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si publicas un artículo que el modelo "redondea" con un paso inventado, agentes lo aplican como verdad.*
- *Si la KB pasa a entrenar el modelo del proveedor sin DPA, expones procedimientos internos.*
- *Si el agente publica directamente sin gate, artículo no revisado va a producción.*

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano de publicación, allow-list con DPA y revisión de producto obligatoria para artículos técnicos.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `kb-miner` extrae patrones recurrentes de tickets resueltos y propone artículos nuevos; la publicación pasa por gate humano y revisión de producto.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Paso inventado ("redondeo" del modelo) publicado como verdad | kagent (A2A) + agentevals | validador contrasta cada paso contra los tickets de origen; agentevals bloquea el handoff si no verifica |
| La KB entrena el modelo del proveedor sin DPA | agentgateway | allowlist de proveedores con retención cero/DPA; egress a destinos no aprobados bloqueado por Istio |
| Auto-publicación sin gate ni revisión de producto | agentgateway + kagent (OBO) | `mcp-guru`/`mcp-confluence` con scope `draft`; `publish` requiere HITL + OBO; artículos técnicos exigen revisión de producto |
| Procedimientos internos expuestos en el brief al LLM (GDPR) | agentgateway | detección `internal-procedure` + redaction antes del request |

## Referencias

- GDPR (PII en tickets), ISO/IEC 27001 (gestión del conocimiento). *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
