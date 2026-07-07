# Privacidad y DPIAs

> **Rol:** legal · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Primer borrador de RAT, DPIA o evaluación de impacto sobre derechos fundamentales para sistemas de IA de alto riesgo (EU AI Act). Tiempo medio actual: 8-12 horas por DPIA.

**Cómo resolverlo.**

- *Local:* Ollama con plantilla AEPD/EDPB + descripción del tratamiento como contexto.
- *Copilot M365:* plantilla + descripción + bases jurídicas posibles → borrador estructurado.
- *Claude Code:* repo `privacidad/` con DPIAs previas, plantillas AEPD y EDPB.
- *Plataformas especializadas:* **OneTrust**, **TrustArc**, **PrivacyEngine**, **Securiti AI**, **DataGrail**.
- *MCPs:* `mcp-onetrust` (`rat:read`, RAT y DPIAs previas), `mcp-graph-files` (`processing:read`, descripción del tratamiento), `mcp-vlex` (`law:read`, normativa AEPD/EDPB); `mcp-dpia-write` (`dpia:write`, escritura de la DPIA en el registro bajo HITL del DPO).

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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de plataformas privacy con cláusulas GDPR-conformes, identidad del agente, gate humano del DPO y registro de uso de IA en la propia DPIA.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `dpia-drafter` produce borrador siguiendo plantilla AEPD/EDPB. Un sub-agente `completeness-validator` (A2A) verifica que el borrador cubre los apartados del art. 35 GDPR antes del handoff. **No decide** el nivel de riesgo residual: lo propone y el DPO firma. La propia DPIA registra el uso del agente para cumplir con transparencia AI Act.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| El agente decide "riesgo bajo" y se firma sin revisión → decisión automatizada con efecto jurídico (**GDPR art. 22 · GDPR art. 35**) | kagent + agentevals | política `risk-level:decide=deny`; el agente marca todos los niveles como `PROPUESTO`; commit a `APROBADO` requiere DPO con `role=dpo` |
| Fuga del RAT (mapa completo de tratamientos del responsable) a herramienta pública (**GDPR art. 30**) | agentgateway | `mcp-onetrust` deny para egress a LLM externo; borrador de DPIA con `pii-redact` sobre categorías especiales antes de salir del cluster |
| Retención por proveedor de LLM del contenido del tratamiento (multiplica ámbito sin base jurídica GDPR art. 6) | agentregistry | catálogo restringido a modelos con DPA firmado y opt-out de entrenamiento; modelos "consumer-tier" bloqueados |
| Clasificación errónea de sistema como "no alto riesgo" (**EU AI Act art. 6 · Anexo III**) | agentevals | eval set 100 sistemas golden con clasificación AEPD; disagreement → `escalate:dpo-partner` obligatorio |
| Uso de IA en la DPIA no divulgado en la propia DPIA (**AI Act art. 50 transparencia**) | agentgateway | OTel span de cada invocación se anexa automáticamente como apéndice `AI-usage-log` al PDF de la DPIA |
