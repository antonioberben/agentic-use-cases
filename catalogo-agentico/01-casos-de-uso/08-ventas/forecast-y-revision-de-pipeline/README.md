# Forecast y revisión de pipeline

> **Rol:** ventas · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Sesión semanal con manager defendiendo cada oportunidad. Hoy: Excel exportado + memoria, sin sistemática.

**Cómo resolverlo.**

- *Plataformas con forecast IA:* **Clari**, **Gong Forecast**, **InsightSquared**, **Salesforce Einstein**, **HubSpot AI**. Forecast asistido + risk scoring.
- *Copilot M365 + Power BI:* dashboard del pipeline + Copilot Q&A.
- *Claude Code:* repo `pipeline/` con extracts CSV. *"Para cada oportunidad: estado, días en etapa, último next step, fecha último contacto. Marca: sin next step, > 30 días en etapa, cierre previsto este Q sin actividad en 2 semanas. NO reasignes probabilidad; señala riesgos."*
- *MCPs:* `mcp-salesforce` o `mcp-hubspot` (oportunidades en lectura), `mcp-gong` (señales conversacionales).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo prep pipeline review | 90 min | 20 min |
| Forecast accuracy | ±20% | ±7% |
| Deals "rescatados" por alerta temprana | medida base | +25% |
| Tasa de slippage de Q | 30% | 12% |

*Fórmula:* `(70) min × 48 sem = 56 h/año por AE`. Para 50 AEs: `2 800 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente reasigna probabilidad automáticamente, sesga el forecast y el comp model.*
- *Si el extract de pipeline sale a herramienta no aprobada, expones ARR, descuentos y churn risk.*
- *Si el modelo "decide" cerrar oportunidades en CRM, contaminas la fuente única.*

Cubierto en la **arquitectura de remediación (bloque 5)** con scopes de solo lectura sobre opportunity stage, gate humano en mass-update y perímetro aprobado.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `pipeline-risk-scanner` lee el pipeline en solo lectura (`mcp-salesforce`/`mcp-hubspot`, `mcp-gong`) y señala riesgos (sin next step, >30 días en etapa, cierre sin actividad); un validador `figure-validator` (A2A) cuadra las cifras del forecast antes de proponerlas. **Nunca reasigna probabilidad ni cierra oportunidades** — solo propone; cualquier `forecast:write` exige HITL y OBO del AE.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Reasignación automática de probabilidad que sesga forecast y comp model | agentgateway + kagent (OBO) | `mcp-salesforce`/`mcp-hubspot` con scope `opportunities:read`; cualquier `stage/probability write` exige HITL y OBO del AE |
| Cierre de oportunidades en CRM por el agente (contamina la fuente única) | agentgateway | `opportunity:update` fuera de la allowlist; el agente escribe solo en una carpeta de propuestas revisable |
| Extract del pipeline (ARR, descuentos, churn risk) fuera del perímetro aprobado | agentgateway + Istio | redaction de importes por bucket antes del request; `AuthorizationPolicy` L4 bloquea egress a destinos no aprobados |
| Mass-update sin gate humano | agentgateway + kagent (OBO) | toda mutación en lote requiere HITL por lote y firma OBO; sin escritura masiva automática |
| Consulta cara/masiva al warehouse dispara factura cloud | agentgateway | rate limit por tokens y semantic caching de queries de pipeline repetitivas |

## Referencias

- Control interno sobre forecast y comp model (segregación de funciones). *Citas T1.*
- Marco técnico: OWASP LLM08 (Excessive Agency).
