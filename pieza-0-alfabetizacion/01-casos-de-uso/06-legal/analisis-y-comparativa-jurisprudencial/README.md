# Análisis y comparativa jurisprudencial

> **Rol:** legal · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Antes de orientar al cliente interno hay que saber cómo han resuelto los tribunales un punto concreto. Línea mayoritaria, voces discrepantes, tendencia reciente.

**Cómo resolverlo.**

- *Plataformas legales con IA (única vía fiable):* **vLex Vincent**, **Westlaw Edge AI**, **Lexis+ AI**, **Aranzadi Indexa**, **Harvey** (sobre corpus jurisprudencial). Tienen citas verificadas.
- *Claude Code:* sobre PDFs de sentencias ya descargadas y verificadas; nunca pidiendo al modelo que "encuentre" jurisprudencia.
- *MCPs:* `mcp-vlex`, `mcp-aranzadi`, `mcp-westlaw`, `mcp-lexis`. Solo lectura, con cita verificable.
- *Alternativa:* Claude.ai con sentencias adjuntas manualmente. NUNCA chats genéricos para "búscame jurisprudencia": alucinan sentencias completas con tribunal, fecha y número.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por análisis jurisprudencial | 6 h | 1,5 h |
| Sentencias revisadas por análisis | 10 | 40-60 |
| Citas verificables (100% obligatorio) | 100% | 100% |

*Fórmula:* `(4,5) h × 30 análisis/año = 135 h/año por abogado`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si citas una sentencia inventada por el modelo, sanción profesional documentada en varios despachos (EEUU, también ya casos en España).*
- *Si conectas un MCP a un proveedor jurisprudencial pero el agente "completa" cuando no encuentra, el riesgo persiste.* Validación cita-fuente obligatoria.
- *Si el agente accede con tu suscripción personal y no `svc-legal`, no hay traza para el conflict check del despacho.*

Cubierto en **Pieza 2** con allow-list de fuentes jurisprudenciales certificadas, validación cita-fuente obligatoria, identidad propia y prohibición explícita de chats genéricos para jurisprudencia.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
