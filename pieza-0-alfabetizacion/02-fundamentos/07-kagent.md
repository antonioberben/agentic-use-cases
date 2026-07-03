---
title: "kagent"
sidebar_position: 7
---

# kagent

Gestiona la **identidad y el ciclo de vida** del agente en Kubernetes. Convierte al agente en un ciudadano de primera clase de la plataforma, no en un script anónimo.

## Para qué sirve

- **Identidad propia del agente.** Cada agente desplegado tiene una identidad de servicio (`svc-<agente>-<entorno>`), no usa la credencial personal del operador. Trazabilidad real.
- **Rotación de credenciales.** Los tokens que el agente usa contra MCPs y modelos se rotan automáticamente. Sin claves de larga duración hardcodeadas.
- **Scopes mínimos por agente.** El agente declara qué MCPs y qué LLM necesita; kagent emite credenciales solo para eso.
- **Alta y baja.** Crear un agente nuevo (con su identidad, sus secretos, su política) es una operación de plataforma, no un copy-paste de variables de entorno.

## Por qué hace falta

Cuando un equipo prueba un agente con su PAT personal, todo va bien hasta que:

- La persona se va de la empresa y su PAT sigue funcionando.
- Hay 30 agentes corriendo y nadie sabe cuáles existen, qué tocan ni a quién pertenecen.
- Un agente actúa y la auditoría solo ve el nombre de la persona, no del agente.

kagent resuelve esto antes de que escale.

## Dónde entra en los casos de uso

Es el componente que materializa el patrón "identidad propia del agente con scopes mínimos" que aparece en cada ficha del catálogo en la sección de riesgos. Sin kagent, ese patrón se queda en intención.
