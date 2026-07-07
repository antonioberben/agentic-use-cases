# Resumen y *next steps* de llamadas

> **Rol:** ventas · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

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

Cubierto en la **arquitectura de remediación (bloque 5)** con consentimiento gestionado por la plataforma, allow-list de proveedores con cláusulas NDA-friendly, gate humano antes de update y identidad propia del agente.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* + *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `call-notes-writer` resume la transcripción y propone el update de CRM como diff; un validador comprueba que no inventa acuerdos y el AE firma antes de escribir en Salesforce.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Grabación sin consentimiento — GDPR/LOPDGDD art. 6 (posible nulidad de la prueba) | agentgateway | la plataforma exige flag de consentimiento registrado antes de procesar la transcripción; sin él, el MCP de la call queda fuera de la allowlist |
| Transcript con contenido NDA subido a chat genérico | agentgateway + agentregistry | allow-list de MCPs de conversational intelligence registrados con cláusula NDA-friendly; redaction antes del request |
| Compromiso del cliente mal registrado que contamina la fuente única (costura resumen→write-back) | kagent (A2A) + agentevals | validador cruza cada next step contra la transcripción de `mcp-gong`/`mcp-chorus` (RO); `agentevals` bloquea el diff si aparece un acuerdo no verbalizado |
| Update automático a Salesforce sin gate | agentgateway + kagent (OBO) | `mcp-salesforce` con `update:write` fuera de la allowlist directa; el diff exige HITL y OBO del AE |
| Coste por 30 llamadas/semana por AE | agentgateway | rate limit por AE y semantic caching de plantillas de resumen |

## Referencias

- GDPR / LOPDGDD (consentimiento de grabación de llamadas, art. 6); NDA con cliente. *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
