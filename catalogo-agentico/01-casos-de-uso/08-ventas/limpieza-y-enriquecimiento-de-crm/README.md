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

Cubierto en la **arquitectura de remediación (bloque 5)** con DPIA del enriquecimiento, allow-list de proveedores con base jurídica documentada, gate humano en fusión y prohibición de escritura masiva automática.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `crm-hygiene` detecta duplicados y registros obsoletos y **propone** fusiones/actualizaciones revisables; un validador `dedup-validator` (A2A) verifica cada match propuesto antes de la revisión humana. Nunca fusiona ni escribe en lote de forma automática — sales ops firma cada lote (`contact:write` gated).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Fusión automática de registros con pérdida de historial de actividad | agentgateway + kagent (OBO) | `mcp-salesforce` con scope `contact:read` para análisis; `contact:write` solo tras HITL por lote y OBO de sales ops |
| Escritura masiva automática al CRM | agentgateway | `merge`/`bulk-update` fuera de la allowlist; la propuesta va a una carpeta revisable, no al sistema de registro |
| Enriquecimiento masivo sin base jurídica (interés legítimo no testado, sin información al sujeto) — GDPR/AEPD | agentevals + agentgateway | gate previo que exige base jurídica documentada por proveedor; sin ella el enriquecimiento no se ejecuta |
| Proveedor de enriquecimiento con datos scrapeados sin consentimiento (breach por la vía del proveedor) | agentregistry + agentgateway | allow-list de proveedores registrados con base jurídica; `mcp-zoominfo`/`mcp-apollo` con scope `enrichment:read` y origen auditado |
| Coste de enriquecimiento masivo de 4.000 contactos | agentgateway | rate limit por lote y semantic caching de firmográficos ya resueltos |

## Referencias

- GDPR / LOPDGDD (base jurídica del enriquecimiento, información al interesado); guía AEPD sobre tratamientos de enriquecimiento. *Citas T1.*
- Marco técnico: OWASP LLM08 (Excessive Agency).
