# Migración de proveedor de LLM sin cambiar la app + selección de modelo con semantic router (ExtProc)

**Rol principal:** Operador (Plataforma) · **Sectores:** transversal · **Patrón técnico:** operacional · **Madurez recomendada:** nivel 3-4 (gobernado/optimizado)

**Capacidad destacada:** migración / semantic routing (ExtProc)
<!-- capacidad: migracion-semantic-routing -->

> La capa de gobierno de este caso vive en el bloque 5 (arquitectura de remediación). No llevar a producción sin ella.

## 1. Caso de uso

La empresa tiene decenas de aplicaciones y agentes que apuntan directamente al SDK de un proveedor de LLM (endpoint y clave embebidos en cada app). Ahora hay que cambiar de proveedor, repartir tráfico entre dos, o mandar cada petición al modelo adecuado según su coste y complejidad. Hacerlo app por app es inviable: cada equipo tendría que tocar código, redeplegar y re-testear, y no hay forma de migrar de forma progresiva ni de volver atrás rápido si el nuevo proveedor degrada.

Hoy el patrón típico es "cada app con su clave": sin punto único de indirección, sin visibilidad de qué modelo consume qué, y con el coste disparado porque todas las peticiones (triviales y complejas) van al mismo modelo premium. Migrar un proveedor puede tardar semanas y bloquear a varios equipos.

## 2. Cómo resolverlo

### Local (laboratorio)

Ollama o LM Studio con dos modelos (uno pequeño tipo Llama 8B y uno grande) detrás de un proxy local; un router mínimo que clasifica la petición y elige modelo. Sirve para entender el patrón coste↔calidad antes de llevarlo al plano real.

### Copilot

No aplica directamente: es infraestructura de plataforma, no una tarea de escritorio. El equipo de plataforma expone un endpoint interno único al que apuntan los asistentes de código (Copilot, Claude Code) para que también su tráfico pase por el mismo plano de routing y observabilidad.

### Claude Code u otro agente de escritorio

`AGENTS.md` del repo `platform-llm-gateway/` fija: los cambios de política de routing y los pesos de canary se editan como archivos versionados (GitOps), nunca a mano en el clúster; el agente solo propone el diff y abre PR; la promoción de un canary o el cambio de proveedor exige aprobación humana. Allowlist de herramientas: leer configuración y métricas; escribir solo vía PR.

### MCPs

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| mcp-git | `vault://platform/git` | `git:read`, `git:pr` |
| mcp-metrics | `vault://platform/otel-metrics` | `metrics:read` (coste/latencia/error por modelo) |
| mcp-routing-config | `vault://platform/routing-config` | `config:write (gate)` — aplicar política de routing / promover canary |

El único scope de escritura (`mcp-routing-config`) va con gate humano: aplicar una nueva política de routing o promover un canary no ocurre sin aprobación.

### Alternativas

Editar la config de routing a mano en cada gateway sin GitOps ni revisión: rápido pero sin trazabilidad ni rollback. No recomendable fuera de laboratorio.

## 3. KPIs y mejora de rendimiento

| KPI | Base | Con agente |
|-----|------|-----------|
| Tiempo de migración de proveedor | *semanas (app por app)* | *horas (una política, sin tocar apps)* |
| Coste medio por 1k peticiones | *100% (todo a premium)* | *40-60% (barato↔premium según complejidad)* |
| Apps que hay que redeplegar para migrar | *decenas* | *0* |
| Tiempo de rollback ante degradación | *horas/días* | *minutos (revertir política)* |

*Fórmula de ahorro: reducción de coste por routing barato↔premium sobre el volumen de peticiones + horas de ingeniería evitadas en la migración app por app. (estimación, T1)*

## 4. Vulnerabilidades y riesgos

- *"Si migro a un proveedor nuevo sin controlar dónde procesa los datos, puedo mandar datos de clientes a una región o jurisdicción no permitida"* — transferencia internacional y residencia de datos (**GDPR arts. 44-49, AEPD**).
- *"Si el nuevo proveedor entrena con las peticiones o las retiene, expongo datos internos"* — fuga de datos y dependencia de proveedor (**EU AI Act**, obligaciones de transparencia y gestión de proveedores de modelos).
- *"Si el semantic router recibe una petición manipulada, puede degradar a un modelo inseguro o filtrar contexto"* — el LLM como vector de exfiltración/alucinación.
- *"Si quedan apps que siguen apuntando al proveedor viejo directamente, tengo tráfico de IA fuera del plano de control"* — **shadow AI**: consumo y coste sin gobierno ni observabilidad, imposible de migrar o auditar.
- *"Si el cambio de política de routing lo aplica el agente solo, una promoción de canary equivocada manda producción al modelo/proveedor incorrecto"* — acción sensible sin gate.
- *"Si no mido coste por modelo, el routing puede desviarse al modelo caro sin que nadie lo note"* — coste descontrolado.

Estas vulnerabilidades se cubren con la capa de gobernanza del bloque 5 (arquitectura de remediación); no llevar a producción sin ella.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** A5 — operacional infra (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `llm-migration-operator` propone cambios de política de routing/canary como diff versionado; **agentgateway** es el punto único de indirección del plano LLM y **kgateway** aporta **ExtProc** para el semantic router.

### Particularizaciones de este caso

| Riesgo (del bloque 4) | Componente Solo | Mecanismo (dónde/cómo) |
|---|---|---|
| Datos de cliente a jurisdicción no permitida al cambiar de proveedor (GDPR 44-49) | agentgateway + Istio ambient | **body-based LLM provider routing** enruta según cuerpo hacia el proveedor/región permitida; `AuthorizationPolicy` L4/L7 niega egress a endpoints de proveedor no aprobados |
| Selección de modelo caro↔barato según coste/relevancia/contexto | kgateway (**ExtProc**) | semantic router como external processing: clasifica la petición on the fly y elige modelo; **model failover por priority groups** en agentgateway como resiliencia y fallback de coste |
| Migración progresiva y rollback (canary entre proveedores) | agentgateway | reparto de tráfico por política declarativa; promover canary o cambiar proveedor sin tocar apps; revertir = revertir la política |
| Apps que siguen apuntando al proveedor viejo (shadow AI) | agentregistry + Istio ambient | inventario de qué consume qué modelo; lo no registrado no obtiene ruta ni identidad; `AuthorizationPolicy` fuerza que todo egress LLM pase por el gateway |
| Fuga/exfiltración vía el LLM y proveedor que entrena con las peticiones | agentgateway | prompt guards con PII y `overrides` de campos (ej. cap de `max_tokens`); política de no-retención por proveedor; observabilidad por invocación |
| Promoción de canary / cambio de política sin gate | kagent + agentevals | la escritura de `mcp-routing-config` exige HITL; **agentevals** valida la nueva política contra un golden set de coste/calidad antes de promover |

**Cómo se consigue la identidad:** el agente `llm-migration-operator` no es anónimo. En malla ambient recibe identidad **SPIFFE** vía mTLS emitido por istiod y aplicado en ztunnel; **agentgateway** valida su credencial **OIDC/JWT** en cada petición; **kagent** usa intercambio de token **OBO** para actuar con el scope delegado del operador.

**Dónde se aplican las políticas:** no viven en el agente. El routing de proveedor y los guardrails del plano LLM se aplican en **agentgateway** vía `AgentgatewayPolicy` (body-based routing, prompt guards, rate limit por tokens, priority groups); el semantic router vive en **kgateway** vía **ExtProc**; la segmentación y el egress se aplican en la malla vía `AuthorizationPolicy` de Istio (L4 en ztunnel, L7 en waypoint).

## Referencias

*Citas T1.*
