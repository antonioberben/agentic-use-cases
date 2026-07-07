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

Si la app me dice algo incorrecto y lo repito al cliente con mi uniforme, la empresa responde por la palabra dada (responsabilidad del comerciante / proveedor de servicio). Si el asistente me da una respuesta de garantía equivocada en un producto regulado (sanitario, financiero) y el cliente actúa sobre ella, daño al cliente y eventual sanción sectorial. Si yo, en vez de la app de la empresa, abro ChatGPT en el móvil personal y le cuento el caso del cliente con nombre y DNI, **filtración de datos personales** que la empresa ni siquiera registra. Riesgos típicos: alucinación del asistente con consecuencia comercial, *shadow AI* en móvil personal del empleado, falta de cita de fuente. **Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, trazabilidad y herramientas aprobadas de la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-kb-research` responde dudas procedimentales leyendo el manual y la KB en RO y devuelve la respuesta con la sección citada; si no encuentra, deriva sin inventar. Un validador A2A `source-validator` verifica que la cita resuelve antes de responder.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Alucinación con consecuencia comercial repetida al cliente (responsabilidad del proveedor; art. 50 EU AI Act si media interacción) | agentgateway + agentevals | cada respuesta cita la sección del manual; agentevals verifica que la cita resuelve; sin cita, respuesta "derivar" |
| Respuesta de garantía errónea en producto regulado (sanitario/financiero) | agentgateway | prompt guard de salida marca dominios regulados y fuerza confirmación con el responsable antes de comunicar al cliente |
| ChatGPT en móvil personal con nombre+DNI del cliente (shadow AI, GDPR) | agentregistry + Istio | sólo `mcp-kb`/`mcp-manuales` registrados tienen identidad SPIFFE; el egress a un LLM no aprobado se deniega en ztunnel |
| Prompt injection desde un documento del KB manipulado | agentgateway | contenido de `mcp-manuales` marcado `untrusted`, spotlighting antes del LLM |
| Coste por consultas repetidas del mismo procedimiento en hora punta | agentgateway | semantic caching de respuestas a procedimientos frecuentes; rate limit por puesto |

## Referencias

- GDPR/LOPDGDD, EU AI Act art. 50 (cuando media interacción con cliente), normativa sectorial de garantías. *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
