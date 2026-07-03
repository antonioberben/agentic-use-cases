# T09 — Apoyo regulatorio (AEPD, EU AI Act, NIS2)

## Identificación

- **Rol principal**: compliance officer, DPO, CISO.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 1 piloto en lectura de norma; nivel 3 antes de basar dictamen en la salida.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en la **Pieza 2 — Plan Director de IA**. No produccion sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- EU AI Act, GDPR, NIS2, DORA, guías AEPD. *Citas T1.*
