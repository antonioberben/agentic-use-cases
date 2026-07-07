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

Si trato la salida del modelo como recomendación y no como estructura, sustituyo mi criterio por el suyo en decisiones irreversibles. Si la decisión es sobre personas (despidos, compensación, promoción) y la IA pesó en ella sin las garantías del **GDPR art. 22** y **EU AI Act**, problema regulatorio. Riesgos típicos: delegación implícita en el modelo, decisiones de personas con apoyo IA sin gate humano documentado, ausencia de trazabilidad. **Cubierto en la arquitectura de remediación (bloque 5)** (gate humano sobre alto riesgo, trazabilidad de decisiones IA-asistidas).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `agente-sparring-decision` estructura opciones, trade-offs y contraargumentos; no recomienda, el ejecutivo decide (HITL siempre).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Delegación implícita: tratar la salida como recomendación en decisión irreversible | agentgateway + agentevals | prompt guard fuerza el formato "estructura, no recomendación"; OTel registra que la decisión final la firma el humano |
| Decisión sobre personas (despido, promoción, compensación) con peso de IA sin garantías (GDPR art. 22; EU AI Act Anexo III, alto riesgo) | agentgateway + kagent (OBO) | policy bloquea el uso del agente para outputs decisorios sobre personas; gate humano documentado obligatorio |
| Fuga del modelo financiero interno al proveedor | agentgateway | `mcp-financial-model` con `models:read`; redaction de cifras absolutas → rangos por bucket antes del request |
| Sesgo del modelo hacia una opción sin contexto sectorial | agentevals | LLM-as-judge con rubric de neutralidad; señala supuestos no explicitados en lugar de recomendar |
| Ausencia de trazabilidad de decisiones IA-asistidas para gobierno corporativo | agentgateway | OTel per-invocation (opciones, contraargumentos, decisión HITL) como evidencia en acta |

## Referencias

- GDPR (Reg. UE 2016/679) art. 22; EU AI Act (Reg. UE 2024/1689) Anexo III. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation / Overreliance).
