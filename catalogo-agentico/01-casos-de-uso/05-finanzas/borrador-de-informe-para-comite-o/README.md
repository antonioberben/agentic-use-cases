# Borrador de informe para comité o auditoría

> **Rol:** finanzas · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 10 páginas de informe trimestral o nota técnica al auditor, en el último día. Cifras ya calculadas, falta narrarlas con tono adecuado.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre KPIs cerrados en CSV. Genera estructura y prosa; tú validas cifras.
- *Copilot Word / PowerPoint:* tabla de KPIs en Excel + Copilot redactando narrativa en Word. Cada cifra cita su celda fuente.
- *Claude Code:* repo `reports/` con template del informe y un `AGENTS.md` con el tono (comité vs auditor).
- *MCPs:* `mcp-graph-files` (papeles de trabajo), `mcp-confluence` (informes anteriores).
- *Alternativa:* prompt en Claude/ChatGPT con cifras ya públicas o redondeadas.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas para primer borrador | 8 h | 2 h |
| Iteraciones hasta firma | 5 | 2-3 |
| Cifras con cita-fuente | 60% | 100% |

*Fórmula:* `(8 − 2) h × 4 trim = 24 h/año por controller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" una cifra que no le diste, firmas un informe con datos inventados.* Riesgo de auditoría y, en cotizadas, de mercado.
- *Si el borrador del trimestre se sube a una herramienta no aprobada antes de publicación, MNPI fuera del perímetro → MAR/CNMV.*
- *Si el agente escribe directamente en SharePoint compartido con auditoría externa, mezclas borradores con final.*

Cubierto en la **arquitectura de remediación (bloque 5)** con perímetro de herramientas aprobadas pre-publicación, identidad del agente y workflow de aprobación.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `committee-report-writer` narra KPIs ya cerrados desde los papeles de trabajo y un segundo agente `figure-checker` valida vía A2A que cada cifra del texto resuelva a una celda fuente antes del handoff. La publicación la firma el controller.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| El modelo "rellena" una cifra no aportada → informe firmado con dato inventado | kagent (A2A) + agentevals | `figure-checker` casa cada número de la prosa contra la celda de `mcp-graph-files`; `agentevals` bloquea el handoff si `figures_traced < 100%` |
| Borrador del trimestre (MNPI) sube a herramienta no aprobada antes de publicar (**MAR/CNMV**) | agentregistry + Istio | sólo MCPs registrados obtienen egress; ztunnel deniega salida a LLM públicos; el borrador nunca abandona el perímetro pre-publicación |
| Escritura directa en SharePoint compartido con auditoría externa mezcla borrador y final | agentgateway + kagent (OBO) | `mcp-graph-files` con scope `draft/` para el agente; mover a la carpeta de auditoría requiere HITL + OBO del controller |
| Narrativa con tono equivocado (comité vs auditor) filtra juicio no revisado | agentgateway | prompt guard de salida con lista de afirmaciones prohibidas sin respaldo (previsiones, opiniones de going concern); marca para revisión humana |

## Referencias

- MAR/CNMV (información privilegiada), SOX, normativa ICAC. *Citas T1.*
- Marco técnico: OWASP LLM09 (overreliance).
