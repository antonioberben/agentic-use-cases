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

Si la grabación se procesa por servicio externo sin consentimiento explícito del cliente al inicio, riesgo GDPR / LOPDGDD. Si el resumen automático mete el nombre completo + DNI + dolencia / saldo / sentencia en un campo de texto libre, problema de minimización y de visibilidad indebida del dato a compañeros posteriores. Si guardas el resumen sin revisarlo y la IA cambió "750 euros de devolución" por "7.500", error con consecuencia económica. Riesgos típicos: grabación sin consentimiento, sobre-registro de datos sensibles, alucinación numérica en nota. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-notas-writeback` convierte dictado/transcripción en nota estructurada y propone el guardado en CRM/expediente; el empleado revisa antes de guardar; sin guardado automático. Un validador A2A `accuracy-validator` comprueba que la nota refleja lo ocurrido (cifras y fechas) antes del write-back.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Grabación procesada sin consentimiento explícito del cliente (GDPR/LOPDGDD art. 6) | agentgateway | el flujo exige el flag `consent=true` antes de invocar `mcp-transcripcion`; sin él, la transcripción no se llama |
| Sobre-registro de datos sensibles (salud, saldo, sentencia) en texto libre (minimización, art. 9) | agentgateway | detección de PII especial + redaction/aviso antes de proponer la nota; sólo el dato necesario al caso |
| Alucinación numérica en la nota (750→7.500) guardada sin revisar | agentevals + kagent (OBO) | comprobaciones deterministas de cifras y fechas; el guardado en CRM va con OBO del empleado tras HITL |
| Escritura automática al sistema de registro sin revisión humana | agentgateway + kagent (OBO) | `mcp-crm` con scope RO + `proposals/`; el `write` autoritativo requiere HITL y OBO |

## Referencias

- GDPR/LOPDGDD (arts. 6, 9, principio de minimización), consentimiento de grabación. *Citas T1.*
- Marco técnico: OWASP LLM02 (Divulgación de Información Sensible).
