# Traducción y adaptación cultural

> **Rol:** soporte · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Atender en idiomas en los que el equipo no es nativo. Traducir manteniendo términos técnicos del producto y tono formal/informal según costumbre local.

**Cómo resolverlo.**

- *Plataformas con traducción + glosario:* **DeepL** (mejor calidad técnica), **Smartling**, **Lokalise**, **Zendesk AI traduce automático**.
- *Local:* Ollama + glosario de términos del producto.
- *Copilot M365:* Copilot Chat con traducción + glosario en SharePoint.
- *Claude Code:* repo `i18n/` con glosario y memoria de traducción.
- *MCPs:* `mcp-deepl`, `mcp-graph-files` (glosario corporativo).

**Prompt:** *"Traduce esta respuesta a [idioma]. Mantén términos técnicos en forma habitual del producto. Tono formal/informal según costumbre local. Si una frase no traduce bien, propón alternativa."*

Cuidado: traducción literal pierde matiz contractual. Para compromisos legales en idiomas críticos, revisión humana nativa.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Idiomas cubiertos | 3 | 12+ |
| Tiempo extra por idioma no nativo | +40% | +5% |
| CSAT en idiomas no nativos | 6/10 | 8/10 |
| % errores de traducción técnica | 15% | < 3% |

*Fórmula:* `(20) min × 30 tickets/sem × 48 = 480 h/año por equipo de soporte multilingüe`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la traducción altera un compromiso contractual ("we will" vs "we may"), riesgo legal.*
- *Si el glosario contiene términos confidenciales (nombres internos, código de producto), expones a herramienta no aprobada.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de traductores con DPA, glosario en perímetro aprobado y revisión humana para compromisos.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `traductor-soporte` traduce respuestas al idioma del cliente manteniendo la terminología del producto; los compromisos contractuales van a revisión humana nativa y el envío al cliente sale por `mcp-reply` (`reply:send`) con gate HITL.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| La traducción altera un compromiso contractual ("we will" vs "we may") | agentgateway + kagent | prompt guard de salida marca segmentos con verbos de obligación; ruteo a revisión humana nativa antes de usarlos en compromisos |
| Términos confidenciales del glosario (nombres internos, código de producto) al traductor externo (GDPR) | agentgateway | `mcp-deepl` con allowlist y DPA; detección `internal-codename` + redaction; glosario en `mcp-graph-files` RO en perímetro aprobado |
| Traducción técnica errónea presentada como válida | kagent (A2A) + agentevals | validador contra memoria de traducción/glosario; agentevals bloquea si diverge del término aprobado |
| Coste por volumen multilingüe | agentgateway | semantic caching de segmentos repetidos; rate limit por equipo |

## Referencias

- GDPR (términos confidenciales), normativa de protección del consumidor. *Citas T1.*
- Marco técnico: OWASP LLM06 (Divulgación de información sensible).
