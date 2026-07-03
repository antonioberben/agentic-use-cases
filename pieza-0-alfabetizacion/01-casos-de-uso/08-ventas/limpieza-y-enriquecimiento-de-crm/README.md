# Limpieza y enriquecimiento de CRM

> **Rol:** ventas · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
