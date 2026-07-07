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

Si el resumen omite un matiz crítico (ej. cambio normativo que limita un descuento) y actúo como antes, comunicación errónea al cliente con potencial regulatorio. Si el role-play me da una respuesta correcta-pero-no-actual, fijo conocimiento desactualizado. Riesgos típicos: simplificación que pierde matiz regulatorio, formación informal sustituyendo a la oficial. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-formacion-research` resume cambios de procedimiento o producto desde el LMS/KB con cita y genera role-play; sin escrituras; deriva a la formación oficial cuando la duda es certificable. Un validador A2A `source-validator` verifica la vigencia de la fuente citada.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Resumen que omite un matiz regulatorio crítico del procedimiento (transparencia, responsabilidad frente al cliente) | agentgateway + agentevals | eval set con "trap questions" sobre los matices normativos del cambio; `nuance_recall < umbral` bloquea el resumen |
| Fuente desactualizada presentada como vigente en el role-play (desinformación) | agentgateway | cada afirmación cita el documento del LMS con su `fecha de vigencia`; sin fecha, no es respuesta oficial |
| Contenido del LMS/PDF con instrucción inyectada (prompt injection documental) | agentgateway | contenido de `mcp-lms` marcado `untrusted-content`, spotlighting antes del LLM |
| Uso de un LMS externo o ChatGPT personal para "estudiar" con material interno (shadow AI) | agentregistry + Istio | sólo `mcp-lms` y `mcp-kb` registrados obtienen identidad SPIFFE; el egress a destinos no registrados se deniega en ztunnel |

## Referencias

- Normativa sectorial del procedimiento objeto de formación (según sector). *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
