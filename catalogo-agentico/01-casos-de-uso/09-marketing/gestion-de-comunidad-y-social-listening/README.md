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

Cubierto en la **arquitectura de remediación (bloque 5)** con prohibición técnica de respuesta automática, gate humano y allow-list de proveedores con retención cero.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (clasificación de menciones) + *A7 — Generación creativa con guardrails* (redacción de respuestas), ver [`../../arquetipos.md`](../../arquetipos.md). Agente `community-signal-agent`: clasifica menciones sin responder y redacta respuestas propuestas bajo brand voice; social/comms firman antes de publicar.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Respuesta automática mal calibrada publicada se viraliza | agentgateway + kagent (OBO) | el MCP de publicación social queda **fuera de la allowlist**; el agente sólo redacta en `draft`; publish con HITL + OBO de social |
| PII en menciones/comentarios procesada sin base jurídica (GDPR art. 6/9) | agentgateway | redaction de identificadores antes del LLM; `mcp-brandwatch`/`mcp-sprinklr` scope `mentions:read` agregado |
| Proveedor de social listening retiene datos para entrenamiento (GDPR, contrato) | agentgateway + agentregistry | sólo MCPs de proveedores allowlisted con retención cero; el resto sin identidad SPIFFE ni egress |
| Respuesta que promete compensación/compromiso comercial (Dir. 2005/29/CE) | agentgateway | prompt guard de salida con lista de compromisos prohibidos; escala a humano |
| Falta de disclosure de bot en interacción pública (EU AI Act art. 50) | agentgateway | disclosure obligatorio en respuestas publicadas por canal automatizado |

## Referencias

- GDPR (art. 6/9, base jurídica), Directiva 2005/29/CE (prácticas comerciales desleales), EU AI Act art. 50 (disclosure), LSSI/ePrivacy. *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection).
