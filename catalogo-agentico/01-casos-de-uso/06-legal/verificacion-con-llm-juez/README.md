# Verificación de salidas con un LLM juez (LLM-as-judge)

**Rol principal:** legal · **Sectores:** transversal · **Patrón técnico:** documentos · **Madurez recomendada:** nivel 1 piloto en modo asesor; nivel 3 antes de conectar la escritura del dictamen al gestor documental.

**Capacidad destacada:** Judge LLM
<!-- capacidad: judge-llm -->

> La capa de gobierno de este caso vive en el bloque 5 (arquitectura de remediación). No llevar a producción sin ella.

## 1. Caso de uso

Un agente ejecutor redacta una salida cara de verificar y peligrosa si sale mal: un dictamen o una nota legal con citas jurisprudenciales, referencias normativas y una tesis. El coste de un error no es un typo, es una cita a una sentencia inexistente, una afirmación de materialidad sin soporte o la filtración de un dato del cliente que rompe confidencialidad. Hoy la verificación es humana, lenta y cuesta 1-2 horas de revisión por documento; el abogado relee cita a cita antes de firmar. El cuello de botella no está en redactar sino en **verificar** lo redactado.

La técnica: en vez de fiar la calidad a un único modelo, un **segundo modelo actúa de juez**. El agente ejecutor produce el borrador; un LLM juez independiente, con identidad y prompt distintos, lo puntúa contra criterios objetivos (¿cada cita resuelve a una fuente real?, ¿cada afirmación de materialidad tiene soporte en las notas?, ¿hay PII o secreto que no debería estar?) **antes** de darlo por bueno. Lo que el juez marca dudoso no se descarta ni se acepta en silencio: se **eleva al gate humano**. El juez no sustituye al abogado; filtra para que el abogado solo revise lo que de verdad lo necesita.

## 2. Cómo resolverlo

### Local (laboratorio)

Dos instancias en Ollama: Llama 3.1 70B como ejecutor sobre las notas y la conclusión fijada; un segundo modelo (idealmente de familia distinta, ej. Qwen o Mixtral) como juez. Prompt del juez: *"No redactes. Puntúa este borrador de 0 a 100 en cuatro ejes: (1) toda cita resuelve a norma/sentencia existente, (2) toda afirmación de materialidad aparece en las notas de entrada, (3) no hay PII ni secreto del cliente fuera de lo autorizado, (4) el sentido coincide con la conclusión fijada. Devuelve por eje: score, líneas problemáticas y veredicto pass/review."* Ejecutor y juez separados evitan que un mismo sesgo pase la revisión.

### Copilot

M365 Copilot en Word para el borrador; la verificación no encaja bien en Copilot (no hay segunda identidad ni traza del juez). Útil solo como redactor; el juicio se hace fuera.

### Claude Code u otro agente de escritorio

Repo `dictamenes/` con `AGENTS.md` que fija: rúbrica del juez explícita (los cuatro ejes y sus umbrales), formato del veredicto, y la regla dura de que **ninguna salida se finaliza sin veredicto del juez adjunto**. Allowlist en lectura; sin permisos de envío ni de escritura al DMS salvo gate.

### MCPs

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| `mcp-vlex` | vLex Vincent MCP | `vault://legal/vlex-ro` · `law:read` |
| `mcp-graph-files` | plantillas y dictámenes previos | `vault://legal/graph-ro` · `precedents:read` |
| `mcp-dms` | gestor documental (Ironclad/iManage) | `vault://legal/dms` · `memo:write` (gate) |

El juez consulta `mcp-vlex` en lectura para resolver cada cita del borrador contra la fuente oficial (CELEX/BOE). La escritura del dictamen al DMS (`memo:write`) va con gate: no la invoca el agente, requiere HITL y el token del abogado.

### Alternativas

Harvey o Spellbook si ya incorporan verificación de citas; Claude/ChatGPT/Gemini web con cláusula de no entrenamiento, solo con material anonimizado y sin hechos identificables del cliente. Nunca subir notas del cliente a un endpoint no auditado.

## 3. KPIs y mejora de rendimiento

| KPI | Base | Con agente |
|-----|------|-----------|
| Tiempo de verificación por dictamen | 1,5 h | 20 min |
| Citas alucinadas que llegan a versión final | 8% | 0% |
| % de documentos que requieren revisión completa del socio | 100% | 25% |
| Afirmaciones de materialidad sin soporte detectadas | manual | automática |

*Fórmula: `(1,5 − 0,33) h × 120 dictámenes/año ≈ 140 h/año por abogado`. (estimación, T1).*

## 4. Vulnerabilidades y riesgos

- *"Si el ejecutor y el juez comparten la misma credencial y el mismo modelo, no hay verificación real: el sesgo del ejecutor pasa el filtro y firmo un dictamen viciado."*
- *"Si el LLM alucina una cita (`STS 1234/2023` inexistente) y el juez no la resuelve contra la fuente oficial, la cita falsa llega al cliente y sanciona al despacho."*
- *"Si el documento fuente lleva instrucciones ocultas (prompt injection en el PDF), el ejecutor articula contra el interés del cliente y el juez, si no trata el texto como no confiable, valida el resultado envenenado."*
- *"Si el MCP del DMS tiene scope `memo:write` y el agente finaliza el dictamen sin gate, publico un documento no revisado por el socio."*
- *"Si el juez no tiene identidad ni traza propia, no puedo demostrar al auditor por qué una salida pasó o se elevó a revisión."*
- *"Si conecto un MCP o un modelo juez no registrado (shadow AI), opera sin allowlist, sin identidad y sin control de coste."*

Estas vulnerabilidades se cubren con la capa de gobernanza del bloque 5 (arquitectura de remediación); no llevar a producción sin ella. Normativa: secreto profesional, GDPR/AEPD, EU AI Act.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** A1 — Documental multi-fuente con validador A2A (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente ejecutor `legal-drafter` redacta; un segundo agente `llm-judge` con identidad SPIFFE separada puntúa la salida contra la rúbrica y resuelve cada cita contra `mcp-vlex` antes de que el dictamen llegue al abogado. Lo que el juez marca dudoso se eleva a HITL. La escritura al DMS nunca ocurre con credencial del agente: se firma con OBO del abogado tras aprobación explícita.

| Riesgo (del bloque 4) | Componente Solo | Mecanismo (dónde/cómo) |
|---|---|---|
| Ejecutor y juez sin separación de identidad → verificación falsa | kagent + agentgateway | `llm-judge` corre como agente A2A distinto con SPIFFE propia; agentgateway da identidad por agente (no comparten credencial) y guardarraíles por hop |
| Cita jurisprudencial alucinada que llega al cliente | agentevals + kagent (A2A) | el juez resuelve cada cita contra `mcp-vlex` por CELEX/BOE; `agentevals` (LLM-as-judge con traza) puntúa y bloquea el handoff si `citations_verified < 100%` |
| Prompt injection desde el PDF fuente | agentgateway | prompt guard trata el texto extraído como `untrusted-content` (spotlighting + patrones de jailbreak) antes de ejecutor y juez |
| Escritura no autorizada al DMS (`memo:write`) | agentgateway + kagent (OBO) | `AgentgatewayPolicy` fija `memo:write` fuera del alcance del agente; la finalización exige HITL y el token OBO del abogado firma la mutación |
| Deriva del juez (aprueba lo que no debería) | agentevals | eval set dorado de dictámenes con veredicto conocido; se mide precision/recall del juez y se detecta si se vuelve permisivo con el tiempo |
| Shadow AI: modelo juez o MCP no registrado | agentregistry + Istio ambient | sin registro no se emite SPIFFE ni allowlist; ztunnel deniega el egress del componente no inventariado |
| Auditor pide evidencia de por qué una salida pasó | agentgateway + agentevals | OTel por invocación (input, citas resueltas, veredicto del juez, decisión HITL); `agentevals` conserva el score y la evidencia por eje |

**Cómo se consigue la identidad:** `legal-drafter` y `llm-judge` corren en malla ambient con identidades **SPIFFE** distintas (`.../drafter`, `.../judge`) emitidas por istiod y aplicadas en ztunnel vía mTLS, para que la traza distinga sus invocaciones y `agentevals` puntúe al juez por separado. **agentgateway** valida la credencial **OIDC/JWT** de cada agente en cada request. Cuando el abogado dispara la verificación, **kagent** intercambia su token por uno **OBO** con scope `law:read`/`precedents:read`; la escritura tras HITL usa el token del abogado directamente.

**Dónde se aplican las políticas:** en el plano de datos de **agentgateway** vía `AgentgatewayPolicy` (allowlist MCP en lectura, prompt guard con PII, política A2A entre ejecutor y juez, rate limit por tokens); en la malla vía `AuthorizationPolicy` de Istio (L4 en ztunnel restringe el egress a los endpoints aprobados; L7 en waypoint limita `GET` sobre el DMS y reserva el `POST` al flujo HITL). **agentregistry** es la fuente de verdad: sin registro previo del juez o de cualquier MCP no hay identidad ni allowlist.

## Referencias

- GDPR + LOPDGDD (PII y secreto del cliente), deontología y responsabilidad profesional, EU AI Act. *Citas T1.*
- Marco técnico: OWASP LLM01 (prompt injection desde documento), LLM09 (overreliance); LLM-as-judge / evaluación basada en trazas. *Citas T1.*
