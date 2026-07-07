# Borrador de contenido (blog, post, landing)

> **Rol:** marketing · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Página en blanco para post de 1.500 palabras, email de campaña o landing. Hoy: 4-6 horas para primer borrador.

**Cómo resolverlo.**

- *Local:* Ollama con brief + guía de estilo + ejemplos propios.
- *Copilot Word / Outlook:* drafting con brief en SharePoint.
- *Plataformas content:* **Jasper**, **Copy.ai**, **Writer** (con brand voice), **HubSpot AI**, **Marketo AI**.
- *Claude Code:* repo `content/` con `AGENTS.md` incluyendo guía de estilo, tono prohibido y ejemplos canónicos.
- *MCPs:* `mcp-graph-files` (guías de marca, contenido previo), `mcp-confluence` (mensajería aprobada), `mcp-cms-wordpress` o `mcp-contentful` (publicación con gate).

**Prompt:** *"Genera borrador de [formato] para [audiencia]. Mensaje central: [X]. Tono [marca]. Estructura: gancho, problema, propuesta, prueba, CTA. Sin clichés. Cita fuentes externas si las hay; si no, no cites."*

**Test:** léelo en voz alta. Si suena a comunicado corporativo genérico, vuelve atrás.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por borrador | 5 h | 1 h |
| Posts publicados/mes | 4 | 12 |
| Tiempo medio en página | medida base | +25% |
| Tasa de re-trabajo editorial | 40% | 15% |

*Fórmula:* `(4) h × 100 piezas/año = 400 h/año por content writer`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si publicas sin verificar estadísticas, errores en público no se borran y se viralizan.*
- *Si el agente publica directamente en el CMS sin gate, una variante mala llega al público.*
- *Si el contenido se genera sin disclosure y es promocional, posible infracción EU AI Act + prácticas leales.*

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano editorial, disclosure de uso de IA y allow-list de CMS con workflow de aprobación.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `content-drafter`: produce borradores de blog/landing/email en `draft` sobre la guía de estilo; el editor firma antes de publicar en el CMS.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Estadística o cita inventada publicada (Dir. 2005/29/CE, prácticas engañosas) | kagent (A2A) + agentevals | sub-agente verifica cada estadística/cita contra su fuente; `agentevals` bloquea el handoff si `citations_verified < 100%` |
| Falta de disclosure de contenido IA en pieza promocional (EU AI Act art. 50) | agentgateway | disclosure obligatorio en la salida; bloqueo si falta |
| Publicación directa al CMS sin gate editorial | agentgateway + kagent (OBO) | `mcp-cms-wordpress`/`mcp-contentful` scope `content:draft`; `publish` con HITL + OBO editorial |
| Copia de contenido o marca de tercero (infracción PI, competencia desleal) | agentgateway | prompt guard bloquea marcas no autorizadas; detección de plagio contra el corpus publicado |
| Fuga de mensajería confidencial pre-lanzamiento subida como contexto | agentgateway | detección `internal-project-codename` + redaction antes del LLM |

## Referencias

- Directiva 2005/29/CE (prácticas comerciales desleales), EU AI Act art. 50 (disclosure), LSSI/ePrivacy, marca/copyright de terceros. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
