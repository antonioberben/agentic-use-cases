# Apoyo en emergencias o situaciones difíciles

> **Rol:** frontline · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Cliente conflictivo, situación que se sale del guion, emergencia (sospecha de robo, accidente, agresión, urgencia médica del cliente, riesgo de autolisis en una conversación). Hoy: cara a cara con el caso y el protocolo en la cabeza.

**2. Cómo resolverlo**

- **App del puesto:** ayuda con protocolo aplicable (*"cliente con sospecha de robo de tarjeta, ¿qué hago?"*), contactos a llamar, frases de desescalada.
- **Plataformas de contact center con AI:** sugerencias en tiempo real al agente sobre cómo responder en situaciones de escalada (Cogito, Genesys AI).
- **Herramientas sectoriales:** apps de emergencias en transporte (tripulación), salud (asistencial), seguridad ciudadana.
- **Alternativa siempre disponible:** llamada al supervisor / 112 / protocolo humano.

Reglas:

- **La IA NO sustituye a tu mánager ni a los servicios de emergencia.** En cualquier situación de seguridad personal, primero el protocolo humano.
- Una respuesta inventada por la IA en una emergencia es peor que reconocer "voy a llamar a quien sepa".
- Documenta la situación después con el formulario corporativo, no improvises por canal informal.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a aplicación de protocolo correcto | 5 min | 1 min |
| % incidencias gestionadas según protocolo | 70% | 95% |
| Escalado a supervisor cuando procede | impreciso | claro |

Fórmula: el valor no es ahorro de horas; es **reducir daños y aplicar protocolo correcto**. (estimación cualitativa, T1).

**4. Vulnerabilidades y riesgos → gobernanza**

Si confío en el protocolo que me sugiere la IA y resulta estar desactualizado (porque la base de conocimiento no se actualizó tras un cambio normativo), aplico procedimiento incorrecto en emergencia. Si en situación de riesgo (autolisis del cliente, agresión, urgencia médica) pierdo segundos consultando la app en vez de actuar, daño humano. Si registro la situación con datos sensibles (salud, denuncia) en canal no aprobado, exposición. Riesgos típicos: protocolo desactualizado en base de conocimiento, dependencia de la IA en emergencia, registro sensible en canal informal. **Cubierto en la arquitectura de remediación (bloque 5)** (mantenimiento de base de conocimiento, gate humano en emergencia, canales aprobados).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-emergencia-asistente` sugiere protocolo aplicable y contactos en la app del puesto; ante señal de riesgo personal (agresión, urgencia médica, autolisis) escala inmediato a supervisor/112 sin intermediar. Un validador A2A `protocol-validator` comprueba que el protocolo servido es la versión vigente antes de mostrarlo.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Protocolo de emergencia desactualizado en la KB tras cambio normativo (deber de diligencia del empleador, Ley 31/1995 PRL) | agentgateway + agentevals | eval set con los protocolos vigentes versionados; `protocol_version != current` bloquea la respuesta y fuerza "consulta a supervisor" |
| Situación de riesgo personal tratada por el asistente en vez de escalar (seguridad y salud) | agentgateway | prompt guard de salida detecta intención "riesgo vital/seguridad" y responde con ruteo obligatorio a humano/112, no con procedimiento |
| Registro posterior de datos de salud o denuncia por canal informal (GDPR art. 9) | Istio + agentregistry | egress sólo al formulario corporativo registrado; app personal no registrada no obtiene identidad SPIFFE y ztunnel deniega su salida |
| Alucinación de un contacto o teléfono de emergencia | agentgateway + agentevals | contactos servidos desde `mcp-directorio-emergencias` (RO), no del parámetro del modelo; agentevals verifica que el número resuelve |
| Canal externo (app del puesto en dispositivo) sin control de entrada N-S | kgateway | el ingress del canal frontline termina en kgateway con authn del dispositivo corporativo antes de llegar al agente |

## Referencias

- GDPR/LOPDGDD (art. 9 datos de salud), deber de diligencia del empleador (Ley 31/1995 PRL). *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
