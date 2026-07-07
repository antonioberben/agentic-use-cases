# Lectura crítica de planes y propuestas

> **Rol:** ejecutivo · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Plan estratégico de unidad, business case que te traen a aprobar, propuesta de inversión. Hoy: lectura amable porque te lo presenta gente de confianza, aprobación con menos escrutinio del que merece.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B. *"Lee crítico del plan. Identifica: hipótesis no explicitadas, sensibilidades no testadas, dependencias críticas, métricas que no defienden el caso si fallan, comparativa con benchmarks razonables. Tono de director general que ha visto fracasar planes parecidos. No reescribas el plan; señala."*
- **Copilot M365:** sobre PDF del business case.
- **Claude Code:** `AGENTS.md` con tu rúbrica de revisión de planes (lo que siempre miras: TAM realista, unit economics, supuestos macro, dependencias técnicas, plan B).
- **MCPs:** `mcp-bi` (Power BI/Tableau MCP) con `vault://exec/bi-ro` y scopes `datasets:read` solo sobre datos públicos internos para benchmarkear, no para reescribir.
- **Alternativa:** Claude con PDF y rúbrica al inicio del prompt.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Hipótesis ocultas detectadas por plan | 1-2 | 5-8 |
| Planes aprobados que descarrilan a 12m | medio | bajo |

Fórmula: *valor en planes evitados (orden 10⁵-10⁶ €/plan descarrilado evitado). (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si comparto el business case (que contiene proyecciones de M&A, mercados que estamos por entrar o costes de unidad) con un servicio no aprobado, filtración estratégica directa. Si el modelo inventa benchmarks de mercado y rechazo el plan en base a ellos, decisión errónea con coste reputacional con el director que lo presentó. Riesgos típicos: filtración estratégica, alucinación de benchmarks, sesgo del modelo a estructura "demasiado optimista" sin contexto sectorial. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-revisor-critico` lee el business case y señala hipótesis, sensibilidades y dependencias; no reescribe, el ejecutivo decide aprobar (HITL).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Filtración estratégica del business case (M&A, mercados a entrar, unit economics) al proveedor (secreto empresarial, Ley 1/2019) | agentgateway | detección `internal-project-codename`/cifras estratégicas + redaction; egress solo al modelo aprobado |
| Alucinación de benchmarks de mercado usados para rechazar el plan | kagent (A2A) + agentevals | sub-agente validador comprueba cada benchmark contra `mcp-bi` (fuente interna); bloquea si no resuelve |
| Sesgo del modelo a marcar todo "demasiado optimista" sin contexto sectorial | agentevals | eval set con planes golden calibra la severidad; el output distingue `señalado` de `descartado` |
| Egress a fuentes de benchmark no aprobadas | Istio | `AuthorizationPolicy` L4 en ztunnel; `mcp-bi` con `datasets:read` solo sobre datos públicos internos, sin escritura |
| Traza de por qué se aprobó/rechazó un plan para gobierno corporativo | agentgateway | OTel per-invocation (hipótesis detectadas, benchmarks citados, decisión del ejecutivo) |

## Referencias

- Secreto empresarial (Ley 1/2019); MAR/CNMV cuando el plan contiene MNPI. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
