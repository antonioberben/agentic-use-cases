# B03 — Lectura asistida de DORA / EBA / Banco de España

## Identificación

- **Rol principal**: compliance financiero, CISO, oficial DORA.
- **Sectores**: banca, seguros, infraestructuras financieras críticas.
- **Patrón técnico**: Lab 6 — agente regulatorio.
- **Madurez recomendada**: nivel 1 piloto; nivel 3 antes de basar plan de remediación.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo A — Sectorial banca.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `dora-mapper` extrae obligaciones de DORA/RTS/ITS y las cruza con el inventario de controles ICT en ServiceNow GRC. Un agente A2A `celex-checker` valida cada cita contra EUR-Lex antes de que el mapeo llegue al oficial DORA.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Alucinación de artículo o plazo DORA → plan de remediación sobre norma falsa | agentevals + kagent | validador A2A por CELEX_ID + versión consolidada; artículos DORA hardcoded en golden set con fecha de aplicación (17-ene-2025); miss → línea eliminada |
| Fuga del inventario de gaps (dónde NO se cumple DORA) a LLM público (**secreto empresarial · supervisión BdE**) | agentgateway | egress restringido a EUR-Lex/EBA/BdE oficiales; `mcp-grc` sale con `severity=redacted` a cualquier proveedor LLM externo; MNPI-scale audit trail |
| Reporte de incidentes ICT mal clasificado (**DORA art. 19 · RTS incident reporting**) | agentevals | eval set con 200 incidentes golden pre-clasificados por oficial DORA; el agente propone clasificación pero el `report:submit` requiere firma humana |
| Corpus normativo desactualizado (RTS/ITS actualizados por EBA cada trimestre) | agentgateway | `mcp-eba` obligado a devolver `publication_date + status=in-force`; documentos con `status=draft/withdrawn` rechazados a nivel de gateway |
| Prompt injection desde circular BdE manipulada en repositorio interno | agentgateway | contenido `mcp-sharepoint` etiquetado `untrusted-content`; spotlighting; hash SHA-256 del PDF oficial comparado contra copia local |

## Referencias

- Reglamento (UE) 2022/2554 DORA, RTS/ITS EBA, circulares BdE, guías BCE, Reglamento (UE) 2023/1114 MiCA. *Citas T1.*
