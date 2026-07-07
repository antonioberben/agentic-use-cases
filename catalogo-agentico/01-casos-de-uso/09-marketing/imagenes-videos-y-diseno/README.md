# Imágenes, vídeos y diseño

> **Rol:** marketing · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Imagen del post, banner del evento, thumbnail, slide del deck. Hoy: brief a agencia con 5-10 días de turnaround.

**Cómo resolverlo.**

- *Imágenes:* **Adobe Firefly** (mejor licencia comercial), **Midjourney**, **DALL·E** (vía ChatGPT), **Imagen** (Google). Prompts sin clones de personas reales.
- *Vídeo corto:* **Runway**, **Pika**, **Sora**, **Adobe Premiere con IA**.
- *Diseño / slides:* **Adobe Express AI**, **Canva Magic Studio**, **Gamma**, **Beautiful.ai**.
- *Branding consistente:* fine-tunes aprobados o style transfer con guía de marca.
- *MCPs:* `mcp-bynder` o `mcp-frontify` (DAM), `mcp-graph-files` (templates), `mcp-adobe-express` (workflows).

**Verificación obligatoria:** licencia del output, documentación interna de qué herramienta generó qué activo.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por asset visual | 7 | 1 |
| Coste/asset (€) | 150-500 | 5-30 |
| % assets con licencia comercial verificada | desconocido | 100% |
| % assets con disclosure IA | 0% | 100% (donde aplica) |

*Fórmula:* `(€350 × 200 assets/año) − (€20 × 200) = €66 000/año ahorro por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si generas la imagen de un empleado/cliente real sin consentimiento, infracción derechos de imagen.*
- *Si publicas sin disclosure cuando el contenido podría engañar (EU AI Act art. 50), infracción.*
- *Si usas Midjourney sin licencia comercial adecuada, riesgo PI.*
- *Si el agente publica al CMS sin gate, asset no aprobado va al público.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de herramientas por licencia comercial, registro de disclosure obligatorio y consent management de personas representadas.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `visual-asset-generator`: genera imágenes/vídeo/slides en `draft` con licencia verificada; comms/legal firman antes de publicar.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Imagen de empleado/cliente real sin consentimiento (derechos de imagen; GDPR art. 9, datos biométricos) | agentgateway | prompt guard bloquea nombres/rostros de personas reales; consent check obligatorio antes de generar |
| Falta de disclosure de contenido IA que puede engañar (EU AI Act art. 50) | agentgateway | watermark + metadata C2PA embebida; `publish` sin C2PA bloqueado |
| Herramienta sin licencia comercial adecuada (infracción PI) | agentgateway + agentregistry | allowlist de generadores por licencia (p.ej. Firefly commercial); los no registrados sin identidad ni egress; registro de qué herramienta generó cada asset |
| Marca/logo de tercero reproducido en el visual (marca registrada) | agentgateway | prompt guard bloquea marcas no autorizadas en el prompt de generación |
| Publicación al CMS/DAM sin gate | agentgateway + kagent (OBO) | `mcp-bynder`/`mcp-frontify` scope `draft`; `publish` con HITL + OBO comms/legal |

## Referencias

- EU AI Act art. 50 (disclosure), C2PA (procedencia de contenido), derechos de imagen y GDPR art. 9, marca/copyright de terceros. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
