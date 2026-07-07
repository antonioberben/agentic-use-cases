# Guardrails externos "bring your own" vía Guardrail Webhook API / ExtMCP

**Rol principal:** it-seguridad · **Sectores:** transversal · **Patrón técnico:** operacional · **Madurez recomendada:** nivel 3 (gobernado)

**Capacidad destacada:** guardrails externos / webhook / ExtMCP
<!-- capacidad: guardrails-externos -->

> La capa de gobierno de este caso vive en el bloque 5 (arquitectura de remediación). No llevar a producción sin ella.

## 1. Caso de uso

Un equipo de seguridad ha desplegado asistentes de IA que hablan con LLMs y con MCPs internos. Los prompt guards integrados del punto de control (rechazo por patrón, enmascarado de PII, moderación básica) cubren lo evidente, pero **no cubren un requisito de compliance avanzado**: detección de intentos de exfiltración con ofuscación, taxonomías de toxicidad propias del sector, política de datos regulados que cambia por jurisdicción, o un motor de clasificación que el equipo de riesgos ya tiene homologado y auditado.

Hoy, cuando el guard integrado no llega, la respuesta habitual es una de dos: aflojar el control (y aceptar el riesgo) o escribir lógica de filtrado dispersa dentro de cada asistente. Lo segundo se convierte en código de seguridad no auditado, distinto en cada equipo, imposible de gobernar de forma central y que nadie mantiene. El volumen es todas las peticiones y respuestas de todos los asistentes de IA de la organización: el punto donde un fallo de contención es sistémico, no anecdótico.

## 2. Cómo resolverlo

La idea es **externalizar la decisión de guardrail** a un sistema propio, en la ruta síncrona de cada petición y cada respuesta, sin meter lógica de seguridad dentro de los asistentes.

### Local (laboratorio)

Modelo local (Ollama / LM Studio) detrás de un proxy que llama a un pequeño servidor webhook propio (Python/FastAPI) con dos endpoints, `POST /request` y `POST /response`. El servidor devuelve una de tres acciones: **Pass**, **Mask** (redacta y devuelve el texto modificado) o **Reject** (bloquea). Prompt tipo para probar el flujo: entradas con PII ofuscada, con intento de fuga de secreto y benignas, para ver las tres ramas.

### Copilot

M365 Copilot no expone la ruta de inferencia para insertar un guardrail propio; su moderación es la del proveedor. Para requisitos de compliance avanzados que exijan un motor homologado, el flujo gobernable no pasa por Copilot sino por asistentes cuyo tráfico atraviesa un punto de control propio (siguiente apartado). Copilot sirve para tareas de ofimática de bajo riesgo, no como sustituto del guardrail externo.

### Claude Code u otro agente de escritorio

`AGENTS.md` fija: el endpoint de modelo apunta siempre al punto de control (nunca al proveedor directo), no se implementa filtrado de seguridad en el propio agente (la decisión es externa y central), allowlist de MCPs de solo lectura, y ninguna acción de escritura o publicación sin gate humano. El agente asume que request y response pueden ser modificados o rechazados por el guardrail externo y trata el `403` como resultado esperado, no como error a reintentar.

### MCPs

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| mcp-siem | `vault://mcp/siem` | `events:read` |
| mcp-kb-seguridad | `vault://mcp/sec-kb` | `docs:read` |
| mcp-ticketing | `vault://mcp/servicenow` | `tickets:read` |

Todos de lectura. El guardrail externo no es un MCP de negocio: es un servidor de decisión (webhook HTTP, o gRPC para el patrón a nivel de método MCP). Cualquier acción con efecto (`tickets:write`, cierre de incidente) va con gate humano.

### Alternativas

Claude/ChatGPT/Gemini web con adjuntos solo para material no identificable y con cláusula de no entrenamiento. No sirven para el requisito de este caso: no permiten insertar un motor de guardrail propio y homologado en su ruta de inferencia, que es justo lo que exige el compliance avanzado.

## 3. KPIs y mejora de rendimiento

| KPI | Base | Con agente |
|-----|------|-----------|
| Cobertura de política de contención (categorías cubiertas) | parcial (solo guards integrados) | completa (motor propio homologado) |
| Lógica de filtrado duplicada por asistente | 1 por equipo | 0 (central) |
| Tiempo de propagación de un cambio de política | semanas (recodificar cada asistente) | minutos (una política) |
| Respuestas con PII no contenida | > 0 | ~0 |

*Fórmula: (nº asistentes) × (horas de mantener filtrado propio por asistente/año) evitadas al centralizar, más el coste esperado de un incidente de contención evitado. (estimación, T1).*

## 4. Vulnerabilidades y riesgos

- *Si escribo el filtrado de seguridad dentro de cada asistente*, tengo lógica de contención no auditada, divergente entre equipos y sin punto único de evidencia: un cambio regulatorio obliga a tocar N repositorios y algunos se quedan atrás (EU AI Act, transparencia y gestión de riesgo).
- *Si el LLM devuelve una respuesta con PII o con datos regulados sin contención*, hay fuga de datos personales (GDPR / AEPD); sin un guard en la ruta de response, la fuga llega al usuario final.
- *Si un asistente recibe una instrucción de exfiltración ofuscada que el guard integrado no reconoce*, el motor externo homologado debería atraparla; sin él, el intento pasa (contenido malicioso / prompt injection).
- *Si conecto un servidor de guardrail que alguien montó por su cuenta*, sin registrar ni auditar, ese propio servidor de decisión es **shadow AI** en la ruta crítica: si falla abierto o lo manipulan, deja de contener y nadie lo sabe.
- *Si el punto de control no valida la identidad del asistente*, un agente anónimo evita el guardrail apuntando el modelo a otro sitio, y el control se vuelve opcional.
- *Si dejo el consumo sin límite*, un asistente en bucle dispara coste de tokens sin techo (NIS2: continuidad y gestión de riesgo del servicio).

Estas vulnerabilidades se cubren con la capa de gobernanza del bloque 5 (arquitectura de remediación); no llevar a producción sin ella.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** A7 (generación con guardrails externos) — variante con validación síncrona en request y response vía webhook de terceros.

El punto de control (agentgateway) llama **síncronamente** al servidor de guardrail externo del equipo mediante la **Guardrail Webhook API (Beta)**: dos endpoints, `POST /request` (antes de mandar el prompt al LLM) y `POST /response` (antes de devolver la salida al usuario), con tres acciones posibles — **Pass**, **Mask** (redacta, por ejemplo PII) o **Reject** (bloquea con HTTP `403`). Se engancha vía `EnterpriseAgentgatewayPolicy` → `spec.backend.ai.promptGuard.request[].webhook.backendRef` (y `.response[]`). Un proveedor externo como **NeuralTrust (TrustGuard)** encaja aquí como **uno de los backends de guardrails conectables por webhook** (junto a otras opciones, por ejemplo AWS Bedrock Guardrails vía ApplyGuardrail); es un complemento, no un gateway ni un competidor: el gateway sigue siendo el plano de datos y el motor externo es el que decide. Para control a nivel de método MCP (`tools/call`, `tools/list`) el mismo patrón existe como **ExtMCP**, un servidor gRPC que valida cada invocación de herramienta.

| Riesgo (del bloque 4) | Componente Solo | Mecanismo (dónde/cómo) |
|---|---|---|
| Requisito de compliance avanzado que el guard integrado no cubre | agentgateway | Guardrail Webhook API (Beta): `POST /request` y `POST /response` al motor externo; acciones Pass/Mask/Reject vía `EnterpriseAgentgatewayPolicy` → `promptGuard.request[].webhook.backendRef` |
| PII o dato regulado en la respuesta del LLM | agentgateway | guard de `response` con acción **Mask** (redacta antes de devolver al usuario) o **Reject** (`403`) si la política lo exige |
| Contenido malicioso / exfiltración ofuscada no vista por el guard integrado | agentgateway + backend externo | NeuralTrust (u otro backend homologado) como backend de webhook decide; el gateway aplica la acción; alternativa a nivel MCP vía **ExtMCP** (gRPC) en `tools/call` |
| Servidor de guardrail montado sin registrar (shadow AI en ruta crítica) | agentregistry | el backend de guardrail y el asistente se declaran; lo no registrado no obtiene identidad ni allowlist; el `backendRef` solo apunta a backends inventariados |
| Asistente anónimo que esquiva el punto de control | kagent + Istio ambient | identidad SPIFFE por mTLS y validación OIDC/JWT en cada petición; `AuthorizationPolicy` deniega egress directo al proveedor, forzando el paso por el gateway |
| Consumo de tokens sin techo | agentgateway | rate limit por tokens; observabilidad OpenTelemetry de cada invocación |
| Regresión de la política de guardrail al cambiar el motor externo | agentevals | golden eval sets con casos límite (PII ofuscada, jailbreak, benignos) y LLM-as-judge con traza en CI/CD antes de promover un cambio de política |

**Cómo se consigue la identidad:** el asistente no es anónimo. En malla ambient recibe identidad SPIFFE vía mTLS emitido por istiod y aplicado en ztunnel; agentgateway valida su credencial OIDC/JWT (JWKS remoto) en cada petición antes de llamar al guardrail externo.

**Dónde se aplican las políticas:** no viven en el asistente. La invocación síncrona del guardrail externo se declara en `EnterpriseAgentgatewayPolicy` (`spec.backend.ai.promptGuard.request[]/.response[].webhook.backendRef`) sobre el plano de datos de agentgateway; la segmentación y el bloqueo de egress directo al proveedor se aplican en la malla vía `AuthorizationPolicy` de Istio.

## Referencias

*Citas T1.*
