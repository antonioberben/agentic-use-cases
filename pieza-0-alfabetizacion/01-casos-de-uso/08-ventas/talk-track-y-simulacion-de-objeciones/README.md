# *Talk track* y simulación de objeciones

> **Rol:** ventas · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Llamada difícil mañana. Hay que entrenar mensaje y objeciones.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B como sparring. *"Simula al [CFO] de una empresa [sector, tamaño] con [contexto]. Voy a presentarte [propuesta]. Plantea las 5 objeciones más probables, en orden de importancia. Tras cada respuesta mía, sigue con la siguiente."*
- *Claude.ai / ChatGPT:* iteración corta antes de la llamada real.
- *Plataformas sales coaching:* **Gong Smart Tracker**, **Second Nature**, **Hyperbound**. Roleplay con feedback estructurado.
- *Claude Code:* repo `playbooks/` con objeciones conocidas por persona.
- *MCPs:* `mcp-gong` (objeciones reales registradas en cuentas similares).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min de prep llamada difícil | 0-15 | 20-30 (productivos) |
| Win rate en llamadas con objeciones complejas | medida base | +15pp |
| Confianza pre-call (encuesta) | 6/10 | 8,5/10 |

*Fórmula:* No directa; impacto en win rate. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera argumentos legalmente sensibles (comparaciones falsas con competencia), riesgo de competencia desleal.*
- *Si entrenas con datos reales del cliente (precios, contratos) y la sesión queda en una plataforma que los retiene, breach NDA.*
- *Si confundes el sparring con el cliente real, sobrepreparas un guion que suena artificial.*

Cubierto en **Pieza 2** con allow-list de plataformas y guías de uso (sparring sí, sustituto del juicio no).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
