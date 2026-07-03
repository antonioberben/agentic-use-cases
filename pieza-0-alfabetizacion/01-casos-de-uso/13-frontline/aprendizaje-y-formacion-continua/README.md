# Aprendizaje y formación continua

> **Rol:** frontline · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
