# Privacidad y DPIAs

> **Rol:** legal · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Primer borrador de RAT, DPIA o evaluación de impacto sobre derechos fundamentales para sistemas de IA de alto riesgo (EU AI Act). Tiempo medio actual: 8-12 horas por DPIA.

**Cómo resolverlo.**

- *Local:* Ollama con plantilla AEPD/EDPB + descripción del tratamiento como contexto.
- *Copilot M365:* plantilla + descripción + bases jurídicas posibles → borrador estructurado.
- *Claude Code:* repo `privacidad/` con DPIAs previas, plantillas AEPD y EDPB.
- *Plataformas especializadas:* **OneTrust**, **TrustArc**, **PrivacyEngine**, **Securiti AI**, **DataGrail**.
- *MCPs:* `mcp-onetrust` (RAT, DPIAs previas), `mcp-graph-files` (descripción del tratamiento), `mcp-vlex` (normativa AEPD/EDPB).

**Prompt:** *"Genera DPIA según AEPD y EDPB. Incluye: descripción sistemática, evaluación de necesidad y proporcionalidad, identificación de riesgos para derechos y libertades, medidas previstas. Marca con [REVISAR DPO] los apartados de juicio. No introduzcas finalidades no aportadas."*

Para sistemas de alto riesgo bajo EU AI Act (Anexo III), plantilla aparte: evaluación de impacto sobre derechos fundamentales, gobierno de datos, supervisión humana, documentación técnica.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por DPIA | 10 h | 2,5 h |
| Cobertura criterios AEPD/EDPB | 80% | 100% |
| Iteraciones DPO antes de aprobar | 4 | 2 |
| % tratamientos con DPIA al día | 60% | 95% |

*Fórmula:* `(7,5) h × 40 DPIAs/año = 300 h/año por DPO`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo decide qué riesgos son "bajos" y firmas sin revisión, decisión automatizada con efecto jurídico → art. 22 GDPR.*
- *Si subes el RAT a herramienta no aprobada, mapeas todos los tratamientos del responsable y los expones.*
- *Si la herramienta retiene los datos del tratamiento para entrenamiento, multiplica el ámbito del tratamiento sin base jurídica.*

Cubierto en **Pieza 2** con allow-list de plataformas privacy con cláusulas GDPR-conformes, identidad del agente, gate humano del DPO y registro de uso de IA en la propia DPIA.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
