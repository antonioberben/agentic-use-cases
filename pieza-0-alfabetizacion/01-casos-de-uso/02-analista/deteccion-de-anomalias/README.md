# Detección de anomalías

> **Rol:** analista · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Octubre se disparó. Pierdes una semana buscando por qué. Se busca lista de anomalías con magnitud, fecha, hipótesis técnicas (pipeline, hueco) y de negocio (campaña, evento), ordenadas por probabilidad.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre serie temporal. Prompt: *"Anomalías en esta serie. Para cada una: fecha, magnitud, hipótesis técnica, hipótesis de negocio. Ordena por probabilidad. No inventes causa."*

**Copilot (Power BI / Fabric).** Anomaly detection nativo.

**Claude Code / ChatGPT.** Subes la serie y aplicas el prompt.

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| Warehouse | `mcp-snowflake` etc. | `SELECT` sobre vistas |
| Monitoring (Datadog/New Relic) | `mcp-datadog` | métricas técnicas para correlacionar |

**Alternativa.** Algoritmos clásicos (`prophet`, `isolation forest`) + modelo solo para hipótesis.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-explicación de anomalía | *4-8 h* | *30-60 min* |
| % anomalías con hipótesis verificable | *50%* | *> 80%* |
| Falsos positivos perseguidos | *30%* | *< 10%* |

**Fórmula:** `Ahorro ≈ (TT_base − TT_nuevo) × anomalias_mes × 11`. Ejemplo: 5 h × 6 × 11 ≈ **330 h/año**.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si la hipótesis del agente apunta a un cliente concreto ('cliente X dejó de comprar') y se actúa sin verificar, la decisión comercial se basa en correlación accidental."*
- *"Si el agente cruza la anomalía con datos de RRHH (rotación) para 'explicar' una caída, accede a datos laborales sin necesidad."*
- *"Si la anomalía es financiera y pre-anuncio, su análisis fuera del perímetro es información privilegiada."*

**Riesgos típicos:** decisiones automatizadas sobre cliente, acceso lateral a datos no necesarios, fuga MAR.

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
