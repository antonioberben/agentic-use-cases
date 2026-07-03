# Resumir hallazgos para no-técnicos

> **Rol:** analista · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Análisis cerrado, hay que contarlo a un VP/cliente. Se busca resumen ejecutivo de 5 líneas con la cifra primero, causa después, recomendación al final. Y versiones de 30 s / 3 min / 15 min no contradictorias.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre el bloque de resultados.

**Copilot.** En Word/PowerPoint con el análisis adjunto.

**Claude Code / ChatGPT.** Prompt: *"Resumen de 5 líneas. Cifra primero, causa más probable después, recomendación al final. Sin jerga. Si la confianza es baja, dilo. Luego variantes de 3 min y 15 min, coherentes entre sí."*

**MCPs:** docs (Notion/Confluence) para guardar resúmenes versionados.

**Alternativa.** Plantilla propia en Markdown, prompt corto.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-resumen | *45-90 min* | *10-15 min* |
| % resúmenes con cifra + recomendación | *60%* | *> 90%* |
| Iteraciones por audiencia | *2-3* | *1* |

**Fórmula:** ≈ (60 − 12) min × 20 análisis/mes × 11 / 60 ≈ **176 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el resumen incluye una causa que el modelo afirma con confianza pero no está demostrada, el VP toma decisión sobre certeza falsa."*
- *"Si pego resultados con datos pre-anuncio en asistente público, MAR."*
- *"Si el resumen va a cliente bajo NDA, transferencia internacional sin contrato si el proveedor está fuera del EEE."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
