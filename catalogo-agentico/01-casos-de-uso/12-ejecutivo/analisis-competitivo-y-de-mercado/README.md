# Análisis competitivo y de mercado

> **Rol:** ejecutivo · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Movimiento del competidor, cambio regulatorio, anuncio sectorial. Hoy: pides al director de unidad que lo analice y llega tres días tarde.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre dossiers internos + recortes de prensa filtrados. *"Analiza el anuncio de [X]. Implicaciones para nuestro posicionamiento, precios, propuesta de valor. Tres hipótesis sobre por qué lo han hecho. Tres escenarios de respuesta con pros/contras. Cita fuentes; sin datos inventados; sin inferencias sobre estrategia futura del competidor más allá del hecho público."*
- **Copilot M365:** con conector a Bing/news enterprise filtrado por fuente.
- **Claude Code:** carpeta `competitive/` con un `AGENTS.md` que prohíbe inferir de fuentes no citadas.
- **MCPs:** `mcp-news` (Bloomberg/Reuters MCP) con scopes `articles:read`, `mcp-crm` (Salesforce/Dynamics) con `accounts:read` sobre cuentas estratégicas, `mcp-market-intel` (Gartner/Forrester) con `vault://exec/analyst-ro`, `mcp-brief` con `brief:distribute` (bajo gate humano) para distribuir el análisis firmado por el comité.
- **Alternativa:** Claude con dossier subido + búsqueda web supervisada.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a posición preliminar | 2-3 días | 4 h |
| % movimientos analizados a tiempo | 50% | 85% |

Fórmula: *4 movimientos/mes × ahorro 12 h = 576 h/año a nivel de comité. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si actúo sobre análisis del modelo sin triangular con el director de unidad (que tiene contexto cualitativo del mercado), decido sobre dato superficial. Si el modelo se apoya en rumores no verificados y vinculo nuestra respuesta pública, riesgo de **competencia desleal** o de **información engañosa**. Riesgos típicos: alucinación de movimientos, mezcla de fuentes (rumor con dato verificado), filtración de nuestra reacción si el análisis circula. **Lo que escribe el modelo es punto de partida para discusión, no conclusión. Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-inteligencia-competitiva` agrega news, CRM y market-intel para producir el análisis; el comité (humano) firma cualquier respuesta pública.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Movimiento del competidor alucinado y presentado como hecho, usado en respuesta pública (Ley 3/1991 competencia desleal; información engañosa MAR/CNMV) | agentevals | cada afirmación relevante lleva referencia clicable a la fuente y fecha; bloquea handoff si `citations_verified < 100%` |
| Rumor no verificado mezclado con dato público en la síntesis | kagent (A2A) | sub-agente validador etiqueta cada fuente `hecho-público` vs `rumor` y su fiabilidad antes de sintetizar |
| Exfiltración de nuestra reacción/posicionamiento al proveedor del modelo | agentgateway | redaction: nombres de cuenta estratégica → handle interno; la hipótesis de respuesta no sale en el request |
| Egress a dominios no aprobados durante el scraping de prensa | Istio | `AuthorizationPolicy` L4 en ztunnel con allowlist explícita (`bloomberg.com`, `reuters.com`); el resto se bloquea |
| MCP de analistas (`mcp-market-intel` Gartner/Forrester) con scope amplio | agentgateway | allowlist restringe a `analyst-ro`; sin escritura, sin acceso fuera de las suscripciones contratadas |
| Distribución del brief antes de la firma del comité (`mcp-brief` `brief:distribute`) | agentgateway (HITL) | gate humano: `brief:distribute` no se ejecuta hasta que el comité aprueba; toda distribución queda trazada |

## Referencias

- Ley 3/1991 de Competencia Desleal; MAR (Reg. UE 596/2014) y CNMV (información engañosa). *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
