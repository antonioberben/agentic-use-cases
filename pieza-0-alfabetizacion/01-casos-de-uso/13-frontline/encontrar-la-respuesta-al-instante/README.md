# Encontrar la respuesta al instante

> **Rol:** frontline · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
