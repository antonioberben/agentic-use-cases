# Evaluación continua de agentes en producción con agentevals

**Rol principal:** it-seguridad (aseguramiento de calidad) · **Sectores:** transversal (intensivo en banca, telco, sector público) · **Patrón técnico:** operacional · **Madurez recomendada:** nivel 3-4 (agentes ya en producción; se instrumenta la mejora continua)

**Capacidad destacada:** AgentEvals
<!-- capacidad: agentevals -->

> La capa de gobierno de este caso vive en el bloque 5 (arquitectura de remediación). No llevar a producción sin ella.

## 1. Caso de uso

Los agentes ya están en producción respondiendo a usuarios, clasificando alertas o redactando borradores. La pregunta que nadie sabe contestar es: **¿cómo sé que hoy funcionan igual que el día que los aprobé?** Un cambio de versión del modelo del proveedor, una deriva silenciosa del comportamiento, un prompt de sistema retocado por un equipo o un dato de entrada nuevo degradan la calidad sin que salte ninguna alarma: el agente sigue respondiendo, solo que peor. Hoy la detección es reactiva y anecdótica: alguien se queja, un cliente escala, un auditor pregunta por qué una decisión salió como salió y no hay evidencia. No hay línea base ni umbral objetivo, así que "está bien" es una opinión.

El volumen agrava el problema: una organización con decenas de agentes y varias versiones de modelo por trimestre no puede revisar salidas a mano. El equipo de aseguramiento de calidad necesita convertir "creo que va bien" en una métrica reproducible que se mida sola en cada release y en producción.

## 2. Cómo resolverlo

### Local (laboratorio)

Ollama + Llama 3.1 70B como modelo juez local sobre un pequeño conjunto de trazas anonimizadas exportadas de un agente piloto. Prompt tipo: *"Dada esta traza (entrada, herramientas invocadas, salida) y este criterio de éxito, puntúa de 0 a 1 la fidelidad, la relevancia y el cumplimiento de formato. Justifica con la evidencia de la traza. No inventes criterios que no estén en la rúbrica."* Sirve para prototipar la rúbrica antes de instrumentar producción.

### Copilot

No aplica como producto de oficina. El equivalente gestionado son las suites de evaluación de los proveedores (Azure AI Foundry evaluations, comparables), útiles para un primer termómetro pero atadas al proveedor y sin visión de los agentes multi-herramienta desplegados en la propia malla.

### Claude Code u otro agente de escritorio

Repo `agent-evals/` con `AGENTS.md` que fija: la taxonomía de evaluadores (fidelidad, relevancia, seguridad, formato, coste), el formato de los *golden eval sets* (entrada, salida esperada o rúbrica, etiquetas), el umbral de bloqueo por evaluador y la política de que **ningún eval set se modifica sin revisión de dos personas** (evita que se relajen los umbrales para que "pase" un despliegue). Allowlist estrictamente de lectura: trazas, eval sets y estado de CI; **sin permiso para promover releases** salvo gate humano.

### MCPs

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| `mcp-otel-traces` | `vault://evals/otel-ro` | `traces:read` (sin PII de payload; solo metadatos y hashes) |
| `mcp-eval-sets` | `vault://evals/goldensets-ro` | `evalsets:read` |
| `mcp-ci` | `vault://evals/ci-ro` | `pipeline:read`, `deploy:gate` (gate humano; no promueve solo) |

Least privilege y solo lectura por defecto. El único punto de escritura conceptual es el **gate de release**: `deploy:gate` no despliega, solo emite un veredicto pasa/no-pasa que un humano firma. Snippet `mcp.json` con los tres servidores en modo `read-only` y `mcp-ci` sin scope de `deploy:write`.

### Alternativas

Claude/ChatGPT/Gemini web con un lote de trazas **anonimizadas y no identificables** (sin PII, sin IOCs internos, sin identificadores de cliente) para calibrar una rúbrica puntual, con cláusula de no entrenamiento. Solo para diseño de la rúbrica, nunca como evaluador continuo de producción.

## 3. KPIs y mejora de rendimiento

| KPI | Base | Con agente |
|-----|------|-----------|
| Tiempo de detección de deriva de calidad | semanas (reactivo, por queja) | < 1 despliegue (proactivo) |
| Cobertura de releases con evaluación automática | 0% | 100% |
| Regresiones que llegan a producción / trimestre | 4 | < 1 |
| Horas de revisión manual de salidas / release | 6 h | 0,5 h |

*Fórmula de ahorro:* `5,5 h × 30 releases/año = 165 h/año de aseguramiento de calidad`, más el coste evitado de las regresiones que hoy llegan a producción. *(estimación, T1).*

## 4. Vulnerabilidades y riesgos

- *"Si el modelo del proveedor cambia de versión de un día para otro y nadie mide la salida, mi agente de banca degrada la calidad de sus decisiones de forma silenciosa y solo me entero cuando un cliente o un auditor escala."* Deriva de calidad no detectada; incumple la gestión continua de riesgo que exige el EU AI Act para sistemas de alto riesgo (Anexo III).
- *"Si el propio modelo juez (LLM-as-judge) está comprometido, mal calibrado o alucina, valida como bueno lo que es malo y bloquea lo bueno; el gate de calidad se convierte en teatro."* Evaluador comprometido / falsa señal de conformidad.
- *"Si las trazas de producción llevan PII o secretos en el payload y las mando enteras al modelo juez externo, filtro datos personales al proveedor solo para evaluar."* Fuga de PII (GDPR/AEPD).
- *"Si alguien relaja el umbral de un eval set o lo edita sin revisión para que un despliegue urgente pase, deshabilito el control desde dentro."* Manipulación del propio control.
- *"Si evalúo lo que conozco pero hay un agente en producción que nadie registró ni instrumentó, no lo mide nadie."* **Shadow AI**: agente en producción fuera del inventario, sin trazas ni eval set, invisible al aseguramiento de calidad.
- *"Si la evaluación continua dispara miles de llamadas al modelo juez sin control, el coste de evaluar se dispara."* Coste descontrolado del propio evaluador.

Estas vulnerabilidades se cubren con la capa de gobernanza del bloque 5 (arquitectura de remediación); no llevar a producción sin ella.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** A6 — research + síntesis (aplicado a observación y evaluación de trazas de producción; ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `eval-orchestrator` consume trazas de producción vía OpenTelemetry (zero-code) y las contrasta contra los *golden eval sets*, exclusivamente en modo lectura sobre sistemas de negocio. Un sub-agente **`llm-judge`** (A2A, identidad SPIFFE propia) puntúa cada traza con rúbrica y devuelve la evidencia. El único punto de decisión es el **gate de release**: la promoción de una versión de agente o modelo a producción se firma por un humano solo si los evaluadores superan el umbral; si la calidad cae, el despliegue se bloquea en CI/CD (GitHub Actions).

| Riesgo (del bloque 4) | Componente Solo | Mecanismo (dónde/cómo) |
|---|---|---|
| Deriva silenciosa de calidad tras cambio de versión del modelo (**EU AI Act, gestión continua de riesgo, Anexo III**) | agentevals | eval set dorado versionado + evaluación basada en trazas OTel; puntuación por release y muestreo continuo en producción; si `score < umbral` se dispara alerta y se abre incidente |
| Modelo juez comprometido o mal calibrado que valida lo malo | agentevals + agentgateway | LLM-as-judge con traza auditable (rúbrica + evidencia citada); calibración periódica del juez contra un set etiquetado por humanos; el juez corre tras el gateway, con su propia identidad y prompt guard |
| PII/secretos del payload de trazas enviados al modelo juez (**GDPR/AEPD**) | agentgateway | prompt guard con perfil `pii+secrets`: redacción antes de que la traza salga hacia el juez; el `mcp-otel-traces` expone solo metadatos y hashes, no el payload completo |
| Umbral o eval set manipulado desde dentro para forzar un pase | agentregistry + Istio ambient | eval sets y umbrales versionados y firmados; `AuthorizationPolicy` restringe la escritura a la ruta de dos revisores; cualquier cambio queda en el inventario auditable |
| Agente en producción sin registrar que nadie evalúa (**shadow AI**) | agentregistry + agentevals | lo no registrado no obtiene identidad ni allowlist; el inventario cruza agentes desplegados vs. agentes con eval set activo y marca los huérfanos sin cobertura |
| Coste descontrolado del propio evaluador (**NIS2/DORA, resiliencia operativa**) | agentgateway | rate limit por tokens sobre el modelo juez; semantic caching de trazas repetidas; model failover a un juez más barato para la evaluación de muestreo continuo |
| Gate de release sin control humano ni trazabilidad para el auditor | agentgateway + agentevals | el veredicto pasa/no-pasa se emite con evidencia; la promoción a producción exige HITL; OTel per-invocation deja registro para el auditor (NIS2/DORA, ISO/IEC 42001) |

**Cómo se consigue la identidad:** el agente no es anónimo. `eval-orchestrator` y `llm-judge` reciben identidad **SPIFFE** vía mTLS emitida por istiod y aplicada en ztunnel; **agentgateway** valida su credencial **OIDC/JWT** (JWKS remoto) en cada petición; para el gate de release, **kagent** usa intercambio de token **OBO** con el token del ingeniero de aseguramiento que firma la promoción, de modo que el despliegue queda a su nombre y no a una service account anónima.

**Dónde se aplican las políticas:** no viven en el agente. Se aplican en el plano de datos de **agentgateway** vía `AgentgatewayPolicy` (allowlist de MCP solo-lectura, prompt guard con PII/secretos, rate limit por tokens, semantic caching, failover del juez) y en la malla vía `AuthorizationPolicy` de Istio (L4 en ztunnel para restringir egress al proveedor del modelo en la región correcta, L7 en waypoint para limitar la escritura de eval sets a la ruta revisada).

## Referencias

- EU AI Act (gestión continua de riesgo, sistemas de alto riesgo Anexo III), NIS2 y DORA (resiliencia operativa), ISO/IEC 42001 (sistema de gestión de IA), OWASP LLM Top 10. *Citas T1.*
