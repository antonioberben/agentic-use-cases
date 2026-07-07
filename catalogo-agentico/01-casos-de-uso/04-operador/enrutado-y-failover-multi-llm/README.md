# Enrutado y failover entre varios LLMs

**Rol principal:** operador (SRE/Plataforma) · **Sectores:** transversal · **Patrón técnico:** operacional · **Madurez recomendada:** nivel 3-4

**Capacidad destacada:** multi-LLM / balanceo
<!-- capacidad: multi-llm-balanceo -->

> La capa de gobierno de este caso vive en el bloque 5 (arquitectura de remediación). No llevar a producción sin ella.

## 1. Caso de uso

La plataforma expone un único endpoint de modelo a decenas de agentes, asistentes de código y apps internas. Hoy cada equipo cablea su propia clave y su propio proveedor: unos apuntan a gpt-4.1 para todo (caro y lento para tareas triviales), otros a un solo proveedor sin alternativa cuando ese proveedor tiene un incidente. No hay un punto donde medir consumo, imponer un cap de tokens ni conmutar de modelo cuando uno se degrada.

El problema tiene dos caras. Coste: el 80% de las llamadas son tareas baratas (clasificación, resumen corto, autocompletado) que no necesitan un modelo premium, pero se sirven con él porque nadie decide el enrutado. Resiliencia: cuando el proveedor primario devuelve 429/5xx o sube la latencia, los agentes fallan en cascada porque no hay fallback y el reintento vive disperso en cada app.

Se busca un único endpoint estable delante del cual la plataforma decida el modelo por coste y conmute a un fallback premium solo cuando haga falta, sin que ningún equipo toque su código. Volumen típico: decenas de servicios, millones de llamadas/mes, varios proveedores (OpenAI, Anthropic, modelo local).

## 2. Cómo resolverlo

### Local (laboratorio)

Ollama con dos modelos (uno pequeño tipo `llama3.1:8b`, uno mayor tipo `qwen2.5:32b`) detrás de un proxy que enruta por tamaño de prompt. Sirve para entender el patrón priority-group antes de llevarlo a proveedores reales. Cliente: cualquier SDK OpenAI-compatible apuntando al proxy.

### Copilot

No aplica como herramienta ofimática. El homólogo aquí es apuntar los asistentes de código corporativos (GitHub Copilot, Claude Code, Gemini CLI) al endpoint único de la plataforma en vez de a cada proveedor: el enrutado y el cap de coste se aplican centralizado, sin configuración por desarrollador.

### Claude Code u otro agente de escritorio

`AGENTS.md` del repo `platform-llm-gateway/` fija: el endpoint único como única URL de modelo permitida; la política de grupos (grupo 1 barato load-balanced, grupo 2 premium como fallback); los `overrides` de `max_tokens` por defecto; y la regla de que ningún servicio incrusta claves de proveedor. El agente propone cambios de configuración de routing como PR sobre el repo de la plataforma; nunca aplica en caliente sin gate.

### MCPs

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| Config del gateway | `mcp-gateway-config` `vault://platform/llm-gw` | `config:read` |
| Observabilidad | `mcp-otel` / `mcp-grafana` `vault://obs/llm` | `metrics:read` |
| Cambio de política de routing | `mcp-gateway-config` (mismo) | `config:write (gate)` |

Least privilege: lectura por defecto sobre config y métricas. Cualquier cambio de la política de grupos (`config:write`) exige gate humano; una regla de routing errónea puede desviar todo el tráfico a un modelo caro o a un proveedor con residencia de datos no permitida.

### Alternativas

Un proxy OpenAI-compatible genérico (LiteLLM u homólogo) da el enrutado básico, pero sin identidad por agente, sin allowlist de herramientas, sin rate limit por tokens gobernado ni observabilidad por invocación integrada. Sirve de laboratorio; no de plano de datos gobernado.

## 3. KPIs y mejora de rendimiento

| KPI | Base | Con agente |
|-----|------|-----------|
| Coste por 1M llamadas | *proveedor premium para todo* | *−40% a −60% con grupo barato* |
| Disponibilidad efectiva del endpoint de modelo | *ligada a 1 proveedor* | *fallback cross-provider automático* |
| Tiempo de recuperación ante degradación del primario | *manual, minutos* | *conmutación en el propio request* |
| Llamadas con `max_tokens` sin cap | *frecuentes* | *cap por `overrides`* |

*Fórmula: ahorro ≈ (coste_premium − coste_grupo_barato) × fracción de tráfico trivial (~0.8) × volumen mensual. (estimación, T1)*

## 4. Vulnerabilidades y riesgos

- *"Si un equipo apunta su app directamente al proveedor saltándose el endpoint único, ese tráfico no tiene cap de tokens, ni redacción de PII, ni traza: es un endpoint de modelo no gobernado (shadow AI de plano de datos)."*
- *"Si el modelo al que enruto está alojado en una región no permitida, mando datos de cliente a un proveedor cuya residencia incumple el contrato de tratamiento (GDPR, transferencias internacionales)."*
- *"Si no hay cap de `max_tokens`, un prompt malicioso o un bug de un agente dispara respuestas enormes y el coste se descontrola sin techo."*
- *"Si el prompt lleva PII y sale a un proveedor externo sin redacción, exfiltro datos personales; esos tokens pueden quedar en logs del proveedor."*
- *"Si publico un modelo nuevo sin declarar al usuario que la salida es generada por IA ni qué proveedor la produce, incumplo la transparencia exigida (EU AI Act art. 50)."*
- *"Si cambio la política de routing en caliente sin revisión, una regla errónea desvía todo el tráfico al modelo más caro o a un proveedor caído."*

**Shadow AI:** el vector aquí es un app-team que cablea su propia clave y apunta directo a un proveedor, un endpoint de modelo fuera del inventario. Lo no registrado no debe recibir credencial de salida ni ruta.

Estas vulnerabilidades se cubren con la capa de gobernanza del bloque 5 (arquitectura de remediación); no llevar a producción sin ella.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** A5 (operacional sobre infraestructura; variante plano de datos LLM, ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `llm-router-ops` no enruta el tráfico él mismo: la conmutación la hace **agentgateway** por configuración declarativa (`AgentgatewayBackend.spec.ai.groups`). El agente observa métricas, propone ajustes de la política de grupos y los abre como cambio revisable; el gate humano aprueba antes de que una nueva política de routing entre en vigor.

| Riesgo (del bloque 4) | Componente Solo | Mecanismo (dónde/cómo) |
|---|---|---|
| App apunta directo al proveedor saltándose el gateway → endpoint de modelo no gobernado (shadow AI) | agentregistry + Istio ambient | solo los backends y agentes registrados obtienen ruta; `AuthorizationPolicy` deniega el egress directo a proveedores desde workloads no autorizados, forzando el paso por el gateway |
| Modelo en región no permitida → transferencia de datos que incumple residencia (**GDPR, transferencias internacionales**) | agentgateway | los `groups` solo incluyen backends de proveedores con residencia aprobada; el body-based routing no puede seleccionar un proveedor fuera de la allowlist de la política |
| Coste descontrolado por respuestas sin techo | agentgateway | `overrides` de `max_tokens` fuerzan el cap aunque el caller pida más; **rate limit por tokens** por agente/equipo corta el consumo excesivo |
| PII en el prompt hacia proveedor externo → exfiltración (**GDPR art. 32**) | agentgateway | prompt guard con PII y/o Guardrail Webhook API *(Beta)* redacta antes de que el prompt salga del cluster |
| Salida IA sin declarar proveedor/naturaleza generada (**EU AI Act art. 50**) | agentgateway + agentevals | la traza por invocación registra modelo y proveedor efectivos; base para la etiqueta de transparencia y para auditoría |
| Cambio de política de routing en caliente sin revisión → desvío masivo de tráfico | agentgateway + agentevals | `config:write` sobre la política pasa por gate humano (PR); golden eval sets validan coste/latencia del cambio en CI antes de promover |
| Fallo del proveedor primario → caída en cascada de agentes | agentgateway | **model failover con priority groups**: grupo 1 barato load-balanced round-robin; si el grupo falla, cae al grupo 2 premium; conmutación en el propio request, sin tocar la app |

**Cómo se consigue la identidad:** cada agente y app cliente no es anónimo. En malla ambient recibe identidad SPIFFE vía mTLS emitida por istiod y aplicada en ztunnel; agentgateway valida su credencial OIDC/JWT (JWKS remoto) en cada petición al endpoint de modelo, de modo que el rate limit por tokens y el enrutado se atribuyen al consumidor real.

**Dónde se aplican las políticas:** no viven en la app. El enrutado por coste, el failover por priority groups, el cap de `max_tokens` y el rate limit por tokens se aplican en el plano de datos de agentgateway (`AgentgatewayBackend.spec.ai.groups`, `overrides`, `AgentgatewayPolicy`); la segmentación que impide el egress directo a proveedores se aplica en la malla vía `AuthorizationPolicy` de Istio (L4 en ztunnel, L7 en waypoint).

## Referencias

*Citas T1.*
