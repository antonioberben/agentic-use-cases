---
title: "AGENTS.md"
sidebar_position: 4
---

# AGENTS.md

Archivo de texto plano en la raíz del repositorio (o del directorio de trabajo) que le explica al agente el contexto persistente: qué hace este proyecto, qué convenciones se siguen, qué comandos se usan, qué está prohibido. El agente lo lee al inicio de cada sesión.

Es la diferencia entre arrancar cada sesión desde cero (re-explicando todo) y arrancar con el agente "ya orientado".

## Qué pones dentro

Tipicamente 5-8 bloques cortos:

1. **Qué es este proyecto.** Una o dos frases.
2. **Stack.** Lenguajes, frameworks, infraestructura.
3. **Convenciones.** Estilo, naming, estructura de carpetas.
4. **Comandos de uso frecuente.** Cómo se corre, se testea, se compila.
5. **Prohibiciones.** Qué no tocar (`infra/prod`, secretos, `vendor/`), qué no commitear.
6. **Cómo iterar.** Qué hacer cuando el test falla, cuándo abrir nueva sesión.
7. **Glosario.** Vocabulario del dominio que el agente no conoce.
8. **Enlaces.** A documentación interna, runbooks, dashboards.

No es documentación para humanos: es contexto para el LLM. Cuanto más concreto y menos prosa decorativa, mejor.

## Mini-lab: nota la diferencia

**Paso 1 — Sin AGENTS.md.** Le pides al agente *"añade un endpoint POST /users que valide email"*. El agente improvisa: elige un framework al azar (puede no ser el tuyo), valida con regex propio, ignora tus convenciones, no escribe test, no usa tu logger.

**Paso 2 — Con AGENTS.md.** Mismo prompt, pero el agente ha leído antes:

```markdown
# AGENTS.md

## Stack
- Python 3.11, FastAPI, pydantic v2
- Tests con pytest, fixtures en `tests/conftest.py`
- Logger: `from app.observability import logger`

## Convenciones
- Endpoints en `app/api/<recurso>.py`
- Validación SIEMPRE con pydantic, no regex
- Cada endpoint nuevo necesita test en `tests/api/`
- Commits: convencional (`feat:`, `fix:`, `docs:`)

## Prohibiciones
- No commitear nada en `infra/prod/`
- No usar `print`; usar `logger`
```

El agente ahora crea el endpoint en el archivo correcto, con pydantic, con su test al lado, con el logger del proyecto. Cero re-explicación.

## Cómo se construye uno

1. Empieza vacío. Añade lo que el agente equivocó en la primera sesión.
2. Itera: cada vez que tengas que corregir al agente con una regla del proyecto, esa regla se queda en `AGENTS.md`.
3. Mantenlo corto. Si supera 2 páginas, divide por dominio (`api/AGENTS.md`, `infra/AGENTS.md`).

> Esto es la base de la mecánica de trabajo con un agente. Casi todos los casos del catálogo asumen que tienes un `AGENTS.md` decente.
