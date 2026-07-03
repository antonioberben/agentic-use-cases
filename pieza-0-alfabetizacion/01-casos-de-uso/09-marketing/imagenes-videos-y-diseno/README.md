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

Cubierto en **Pieza 2** con allow-list de herramientas por licencia comercial, registro de disclosure obligatorio y consent management de personas representadas.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
