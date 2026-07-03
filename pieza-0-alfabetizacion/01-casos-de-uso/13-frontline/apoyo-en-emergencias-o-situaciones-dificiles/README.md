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

Si confío en el protocolo que me sugiere la IA y resulta estar desactualizado (porque la base de conocimiento no se actualizó tras un cambio normativo), aplico procedimiento incorrecto en emergencia. Si en situación de riesgo (autolisis del cliente, agresión, urgencia médica) pierdo segundos consultando la app en vez de actuar, daño humano. Si registro la situación con datos sensibles (salud, denuncia) en canal no aprobado, exposición. Riesgos típicos: protocolo desactualizado en base de conocimiento, dependencia de la IA en emergencia, registro sensible en canal informal. **Cubierto en la Pieza 2 — Plan Director de IA** (mantenimiento de base de conocimiento, gate humano en emergencia, canales aprobados).

## 3. Reglas adicionales para el frontline (lo que no negocia tu empresa)

- **Usa solo la herramienta aprobada por tu empresa.** WhatsApp personal, ChatGPT en el móvil personal con datos del cliente: no.
- **Sin foto del cliente sin permiso.** Sin grabación sin aviso. Sin compartir datos del cliente por canal no aprobado.
- **La IA no decide por ti** cuestiones que afecten al cliente: aceptar devolución, conceder descuento, denegar servicio, dar de baja, gestionar reclamación formal. Eso lo decides tú o tu responsable según procedimiento.
- **Si no estás seguro, pregunta.** Una respuesta inventada por la IA en boca tuya es problema de tu empresa.
- **Tu cara es la marca.** El cliente recuerda cómo le trataste, no qué herramienta usaste. La IA está en tu oído; tú estás delante.

## 4. Cinco hábitos clave

1. **Cita la fuente cuando sea importante.** *"Según el manual, la garantía es de 24 meses"*. No *"creo que son 24"*.
2. **Confirma siempre que se ha entendido.** Sobre todo en traducción y en temas sensibles.
3. **Lo que va al cliente, lo lees tú primero.** Mensaje, correo, factura, recibo.
4. **Sin datos del cliente fuera de las herramientas aprobadas.** Foto, nombre, DNI, dirección: solo en el sistema.
5. **Si dudas, escalas.** No improvises. Pregunta a tu responsable.

## 5. Qué evitar

- Usar ChatGPT del móvil personal con datos del cliente.
- Hacer foto al cliente sin permiso. Grabar conversación sin avisar. Compartir el caso por WhatsApp con un compañero.
- Repetir al cliente lo que dice la IA sin verificarlo, especialmente en temas con consecuencia (devolución, garantía, salud, dinero).
- Aceptar que la IA decida cosas que el procedimiento te asigna a ti.
- Inventar respuesta cuando la IA no la tiene. *"Voy a confirmarlo y le digo"* es mejor que una respuesta inventada.

## 6. Cómo seguir

- Lab base **"asistente al empleado frontline"** del catálogo: el patrón del asistente del puesto (2.1, 2.7) — lo que probablemente tu empresa esté desplegando.
- Lab base **"agente operacional read-only"**: el patrón de aplicaciones del puesto con lectura y propuestas, sin escritura automática.
- Si tu empresa tiene formación interna de IA, esta ficha la complementa, no la sustituye.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
