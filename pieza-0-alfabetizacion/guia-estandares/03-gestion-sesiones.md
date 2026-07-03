# 03 — Gestión de sesiones

> ⚠️ **BORRADOR.** Contenido conceptual y procedimental.

## Qué es una sesión

Una sesión es una conversación continua con el agente: comparte contexto de principio a fin. La ejecución de un agente puede ser **durable y reanudable** (no atada a una única petición): un runtime moderno mantiene el estado, transmite resultados en streaming y permite reconectarse a una ejecución en curso (feature V1). Eso es potente, pero implica que una sesión **acumula** historia, aciertos y errores, hasta que conviene cerrarla.

La pregunta operativa de este capítulo: **¿sigo aquí o empiezo de cero?**

## Cuándo seguir en la misma sesión

- La tarea es la misma y avanzas paso a paso.
- El contexto acumulado es un activo (el agente ya conoce los ficheros y decisiones de esta tarea).
- Estás iterando sobre un resultado concreto (ver cap. 04).

## Cuándo abrir una sesión nueva

- **Cambias de tarea.** Mezclar dos problemas en una sesión contamina el contexto de ambos.
- **El agente se ha "perdido":** repite errores, ignora correcciones, arrastra una decisión equivocada. Es más barato reiniciar con un buen prompt que pelear con una sesión envenenada.
- **La ventana de contexto está saturada** (señales en cap. 02).
- **Quieres una segunda opinión limpia:** un agente sin el sesgo de la conversación anterior.

Regla simple: **una sesión, una tarea.** Cuando dudes, abre nueva y arranca con el objetivo claro más el `AGENTS.md` haciendo de memoria permanente.

## Aislamiento: por qué las sesiones no deben pisarse

Los entornos de agente serios aíslan cada ejecución en un **sandbox independiente** con capacidad de snapshot y resume (feature V2): el trabajo de una sesión no afecta al de otra, y se puede pausar y retomar sin efectos colaterales. Para el practitioner esto se traduce en dos hábitos:

1. **No mezcles trabajo de varios temas en un mismo espacio** (sesión, rama, directorio): aísla.
2. **Lo reproducible es lo aislado.** Si una sesión necesita un entorno concreto, que ese entorno esté declarado (es el porqué del devcontainer / Codespaces en D13).

## El antipatrón de la sesión eterna

Arrastrar semanas de conversación en una sola sesión "para que el agente lo recuerde todo" es contraproducente: la ventana se satura, el contexto relevante se diluye y el coste por petición sube. Lo permanente vive en `AGENTS.md` y en la documentación, no en una sesión infinita.

## Relación con el gobierno

A escala, las sesiones son **unidades auditables**: quién las abrió, con qué identidad de agente, contra qué herramientas. La trazabilidad de sesiones es parte de la observabilidad del Plan Director (Parte III, cap. 13) y la base para investigar un incidente de IA.
