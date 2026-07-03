---
title: "Qué es un LLM"
sidebar_position: 1
---

# Qué es un LLM

Un **Large Language Model** es una función estadística que, dado un texto, predice el siguiente fragmento más probable. No razona, no recuerda y no consulta nada por sí mismo: calcula probabilidades sobre un vocabulario de *tokens* a partir de patrones aprendidos durante el entrenamiento.

## Lo importante de entender

- **Es una predicción, no un razonamiento.** Cuando "explica" algo, está completando texto probable, no consultando una base de hechos.
- **No tiene memoria entre conversaciones.** Cada llamada empieza vacía. Si quieres que recuerde, tienes que pasarle la información en el *contexto* de la pregunta (ver [Tokens y contexto](./tokens-y-contexto)).
- **No tiene acceso a tus datos.** Solo ve lo que le pasas en el prompt. Para que acceda a sistemas externos hace falta un *harness* con herramientas (ver [Del chat al agente](./del-chat-al-agente)).
- **Puede alucinar.** Si el patrón estadístico empuja a una respuesta plausible pero falsa, la dará con la misma confianza que la verdadera. Por eso los casos de uso piden *cita exacta de la fuente*.

## Modelos típicos

| Familia | Proveedor | Uso típico |
|---------|-----------|------------|
| GPT-4, GPT-4o | OpenAI | Calidad alta, coste medio-alto |
| Claude 3.5/4 Sonnet, Opus | Anthropic | Calidad alta, fuerte en razonamiento largo y código |
| Gemini 1.5/2.0 | Google | Contexto muy grande, integración con Workspace |
| Llama 3.1, Qwen2.5 | Meta, Alibaba | Modelos abiertos, ejecutables en local con Ollama |

Para casos sensibles a confidencialidad, **modelos locales** (Ollama + Llama o Qwen) evitan que el dato salga de la máquina. Para máxima calidad, **modelos hosted** con acuerdo de no-entrenamiento.
