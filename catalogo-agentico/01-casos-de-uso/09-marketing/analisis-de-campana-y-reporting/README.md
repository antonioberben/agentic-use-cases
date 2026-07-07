# Análisis de campaña y *reporting*

> **Rol:** marketing · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Post-mortem de campaña con data de MAP, CRM, ads, web. Hoy: 1-2 días de consolidación + medio día de slides.

**Cómo resolverlo.**

- *Plataformas analytics:* **HubSpot Breeze**, **Marketo Insights**, **GA4 con Gemini**, **Looker Studio con Gemini**, **Adobe Analytics AI Assistant**.
- *Copilot Power BI:* dashboard con Q&A.
- *Claude Code:* repo `campaigns/[id]/` con data exportada agregada.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-ga4` | Tráfico web y conversión |
| `mcp-hubspot` o `mcp-marketo` | Funnel marketing |
| `mcp-salesforce` | Atribución a pipeline |
| `mcp-google-ads` / `mcp-meta-ads` | Performance paid |
| `mcp-slides` | Publicar el post-mortem (escritura, con gate) |

**Prompt:** *"Analiza campaña [X]: KPIs vs objetivo, segmentos con mejor performance, canales con mejor CAC, drop-off en funnel. 3 aprendizajes y 3 hipótesis a testar. NO inventes correlaciones no presentes en los datos."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por post-mortem | 2 | 0,5 |
| % campañas con post-mortem | 50% | 95% |
| Hipótesis re-testadas en siguiente ciclo | 30% | 80% |

*Fórmula:* `(12) h × 30 campañas/año = 360 h/año por marketing ops`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la data del CRM sale a herramienta no aprobada, expones audiencia y conversión.*
- *Si el modelo "infiere" correlaciones falsas, persigues hipótesis equivocadas.*
- *Si conectas con scope amplio al CRM, accedes a datos personales no necesarios para el análisis.*

Cubierto en la **arquitectura de remediación (bloque 5)** con scopes agregados, prohibición de PII en análisis y validación de correlaciones por humano.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `campaign-analyst`: consolida GA4/CRM/ads en un post-mortem de solo lectura; marketing ops firma los aprendizajes antes de que alimenten decisiones de presupuesto.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Correlación espuria presentada como causal que alimenta claims de campaña (Dir. 2005/29/CE) | agentevals | eval con checks deterministas de significancia; el output marca correlación≠causalidad y bloquea el handoff si presenta causalidad sin test |
| Scope amplio al CRM expone PII de contactos innecesaria para el análisis (GDPR art. 5, minimización) | agentgateway | `mcp-salesforce`/`mcp-hubspot` con scope agregado (cohortes/segmentos); redaction de email/teléfono, sin campos a nivel de contacto |
| Métricas de ads con datos personales de audiencias (GDPR, ePrivacy) | agentgateway | `mcp-google-ads`/`mcp-meta-ads` scope `report:read` agregado; prohibido descargar audiencias o listas de remarketing |
| Report usado para decidir presupuesto sin traza del origen del número | agentgateway + agentevals | OTel per-invocation con hash del dataset y query GA4; cada KPI del informe enlaza a la métrica origen |
| Publicación del post-mortem sin sign-off (correlación espuria alimenta presupuesto) | agentgateway + HITL | `mcp-slides` con scope `report:publish` y **gate**: marketing ops firma los aprendizajes antes de publicar/alimentar decisiones de presupuesto |
| Coste por consulta masiva a GA4/warehouse | agentgateway | rate limit por tokens; semantic caching de queries de reporting recurrentes |

## Referencias

- GDPR (art. 5, minimización), Directiva 2005/29/CE (prácticas comerciales desleales), ePrivacy. *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
