# 05 — MCP y herramientas: del "hablar" al "actuar" con seguridad

> ⚠️ **BORRADOR.** Contenido conceptual y procedimental. Las referencias a productos Solo describen su rol como control; las afirmaciones de comportamiento de producto deben validarse contra la versión del proyecto y, en su caso, el deep-research (T1).

## El salto que lo cambia todo

Un agente que solo conversa es de bajo riesgo. Un agente con **herramientas** (que lee bases de datos, ejecuta comandos, abre tickets, modifica configuración) es un trabajador con manos. Ahí empieza el valor real y también el riesgo real. Este capítulo explica cómo se conecta un agente a herramientas y cómo se hace con el mínimo privilegio desde el primer día.

## Qué es MCP

El **Model Context Protocol (MCP)** es el estándar por el que un agente descubre y usa herramientas externas: un servidor MCP publica un conjunto de herramientas con descubrimiento tipado, y el agente las invoca (feature V12). En las apps de referencia, cada sistema corporativo se expone tras su propio servidor MCP: política, ITSM/CMDB, núcleo, RAN, monitorización, cada uno con su `*-mcp` (feature C2). El agente no habla directamente con el sistema: habla con el MCP, que es la frontera.

Las herramientas típicas que un agente puede recibir: leer/editar ficheros, buscar, ejecutar shell, acceder a la web (feature V4). Cada una amplía lo que el agente puede hacer y lo que puede romper.

## Least-privilege desde el cliente, no solo desde el servidor

El error mental común es pensar que el control vive solo en el servidor. Las primitivas de navegador para agentes demuestran lo contrario: aplican **allowlist de dominios, gates de confirmación para acciones sensibles, política de acciones declarada en JSON y acceso por capacidades** (feature V10), todo del lado del agente. El control de herramientas es de doble cara:

- **Allowlist:** el agente solo ve las herramientas y destinos que necesita, no todos.
- **Gate de confirmación:** las acciones sensibles (escritura, borrado, gasto) requieren un paso de aprobación.
- **Capacidades mínimas:** read-only por defecto; escritura solo donde la tarea lo exige.

Es exactamente la máquina de estados del demo de referencia: cada acción pasa por un gate que la deja pasar (`pass`), la bloquea (`block`) o la marca para auditoría (`trace`) según la política (feature C4). El Lab 4 (operacional read-only) muestra el caso en que un intento de escritura se **bloquea** por política.

## Inventario y procedencia

No puedes gobernar lo que no inventarías. Cada herramienta/MCP que un agente puede usar debe estar:

- **Inventariado:** sabes que existe y qué hace (rol de agentregistry).
- **Con procedencia validada:** sabes quién lo publicó y confías en él. Un `shadow-mcp` no inventariado es el vector de los escenarios adversariales (feature C6).
- **Con secretos protegidos:** las credenciales que el MCP usa van cifradas, nunca en claro ni en `AGENTS.md` (feature V11; ver Anexo C de plantillas).

## Dónde encajan los productos Solo

| Necesidad | Componente | Rol |
|-----------|------------|-----|
| Mediar y aplicar política al tráfico agente↔MCP↔LLM | agentgateway | Frontera y punto de control (allowlist, prompt guard, traza). |
| Orquestar agentes en Kubernetes | kagent | Ciclo de vida e identidad del agente. |
| Inventariar agentes y herramientas | agentregistry | Catálogo y procedencia. |
| Segmentar y dar identidad de red | Istio ambient | Frontera entre zonas. |

Estos componentes se introducen en profundidad fuera de la Pieza 0 (labs ejecutables reales y Parte VI de la Pieza 2). Aquí basta con que el practitioner entienda que **el punto donde el agente toca una herramienta es el punto donde se aplica el control.**

## Antipatrones

- Dar a un agente todas las herramientas "por comodidad".
- Permisos de escritura cuando la tarea es de lectura.
- Conectar un MCP de origen desconocido sin validarlo.
- Meter credenciales en el contexto o en el `AGENTS.md`.

## Relación con el gobierno

Este capítulo es la puerta directa al Plan Director: control de herramientas y MCP (Parte III, cap. 12), identidad de agentes (cap. 10) y seguridad de LLMs y agentes (cap. 11). Lo que aquí es un hábito individual, allí es un control inventariable y auditable.
