# T09 — Apoyo regulatorio (AEPD, EU AI Act, NIS2)

## Identificación

- **Rol principal**: compliance officer, DPO, CISO.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 1 piloto en lectura de norma; nivel 3 antes de basar dictamen en la salida.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Compliance/DPO traduce regulación nueva (EU AI Act, NIS2, DORA, guías AEPD, criterios CNIL/EDPB) a obligaciones internas: qué aplica, qué cambia, qué controles toca actualizar. Hoy: lectura manual + tabla Excel + consulta a despacho externo en casos complejos. El agente extrae obligaciones, mapea a controles internos y propone gaps. El humano firma.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre PDF de la norma. Prompt: *"Extrae obligaciones aplicables a [empresa, sector, tamaño]. Para cada una: artículo, plazo, responsable interno típico, control existente esperado. **Cita exacto el artículo. No inventes referencias cruzadas.**"*

### 2.2 Copilot

Copilot M365 sobre SharePoint del repositorio normativo. Sensibilidad `Confidential / Compliance`.

### 2.3 Claude Code

Repo `compliance/regulations/` con `AGENTS.md` que define formato de salida (tabla artículo × obligación × control × gap) y prohíbe inferencias no respaldadas.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-eurlex` | EUR-Lex MCP comunitario | endpoint público | `documents:read` |
| `mcp-aepd` | AEPD MCP (no GA, propuesto) | scraper interno | `documents:read` |
| `mcp-sharepoint` | Graph MCP | `Sites.Selected` repo norma | `documents:read` |
| `mcp-report` | GRC / gestor documental MCP | `vault://compliance/report-rw` | `memo:write` (gate, HITL) |

### 2.5 Alternativas

Claude Projects con PDF subido + plantilla de extracción.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a mapeo norma → controles | 2 sem | 3 días |
| % obligaciones identificadas correctas | 80% | 95% |
| Gaps detectados antes de auditoría | 50% | 90% |

Fórmula: *2 semanas × 5 normas/año = 400 h/año por compliance officer. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo alucina un artículo (`art. 47 bis del EU AI Act`) y se cita en un dictamen interno, decisión sobre norma falsa."*
- *"Si subo el mapeo de controles (que revela gaps reales) a servicio público, hoja de ruta para un atacante o competidor."*
- *"Si el agente clasifica sistema como 'no alto riesgo' por sesgo del modelo cuando sí lo es (Anexo III EU AI Act), incumplimiento."*

**Riesgos típicos:** alucinación normativa, fuga de gaps internos, clasificación errónea de riesgo, falta de versión actualizada de la norma.

> Cubierto en la **arquitectura de remediación (bloque 5)**. No produccion sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `reg-mapper` extrae obligaciones de la norma y las cruza contra el inventario de controles internos; un segundo agente `citation-checker` valida vía A2A que cada `art. X` resuelva a una URL EUR-Lex/BOE oficial antes de que la salida sea aceptada.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Alucinación normativa (`art. 47 bis EU AI Act` inexistente) → dictamen basado en norma falsa | agentevals + kagent | validador A2A determinista contra EUR-Lex/BOE por URL + versión consolidada; cita no resoluble → línea eliminada, no *softened* |
| Fuga del mapeo de gaps internos a servicio público (**secreto empresarial · Directiva 2016/943**) | agentgateway | egress restringido a EUR-Lex, AEPD, BOE oficiales; MCPs de LLM públicos deny-listed; PII/gap-hash marcado en salida a proveedor de LLM |
| Clasificación errónea de sistema como "no alto riesgo" (**EU AI Act Anexo III**) | agentevals | eval set con 50 sistemas golden pre-clasificados por juristas; disagreement con salida del agente → `escalate:legal-partner` |
| Versión desactualizada de la norma → mapeo sobre texto derogado | agentgateway | `mcp-eurlex` obligado a devolver `celex_id + version_date`; si la versión no es la consolidada vigente, la respuesta se rechaza en el gateway |
| Prompt injection desde PDF de guía externa manipulada | agentgateway | contenido de `mcp-sharepoint` etiquetado `untrusted-content`; spotlighting activo; anomalías → OTel `injection.attempted=true` |

## Referencias

- EU AI Act, GDPR, NIS2, DORA, guías AEPD. *Citas T1.*
