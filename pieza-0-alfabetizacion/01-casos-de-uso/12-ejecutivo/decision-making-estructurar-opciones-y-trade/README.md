# Decision making: estructurar opciones y trade-offs

> **Rol:** ejecutivo · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Decisión compleja con stakeholders en distintas posiciones y datos parciales. Hoy: agenda de 30 min en comité, llegada con la decisión tomada por inercia.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B como sparring. *"Sobre la decisión [X], estructura: objetivo último, opciones disponibles, criterios, trade-offs corto/largo plazo, qué información falta, decisiones reversibles vs irreversibles. **No recomiendes; estructura.**"* Después: *"Plantéame los 5 contraargumentos más fuertes a esta decisión."*
- **Copilot M365:** uso interno como pizarra estructurada.
- **Claude Code:** `AGENTS.md` del marco de decisión corporativo (Bezos one-way/two-way doors, Kahneman pre-mortem, etc.).
- **MCPs:** habitualmente ninguno externo; la decisión se estructura sobre lo que ya tienes en la cabeza. Si procede, `mcp-financial-model` (interno) con scopes `models:read` sobre los modelos relevantes.
- **Alternativa:** Claude Projects para conversación larga estructurada.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Decisiones con pre-mortem documentado | 20% | 70% |
| Decisiones revertidas por información omitida | medio | bajo |

Fórmula: difícil cuantificar; valor en calidad de decisión, no en horas.

**4. Vulnerabilidades y riesgos → gobernanza**

Si trato la salida del modelo como recomendación y no como estructura, sustituyo mi criterio por el suyo en decisiones irreversibles. Si la decisión es sobre personas (despidos, compensación, promoción) y la IA pesó en ella sin las garantías del **GDPR art. 22** y **EU AI Act**, problema regulatorio. Riesgos típicos: delegación implícita en el modelo, decisiones de personas con apoyo IA sin gate humano documentado, ausencia de trazabilidad. **Cubierto en la Pieza 2 — Plan Director de IA** (gate humano sobre alto riesgo, trazabilidad de decisiones IA-asistidas).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
