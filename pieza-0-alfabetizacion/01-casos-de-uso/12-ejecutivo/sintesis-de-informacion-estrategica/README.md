# Síntesis de información estratégica

> **Rol:** ejecutivo · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Informes de consultora de 80 páginas, deep-dives de unidad, market research de viernes por la tarde. Llegan a tu mesa más rápido de lo que puedes procesarlos. Hoy: delegas en el chief of staff o llegas a la reunión sin haberlo leído.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B. *"Resumen en tres niveles: (a) 5 líneas para ejecutivo apurado, (b) 1 página para comité, (c) 3 páginas con detalle. Cita cada cifra con sección de origen. Marca lo que el documento no contesta."*
- **Copilot M365:** sobre PDFs en OneDrive corporativo del ejecutivo.
- **Claude Code:** carpeta con `AGENTS.md` que fija el formato 5-líneas/1-pg/3-pg y prohíbe inferencias no respaldadas.
- **MCPs:** `mcp-sharepoint` y `mcp-confluence` para acceder a la biblioteca de papers internos del comité. Servidor MCP con `vault://exec/research-ro`, scopes `documents:read` sobre la biblioteca, sin permisos de escritura.
- **Alternativa:** Claude Projects con el PDF subido.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de digestión de informe 80pp | 3 h | 30 min |
| % informes leídos antes de comité | 50% | 95% |
| Cifras citadas con fuente verificada | medio | alto |

Fórmula: *(3 − 0,5) h × 30 informes/año = 75 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el modelo alucina una cifra y la cito en comité sin verificarla con la sección de origen, la decisión queda apoyada en dato falso. Si subo el informe del consultor (sujeto a NDA bilateral) a un servicio no aprobado, rompo la cláusula de confidencialidad del contrato. Riesgos típicos: alucinación numérica, ruptura de NDA con tercero, citación cruzada de información de varias unidades que individualmente es confidencial. **Cubierto en la Pieza 2 — Plan Director de IA** (controles MCP, *prompt logging*, observabilidad).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
