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

Cubierto en **Pieza 2** con allow-list de traductores con DPA, glosario en perímetro aprobado y revisión humana para compromisos.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
