# Segunda opinión sobre tu propio análisis

> **Rol:** analista · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Antes de presentar, dudas: *"¿se me ha escapado algo?"*. Se busca un revisor crítico que cuestione supuestos, identifique sesgos del muestreo y proponga métricas alternativas.

## 2. Cómo resolverlo

**Local.** Llama 70B con prompt explícito de revisión adversarial.

**Copilot.** Funciona pero tiende a validar; hay que forzar el rol crítico.

**Claude Code / ChatGPT.** Prompt: *"Critica este análisis como revisor adversarial. Supuestos implícitos. Sesgos. Preguntas no hechas. Métricas alternativas que cambiarían la conclusión. Si no encuentras debilidades, dilo."*

**MCPs:** acceso al repo de análisis previos para comparar metodologías.

**Alternativa.** Pedir revisión humana a un par; el modelo no sustituye a un peer review formal.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % análisis con segunda opinión antes de presentar | *20%* | *> 80%* |
| Errores detectados pre-presentación | base | mejora moderada |
| TT-revisión | *60-120 min* (peer humano, si hay) | *15-20 min* (agente) |

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo no detecta un sesgo grave porque está fuera de su training, yo presento con falsa seguridad."*
- *"Si subo el análisis completo (con datos) al asistente, fuga del dataset."*
- *"Si el modelo sugiere métrica alternativa que apunta a otra conclusión y la adopto sin validar, decisión sobre métrica no probada."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
