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

Cubierto en la **arquitectura de remediación (bloque 5)** con validación cita-fuente y scopes mínimos sobre fuentes oficiales.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `seo-gap-agent`: sintetiza keyword research y Search Console en gaps de contenido priorizados; el SEO valida antes de planificar contenido.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Keywords inventadas sin volumen real que sostienen claims de tráfico (Dir. 2005/29/CE) | kagent (A2A) + agentevals | validador cruza cada keyword contra `mcp-semrush`/`mcp-ahrefs`; descarta las que no tienen volumen verificable |
| Scope amplio a Search Console expone queries reales del cliente (GDPR, ePrivacy) | agentgateway | `mcp-search-console` scope `searchanalytics:read` agregado; sin datos a nivel de usuario o URL personal |
| Datos de tráfico orgánico con posible PII en parámetros de URL hacia el LLM | agentgateway | `mcp-ga4` scope report agregado; redaction de parámetros de URL con identificadores |
| Egress a APIs SEO no aprobadas | Istio + agentregistry | allowlist de endpoints (Semrush, Ahrefs, GSC); MCP no registrado sin identidad ni egress |
| Coste por análisis de keyword masivo | agentgateway | rate limit por tokens; semantic caching de análisis de gap recurrentes |

## Referencias

- GDPR (minimización), ePrivacy (datos de navegación), Directiva 2005/29/CE (prácticas comerciales desleales). *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
