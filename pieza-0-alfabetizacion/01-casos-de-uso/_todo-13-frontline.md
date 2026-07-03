# Frontline / operativa de primera línea — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: personal de tienda y retail, agente de *contact center*, técnico de campo, oficina bancaria, recepción, almacén, taller, sanitario asistencial, tripulación, conductor. Perfil que atiende cliente o ejecuta operación en sitio, con manejo de móvil/tablet más que de ordenador clásico.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA**. La otra mitad —**gobernanza, seguridad, cumplimiento**— vive en la **Pieza 2 — Plan Director de IA**. Para vuestro rol es crítica: trabajáis cara al cliente con datos personales en mano y la empresa responde por lo que decís, aunque lo haya dicho la IA. Datos del cliente (nombre, DNI, dirección, salud, tarjeta) en herramientas no aprobadas incumplen **GDPR/LOPDGDD**; decisiones automatizadas sobre el cliente requieren gate humano (**GDPR art. 22**); en banca/salud/transporte lo que decís puede tener efectos contractuales o sanitarios. **Usad solo la herramienta que vuestra empresa ha aprobado. Si no os lo han dicho, preguntad antes.**

:::

## 1. Qué cambia para ti

La IA no os sustituye; os ayuda con la respuesta rápida, traducción, recordar el procedimiento y registrar lo que pasó. La cara, la voz y el criterio siguen siendo vuestros. La IA es un copiloto en el oído, no quien atiende.

> Nota: a diferencia de otros roles del manual, vuestra herramienta la elige la empresa y vosotros la usáis. Por eso esta ficha **no incluye Local (Ollama) ni configuración de MCPs**: eso lo hace IT central. Lo que sí incluye es **cómo usar bien la app del puesto que ya tenéis** y dónde está el límite.

## 2. Ocho casos típicos en formato de 4 bloques

### 2.1 Encontrar la respuesta al instante

**1. Caso de uso**

*"¿Cubre la garantía este caso?"*, *"¿Qué documentación necesita esta gestión?"*, *"¿Cuál es el procedimiento si pasa esto?"*. Hoy: buscas en el manual PDF, llamas a un compañero veterano, o le dices al cliente *"déjame que lo confirme"* y le haces esperar.

**2. Cómo resolverlo**

- **App del puesto (lo habitual):** asistente integrado en tablet/móvil corporativo conectado al manual del puesto y a la base de conocimiento. Pides en lenguaje normal: *"Cliente con factura de hace 2 años pide reparación de pantalla rota. ¿Entra en garantía?"* y recibes la respuesta con la sección del manual citada.
- **Herramientas frecuentes que despliega la empresa:** Microsoft Copilot for Frontline (Teams), Salesforce Service Cloud, ServiceNow for Frontline, Zendesk AI for agents, Genesys Cloud AI (contact center), Espressive (consultas internas).
- **Cómo lo conecta la empresa (info para tu mánager):** el asistente lee del repositorio de manuales (SharePoint/Confluence/Zendesk KB) en modo **solo lectura**, con identidad propia (no con tu usuario), y no escribe en sistemas críticos sin gate.
- **Alternativa cuando el asistente no encuentra respuesta:** llamar al canal interno de tienda / responsable. **No inventes.**

Reglas:

- La respuesta cita el manual / política. Si no cita, no es respuesta oficial.
- Si la pregunta es sensible (devolución grande, queja formal, salud, financiera), confirma con tu responsable antes de comunicar al cliente.
- Si el asistente dice *"no encuentro respuesta"*, no inventes; deriva.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo medio de respuesta a duda procedimental | 3-5 min | 30 s |
| % consultas resueltas sin escalar | 60% | 85% |
| Errores procedimentales detectados a posteriori | medio | bajo |
| Llamadas al supervisor para dudas básicas | 8/día | 2/día |

Fórmula: *(4 − 0,5) min × 30 consultas/día × 220 días = ≈ 385 h/año por agente. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la app me dice algo incorrecto y lo repito al cliente con mi uniforme, la empresa responde por la palabra dada (responsabilidad del comerciante / proveedor de servicio). Si el asistente me da una respuesta de garantía equivocada en un producto regulado (sanitario, financiero) y el cliente actúa sobre ella, daño al cliente y eventual sanción sectorial. Si yo, en vez de la app de la empresa, abro ChatGPT en el móvil personal y le cuento el caso del cliente con nombre y DNI, **filtración de datos personales** que la empresa ni siquiera registra. Riesgos típicos: alucinación del asistente con consecuencia comercial, *shadow AI* en móvil personal del empleado, falta de cita de fuente. **Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, trazabilidad y herramientas aprobadas de la Pieza 2 — Plan Director de IA.**

### 2.2 Traducción y atención multilingüe

**1. Caso de uso**

Cliente en un idioma que no manejas. Hoy: buscas a un compañero, usas Google Translate del móvil personal con el cliente esperando, o pierdes la venta/atención.

**2. Cómo resolverlo**

- **App del puesto:** traducción en tiempo real integrada en la plataforma de contact center o tienda (Genesys, Talkdesk, NICE CXone). Auriculares con interpretación en vivo en algunos sectores.
- **Apps aprobadas por la empresa para móvil/tablet del puesto:** Microsoft Translator, Google Translate Enterprise, DeepL Pro, Pocketalk (terminal físico en hostelería, retail, sanidad).
- **Cómo lo conecta la empresa:** habitualmente como **add-on de la plataforma de atención**, con datos cifrados y retención conforme a política. No usar la app personal de Google Translate gratuita con datos del cliente.
- **Alternativa para temas con matiz legal/sanitario:** servicio de intérprete oficial telefónico contratado por la empresa.

Reglas:

- Frases cortas, una idea por frase. La IA traduce mejor frases simples.
- Para legal, financiero o sanitario donde la decisión depende del matiz: intérprete oficial.
- Confirma con el cliente que se ha entendido: *"¿Es así lo que me pide?"*.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| % atenciones cerradas sin barrera idiomática | 60% | 92% |
| Tiempo medio en atención multilingüe | +50% sobre base | +15% sobre base |
| Satisfacción cliente (NPS) en atención multilingüe | bajo | medio-alto |

Fórmula: depende del volumen multilingüe de tu centro. *En contact center con 15% de llamadas no nativas, ≈ 200 h/año por agente en atenciones que antes se escalaban.* (estimación, T1).

**4. Vulnerabilidades y riesgos → gobernanza**

Si uso Google Translate gratuito con conversación de cliente, los textos pueden quedar en logs del servicio para entrenamiento futuro — incumple GDPR de minimización y de transferencia internacional. Si la traducción simplifica un matiz legal (*"podemos resolver"* traducido como compromiso firme cuando era una posibilidad), vinculas a la empresa por error. Si en sanidad la traducción de un síntoma se pierde y se administra mal una medicación, daño al paciente. Riesgos típicos: traductor personal sin cobertura legal, pérdida de matiz contractual, error sanitario. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.3 Notas y registro de la atención

**1. Caso de uso**

Tras atender, hay que dejar registro en el sistema (CRM, expediente, ticket). Hoy: lo escribes a mano al final del turno, se te olvidan detalles, llegan a quejas porque el siguiente compañero no sabe qué pasó.

**2. Cómo resolverlo**

- **App del puesto con dictado:** dictar al móvil/tablet *"Cliente vino a por X, le di Y, próximo paso Z, fecha cuándo."* La IA convierte a texto estructurado y rellena el formulario del sistema. Tú revisas antes de guardar.
- **En contact center:** transcripción y resumen automático post-llamada integrado (Gong, Salesforce Einstein, Genesys AI). Tú validas el resumen y lo confirmas.
- **Cómo lo conecta la empresa:** integrado con el CRM corporativo, con consentimiento informado al cliente al inicio de la grabación ("esta llamada puede ser grabada y procesada para mejora del servicio").
- **Alternativa cuando no hay app:** plantilla rápida en libreta + entrada al sistema al cierre.

Reglas:

- Sin datos personales en la nota más allá de lo necesario para el caso (principio de minimización GDPR).
- Si grabas la conversación, el cliente tiene que saberlo y aceptarlo. Si no, no se graba.
- Tú revisas el resumen automático antes de guardar. La IA puede invertir cifras, fechas o nombres.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo en notas post-atención | 3 min/cliente | 30 s/cliente |
| % notas completas y útiles para el siguiente turno | 50% | 90% |
| Atenciones cerradas sin pasar al sistema | 15% | 2% |

Fórmula: *2,5 min × 60 atenciones/día × 220 días = ≈ 550 h/año por agente. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la grabación se procesa por servicio externo sin consentimiento explícito del cliente al inicio, riesgo GDPR / LOPDGDD. Si el resumen automático mete el nombre completo + DNI + dolencia / saldo / sentencia en un campo de texto libre, problema de minimización y de visibilidad indebida del dato a compañeros posteriores. Si guardas el resumen sin revisarlo y la IA cambió "750 euros de devolución" por "7.500", error con consecuencia económica. Riesgos típicos: grabación sin consentimiento, sobre-registro de datos sensibles, alucinación numérica en nota. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.4 Imágenes y fotos del servicio

**1. Caso de uso**

Registrar daño visible, estado de un equipo, identificación de pieza, evidencia de incidencia. Hoy: foto con el móvil, descripción a mano, varias búsquedas para identificar el modelo correcto.

**2. Cómo resolverlo**

- **App del puesto con cámara:** foto desde la app corporativa. La IA puede describir lo que se ve (*"daño visible en esquina inferior derecha"*), identificar pieza o modelo (*"es el modelo X de la serie Y"*), comparar con el estándar.
- **Herramientas frecuentes:** ServiceNow Field Service, Salesforce Field Service AI, Microsoft Dynamics 365 Field Service, herramientas sectoriales (TraceParts en industria, sanitarias propias).
- **Cómo lo conecta la empresa:** las fotos se guardan en el sistema corporativo con metadatos del caso, no en la galería personal del móvil. La IA accede al catálogo de piezas/modelos en modo solo lectura.
- **Alternativa:** foto + descripción manual cuando la IA no identifica.

Reglas:

- No tomar fotos donde aparezca el cliente sin permiso. Pixela cara/matrícula si entra en plano.
- En sectores con normativa específica (sanidad, seguridad, ferrocarril): solo lo que el procedimiento permita y donde permita.
- Las fotos no salen del sistema corporativo. Nada de WhatsApp con compañeros para "preguntar qué es esto".

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de identificación de pieza | 5-10 min | 30 s |
| % incidencias documentadas con foto + descripción | 70% | 95% |
| Errores en identificación de modelo | medio | bajo |

Fórmula: *7 min × 8 piezas/día × 220 días = ≈ 200 h/año por técnico. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la foto incluye al cliente sin permiso y va a un servicio externo de identificación, problema de imagen y de GDPR. Si la pieza fotografiada incluye un número de serie + dato del cliente en el mismo encuadre y la imagen circula por compañeros vía canal no aprobado, fuga. Si en sanidad fotografías una herida y la mandas por WhatsApp para consultar a un colega, dato de salud sin tratamiento conforme. Riesgos típicos: imagen sin consentimiento, fuga vía móvil personal, sectores regulados con foto prohibida. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.5 Comunicación con el cliente

**1. Caso de uso**

El WhatsApp / SMS / correo de seguimiento al cliente. Hoy: lo escribes al final del turno, redactando rápido, o se te olvida.

**2. Cómo resolverlo**

- **App del puesto / CRM:** borrador asistido. *"Cliente Juan, vino esta mañana, tema tal, mañana le confirmamos. Redacta WhatsApp corto, formal cercano, sin emojis."* Revisas y envías.
- **Plantillas con IA en CRM:** Salesforce Einstein, HubSpot AI, Zendesk AI. Generan el primer borrador respetando tono corporativo.
- **Para WhatsApp Business:** integraciones de plataforma autorizadas (Twilio, Meta Business). **Nunca WhatsApp personal con datos del cliente.**
- **Alternativa:** plantillas pre-aprobadas por la empresa, personalizadas a mano.

Reglas:

- Nada de promesas no aprobadas (fechas, descuentos, soluciones que no podéis dar).
- Si el cliente está enfadado, mejor llamarle que escribir.
- No envíes mensajes generados por IA sin leerlos. Lo que firmas con tu nombre, lo respondes tú.
- Sin envío automático sin tu validación, salvo confirmaciones operativas estandarizadas (recordatorio de cita, etc.).

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a primer borrador de mensaje | 4 min | 30 s |
| % follow-ups enviados a tiempo | 60% | 90% |
| Quejas por trato impersonal | medio | bajo |

Fórmula: *3,5 min × 15 mensajes/día × 220 días = ≈ 190 h/año por agente. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la app de mensajería tiene envío automático y el modelo mete una fecha incorrecta, compromiso erróneo con el cliente. Si uso WhatsApp personal con el cliente bajo *"para que sea más rápido"*, su número y conversación quedan en mi terminal — al irme de la empresa, dato del cliente sin control. Si el mensaje vincula a la sociedad con un descuento o solución que no estaba aprobada, problema comercial y posiblemente regulatorio (publicidad engañosa, sector financiero). Riesgos típicos: envío automático sin gate, WhatsApp personal con datos del cliente, compromiso no autorizado. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.6 Aprendizaje y formación continua

**1. Caso de uso**

Ponerte al día con producto nuevo, procedimiento que cambia, normativa que afecta a vuestra atención. Hoy: PDFs del LMS interno que nadie lee, mailing de "novedades" enterrado.

**2. Cómo resolverlo**

- **App del puesto:** *"Resumen del cambio del procedimiento X que entra en vigor el lunes. En 5 puntos. Qué cambia para mí."* Te da los puntos con cita al documento oficial.
- **Práctica simulada:** *"Hazme 5 preguntas tipo cliente sobre el producto nuevo. Cuando responda, dime si es correcto y por qué."* Conversación de role-play para fijar conocimiento.
- **Plataformas habituales:** Cornerstone, Docebo, SAP SuccessFactors Learning con AI integrada. Microsoft Viva Learning.
- **Alternativa:** sesiones presenciales del responsable de tienda / supervisor.

Reglas:

- La formación oficial sigue siendo la oficial. La IA es repaso, no certificación.
- Si tienes una duda específica de procedimiento, mejor preguntar al responsable que confiar al 100% en el resumen.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de digestión de procedimiento nuevo | 30 min | 5 min |
| % personal al día con cambios recientes | 50% | 90% |
| Errores en primera semana tras cambio | alto | medio-bajo |

Fórmula: *25 min × 6 cambios/año × plantilla = horas significativas a nivel red. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el resumen omite un matiz crítico (ej. cambio normativo que limita un descuento) y actúo como antes, comunicación errónea al cliente con potencial regulatorio. Si el role-play me da una respuesta correcta-pero-no-actual, fijo conocimiento desactualizado. Riesgos típicos: simplificación que pierde matiz regulatorio, formación informal sustituyendo a la oficial. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.7 Sugerencia de producto o servicio

**1. Caso de uso**

Recomendar al cliente lo que más le encaja según historial y catálogo. Hoy: te basas en lo que tienes en la cabeza, vendes lo que más conoces, no siempre lo que el cliente necesita.

**2. Cómo resolverlo**

- **App del puesto / CRM:** asistente con historial del cliente (compras anteriores, contratos, preferencias) y catálogo. Propone opciones relevantes. Tú filtras y comunicas.
- **Herramientas frecuentes:** Salesforce Einstein Next Best Action, Microsoft Dynamics 365 Sales AI, Pega, herramientas sectoriales (Temenos en banca retail).
- **Cómo lo conecta la empresa:** el modelo accede al CRM en lectura, propone, **no contrata**. La contratación la haces tú con el procedimiento del producto.
- **Alternativa:** catálogo + historial + tu criterio.

Reglas:

- Recomienda lo que el cliente necesita, no lo que el sistema empuja. Si no le encaja, no insistas.
- Sin venta cruzada agresiva basada en perfilado sin base jurídica clara (consentimiento o interés legítimo equilibrado).
- En productos regulados (seguros, financiero, sanidad) la recomendación tiene requisitos formales (idoneidad, conveniencia, test MiFID, deber de información). **La IA propone borrador; tú haces el asesoramiento.**

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tasa de aceptación de recomendación | 15% | 25-30% |
| Quejas por venta inadecuada | medio | bajo (si se aplica gate) |
| Productos en cartera por cliente | base | +0,3-0,5 |

Fórmula: depende del producto. *En banca retail, +0,4 productos × 500 clientes/año × margen unitario = revenue significativa por oficina. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la recomendación se hace sobre datos de perfilado sin base jurídica (GDPR art. 22 + considerandos sobre perfilado), problema regulatorio. Si en banca recomiendo un producto financiero sin el test de idoneidad / conveniencia hecho, infracción MiFID II. Si en sanidad recomiendo un suplemento sin formación específica, problema sanitario y posiblemente penal. Si la IA empuja productos por margen (no por encaje) y el cliente luego se queja, demanda de "asesoramiento inadecuado". Riesgos típicos: perfilado sin base jurídica, falta de test regulatorio, optimización por margen no por idoneidad. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.8 Apoyo en emergencias o situaciones difíciles

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
