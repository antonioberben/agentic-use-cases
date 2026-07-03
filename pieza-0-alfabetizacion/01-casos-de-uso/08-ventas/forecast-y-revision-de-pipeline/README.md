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

Cubierto en **Pieza 2** con scopes de solo lectura sobre opportunity stage, gate humano en mass-update y perímetro aprobado.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
