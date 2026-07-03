# Ventas — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: AE, SDR/BDR, sales engineer, customer success, sales ops, channel manager. Perfil con manejo intensivo de CRM, llamadas, propuestas y forecast.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, herramientas, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Adoptar estos casos sin un marco de gobierno significa:

- Datos de clientes y prospectos (contactos, conversaciones, pipeline, precios negociados) saliendo del perímetro — incumplimiento **GDPR**, **LOPDGDD** y NDA del cliente.
- Grabaciones procesadas sin consentimiento informado o sin las bases del **EU AI Act** sobre sistemas que analizan habla/biometría.
- Información comercial del cliente bajo NDA cargada a un modelo público que la retiene.
- Lead scoring que escala a "decisión automatizada" sin garantías (art. 22 GDPR, alto riesgo EU AI Act).
- Coste de tokens descontrolado en *outreach* asistido por IA.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA**. Antes de conectar un agente al CRM o a tus llamadas, lee la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

El trabajo de ventas es ciclos largos con mucho contexto disperso: discovery, propuestas, follow-ups, forecast, QBRs. La IA junta el contexto y acelera la salida escrita. Lo que no cambia: la relación con el cliente. La IA no negocia ni firma. Y el cliente nota la diferencia entre un correo personalizado y un *spray and pray*.

## 2. Ocho casos típicos

Cada caso en cuatro bloques: caso → cómo resolverlo → KPIs → riesgos.

### 2.1 Investigación de cuenta antes de la primera reunión

**Caso de uso.** 2 horas leyendo web del cliente, últimos resultados, prensa, LinkedIn antes de un first meeting. Salida: una página con contexto, dolor probable y nombres clave.

**Cómo resolverlo.**

- *Local:* Ollama con RAG sobre PDFs descargados (cuentas anuales, presentaciones investor).
- *Copilot M365:* Copilot Chat con web grounding. *"Resume [empresa]: modelo de negocio, segmentos, últimos resultados con fuente, hitos del año, C-level relevante. Cita cada dato con URL. Si no tienes fuente, dilo."*
- *Claude Code:* repo `cuentas/[acme]/` con `AGENTS.md` que prohíbe inventar cifras.
- *Plataformas:* **6sense AI**, **Clay**, **Apollo.io AI**, **Common Room**, **Crystal Knows**. Investigación con citación: **Perplexity**, **Claude/ChatGPT con búsqueda**.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-salesforce` | `npx mcp-salesforce`, `vault://sfdc/ae-ro` | `account:read`, `contact:read` |
| `mcp-zoominfo` o `mcp-apollo` | oficial | `contact:read`, `firmographic:read` |
| `mcp-web-fetch` con allow-list | local | dominios públicos del cliente, prensa |

```json
{
  "mcpServers": {
    "salesforce": { "command": "npx", "args": ["mcp-salesforce"], "env": { "SF_USER": "svc-ae-ro" } }
  }
}
```

- *Alternativa:* Claude.ai con PDFs adjuntos manualmente.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo prep cuenta | 120 min | 30 min |
| Cobertura datos verificables | 60% | 95% |
| Conversión first meeting → next step | 40% | 60% |
| Cuentas investigadas/semana | 5 | 15 |

*Fórmula:* `(90) min × 200 cuentas/año = 300 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si trabajo desde Copilot y conecto un MCP web sin allow-list, prompt injection desde una web del cliente compromete el contexto.*
- *Si cito una cifra inventada por el modelo ("vi que crecisteis un 30%"), pierdo credibilidad en 5 segundos.*
- *Si el MCP de Salesforce usa mi token personal y no `svc-ae-ro`, no hay traza segregada del agente.*

Cubierto en **Pieza 2** con allow-list de fuentes, identidad de agente, validación cita-fuente obligatoria y prohibición de cifras sin URL.

### 2.2 Resumen y *next steps* de llamadas

**Caso de uso.** 30 llamadas/semana cuyas notas nunca llegan al CRM. Información perdida, follow-ups olvidados, manager sin visibilidad.

**Cómo resolverlo.**

- *Plataformas nativas (la vía principal):* **Gong**, **Chorus**, **Avoma**, **Fireflies**, **Clari Copilot**. Resumen automático, detección de objeciones, *next steps*.
- *Teams / Zoom con Copilot / AI Companion:* transcripción + resumen + acciones. Atención al consentimiento (España/UE: aviso previo y derecho a oponerse).
- *Local:* Granola u Otter para captura local; después prompt sobre transcript: *"Extrae dolor del cliente, próximos pasos con responsable y fecha, objeciones, decisores mencionados, competencia. No inventes acuerdos no verbalizados."*
- *Claude Code:* repo `llamadas/` con transcripts; el agente genera el resumen y propone update CRM como diff.
- *MCPs:* `mcp-gong` o `mcp-chorus` (transcripts y *insights* en lectura), `mcp-salesforce` (update con gate humano), `mcp-graph-teams` (transcripciones).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| % llamadas con resumen en CRM | 30% | 95% |
| Tiempo de update post-llamada | 15 min | 2 min |
| Next steps con responsable y fecha | 50% | 100% |
| Forecast accuracy (Q-end) | ±15% | ±5% |

*Fórmula:* `(13) min × 30 llamadas/sem × 48 = 312 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si grabo sin consentimiento, infracción GDPR + LOPDGDD + posible nulidad de la prueba si hay disputa.*
- *Si subo transcript a chat genérico, expongo contenido cubierto por NDA del cliente.*
- *Si el agente tiene `update:write` sobre Salesforce y registra mal un compromiso del cliente, contaminas la fuente única del pipeline.*

Cubierto en **Pieza 2** con consentimiento gestionado por la plataforma, allow-list de proveedores con cláusulas NDA-friendly, gate humano antes de update y identidad propia del agente.

### 2.3 Borrador de correo personalizado de seguimiento

**Caso de uso.** Correo post-meeting a las 21h con prisa. Hoy: genérico o con detalles olvidados.

**Cómo resolverlo.**

- *Local:* Ollama con notas del meeting + propuesta de valor + next step.
- *Copilot Outlook:* notas en OneNote + Copilot drafting en Outlook. *"Redacta correo seguimiento. Tono profesional cercano. Estructura: agradecimiento concreto, recap 3 puntos clave, próximos pasos con fecha, pregunta de cierre. Sin marketing-speak. Sin 'esperando con interés'."*
- *Claude Code:* repo `outreach/` con plantillas por persona y `AGENTS.md` con estilo del AE.
- *Plataformas sales engagement:* **Outreach**, **Salesloft**, **Apollo**, **Lavender**. Con AI nativa para personalización 1:1.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-graph-mail` | Histórico de correos con el cliente (lectura), draft (NO `Send`) |
| `mcp-salesforce` | Notas de meeting y contexto |
| `mcp-gong` | Recap del meeting |

Scope crítico: `Mail.ReadWrite` (draft), NUNCA `Mail.Send` automático.

- *Alternativa:* Claude.ai con notas y plantilla pegadas.

**Test:** si el correo podría enviarse a cualquier cliente, no es personalizado. Vuelve atrás.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por correo seguimiento | 20 min | 5 min |
| Tasa de respuesta | 25% | 45% |
| Correos enviados < 24h post-meeting | 50% | 95% |

*Fórmula:* `(15) min × 30 correos/sem × 48 = 360 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene `Mail.Send` automático, envía un borrador no revisado con tu firma.*
- *Si las notas del meeting incluyen NDA y se procesan en herramienta no aprobada, breach contractual.*
- *Si el modelo "rellena" un compromiso del cliente que no diste ("según comentaste, comprarás 100 licencias"), contradicción legal del cliente.*

Cubierto en **Pieza 2** con scope `Mail.ReadWrite` sin `Send`, gate humano y allow-list de herramientas para datos NDA.

### 2.4 Preparación de QBR / business review

**Caso de uso.** 15 slides del QBR trimestral. Datos de uso, casos abiertos, NPS, roadmap. Hoy: recopilación manual de 8 fuentes en 6 horas.

**Cómo resolverlo.**

- *Copilot PowerPoint:* tabla de KPIs en Excel + Copilot redacta narrative.
- *Claude Code:* repo `qbr/[cliente]/` con datos exportados y plantilla.
- *Local:* Ollama sobre data extract anonimizado.
- *Plataformas CS:* **Gainsight AI**, **ChurnZero AI**, **Catalyst** generan QBR templates.
- *MCPs:* `mcp-salesforce` (oportunidades, casos), `mcp-zendesk` o `mcp-jira-servicedesk` (incidencias del cliente), `mcp-product-analytics` (uso real).

**Prompt:** *"Genera estructura QBR 10 slides: estado relación, valor entregado este trimestre (cifras), incidencias y resolución, plan próximo trimestre, peticiones pendientes, riesgos. Tono ejecutivo. Marca [DATO PENDIENTE] lo que rellene manualmente."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por QBR | 6 h | 1,5 h |
| % QBRs entregados a tiempo | 70% | 95% |
| NRR de cuentas con QBR ejecutado | medida base | +10pp |

*Fórmula:* `(4,5) h × 8 cuentas × 4 trim = 144 h/año por CSM`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si compartes el QBR pre-publicación a herramienta no aprobada, expones métricas internas del cliente.*
- *Si el modelo "inventa" un valor entregado, el QBR pierde credibilidad y pone en riesgo la renovación.*
- *Si el agente accede al sistema del cliente con tu usuario, no hay segregación.*

Cubierto en **Pieza 2** con identidad propia, allow-list NDA-friendly y validación cita-fuente.

### 2.5 Forecast y revisión de pipeline

**Caso de uso.** Sesión semanal con manager defendiendo cada oportunidad. Hoy: Excel exportado + memoria, sin sistemática.

**Cómo resolverlo.**

- *Plataformas con forecast IA:* **Clari**, **Gong Forecast**, **InsightSquared**, **Salesforce Einstein**, **HubSpot AI**. Forecast asistido + risk scoring.
- *Copilot M365 + Power BI:* dashboard del pipeline + Copilot Q&A.
- *Claude Code:* repo `pipeline/` con extracts CSV. *"Para cada oportunidad: estado, días en etapa, último next step, fecha último contacto. Marca: sin next step, > 30 días en etapa, cierre previsto este Q sin actividad en 2 semanas. NO reasignes probabilidad; señala riesgos."*
- *MCPs:* `mcp-salesforce` o `mcp-hubspot` (oportunidades en lectura), `mcp-gong` (señales conversacionales).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo prep pipeline review | 90 min | 20 min |
| Forecast accuracy | ±20% | ±7% |
| Deals "rescatados" por alerta temprana | medida base | +25% |
| Tasa de slippage de Q | 30% | 12% |

*Fórmula:* `(70) min × 48 sem = 56 h/año por AE`. Para 50 AEs: `2 800 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente reasigna probabilidad automáticamente, sesga el forecast y el comp model.*
- *Si el extract de pipeline sale a herramienta no aprobada, expones ARR, descuentos y churn risk.*
- *Si el modelo "decide" cerrar oportunidades en CRM, contaminas la fuente única.*

Cubierto en **Pieza 2** con scopes de solo lectura sobre opportunity stage, gate humano en mass-update y perímetro aprobado.

### 2.6 Respuesta a RFP / cuestionarios de seguridad

**Caso de uso.** 200 preguntas del cuestionario del cliente, ya respondidas cinco veces con palabras distintas. Hoy: semana entera del SE + product + security + legal.

**Cómo resolverlo.**

- *Plataformas RFP con IA (la vía principal):* **Loopio**, **Responsive (antes RFPIO)**, **DealHub**, **Vendorful**. Repositorio de respuestas aprobadas + búsqueda IA.
- *Copilot M365:* Copilot Chat sobre SharePoint con respuestas previas.
- *Claude Code:* repo `rfp-library/` con respuestas aprobadas; agente busca match más reciente.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-loopio` o `mcp-responsive` | Repositorio aprobado |
| `mcp-graph-files` | SharePoint con respuestas legacy |
| `mcp-confluence` | Documentación técnica de producto |

**Prompt:** *"Para cada pregunta, busca respuesta más reciente y aprobada en el repositorio. Si no hay match exacto, propone borrador [BORRADOR] señalando gap. NO combines respuestas de productos distintos."*

**Revisión final:** seguridad, legal y producto firman el cuestionario. NO el modelo.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por RFP | 5 | 1 |
| % preguntas con respuesta automática (revisada) | 30% | 70% |
| Tasa de win rate post-RFP | medida base | +10pp |
| Errores factuales detectados en revisión | 5% | < 1% |

*Fórmula:* `(4 días × 8h × 4 personas) × 30 RFPs/año = 3 840 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo combina respuestas de productos distintos, comprometes funcionalidad y SLA.*
- *Si el repositorio incluye respuestas no actualizadas (CVE parcheada, certificación renovada), firmas obsoleto.*
- *Si el RFP del cliente tiene contenido NDA y se procesa en chat genérico, breach NDA.*
- *Si el agente firma/envía sin gate, infringes política de aprobación interna.*

Cubierto en **Pieza 2** con allow-list de plataformas RFP, gate humano de seguridad/legal/producto y validación de freshness.

### 2.7 *Talk track* y simulación de objeciones

**Caso de uso.** Llamada difícil mañana. Hay que entrenar mensaje y objeciones.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B como sparring. *"Simula al [CFO] de una empresa [sector, tamaño] con [contexto]. Voy a presentarte [propuesta]. Plantea las 5 objeciones más probables, en orden de importancia. Tras cada respuesta mía, sigue con la siguiente."*
- *Claude.ai / ChatGPT:* iteración corta antes de la llamada real.
- *Plataformas sales coaching:* **Gong Smart Tracker**, **Second Nature**, **Hyperbound**. Roleplay con feedback estructurado.
- *Claude Code:* repo `playbooks/` con objeciones conocidas por persona.
- *MCPs:* `mcp-gong` (objeciones reales registradas en cuentas similares).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min de prep llamada difícil | 0-15 | 20-30 (productivos) |
| Win rate en llamadas con objeciones complejas | medida base | +15pp |
| Confianza pre-call (encuesta) | 6/10 | 8,5/10 |

*Fórmula:* No directa; impacto en win rate. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera argumentos legalmente sensibles (comparaciones falsas con competencia), riesgo de competencia desleal.*
- *Si entrenas con datos reales del cliente (precios, contratos) y la sesión queda en una plataforma que los retiene, breach NDA.*
- *Si confundes el sparring con el cliente real, sobrepreparas un guion que suena artificial.*

Cubierto en **Pieza 2** con allow-list de plataformas y guías de uso (sparring sí, sustituto del juicio no).

### 2.8 Limpieza y enriquecimiento de CRM

**Caso de uso.** 4.000 contactos del CRM con datos incompletos, duplicados, desactualizados. Bounces, secuencias rotas, forecast contaminado.

**Cómo resolverlo.**

- *Plataformas con esto integrado:* **Clay**, **Apollo**, **ZoomInfo**, **Cognism**, **HubSpot Breeze AI**.
- *Local:* Ollama sobre CSV export. *"Identifica duplicados (mismo email, mismo teléfono, nombre+empresa). Marca registros con: email inválido formal, empresa cerrada según fuentes públicas, cambio de empresa detectable. NO fusiones automáticamente; propone fusión revisable."*
- *Copilot Excel:* limpieza asistida.
- *Claude Code:* repo `crm-hygiene/` con scripts y `AGENTS.md` que prohíbe escritura automática.
- *MCPs:*

| MCP | Comando | Scopes |
|-----|---------|--------|
| `mcp-salesforce` | oficial | `contact:read` para análisis, `contact:write` con gate humano por lote |
| `mcp-zoominfo` o `mcp-apollo` | oficial | `enrichment:read` |

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tasa de bounce de campañas | 12% | < 2% |
| % registros con datos completos | 50% | 90% |
| Duplicados activos | 8% | < 1% |
| Horas/mes en limpieza | 12 h | 2 h |

*Fórmula:* `(10) h × 12 = 120 h/año por sales ops`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el enriquecimiento masivo se hace sin base GDPR clara (interés legítimo no testado, sin información al sujeto), infracción AEPD.*
- *Si el agente fusiona registros automáticamente, perdemos historial de actividad asociado.*
- *Si la fuente de enriquecimiento incluye datos scrapeados sin consentimiento, breach por la vía del proveedor.*

Cubierto en **Pieza 2** con DPIA del enriquecimiento, allow-list de proveedores con base jurídica documentada, gate humano en fusión y prohibición de escritura masiva automática.

## 3. MCPs: cómo enchufar tus fuentes al agente

| MCP | Para qué lo usas |
|-----|------------------|
| CRM (Salesforce, HubSpot, Dynamics, Pipedrive) | Cuentas, oportunidades, contactos, actividad |
| Conversational intelligence (Gong, Chorus, Avoma) | Transcripciones, *insights*, riesgos de deal |
| Sales engagement (Outreach, Salesloft, Apollo) | Secuencias, *cadences*, A/B de mensajes |
| Enriquecimiento (ZoomInfo, Cognism, Clay) | Datos firmográficos y de contacto |
| RFP / Knowledge (Loopio, Responsive, DealHub) | Respuestas aprobadas, biblioteca de propuestas |
| CPQ / Pricing (Salesforce CPQ, DealHub CPQ) | Configuración de oferta, descuentos aprobados |
| Documentos (SharePoint / Drive) | Propuestas, NDAs, contratos firmados |

**Reglas adicionales para ventas:**

- **NDAs con cliente.** Un LLM público es un tercero. Antes de pegar información NDA, verifica política de tratamiento.
- **Grabación de llamadas.** UE: consentimiento informado previo, propósito declarado, retención mínima.
- **Pricing.** Precios negociados, descuentos especiales: no salen del perímetro aprobado.
- **Lead scoring automatizado.** Decisión apoyada por humano, no automatizada. EU AI Act + GDPR aplicables.
- **No automatices *outreach* a volumen.** Spam para el cliente y problema para la marca.

## 4. Cinco hábitos clave

1. **Personaliza de verdad.** Si el correo podría reenviarse a otro cliente sin cambios, no lo envíes.
2. **Verifica datos del cliente antes de citar.** Los modelos alucinan revenue, plantilla, hitos.
3. **Una sesión por cuenta o por proceso.** No mezcles cuentas distintas.
4. **Pide siempre next step con responsable y fecha.** Sin esto, los resúmenes son literatura.
5. **Revisa antes de enviar.** Todo lo que va al cliente con tu nombre lo firmas tú.

## 5. Qué evitar

- Pegar transcripciones o documentos del cliente en chats no aprobados, especialmente con NDA.
- Enviar correos masivos generados por IA sin personalización real.
- Citar datos del cliente sin verificar; alucinación frecuente.
- Usar "potencial de compra" o "afinidad" como criterio único de discriminación de leads.
- Compartir pricing negociado, contratos firmados o roadmaps NDA con modelos públicos.
- Sustituir conversación humana por bots en renovaciones, escaladas o negociaciones sensibles.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"**: patrón de forecast y pipeline (2.5, 2.8).
- Lab base **"asistente al empleado frontline"**: patrón RFP (2.6).
- Lab base **"agente regulatorio/legal sobre documentos"**: revisión NDAs y contratos.
- Guías: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
