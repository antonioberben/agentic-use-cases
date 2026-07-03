---
title: "Del chat al agente"
sidebar_position: 3
---

# Del chat al agente

Tres etapas de madurez en el uso de un LLM:

## 1. Prompt

Pides algo en lenguaje natural, recibes texto. El modelo solo ve lo que cabe en la pregunta. Útil pero limitado: no consulta nada, no recuerda nada.

## 2. Contexto

Le das al modelo el material que necesita: documentos, datos, historial. La calidad explota. Es lo que hace Copilot dentro de M365: el contexto es tu correo, tu Excel, tus documentos.

## 3. Harness (agente)

El modelo se mete dentro de un sistema que le da:

- **Herramientas (MCP)** que puede invocar para leer datos o ejecutar acciones.
- **Bucle de razonamiento**: piensa → llama herramienta → observa resultado → vuelve a pensar.
- **Memoria estructurada** (`AGENTS.md`, archivos, base vectorial).

Ya no responde: **actúa**. Lee un Jira, abre un PR, busca en un log, calcula una varianza, redacta un borrador.

## Quién decide y quién ejecuta

En un agente, el LLM **decide** qué hacer y el harness **ejecuta**. El harness es código normal: tiene permisos, tiene allowlist de comandos, tiene gates humanos. La gobernanza del agente no se hace dentro del LLM (no se puede); se hace en el harness.

Por eso los casos de uso siempre acotan:

- Qué MCPs ve el agente y con qué scopes (`read` vs `write`).
- Qué comandos puede ejecutar (allowlist).
- Qué acciones requieren confirmación humana.
- Qué identidad usa el agente (nunca tu sesión personal; siempre identidad propia tipo `svc-*`).

Ese conjunto de controles es lo que cubre la **Pieza 2 — Plan Director de IA**.
