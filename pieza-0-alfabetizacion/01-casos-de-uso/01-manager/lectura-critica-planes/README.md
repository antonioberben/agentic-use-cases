# T15 — Lectura crítica de planes y business cases

## Identificación

- **Rol principal**: ejecutivo (CEO, COO, CFO, director general de unidad).
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio/legal (variante crítica).
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de basar decisión de inversión.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

A comité llegan business cases bien presentados pero con hipótesis ocultas, sensibilidades no testadas, dependencias críticas. El ejecutivo aprueba bajo presión de tiempo y a veces por relación con el ponente. El agente actúa como contrincante: enumera hipótesis no explicitadas, sensibilidades, dependencias y comparativa con benchmarks razonables.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre PDF del plan. Prompt: *"Lee crítico: hipótesis no explicitadas, sensibilidades no testadas, dependencias críticas, métricas que no defienden el caso si fallan, comparativa con benchmarks razonables. Tono de director general que ha visto fracasar planes parecidos. **No reescribas el plan; señala.**"*

### 2.2 Copilot

Copilot M365 con sensibilidad `Highly Confidential / Board`. Nunca chat público.

### 2.3 Claude Code

Repo `exec/cases/` con `AGENTS.md` que define rúbrica del ejecutivo (TAM realista, unit economics, supuestos macro, dependencias técnicas, plan B).

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-bi` | Power BI/Tableau MCP | `vault://exec/bi-ro` | `datasets:read` solo datos públicos internos |
| `mcp-research` | Gartner/Forrester MCP | `vault://exec/analyst-ro` | `reports:read` |

### 2.5 Alternativas

Claude Projects con rúbrica al inicio del prompt.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Hipótesis ocultas detectadas por plan | 1-2 | 5-8 |
| Planes aprobados que descarrilan a 12m | medio | bajo |
| Tiempo a análisis crítico | 4 h | 30 min |

Fórmula: *valor en planes evitados (orden 10⁵-10⁶ €/plan). (estimación cualitativa, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si subo el business case (con proyecciones M&A, mercados por entrar) a servicio no aprobado, filtración estratégica directa."*
- *"Si el modelo alucina benchmarks de mercado y rechazo el plan, decisión errónea + coste reputacional con el director que lo presentó."*
- *"Si delego en el modelo la decisión, sustituyo criterio fiduciario por output estadístico."*

**Riesgos típicos:** fuga estratégica, alucinación de benchmarks, delegación implícita en el modelo, sesgo del modelo a estructura "optimista".

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Deber fiduciario del administrador, gobierno corporativo. *Citas T1.*
