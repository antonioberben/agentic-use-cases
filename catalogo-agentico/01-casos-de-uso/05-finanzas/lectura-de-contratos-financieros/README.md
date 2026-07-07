# Lectura de contratos financieros

> **Rol:** finanzas · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 40 páginas de un leasing, financiación, emisión de deuda o ISDA. Hay que extraer covenants, garantías, tipo de interés, eventos de incumplimiento, penalizaciones. Hoy es tarde-completa de lectura.

**Cómo resolverlo.**

- *Local:* Ollama sobre PDF (texto extraído). Cero envío a la nube si el contrato es confidencial.
- *Copilot M365:* el PDF en SharePoint, Copilot Chat. Extrae estructurado a Excel.
- *Claude Code + Claude Sonnet con contexto largo:* el contrato en `legal/contracts/`; el agente extrae campos a JSON contra un esquema.
- *MCPs:* `mcp-graph-files` (SharePoint), `mcp-icertis` o `mcp-docusign-clm` si hay CLM (solo lectura).
- *Alternativa:* subir el PDF anonimizado a Claude.ai para extracción asistida.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por contrato | 4 h | 1 h |
| Covenants extraídos | 80% | 100% |
| Errores en fechas/importes | 10% | < 2% |

*Fórmula:* `(4 − 1) h × 40 contratos/año = 120 h/año por analista de tesorería`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si subes el contrato a una herramienta no aprobada, expones contraparte, condiciones y covenants — sensible competitivamente y, en M&A, MNPI.*
- *Si el modelo malinterpreta una cláusula de incumplimiento ("ambigüedad"), tomas una decisión de tesorería mal informada.* Pide siempre revisión legal humana de lo extraído.
- *Si el agente tiene escritura en el CLM, puede modificar el master record.*

Cubierto en la **arquitectura de remediación (bloque 5)** con perímetro de herramientas aprobadas para legal, identidad propia y workflow revisión legal antes de actuar.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `treasury-doc` extrae covenants, tipos, garantías y eventos de incumplimiento contra un esquema JSON. Un sub-agente `numeric-checker` cuadra tipo nominal, tipo efectivo y calendario contra la tabla del PDF antes del handoff.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Malinterpretación de "material adverse change" / cross-default → decisión de tesorería sobre dato falso | agentevals + kagent (A2A) | validador legal humano-in-loop obligatorio para cláusulas `event_of_default`; `agentevals` marca la ficha como `incompleta` hasta firma |
| Extracción numérica alucinada (spread, plazo, base 360/365) | agentevals | `numeric-checker` recomputa cada campo contra la tabla original; `mismatch > 0` bloquea |
| MNPI en M&A / emisión de deuda pre-anuncio (**MAR art. 7 · CNMV**) | agentgateway + Istio | dataset etiquetado `mnpi=true`; egress restringido al modelo en tenant UE con no-training; ztunnel bloquea cualquier otro LLM |
| Contraparte persona física en leasing/factoring (**GDPR art. 6 · LOPDGDD**) | agentgateway | prompt guard con detección DNI/NIF/nombre; redaction antes de request |
| Escritura no autorizada en CLM (Icertis/DocuSign) | agentgateway + kagent (OBO) | scope `contracts:read`; el `commit` al master record requiere HITL del legal counsel con OBO |
