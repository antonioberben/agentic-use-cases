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

Cubierto en **Pieza 2** con allow-list de fuentes, identidad de agente, validación cita-fuente obligatoria y prohibición de cifras sin URL.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
