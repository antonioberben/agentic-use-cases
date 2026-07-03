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

Cubierto en **Pieza 2** con scopes agregados, prohibición de PII en análisis y validación de correlaciones por humano.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
