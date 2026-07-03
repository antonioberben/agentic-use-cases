# SEO y *content gap*

> **Rol:** marketing · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Entender qué buscan clientes y qué contenido falta. Hoy: research manual con Ahrefs/Semrush + Excel + intuición.

**Cómo resolverlo.**

- *Plataformas SEO con IA:* **Semrush Copilot**, **Ahrefs AI**, **Surfer**, **Clearscope**, **MarketMuse**.
- *Local:* Ollama sobre exports de keywords + content audit.
- *Copilot M365:* Copilot Chat sobre Excel con keyword research.
- *Claude Code:* repo `seo/` con scripts de gap analysis y `AGENTS.md`.
- *MCPs:* `mcp-semrush`, `mcp-ahrefs`, `mcp-ga4` (tráfico orgánico), `mcp-search-console`.

**Prompt:** *"Identifica las 20 keywords más relevantes para [tema] con intent informacional. Por cada una: volumen, dificultad, intent, pregunta del usuario. Marca las que no tenemos contenido publicado."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por content gap analysis | 5 | 1 |
| Posts publicados con keyword research | 50% | 95% |
| Tráfico orgánico (T+6m) | medida base | +40% |
| Posiciones top-10 nuevas/trim | 5 | 20 |

*Fórmula:* `(32) h × 6 análisis/año = 192 h/año por SEO`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera "keywords" inventadas (sin volumen real), pierdes ciclos persiguiendo nada.*
- *Si conectas Google Search Console con scope amplio, expones datos de query del cliente.*

Cubierto en **Pieza 2** con validación cita-fuente y scopes mínimos sobre fuentes oficiales.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
