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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
