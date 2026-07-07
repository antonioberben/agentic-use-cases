# Guía de estándares operativos — Catálogo de IA agéntica

> ⚠️ **BORRADOR.** Guía operativa para practitioners. Contenido mayoritariamente conceptual y procedimental (bajo riesgo factual). Cualquier dato cuantitativo o referencia normativa que se añada queda sujeto al deep-research (T1) pendiente (ver `AGENTS.md` §3).

## Propósito

Enseñar los **hábitos operativos** que hacen que el trabajo con agentes de IA sea repetible, seguro y útil, **antes** de gobernar la adopción a escala. No es un curso de IA generativa (eso es el capítulo puente, D12); es el manual de "cómo se trabaja con un agente" común a todos los roles.

La guía sostiene los labs: cada lab base asume que el lector ya conoce estos cinco capítulos.

## Audiencia

Cualquier practitioner que use un agente (Claude Code, Cursor, Copilot, un asistente interno) en su día a día, con independencia del rol.

## Capítulos

| # | Capítulo | Pregunta que responde | Features de referencia |
|---|----------|------------------------|------------------------|
| 01 | [AGENTS.md](01-agents-md.md) | ¿Cómo le doy a un agente las reglas permanentes de mi proyecto? | V8 (`INFO.md`), V3 |
| 02 | [Gestión de contexto](02-gestion-contexto.md) | ¿Qué información meto en cada petición y qué dejo fuera? | V1, V4 |
| 03 | [Gestión de sesiones](03-gestion-sesiones.md) | ¿Cuándo sigo en la misma sesión y cuándo abro una nueva? | V1, V2 |
| 04 | [Iteración crítica](04-iteracion-critica.md) | ¿Cómo uso al agente como crítico y no me fío a ciegas? | V6 |
| 05 | [MCP y herramientas](05-mcp-y-herramientas.md) | ¿Cómo da un agente el salto de "hablar" a "actuar" con seguridad? | C2, V4, V10, V12 |

## Principio rector

Un agente no es un buscador ni un chat: es un trabajador con memoria limitada, acceso a herramientas y capacidad de actuar. Los cinco hábitos de esta guía se reducen a uno: **dale contexto suficiente, dale el mínimo de permisos necesario y verifica siempre su salida.** Ese principio es también el puente hacia el gobierno de IA a escala.

Las IDs de feature (V8, C2, etc.) remiten al inventario interno de features de referencia (`inventario-features-referencia.md`, documento de trabajo no publicado en el sitio).
