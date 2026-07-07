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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de plataformas y guías de uso (sparring sí, sustituto del juicio no).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `objection-sparring` genera un roleplay de objeciones y talk track para entrenar al AE a partir de objeciones reales de cuentas similares (`mcp-gong`, `calls:read`); un validador `claims-validator` (A2A) comprueba que ningún argumento comparativo o feature prometida carezca de respaldo antes de mostrar el guion. Es un sparring interno: no produce nada cara al cliente ni sustituye el juicio del AE.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Argumentos legalmente sensibles (comparación falsa con competencia) → competencia desleal (Ley 3/1991) | agentevals | LLM-as-judge con rubric de claims comparativos; bloquea el handoff si genera afirmaciones sobre competidores no sustentadas |
| Entrenamiento con datos reales del cliente (precios, contratos) retenidos por la plataforma → breach NDA | agentgateway + agentregistry | allow-list de plataformas de coaching registradas con retención acotada; redaction de precios/cláusulas antes del request |
| Objeciones reales de cuentas ajenas expuestas vía Gong | agentgateway | `mcp-gong` con scope `calls:read` sobre cuentas similares; nombres de cuenta reemplazados por handle interno antes del request |
| Sobre-confianza en el guion generado (suena artificial en la llamada real) | agentevals | el output se etiqueta como material de práctica; eval set penaliza guiones rígidos palabra-por-palabra |
| Coste de sesiones de roleplay iterativas | agentgateway | rate limit por AE y model failover a modelo barato en el bucle de práctica |

## Referencias

- Ley 3/1991 de Competencia Desleal (comparaciones con competencia); NDA con cliente. *Citas T1.*
- Marco técnico: OWASP LLM09 (Overreliance).
