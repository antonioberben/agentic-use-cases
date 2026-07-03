# Comunicación con el cliente

> **Rol:** frontline · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
