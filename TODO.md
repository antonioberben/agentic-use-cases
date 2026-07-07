# TODO — Plataforma de capacitación (reproductor + casos de uso)

> Backlog vivo del catálogo: reproductor de escenarios, sistema de labels y nuevos tipos de caso de uso.
> Idioma de entregables: español (contenido bilingüe ES/EN en el sitio). Leyenda: ⬜ pendiente · 🔄 en curso · ✅ hecho.
> Las convenciones marcadas **(→ skill)** deben plegarse en `.claude/skills/crear-caso-de-uso/SKILL.md` al implementarse.

## A. Reproductor / UI

- ✅ **1. Iconos reales de los componentes (2026-07-07).** Nodos del reproductor con iconos oficiales por tipo: agente→`kagent.png`, gateway→`agw-favicon.svg`, MCP→`mcp.svg`, registry→`agentregistry.png` (ya cableado en `index.jsx` ICON map + `<image>`). Añadido además icono oficial en la **tira de componentes del bloque 5** (`comps`) para agentgateway/kagent/agentregistry (`COMP_ICON` + `.cn-ic`). Nodos sin producto (user/llm/ext/shadow/trace) siguen con glyph SVG dibujado (no existe icono de marca). Pendiente menor: iconos oficiales para agentevals/kgateway/Istio ambient (no hay asset todavía).
- ✅ **4. Gateways etiquetados por rol (2026-07-07).** Los roles `gw:['LLM Gateway','MCP Gateway','AgentGateway']` se muestran como **chips** en la cabecera del reproductor (`caseline`, `chip gw`) y se nombran en las tablas del **bloque 5** (`agentgateway (LLM Gateway)` etc.). Añadido **eje de filtro "Por gateway"** en el catálogo: el generador `generar-listado-casos.py` parsea `gw:[...]` de `casos.js` (state machine id→gw, tolera multi-línea) y emite `gateways[]` en `casos.json`; `casos-de-uso.jsx` filtra por rol de gateway. Cobertura: **126/126** casos con rol de gateway.

## B. Convenciones de autoría **(→ skill)**

- ⬜ **2. Usar siempre los productos enterprise, sin mencionar la palabra "enterprise".** Asumir capacidades enterprise (prompt guards con PII, rate limit por tokens, OIDC/JWKS, ExtProc, semantic caching, model failover, tracing, agent registry) pero referirse a los productos por su nombre a secas (agentgateway, kagent, agentregistry, Istio ambient). No escribir "Solo Enterprise for …" en el contenido de cara al usuario.

## C. Nuevos tipos de caso de uso (contenido)

> ✅ **Tanda 2026-07-07: 7 casos nuevos creados** (ficha 5 bloques + objeto `spec` bilingüe en el reproductor + label de capacidad + rol de gateway). Groundeados contra la KB de Solo (`solo-knowledge-base`). Cubren los items 3, 5, 6, 7, 8, 8b y 9. Build es+en limpio; `casos.json`/`casos-detalle.json` regenerados (126 casos). KPIs marcados `(estimación, T1)`.

- ✅ **3. Chain de agentes (A2A multi-equipo).** `it-seguridad/orquestacion-multiagente-incidente` (A2, capacidad `chain-de-agentes`): incidente cruza red+soporte+seguridad, orquestador kagent + validador A2A, agentgateway proxya A2A con identidad por agente, contención con HITL.
- ✅ **5. Varios LLMs + balanceo.** `operador/enrutado-y-failover-multi-llm` (A5, `multi-llm-balanceo`): model failover con priority groups + failover por coste cross-provider + rate limit por tokens + `overrides` de max_tokens.
- ✅ **6. AgentEvals en producción.** `it-seguridad/evaluacion-continua-con-agentevals` (A6, `agentevals`): eval sets dorados, eval basada en trazas OTel zero-code, evaluadores personalizados, LLM-as-judge con traza, gate de release CI/CD.
- ✅ **7. Migración de proveedor + semantic router ExtProc.** `operador/migracion-proveedor-llm-semantic-router` (A5, `migracion-semantic-routing`): body-based routing como punto de indirección, semantic router vía ExtProc (kgateway), migración canary.
- ✅ **8. Judge LLM.** `legal/verificacion-con-llm-juez` (A1, `judge-llm`): ejecutor + LLM juez con identidad separada (A2A), eleva lo dudoso al HITL; encaje agentevals.
- ✅ **8b. Guardrails externos BYO (webhook/ExtMCP).** `it-seguridad/guardrails-externos-byo-webhook` (A7, `guardrails-externos`): Guardrail Webhook API (**Beta**) `/request`+`/response` Pass/Mask/Reject vía `EnterpriseAgentgatewayPolicy.promptGuard`, NeuralTrust como backend vendor-neutral, ExtMCP a nivel de método MCP.

## D. Sistema de labels / filtros del catálogo (consolidar)

> Estado 2026-07-07: filtros vivos en `casos-de-uso.jsx` = **rol · técnica · arquetipo · capacidad · gateway · madurez**. Añadidos esta tanda: **Capacidad destacada** (parseada del marcador `<!-- capacidad: X -->` del README; 7 casos etiquetados) y **Rol de gateway** (`gw:[...]` de `casos.js` → `gateways[]` en `casos.json`; 126/126). Pendientes de D: ejes **Producto Solo**, **Asistente de código**, **Framework de agente**, **Sector** (no implementados aún).

- 🔄 Ampliar los filtros del catálogo más allá de rol y patrón técnico. Ejes de label propuestos:
  - **Patrón técnico**: analítico · triage · código · operacional · asistencia · documentos · generación.
  - **Rol de gateway** (item 4): LLM Gateway · MCP Gateway · AgentGateway.
  - **Producto Solo implicado**: agentgateway · kagent · agentregistry · agentevals · Istio ambient · kgateway.
  - **Capacidad destacada**: chain de agentes (item 3) · multi-LLM / balanceo (item 5) · AgentEvals (item 6) · migración (item 7) · semantic routing / ExtProc (item 7) · Judge LLM (item 8) · guardrails externos / webhook / ExtMCP (item 8b) · LLM Gateway para asistentes de código (item 9) · gobernanza de harness/asistentes (item 10).
  - **Asistente de código**: Claude Code · Copilot · opencode · Codex · Gemini CLI · Goose.
  - **Framework de agente**: Google ADK · LangGraph · CrewAI · BYO (A2A).
  - **Sector**: transversal · banca · telco · serv. profesionales.
- ⬜ Reflejar estos labels como metadato en cada ficha (`README.md`) y en la portada filtrable del sitio. **(→ skill)**

## E. Casos nuevos — ampliación (asistentes, harness, substrate)

- ✅ **9. LLM Gateway delante de asistentes de código (2026-07-07).** `desarrollador/llm-gateway-asistentes-de-codigo` (A8, capacidad `llm-gateway-codigo`): agentgateway como LLM Gateway ante Claude Code/Copilot/opencode/Codex/Gemini CLI/Goose; rate limit por tokens, semantic caching, prompt guard+PII, routing/failover, observabilidad por invocación; Goose↔agentgateway (GA); push/PR con HITL. (Substrate ACP marcado emergente, no incluido.)
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

## G. Sincronizar fichas README ↔ objeto del reproductor (119 casos)

> **✅ COMPLETADO (2026-07-07).** Los 13 roles (119 casos) sincronizados. Método: **1 subagente por rol**, edita README + `casos.js` directamente, **README primario**, promueve al README cualquier validador/gate útil que solo esté en el spec, corre en serie, build es+en entre roles.
>
> **Todos los roles hechos:** legal (11) · finanzas (8) · it-seguridad (10) · operador (10) · frontline (9) · manager (12) · analista (8) · desarrollador (4) · ventas (9) · marketing (9) · soporte (11) · rrhh (10) · ejecutivo (8). Cada uno verificado con build es+en limpio. Cierre: `casos.json` regenerado (119) + `casos-detalle.json` (prebuild) + build es+en final limpio.
>
> Reglas aplicadas: alineado `label`/`sub` de MCP al README, `label` del `agent` al bloque 5 (kebab-case), validador A2A solo si el README lo declara (o promovido al README si el spec tenía uno útil), nº nodos MCP = nº MCPs del README (escritura/envío con `gate:true`); NO se tocaron `danger`/`c.risk`/momento del `hitl` (ejes ya diferenciados en §H) salvo contradicción del README (casos read-only → HITL reubicado a `trace` o eliminado); NO se tocaron los alias-piloto de id corto.
>
> Pendiente residual (menor): saneado estructural de headings duplicados Fase 2 en algunos README (ej. `ejecutivo/gestion-de-calendario`), y afinar `c.risk` de texto donde el vector cambió — no bloqueante.
>
> ---
> Diagnóstico original (histórico):

Estado: las 119 fichas tienen (a) README largo con bloque 5 y (b) objeto `spec` en `website/src/components/ScenarioPlayer/casos.js`, **autorados por separado** → divergen. Diagnóstico por nombres de MCP en `website/.journal/sync-divergencia.md`: **5 alineados · 89 solape parcial · 25 sin solape**; además divergen nombres de agente/validador y mecanismos del bloque 5 (ej. `legal/due-diligence`: README `dd-analyst`+`clause-verifier` / `mcp-dataroom,mcp-clm,mcp-sharepoint` vs reproductor `dd-agent`+`reference-checker`).

- ⬜ **Fuente de verdad: caso por caso** (decisión 2026-07-06). En cada caso, elegir la mejor de las dos redacciones y alinear la otra; no hay regla global.
- ⬜ Método: 1 subagente por caso (o por rol) que lee README + objeto, decide y reescribe el que pierda, dejando MCPs/scopes, nombre de agente/validador, gates y mecanismos idénticos en ambos. Regenerar `casos-detalle.json` (prebuild) + build es+en por tanda.
- ⬜ Priorizar los **25 sin-solape**, luego los 89 parciales.
- ⬜ Al cerrar, verificar que el bloque 5 escrito y el tab Solo.io del reproductor cuentan la misma historia (mismos componentes, misma identidad SPIFFE/OIDC/OBO, mismas políticas).

## H. Arquetipos dinámicos: diferenciar visualmente los 119 diagramas

> **Bloqueado por presupuesto** (subagentes). Diseño ya hecho: `catalogo-agentico/01-casos-de-uso/arquetipos-dinamicos.md`.

Problema (2026-07-06): los 119 `spec` convergieron a ~1 forma — **70 casos** comparten "agente + validador + 4 MCPs" y **125/125** tienen el HITL en la última etapa (`pass`). Al abrir 3 casos distintos se ven idénticos. El motor (`compiler.js`) **sí soporta** variación (momento del HITL por etapa, `danger` en cualquier nodo, nº de MCPs, kgateway, validador opcional); los specs no la aprovechan.

- ⬜ Diseñada taxonomía extendida `A<N>.<v>` (11+ variantes) en `arquetipos-dinamicos.md`, con 4 ejes de variación: forma, momento del HITL (temprano/tardío/ninguno/doble), vector de vulnerabilidad destacado (`prompt-injection`/`shadow-mcp`/`jailbreak`/`exfiltración`/`excessive-agency`/`cross-tenant`…), y coreografía de aristas.
- ✅ **Dos ejes diferenciados en los 119 casos del catálogo** (2026-07-06). Vector de vulnerabilidad: **6 formas** de `danger` repartidas — `llm,shadow` 62 · `ext,shadow` 34 · `mcpD,shadow` 12 · `user,shadow` 9 · `mcpC,shadow` 5 (antes 1 forma). Momento del HITL: **25 temprano (`impacto`) / 101 tardío (`pass`)** (antes 125/0). Regla de vector por arquetipo aplicada de forma determinista (A1/A5/A7→`llm`; A2/A6→`ext`+arista `ext→agent`; A3-write→`mcp`-gate; A4→`user`). Quedan 5 objetos genéricos que son **alias piloto con id corto** (`legal`/`finanzas`/`soc`/`ops`/`banca`), no casos del catálogo — solo accesibles por `?case=<id>` directo; sin impacto en la navegación.
- ⬜ Mapear cada uno de los 119 casos a una variante `A<N>.<v>` según su README (nuevo campo `arqDin` en `casos.json` vía generador). Regla de vector por arquetipo (validada en la muestra): A1→`llm` (alucinación), A2→`ext` (injection) / MCP-acción, A3→`mcp`-write, A4→`user` (jailbreak), A5→`llm`/`mcp`-apply, A6→`ext` (web injection), A7→`llm` (claim), A8→`llm` (secretos). HITL temprano (`impacto`) en A2/A3-write/A5/KYC; tardío (`pass`) en publish; ninguno en A3-RO/A4-deflection.
- ⬜ Reescribir los `spec` por **tandas por variante** (no por rol): dentro de una variante comparten esqueleto; entre variantes se ven distintos. Mover el `hitl:true` a la etapa correcta (`impacto` para acceso, `pass` para write, ninguno para RO/deflection), fijar `danger` en el nodo del vector real y `c.risk` describiéndolo.
- ⬜ Verificar con el script de conteo de formas: objetivo **≥ 11 formas** repartidas y HITL NO concentrado en `pass`.
- ⬜ Plegar la regla en el skill `crear-caso-de-uso` (elegir variante dinámica; no copiar el molde 4-MCP+validador+HITL-en-pass).

## Notas

- Items 2, 4 y D son convenciones/estructura → actualizar el skill `crear-caso-de-uso` cuando se implementen.
- Items 3, 5, 6, 7, 8 son **nuevos casos**; al crearlos, seguir el patrón de 5 bloques + escenario del reproductor del skill, y respaldar toda cifra factual con T1.
- Verificar contra la KB (`solo-knowledge-base`) cualquier capacidad de producto antes de afirmarla (ExtProc, model-failover, agentevals, A2A ya confirmados).
