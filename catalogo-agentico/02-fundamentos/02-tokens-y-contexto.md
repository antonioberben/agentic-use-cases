---
title: "Tokens y contexto"
sidebar_position: 2
---

# Tokens y contexto

## Token

Unidad básica de entrada y salida de un LLM. No son palabras: el modelo descompone el texto en fragmentos (típicamente 3-4 caracteres en castellano, una palabra puede ser 1-3 tokens).

Importa porque:

- **Coste.** Los modelos hosted facturan por token de entrada + token de salida. Un prompt de 4.000 palabras viene a 6.000-8.000 tokens.
- **Límite.** Cada modelo tiene una *ventana de contexto* máxima (lo que cabe en una llamada): 8k, 128k, 200k, 1M tokens según el modelo.

## Contexto

Todo lo que el modelo "ve" en una llamada: el *system prompt* (instrucciones), el historial de la conversación, los documentos adjuntos, el resultado de herramientas y la pregunta actual.

Reglas prácticas:

- **Más contexto bien curado = mejor respuesta.** El modelo no es un oráculo: dale el material que necesita.
- **Más contexto basura = peor respuesta.** Saturar el contexto con ruido degrada la calidad y dispara el coste.
- **El contexto no es memoria persistente.** Al cerrar la sesión se va. Para persistir, hace falta `AGENTS.md` o RAG (ver [AGENTS.md](./agents-md)).

## Cuándo abrir nueva sesión

- Cuando cambias de tarea (de redactar a depurar).
- Cuando el modelo empieza a confundirse con conversaciones largas.
- Cuando la ventana de contexto está cerca del límite.

## Qué cabe en cuántos tokens

| Contenido | Tokens aproximados |
|-----------|--------------------|
| 1 página de texto en castellano | 600-800 |
| 1 contrato medio (15 pp) | 10.000-12.000 |
| 1 libro de 300 páginas | 180.000-240.000 |
| 1 codebase mediano (500 archivos) | varios millones (necesita RAG, no cabe) |
