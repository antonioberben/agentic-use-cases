# Investigación de cuenta antes de la primera reunión

> **Rol:** ventas · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 2 horas leyendo web del cliente, últimos resultados, prensa, LinkedIn antes de un first meeting. Salida: una página con contexto, dolor probable y nombres clave.

**Cómo resolverlo.**

- *Local:* Ollama con RAG sobre PDFs descargados (cuentas anuales, presentaciones investor).
- *Copilot M365:* Copilot Chat con web grounding. *"Resume [empresa]: modelo de negocio, segmentos, últimos resultados con fuente, hitos del año, C-level relevante. Cita cada dato con URL. Si no tienes fuente, dilo."*
- *Claude Code:* repo `cuentas/[acme]/` con `AGENTS.md` que prohíbe inventar cifras.
- *Plataformas:* **6sense AI**, **Clay**, **Apollo.io AI**, **Common Room**, **Crystal Knows**. Investigación con citación: **Perplexity**, **Claude/ChatGPT con búsqueda**.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-salesforce` | `npx mcp-salesforce`, `vault://sfdc/ae-ro` | `account:read`, `contact:read` |
| `mcp-zoominfo` o `mcp-apollo` | oficial | `contact:read`, `firmographic:read` |
| `mcp-web-fetch` con allow-list | local | dominios públicos del cliente, prensa |

```json
{
  "mcpServers": {
    "salesforce": { "command": "npx", "args": ["mcp-salesforce"], "env": { "SF_USER": "svc-ae-ro" } }
  }
}
```

- *Alternativa:* Claude.ai con PDFs adjuntos manualmente.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo prep cuenta | 120 min | 30 min |
| Cobertura datos verificables | 60% | 95% |
| Conversión first meeting → next step | 40% | 60% |
| Cuentas investigadas/semana | 5 | 15 |

*Fórmula:* `(90) min × 200 cuentas/año = 300 h/año por AE`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si trabajo desde Copilot y conecto un MCP web sin allow-list, prompt injection desde una web del cliente compromete el contexto.*
- *Si cito una cifra inventada por el modelo ("vi que crecisteis un 30%"), pierdo credibilidad en 5 segundos.*
- *Si el MCP de Salesforce usa mi token personal y no `svc-ae-ro`, no hay traza segregada del agente.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de fuentes, identidad de agente, validación cita-fuente obligatoria y prohibición de cifras sin URL.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `account-researcher` agrega CRM (`mcp-salesforce`), enriquecimiento firmográfico (`mcp-zoominfo`/`mcp-apollo`) y web pública del cliente (`mcp-web-fetch`) para producir una página de contexto pre-first-meeting; un validador `source-validator` (A2A) exige cita-fuente con URL en cada dato cuantitativo antes de entregar. El AE valida antes de usarla. Sin escrituras.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Prompt injection desde la web del cliente citada | agentgateway + Istio | `mcp-web-fetch` con allow-list de dominios públicos del cliente/prensa; contenido marcado `untrusted` y spotlighting antes del LLM; egress no aprobado bloqueado en ztunnel |
| Cifra inventada presentada como hecho ("crecisteis un 30%") | agentevals | eval set exige cita-fuente con URL en cada dato cuantitativo; bloquea el handoff si falta la referencia |
| Uso de token personal en lugar de `svc-ae-ro` (sin traza segregada) | kagent (OBO) + agentregistry | `mcp-salesforce` con identidad `svc-ae-ro` y scope `account:read,contact:read`; el agente registrado en agentregistry, no la cuenta del AE |
| Enriquecimiento con datos personales sin base jurídica — GDPR interés legítimo | agentgateway | `mcp-zoominfo`/`mcp-apollo` con scope `contact:read,firmographic:read`; detección y redaction de categorías especiales |
| Coste por fetch/scraping múltiple | agentgateway | rate limit + semantic caching + allow-list estrecha de dominios en `mcp-web-fetch` |

## Referencias

- GDPR (base jurídica del enriquecimiento de contactos, interés legítimo). *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection).
