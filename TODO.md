# TODO — Plataforma de capacitación (reproductor + casos de uso)

> Backlog vivo de la Pieza 0: reproductor de escenarios, sistema de labels y nuevos tipos de caso de uso.
> Idioma de entregables: español (contenido bilingüe ES/EN en el sitio). Leyenda: ⬜ pendiente · 🔄 en curso · ✅ hecho.
> Las convenciones marcadas **(→ skill)** deben plegarse en `.claude/skills/crear-caso-de-uso/SKILL.md` al implementarse.

## A. Reproductor / UI

- ⬜ **1. Iconos reales de los componentes en los nodos.** El reproductor debe usar los iconos de producto: nodo agente → icono **kagent**; gateway → icono **agentgateway**; servidor MCP → icono **MCP**. Sustituir los recuadros/emoji actuales por los SVG de marca.
  - Subtarea: conseguir los SVG oficiales (Figma `Product Pages/` de la marca Solo; no están en el skill `solo-design`, que solo trae patrones binarios). Inline como SVG/data-URI (CSP bloquea externos).
- ⬜ **4. Etiquetar los gateways por su rol** cuando corresponda: **LLM Gateway**, **MCP Gateway**, **AgentGateway**. Un caso puede usar varios a la vez; mostrarlos como tales en la topología y en el bloque 5. **(→ skill)**
  - Definir estos roles también como **labels de filtrado** del catálogo (ver sección D).

## B. Convenciones de autoría **(→ skill)**

- ⬜ **2. Usar siempre los productos enterprise, sin mencionar la palabra "enterprise".** Asumir capacidades enterprise (prompt guards con PII, rate limit por tokens, OIDC/JWKS, ExtProc, semantic caching, model failover, tracing, agent registry) pero referirse a los productos por su nombre a secas (agentgateway, kagent, agentregistry, Istio ambient). No escribir "Solo Enterprise for …" en el contenido de cara al usuario.

## C. Nuevos tipos de caso de uso (contenido)

- ⬜ **3. Casos con _chain de agentes_ (multi-agente / multi-equipo).** Escenarios complejos donde intervienen varios equipos y cada uno aporta un agente distinto que se coordinan (A2A). Ej.: incidente que cruza red + soporte + seguridad. Mostrar la orquestación kagent y la mediación A2A/MCP en agentgateway.
- ⬜ **5. Casos con _varios LLMs_ y balanceo entre modelos/proveedores.** Enrutado y failover entre modelos para **reducción de costes** y **migración**. Mostrar routing/model-failover en agentgateway.
- ⬜ **6. Casos de _AgentEvals_ en el mundo real.** Enseñar cómo se usa agentevals: eval sets dorados, evaluación basada en trazas, tracing OTel zero-code, evaluadores personalizados, integración CI/CD. Añadir **label "AgentEvals"** para filtrar estos casos (ver D).
- ⬜ **7. Casos de _migración de proveedor_ + _semantic router vía ExtProc_.**
  - Migración de un proveedor de LLM a otro sin cambiar la aplicación (agentgateway como punto de indirección).
  - Integrar un **semantic router a través de ExtProc** para **selección automática de modelo** según estrategia: coste, relevancia del proyecto y del contexto. Evaluaciones _on the fly_ con el contexto que redirigen a un modelo "caro↔barato" / "más↔menos eficiente".
- ⬜ **8. Casos con _Judge LLM_ (LLM-as-judge) y evaluación de calidad.** Validar/puntuar salidas de agente con un modelo juez; encaje directo con **agentevals** (evaluadores personalizados + eval sets) y con los prompt guards de agentgateway. Caso limpio y vendor-neutral: priorizar.
- ⬜ **8b. Casos: sistemas de guardrails externos ("bring your own guardrails").** agentgateway expone una **Guardrail Webhook API**: un servidor externo inspecciona / enmascara / rechaza request y response de forma síncrona (pipeline: regex → moderación externa → webhook personalizado), y **ExtMCP** aplica lo mismo a nivel de método MCP (`tools/call`, `tools/list`) vía servidor gRPC. Caso: enganchar un **sistema de guardrails externo** para detección avanzada, manteniendo agentgateway como plano de aplicación / identidad / routing.
  - **NeuralTrust (TrustGuard)** encaja aquí como **uno de los proveedores de guardrails externos** conectables por webhook (junto a otras opciones del mercado). Presentarlo **como backend de guardrails vía la Guardrail Webhook API / ExtMCP, no como gateway** — así es complemento, no competidor. Mantener el caso vendor-neutral (NeuralTrust como ejemplo, no como dependencia).
  - Base real (docs): `agentgateway/latest/llm/guardrails/webhook/` y `agentgateway/latest/mcp/guardrails/` (ExtMCP).

## D. Sistema de labels / filtros del catálogo (consolidar)

- ⬜ Ampliar los filtros del catálogo más allá de rol y patrón técnico. Ejes de label propuestos:
  - **Patrón técnico**: analítico · triage · código · operacional · asistencia · documentos · generación.
  - **Rol de gateway** (item 4): LLM Gateway · MCP Gateway · AgentGateway.
  - **Producto Solo implicado**: agentgateway · kagent · agentregistry · agentevals · Istio ambient · kgateway.
  - **Capacidad destacada**: chain de agentes (item 3) · multi-LLM / balanceo (item 5) · AgentEvals (item 6) · migración (item 7) · semantic routing / ExtProc (item 7) · Judge LLM (item 8) · guardrails externos / webhook / ExtMCP (item 8b) · LLM Gateway para asistentes de código (item 9) · gobernanza de harness/asistentes (item 10).
  - **Asistente de código**: Claude Code · Copilot · opencode · Codex · Gemini CLI · Goose.
  - **Framework de agente**: Google ADK · LangGraph · CrewAI · BYO (A2A).
  - **Sector**: transversal · banca · telco · serv. profesionales.
- ⬜ Reflejar estos labels como metadato en cada ficha (`README.md`) y en la portada filtrable del sitio. **(→ skill)**

## E. Casos nuevos — ampliación (asistentes, harness, substrate)

- ⬜ **9. Casos: LLM Gateway delante de asistentes de código.** Poner agentgateway como **LLM Gateway** ante **Claude Code, GitHub Copilot, opencode, Codex, Gemini CLI, Goose**: apuntar el endpoint de modelo del asistente al gateway para gobernar coste (rate limit por tokens, semantic caching), seguridad (prompt guard + PII), routing/failover de modelo y observabilidad por invocación. Base real: agentgateway LLM routing + "Body-Based LLM Provider Routing" + proveedores Gemini/Vertex.
- ⬜ **10. Casos: enganchar asistentes/harness de agentes con gobernanza (Hermes, OpenClaw, Goose, Codex, Gemini CLI…).** Exponerlos y coordinarlos con otros agentes (A2A) y MCP, con agentgateway mediando y agentregistry inventariando; habilita "usar asistentes de IA" de forma gobernada.
  - **Goose ↔ agentgateway**: integración **documentada (GA)** — `docs.solo.io/agentgateway/latest/integrations/web-uis/goose/`. Empezar por aquí.
  - **Harness en kagent Agent Substrate** (OpenClaw tiene ejemplo en repo `kagent-dev/kagent/examples/substrate-openclaw`; Hermes/Codex/Gemini CLI): la exposición vía **ACP (Agent Client Protocol)** es **propuesta de diseño (EP), no GA** — marcar como **emergente** y verificar antes de redactar. ("nemoclaw" descartado por el usuario.)
- ⬜ **11. Casos: kagent Agent Substrate** (confirmado por el usuario). Runtime `ate-api` que ejecuta *AgentHarness* como actores; backends OpenClaw/Hermes/Codex/Goose/Gemini CLI. Caso: correr estos harness de forma gobernada en kagent y exponerlos a otros agentes vía A2A, con agentgateway (MCP/A2A/LLM) mediando y agentregistry inventariando. **Marcar como emergente / no-GA** (ACP y varios backends están en diseño; solo OpenClaw tiene ejemplo en repo).
  - Casos aparte (Google real en kagent, GA), no confundir con Substrate: **ADK** como framework (con LangGraph/CrewAI; BYO vía A2A) y **Vertex AI** como proveedor (`GeminiVertexAI` / `AnthropicVertexAI` → Gemini o Claude por Vertex).

- ⬜ **12. Verificación multiagente (ejecutor + validadores) en el reproductor y en los casos.** Un agente ejecuta la tarea y **otros agentes validan partes** de la salida antes de darla por buena (patrón generador → N verificadores independientes → consolidación; verificación adversarial / LLM-as-judge). Un solo agente no basta cuando la salida es difícil de verificar rápido, el error es costoso/irreversible/regulado y la tarea se descompone en sub-afirmaciones comprobables.
  - **Prioridad por coste del error:** Legal ≈ Finanzas > Banca > SOC > Ops.
  - **Validadores por caso:** Legal (citation-checker anti-jurisprudencia inventada · materiality-checker · confidencialidad); Finanzas (reconciliación de cifras vs ledger · atribución de driver · MNPI/disclosure guard); Banca (advice-boundary MiFID II → si es asesoramiento, HITL/derivar · grounding a la política — validador **ligero**, cliente esperando); SOC (re-check de falsos positivos vs threat-intel/histórico · safety pre-check antes de contener); Ops (challenger de causa raíz · runbook-safety).
  - **Flujo:** los validadores **elevan al gate humano (HITL)** solo lo dudoso, no todo; un hallazgo sobrevive si la mayoría confirma.
  - **Reproductor:** añadir en los casos que lo justifican (empezar por **Legal** y **Finanzas**) uno o dos **nodos validadores** que verifican la salida del ejecutor antes de la etapa de impacto/remediación, con arista de "validación" y, si falla, elevación al HITL.
  - **Encaje Solo:** kagent orquesta ejecutor+validadores y la coordinación A2A; agentgateway media el A2A y da **identidad propia a cada agente** (no comparten credencial) + guardarraíles por hop; **agentevals** es la capa natural de validación (eval sets, evaluadores, LLM-as-judge con traza); agentregistry inventaría cada validador (nada de validadores shadow).
  - Relacionado con items **3** (chain de agentes), **6** (AgentEvals) y **8** (Judge LLM).

## F. Casos propuestos desde el MCP de Solo (item 2b — verificados en docs/GitHub)

Candidatos con respaldo en la documentación/repos de Solo; al redactar, mapear a rol + patrón + labels (sección D):

- ⬜ agentgateway como **MCP/LLM Gateway en malla ambient** (waypoint).
- ⬜ **Body-Based LLM Provider Routing** (enrutado por el cuerpo de la petición) → base de selección de modelo por coste/estrategia (liga con item 7).
- ⬜ **Asegurar servidores MCP**: OAuth2 y JWT auth para MCP; PAR para compatibilidad con WAF.
- ⬜ **Proxy de comunicación A2A entre agentes** a través de agentgateway (liga con item 3, chain de agentes).
- ⬜ **Agentes kagent como servidores MCP en el IDE** (Claude Code / Cursor) (liga con item 9).
- ⬜ **Exponer / invocar agentes vía A2A** (endpoints A2A por gateway; discovery label de agentgateway para kagent).
- ⬜ **Vertex AI en kagent** (Gemini/Claude por Vertex) como proveedor de modelo.
- ⬜ **Observabilidad**: kagent tracing con Grafana Tempo; tracing OTel zero-code (liga con AgentEvals, item 6).
- ⬜ Revisar además **Slack interno y repos** (`agentgateway/agentgateway`, `kagent-dev/kagent`, `agentregistry-dev/agentregistry`) para features aún no documentadas antes de cerrar el catálogo ampliado.

## Notas

- Items 2, 4 y D son convenciones/estructura → actualizar el skill `crear-caso-de-uso` cuando se implementen.
- Items 3, 5, 6, 7, 8 son **nuevos casos**; al crearlos, seguir el patrón de 5 bloques + escenario del reproductor del skill, y respaldar toda cifra factual con T1.
- Verificar contra la KB (`solo-knowledge-base`) cualquier capacidad de producto antes de afirmarla (ExtProc, model-failover, agentevals, A2A ya confirmados).
