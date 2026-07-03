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

Cubierto en **Pieza 2** con gate humano en lanzamiento, disclosure y allow-list MAP.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
