# Marketing — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: product marketing, demand generation, content, comunicación, brand, eventos, marketing ops, analytics.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, herramientas, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Adoptar estos casos sin un marco de gobierno significa:

- Bases de contactos (CRM, MAP, eventos) fuera del perímetro — **GDPR**, **LOPDGDD**, **ePrivacy**, LSSI.
- Contenido IA publicado **sin disclosure** cuando es obligatorio (transparencia EU AI Act, prácticas comerciales leales).
- Imágenes, voces o estilos de personas reales sin consentimiento — derechos de imagen, PI, EU AI Act.
- Posicionamiento inventado por el modelo publicado: publicidad engañosa, competencia desleal.
- *Outreach* masivo sin base jurídica, sin checklist exclusión, sin gestión bajas — multas AEPD documentadas.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA**. Antes de conectar un agente al MAP, al CRM o al CMS público, lee la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

Marketing es producción de contenido a volumen, segmentación y medición. La IA acelera producción y segmentación. Lo que no cambia: el criterio sobre lo que la marca dice. Un contenido genérico generado en masa vacía la marca en semanas.

## 2. Ocho casos típicos

Cada caso en cuatro bloques: caso → cómo resolverlo → KPIs → riesgos.

### 2.1 Investigación de audiencia y mensajes

**Caso de uso.** Entender qué le duele al buyer persona antes de escribir nada. Hoy: 1-2 días de research, riesgo de basarse en suposiciones.

**Cómo resolverlo.**

- *Local:* Ollama con RAG sobre transcripts de discovery y entrevistas.
- *Copilot M365:* Copilot Chat con web grounding sobre dominios técnicos del sector.
- *Plataformas con citación:* **Perplexity Deep Research**, **Claude/ChatGPT con búsqueda**, **Sparktoro**, **AnswerThePublic**.
- *Claude Code:* repo `audience/[persona]/` con `AGENTS.md` que prohíbe inventar evidencia.
- *MCPs:*

| MCP | Para qué | Scopes |
|-----|----------|--------|
| `mcp-web-fetch` con allow-list (Reddit, HN, foros sectoriales) | Captura de menciones | dominios públicos |
| `mcp-gong` o `mcp-chorus` | Voz del cliente real | `transcript:read` agregado |
| `mcp-graph-files` | Estudios internos previos | `Files.Read.All` |

- *Alternativa:* Perplexity con prompt directo + 3 entrevistas reales antes de publicar.

**Prompt:** *"Investiga al rol [X] en empresas de [sector y tamaño]. Foros, comunidades, vídeos, papers. Por hallazgo: pain point, evidencia con fuente, frecuencia aparente. No inventes; si la evidencia es débil, dilo."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por research de persona | 5 | 1 |
| Pain points con evidencia citada | 50% | 95% |
| Mensajes con resonancia (test A/B) | medida base | +30% |

*Fórmula:* `(32) h × 6 personas/año = 192 h/año por PMM`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo inventa una estadística "según Gartner X dijo Y", publicas falsedad citada y daño reputacional.*
- *Si el MCP de web-fetch no tiene allow-list, prompt injection desde foro manipulado sesga conclusiones.*
- *Si subes transcripts de cliente con NDA a herramienta no aprobada, breach NDA.*

Cubierto en **Pieza 2** con allow-list de fuentes, validación cita-fuente y allow-list de herramientas NDA-friendly.

### 2.2 Borrador de contenido (blog, post, landing)

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

Cubierto en **Pieza 2** con gate humano editorial, disclosure de uso de IA y allow-list de CMS con workflow de aprobación.

### 2.3 Variantes y *testing* A/B

**Caso de uso.** Generar 6 subject lines, 4 hero copies o 3 versiones de un anuncio para test. Hoy: 1-2 h por brainstorm.

**Cómo resolverlo.**

- *Local:* Ollama para iteración rápida.
- *Copilot M365:* Copilot Chat con guía de estilo.
- *Plataformas:* **Jasper**, **Copy.ai**, **Mutiny** (personalización web), **Persado** (lenguaje optimizado).
- *Claude Code:* repo `variants/` con histórico de variantes ganadoras.
- *MCPs:* `mcp-marketo` o `mcp-hubspot` (variantes en lectura), `mcp-google-ads` o `mcp-meta-ads` (creatividades).

**Prompt:** *"6 variantes de subject line a [audiencia] sobre [tema]. Cada una distinta en ángulo: urgencia, curiosidad, beneficio, dato, pregunta, dolor. Máx 50 caracteres. Sin emojis. Sin clickbait."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por set de variantes | 90 min | 15 min |
| Tests A/B ejecutados/mes | 4 | 12 |
| Lift medio del ganador | +12% | +25% |
| Open rate de email | 18% | 28% |

*Fórmula:* `(75) min × 200 sets/año = 250 h/año por demand gen`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera clickbait que contradice el contenido real, daño reputacional + sanciones de plataformas publicitarias.*
- *Si el test se lanza sin gate, una variante puede contener afirmaciones falsas.*
- *Si los datos del test salen a herramienta no aprobada, expones audiencia y conversión.*

Cubierto en **Pieza 2** con gate humano en lanzamiento, disclosure y allow-list MAP.

### 2.4 Imágenes, vídeos y diseño

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

### 2.5 Briefs creativos y de agencia

**Caso de uso.** Briefs a agencia/equipo creativo incompletos generan 3-4 iteraciones. Hoy: 30-60 min de brief, días perdidos en revisiones.

**Cómo resolverlo.**

- *Copilot Word:* template + Copilot estructura.
- *Local:* Ollama con plantilla y stakeholders inputs.
- *Claude Code:* repo `briefs/` con templates por tipo (campaña, landing, evento, asset).
- *MCPs:* `mcp-graph-files` (briefs previos), `mcp-asana` o `mcp-monday` (gestión de proyecto).

**Prompt:** *"Genera brief creativo para [campaña/asset]. Estructura: objetivo de negocio, KPI, audiencia e insight, mensaje único, qué decir y qué NO, deliverables, plazos, restricciones de marca. Marca [REVISAR] lo que requiera validación con stakeholder."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min por brief | 45 | 15 |
| Iteraciones agencia hasta v1 aprobada | 4 | 2 |
| Briefs con KPI definido | 60% | 100% |

*Fórmula:* `(30) min × 80 briefs/año + (10h ahorradas iteración × 80) = 40 + 800 = 840 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el brief incluye estrategia confidencial (lanzamiento no anunciado, M&A) y se sube a herramienta no aprobada, breach.*
- *Si el modelo "rellena" un KPI sin pedírtelo, persigues métrica equivocada.*

Cubierto en **Pieza 2** con allow-list y gate humano de validación de stakeholders.

### 2.6 SEO y *content gap*

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

### 2.7 Análisis de campaña y *reporting*

**Caso de uso.** Post-mortem de campaña con data de MAP, CRM, ads, web. Hoy: 1-2 días de consolidación + medio día de slides.

**Cómo resolverlo.**

- *Plataformas analytics:* **HubSpot Breeze**, **Marketo Insights**, **GA4 con Gemini**, **Looker Studio con Gemini**, **Adobe Analytics AI Assistant**.
- *Copilot Power BI:* dashboard con Q&A.
- *Claude Code:* repo `campaigns/[id]/` con data exportada agregada.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-ga4` | Tráfico web y conversión |
| `mcp-hubspot` o `mcp-marketo` | Funnel marketing |
| `mcp-salesforce` | Atribución a pipeline |
| `mcp-google-ads` / `mcp-meta-ads` | Performance paid |

**Prompt:** *"Analiza campaña [X]: KPIs vs objetivo, segmentos con mejor performance, canales con mejor CAC, drop-off en funnel. 3 aprendizajes y 3 hipótesis a testar. NO inventes correlaciones no presentes en los datos."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por post-mortem | 2 | 0,5 |
| % campañas con post-mortem | 50% | 95% |
| Hipótesis re-testadas en siguiente ciclo | 30% | 80% |

*Fórmula:* `(12) h × 30 campañas/año = 360 h/año por marketing ops`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la data del CRM sale a herramienta no aprobada, expones audiencia y conversión.*
- *Si el modelo "infiere" correlaciones falsas, persigues hipótesis equivocadas.*
- *Si conectas con scope amplio al CRM, accedes a datos personales no necesarios para el análisis.*

Cubierto en **Pieza 2** con scopes agregados, prohibición de PII en análisis y validación de correlaciones por humano.

### 2.8 Gestión de comunidad y *social listening*

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
