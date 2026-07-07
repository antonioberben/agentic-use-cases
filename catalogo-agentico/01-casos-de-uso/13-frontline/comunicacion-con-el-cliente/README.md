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

Si la app de mensajería tiene envío automático y el modelo mete una fecha incorrecta, compromiso erróneo con el cliente. Si uso WhatsApp personal con el cliente bajo *"para que sea más rápido"*, su número y conversación quedan en mi terminal — al irme de la empresa, dato del cliente sin control. Si el mensaje vincula a la sociedad con un descuento o solución que no estaba aprobada, problema comercial y posiblemente regulatorio (publicidad engañosa, sector financiero). Riesgos típicos: envío automático sin gate, WhatsApp personal con datos del cliente, compromiso no autorizado. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-comms-borrador` redacta borradores de mensaje (WhatsApp Business/SMS/correo) con tono corporativo; el empleado revisa y envía; sin envío automático salvo confirmaciones operativas estandarizadas. Un validador A2A `output-guard` revisa la salida en busca de compromisos prohibidos antes del envío.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Compromiso no autorizado en el borrador (fecha, descuento, solución): publicidad engañosa / vinculación indebida | agentgateway | prompt guard de salida con lista de compromisos prohibidos (importes, plazos, promesas); si detecta, bloquea el envío y marca para revisión |
| Envío automático de mensaje con dato erróneo del modelo (art. 50 EU AI Act, responsabilidad) | agentgateway + kagent (OBO) | `mcp-mensajeria` con scope `draft`; el `send` requiere OBO del empleado salvo plantilla operativa preaprobada |
| Uso de WhatsApp personal con datos del cliente (GDPR minimización + transferencia) | agentregistry + Istio | sólo la pasarela `mcp-whatsapp-business` registrada obtiene identidad; el terminal personal no registrado no tiene egress |
| Falta de disclosure de interacción/mensaje asistido por IA al cliente (EU AI Act art. 50) | agentgateway | la plantilla de salida incorpora la identificación del canal como asistido cuando aplica |
| Canal externo entrante (WhatsApp Business/Meta, Twilio) sin control N-S | kgateway | el webhook de Meta/Twilio termina en kgateway con verificación de firma antes de llegar al agente |

## Referencias

- EU AI Act art. 50 (disclosure), GDPR/LOPDGDD, LSSI/ePrivacy (comunicaciones comerciales). *Citas T1.*
- Marco técnico: OWASP LLM05 (Tratamiento Inadecuado de Salidas).
