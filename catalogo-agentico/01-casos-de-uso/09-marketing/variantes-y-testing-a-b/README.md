# Variantes y *testing* A/B

> **Rol:** marketing · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Generar 6 subject lines, 4 hero copies o 3 versiones de un anuncio para test. Hoy: 1-2 h por brainstorm.

**Cómo resolverlo.**

- *Local:* Ollama para iteración rápida.
- *Copilot M365:* Copilot Chat con guía de estilo.
- *Plataformas:* **Jasper**, **Copy.ai**, **Mutiny** (personalización web), **Persado** (lenguaje optimizado).
- *Claude Code:* repo `variants/` con histórico de variantes ganadoras.
- *MCPs:* `mcp-marketo` o `mcp-hubspot` (variantes en lectura), `mcp-google-ads` o `mcp-meta-ads` (creatividades).

**Prompt:** *"6 variantes de subject line a [audiencia] sobre [tema]. Cada una distinta en ángulo: urgencia, curiosidad, beneficio, dato, pregunta, dolor. Máx 50 caracteres. Sin emojis. Sin clickbait."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por set de variantes | 90 min | 15 min |
| Tests A/B ejecutados/mes | 4 | 12 |
| Lift medio del ganador | +12% | +25% |
| Open rate de email | 18% | 28% |

*Fórmula:* `(75) min × 200 sets/año = 250 h/año por demand gen`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera clickbait que contradice el contenido real, daño reputacional + sanciones de plataformas publicitarias.*
- *Si el test se lanza sin gate, una variante puede contener afirmaciones falsas.*
- *Si los datos del test salen a herramienta no aprobada, expones audiencia y conversión.*

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano en lanzamiento, disclosure y allow-list MAP.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `variant-generator`: genera sets de variantes (subject/hero/ads) en `draft`; demand gen firma antes de lanzar el test.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Clickbait que contradice el contenido real (Dir. 2005/29/CE; sanción de plataformas publicitarias) | agentgateway + agentevals | prompt guard de salida contra patrones clickbait; rubric de coherencia titular↔contenido bloquea el handoff |
| Variante con afirmación falsa lanzada sin gate | agentgateway + kagent (OBO) | `mcp-marketo`/`mcp-hubspot` scope `content:draft`; el lanzamiento del test requiere HITL + OBO de demand gen |
| Falta de disclosure de contenido IA en la creatividad (EU AI Act art. 50) | agentgateway | disclosure obligatorio; bloqueo si falta en la variante publicable |
| Datos del test (audiencia, conversión) a herramienta no aprobada (GDPR, ePrivacy) | agentgateway + agentregistry | `mcp-google-ads`/`mcp-meta-ads` scope `report:read` agregado; sólo MAP allowlisted; prohibido exportar audiencias |
| Coste por generación masiva de variantes | agentgateway | rate limit por campaña; semantic caching de variantes cercanas |

## Referencias

- Directiva 2005/29/CE (prácticas comerciales desleales), EU AI Act art. 50 (disclosure), GDPR y ePrivacy. *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
