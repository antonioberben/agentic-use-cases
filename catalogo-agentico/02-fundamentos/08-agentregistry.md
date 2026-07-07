---
title: "agentregistry"
sidebar_position: 8
---

# agentregistry

**Inventario y versionado** de los agentes, MCPs y prompts en producción. La fuente única de verdad de "qué agentes existen, qué versión corren y qué pueden hacer".

## Para qué sirve

- **Inventario.** Lista de todos los agentes desplegados, con su propietario, su modelo, sus MCPs autorizados, su entorno.
- **Versionado de prompts.** Cada cambio de prompt queda registrado. Si una respuesta empieza a fallar, sabes qué cambió.
- **Versionado de MCPs.** Igual: qué versión del MCP de Jira está autorizada hoy, qué versión estaba autorizada el mes pasado.
- **Auditoría.** El registro es la respuesta cuando el regulador o auditor pregunta *"¿qué agentes tratan datos de clientes, con qué fines y bajo qué controles?"*. Sin esto, esa pregunta no tiene respuesta.

## Por qué hace falta

Sin un registro, en seis meses no sabes:

- Cuántos agentes corren en producción.
- Quién es el dueño del agente que llama a Salesforce 30.000 veces al día.
- Qué prompt está usando un agente que dejó de funcionar tras un cambio.
- Si el MCP comunitario que un equipo añadió "para probar" sigue conectado.

La gobernanza a escala exige inventario; agentregistry lo provee.

## Dónde entra en los casos de uso

Aparece en todas las fichas del catálogo como "versionado de prompts y de MCPs autorizados". Es lo que permite cumplir DORA, NIS2, EU AI Act y el deber genérico de control sobre sistemas que tratan datos sensibles.
