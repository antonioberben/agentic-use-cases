# B03 — Lectura asistida de DORA / EBA / Banco de España

## Identificación

- **Rol principal**: compliance financiero, CISO, oficial DORA.
- **Sectores**: banca, seguros, infraestructuras financieras críticas.
- **Patrón técnico**: Lab 6 — agente regulatorio.
- **Madurez recomendada**: nivel 1 piloto; nivel 3 antes de basar plan de remediación.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

DORA, los RTS/ITS de la EBA, las circulares del BdE/BCE producen centenares de páginas que el área de cumplimiento financiero tiene que traducir a obligaciones operativas (gestión de riesgo TIC, reporte de incidentes, pruebas de resiliencia, gestión de proveedores ICT). El agente extrae obligaciones por artículo, mapea a controles internos y propone gaps. El humano firma.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre PDFs oficiales. Prompt: *"Para cada artículo del Reglamento (UE) 2022/2554 (DORA) y los RTS aplicables: obligación, plazo, área responsable, control existente esperado. Cita exacto. **No agrupes ni interpretes; extrae.**"*

### 2.2 Copilot

Copilot M365 sobre SharePoint del repositorio normativo financiero. Sensibilidad `Confidential / Compliance`.

### 2.3 Claude Code

Repo `dora/` con `AGENTS.md`: corpus normativo con fecha de corte, formato tabla `artículo × obligación × control × evidencia × gap`, prohibición de inferencia.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-eurlex` | EUR-Lex MCP | endpoint público | `documents:read` |
| `mcp-eba` | EBA MCP (no GA, propuesto) | scraper interno | `documents:read` |
| `mcp-bde` | Banco de España MCP (no GA, propuesto) | scraper interno | `documents:read` |
| `mcp-grc` | ServiceNow GRC / Archer MCP | `vault://compliance/grc-rw-limited` | `findings:draft` |

### 2.5 Alternativas

Claude Projects con PDFs subidos + plantilla.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a mapeo norma → controles | 6 semanas | 1 semana |
| % obligaciones identificadas correctas | 80% | 95% |
| Gaps detectados antes de inspección | 50% | 90% |
| Coste de adaptación al cambio normativo | € | € × 0,4 |

Fórmula: *5 semanas × 2 FTE × 6 normas/año = ≈ 2.400 h/año por área. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo alucina un artículo o un plazo (DORA aplicable desde 17 enero 2025) y se planifica en base a ello, retraso en cumplimiento + inspección crítica."*
- *"Si el mapeo de gaps (que muestra dónde NO cumplimos) se procesa en servicio público sin acuerdo, supervisor podría considerar fuga de información reservada de la entidad."*
- *"Si confío en la salida sin verificar contra el texto oficial, ruptura del deber de cumplimiento que la entidad tiene como sujeto regulado."*

**Riesgos típicos:** alucinación normativa, fuga de inventario de gaps, dependencia del modelo sin verificación, corpus desactualizado.

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo A — Sectorial banca.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Reglamento (UE) 2022/2554 DORA, RTS/ITS EBA, circulares BdE, guías BCE, Reglamento (UE) 2023/1114 MiCA. *Citas T1.*
