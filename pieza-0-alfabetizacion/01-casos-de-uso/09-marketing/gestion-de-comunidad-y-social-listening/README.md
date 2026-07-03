# Gestión de comunidad y *social listening*

> **Rol:** marketing · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Menciones, comentarios, reviews y comunidades. Hoy: equipo de social monitoreando manualmente con saturación.

**Cómo resolverlo.**

- *Plataformas:* **Brandwatch con IQ**, **Sprinklr AI**, **Sprout Social AI**, **Hootsuite OwlyWriter**, **Khoros**.
- *Local:* Ollama sobre export de menciones.
- *Claude Code:* repo `social/` con triage rules y `AGENTS.md` que prohíbe respuesta automática.
- *MCPs:* `mcp-brandwatch`, `mcp-sprinklr` (menciones en lectura).

**Prompt:** *"Clasifica menciones por sentimiento, categoría (producto/precio/soporte/competencia), urgencia. Marca las que requieren respuesta personalizada. NO respondas automáticamente."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Menciones clasificadas/día | 200 | 2.000 |
| Tiempo de respuesta a crisis | 4 h | < 30 min |
| % menciones críticas escaladas | 60% | 98% |

*Fórmula:* `(20) h/sem × 48 = 960 h/año por equipo social`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente responde automáticamente, una respuesta mal calibrada se viraliza en horas.*
- *Si analiza datos de usuarios (PII en comentarios) sin base jurídica, infracción GDPR.*
- *Si la plataforma de social listening retiene datos para entrenamiento, breach.*

Cubierto en **Pieza 2** con prohibición técnica de respuesta automática, gate humano y allow-list de proveedores con retención cero.

## 3. MCPs: cómo enchufar tus fuentes al agente

| MCP | Para qué lo usas |
|-----|------------------|
| MAP (HubSpot, Marketo, Pardot, Eloqua) | Audiencias, *nurturing*, métricas de campaña |
| CRM (Salesforce, HubSpot, Dynamics) | Pipeline atribuible, *lead scoring*, ciclo |
| Web Analytics (GA4, Adobe Analytics, Plausible) | Tráfico, conversión, *attribution* |
| CMS (WordPress, Contentful, Sanity, Webflow) | Publicación, biblioteca de contenido |
| Ads (Google Ads, Meta, LinkedIn) | Performance, *creative testing* |
| Social listening (Brandwatch, Sprinklr, Talkwalker) | Menciones, *sentiment*, comunidades |
| DAM / Asset library (Bynder, Frontify, Brandfolder) | Logos, plantillas, guías de marca |
| SEO (Semrush, Ahrefs, Surfer) | *Keyword research*, *gap analysis*, posicionamiento |

**Reglas adicionales para marketing:**

- **Base jurídica del email/SMS.** LSSI + ePrivacy + GDPR. La IA no exime de gestionar bajas, double opt-in cuando aplica, ni de mantener pruebas.
- **Disclosure de contenido IA.** Imágenes, voces y vídeos generados con IA deben etiquetarse cuando hay riesgo de engaño (EU AI Act art. 50). Documentación interna obligatoria.
- **Derechos de imagen y voz.** No clonar personas reales sin consentimiento explícito y documentado.
- **Marca registrada y competencia.** No publiques contenido comparativo apoyado en datos del modelo sin verificar.
- **Datos de contactos.** No subir listas a herramientas no aprobadas.

## 4. Cinco hábitos clave

1. **Verifica antes de publicar.** Datos, estadísticas, citas, nombres. La IA los inventa con seguridad aparente.
2. **Brief antes de prompt.** Si el brief es flojo, el output será flojo.
3. **Una voz, una marca.** Sube guía de estilo y ejemplos propios.
4. **Documenta qué se generó con IA.** Asset, herramienta, prompt aprobado, revisión.
5. **No publiques en bucle.** Marca > volumen.

## 5. Qué evitar

- Publicar contenido sin verificar datos, citas o estadísticas.
- Generar imágenes o vídeos de personas reales sin consentimiento.
- Subir listas de contactos a herramientas no aprobadas para enriquecimiento.
- Campañas de email/SMS apoyadas en IA sin gestión de consentimiento y bajas.
- Comparativas competitivas con datos generados por el modelo sin verificar.
- Sustituir la voz de marca por la voz del modelo.

## 6. Cómo seguir

- Lab base **"asistente al empleado frontline"**: patrón de generación asistida con guardarraíles.
- Lab base **"agente analítico sobre datos"**: patrón de análisis de campaña y SEO (2.6, 2.7).
- Lab base **"generación creativa con control"** (opcional, D11): patrón de imagen, vídeo y creative testing.
- Guías: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
