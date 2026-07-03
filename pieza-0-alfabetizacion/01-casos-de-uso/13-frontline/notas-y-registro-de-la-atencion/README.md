# Notas y registro de la atención

> **Rol:** frontline · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
