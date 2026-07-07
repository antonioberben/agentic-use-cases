# Búsqueda en documentación y AGENTS.md de plataforma

> **Rol:** operador · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

*"¿Cómo se hace rollback en Argo CD?"*. 20 min entre Stack Overflow + docs oficiales + Confluence interna. Se busca: respuesta combinando convenciones internas + docs oficiales en segundos.

## 2. Cómo resolverlo

**Local.** RAG sobre `docs/` con LangChain + Ollama.

**Copilot (M365).** Si Confluence/SharePoint indexado: pregunta directa.

**Claude Code.** Con MCP de Context7, DeepWiki o docs del vendor + repo interno con `AGENTS.md`.

**MCPs:** `mcp-context7`, `mcp-deepwiki`, `mcp-confluence`, `mcp-github` (repo de runbooks).

**Alternativa.** `repomix` para empaquetar el repo y pegarlo al asistente.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-búsqueda de comando/flag | *15-20 min* | *1-3 min* |
| % respuestas correctas a la primera | *60%* | *> 85%* |

**Fórmula:** ≈ 15 min × 6 búsquedas/día × 220 días / 60 ≈ **330 h/año** por operador.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente cita una doc oficial obsoleta y el comando que sugiere ya no existe o ha cambiado de comportamiento, ejecuto algo no esperado."*
- *"Si la doc interna contiene info confidencial (endpoints internos, cuentas de servicio) y va a modelo externo, fuga de topología."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `docs-searcher` cruza Context7/DeepWiki + Confluence interna + repo de runbooks. Cada respuesta cita `source_url` + `version`; sin cita resoluble no aparece en la respuesta.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Cita de doc oficial obsoleta → comando ya no existe o cambió comportamiento, outage al ejecutar | agentevals + agentgateway | `mcp-context7` obligado a devolver `version + published_date`; el eval rechaza citas con `version < installed_version`; comando propuesto marcado `[VERIFICAR - DOC v1.2 vs instalado v1.5]` |
| Doc interna con endpoints/cuentas de servicio a LLM externo → fuga de topología (**ENS · NIS2 art. 21**) | agentgateway | `mcp-confluence`/`mcp-github` con clasificación `internal-topology` fuerza modelo on-prem; consumer-tier deny; `pii-redact` sobre patrones tipo `https://*.internal.corp`, cuentas de servicio |
| Alucinación de flag o parámetro basada en similitud semántica con otro CLI | agentevals | validador determinista: cada `--flag` propuesto debe existir en el output de `--help` del comando (cacheado en `mcp-context7`); miss → flag eliminado |
| Combinación mezclada de docs de versiones distintas del mismo producto | agentgateway | `mcp-context7` scope obligatorio con `product_id + version`; el gateway rechaza si el resultado mezcla versiones distintas del mismo producto en una misma respuesta |
| Coste explosivo al usar el agente como buscador general (todo el día) | agentgateway | rate-limit por operador; cache TTL 24h sobre `query_hash + repo_state`; presupuesto mensual con corte |
