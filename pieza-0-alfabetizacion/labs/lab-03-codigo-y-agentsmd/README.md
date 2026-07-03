# Lab 3 — Agente sobre código y repositorios (AGENTS.md + MCP)

> **Walkthrough didáctico, no lab ejecutable.** Esta pieza explica el patrón con prompts, salidas típicas y comparativas. No tiene devcontainer ni app de ejemplo: el practitioner aplica lo aprendido sobre uno de sus propios repos. Los labs ejecutables con devcontainer, manifiestos y componentes Solo (agentgateway, kagent, agentregistry) viven fuera de la Pieza 0.

## Resumen

| Atributo | Valor |
|----------|-------|
| Patrón técnico | Agente sobre código y repositorios |
| Roles cubiertos | Desarrollador, ingeniería de plataforma |
| Tiempo de lectura | 15-20 minutos |
| Tiempo de aplicación sobre un repo propio | 30-60 minutos |
| Componentes Solo | Ninguno; foco en estándares (`AGENTS.md`, MCP) |
| Pre-requisitos | Cliente de IA disponible (Claude Code, Cursor, equivalente) |

## Objetivo de aprendizaje

Al finalizar el lab, el practitioner debe ser capaz de:

1. Escribir un `AGENTS.md` útil para un repositorio propio (no genérico).
2. Entender qué es MCP (Model Context Protocol) y por qué cambia la forma de dar herramientas a un agente.
3. Iterar con un agente de código como crítico, no como generador ciego.
4. Identificar qué partes de su flujo de trabajo son candidatas a un agente y cuáles no.

## Estructura del lab

### Paso 0 — Preparación del entorno

- Clonar el repositorio del lab.
- Abrir en Codespaces o en devcontainer local.
- Verificar que el cliente de IA elegido (Claude Code, Cursor u otro) está disponible.

### Paso 1 — Anti-patrón: pedir sin contexto

Se le pide al practitioner que invoque al agente sin `AGENTS.md` y sin contexto, sobre un repositorio pequeño con convenciones específicas. Se observa que el agente genera código que ignora las convenciones, inventa nombres y no respeta la estructura.

Lección: el agente sin contexto adivina, y adivina mal.

### Paso 2 — Construcción de un AGENTS.md útil

Se guía al practitioner a redactar un `AGENTS.md` para el repositorio del lab, cubriendo:

- Estructura del proyecto.
- Convenciones de nombrado, estilo, tests.
- Comandos de build, test, lint.
- Cómo añadir una funcionalidad nueva.
- Qué evitar (anti-patrones específicos del repo).

Se repite la tarea del paso 1 con `AGENTS.md` presente. Diff visible.

### Paso 3 — Introducción a MCP

Se introduce conceptualmente MCP como forma estandarizada de exponer herramientas al agente. Se conecta un MCP simple (filesystem, git) y se muestra cómo el agente pasa de generar texto a ejecutar acciones controladas.

### Paso 4 — Iteración con la IA como crítico

Tarea final: el practitioner pide al agente que revise un PR (cambio real preparado en el repo del lab) y le da un objetivo de revisión claro. Aprende a pedir crítica, no aprobación. Aprende a pedir al agente que cuestione sus propias sugerencias.

### Paso 5 — Reflexión y salida

- ¿Qué tareas de tu día a día encajan en este patrón?
- ¿Qué tareas NO encajan?
- Apuntar a la guía de estándares operativos (`agents-md`, `gestion-contexto`, `iteracion-critica`).
- Apuntar a la siguiente lección: cuando este flujo escala a varios agentes con herramientas más sensibles, ¿qué necesitas? → Lab 4 con agentgateway.

## Estructura del walkthrough

```
lab-03-codigo-y-agentsmd/
  README.md                            (este archivo)
  guion/
    paso-1-sin-contexto.md             (anti-patrón ilustrado)
    paso-2-agents-md.md                (construcción de AGENTS.md con ejemplo guiado)
    paso-3-mcp.md                      (qué es MCP y cuándo añadirlo)
    paso-4-critica.md                  (IA como crítico, prompts ejemplo)
    paso-5-reflexion.md                (preguntas de cierre y siguientes pasos)
  app/
    AGENTS.md.template                 (plantilla vacía para usar en repo propio)
```

## Criterios de aceptación del walkthrough

- El practitioner puede leerlo entero en 15-20 minutos.
- Los ejemplos de prompts y salidas típicas se entienden sin ejecutar nada.
- Al terminar, el practitioner tiene claro qué cambiaría en su propio repo y puede rellenar `AGENTS.md.template` con su contexto.

## Próximos labs sugeridos

- **Lab 1** — Agente analítico sobre datos estructurados. Introduce agentgateway en modo observación.
- **Lab 4** — Agente operacional con herramientas read-only. Introduce kagent + MCP allowlist.
