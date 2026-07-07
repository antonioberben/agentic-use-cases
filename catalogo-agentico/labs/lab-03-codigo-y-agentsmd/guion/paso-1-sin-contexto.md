# Paso 1 — Anti-patrón: pedir sin contexto

> Objetivo: entender lo que produce un agente cuando trabaja sobre un repositorio que no conoce. Generar el contraste que justifica el paso 2.
>
> **Walkthrough didáctico.** Puedes leerlo y aplicarlo mentalmente, o probarlo sobre uno de tus propios repos en menos de 5 minutos.

## Escenario ilustrativo

Imagina un repositorio de tamaño medio con convenciones propias (nombrado en español, tests con `unittest`, utilidades de dominio reutilizables en un módulo común). Le pides a tu cliente de IA (Claude Code, Cursor o equivalente) que trabaje sobre él **sin darle ningún contexto previo** (sin `AGENTS.md`, sin abrirle el `README.md`, sin pasarle archivos representativos).

Lanzas al agente la siguiente petición, tal cual:

   > "Añade una función nueva al proyecto que calcule el descuento aplicable a un pedido en función del tipo de cliente. Incluye tests."

4. Deja que el agente trabaje. No lo interrumpas para guiarlo.

## Qué observar mientras trabaja

- ¿Dónde decide poner la función? ¿Acierta con la estructura existente?
- ¿Cómo nombra el archivo, la función, las variables? ¿Coincide con las convenciones del resto del código?
- ¿Qué framework de tests usa? ¿Coincide con el que ya hay en el repo?
- ¿Importa cosas que ya existen o reinventa utilidades?
- ¿Inventa tipos de cliente que no existen en el dominio?

Anota tus observaciones antes de seguir. Vas a contrastarlas con el resultado del paso 2.

## Lo que probablemente ha pasado

Sin contexto explícito, el agente toma decisiones plausibles pero genéricas:

- Estructura "razonable" que no es la del proyecto.
- Nombres en inglés cuando el proyecto está en español, o al revés.
- Tests con `pytest` cuando el proyecto usa `unittest`, o viceversa.
- Funciones de utilidad reinventadas en vez de reutilizar lo que ya existe en el repo.
- Reglas de descuento inventadas en lugar de las que define el negocio.

Nada de esto es culpa del modelo. El modelo no es adivino: si no le das contexto, adivina.

## Coste real del anti-patrón

Si aceptas el código generado tal cual, dedicarás tiempo a:

- Renombrar archivos y variables para alinear con tus convenciones.
- Reescribir los tests para que encajen con tu framework.
- Borrar utilidades duplicadas.
- Discutir en revisión de PR cosas que el agente "no podía saber".

Casi todo ese trabajo desaparece si dedicas 30 minutos a darle un buen `AGENTS.md`. Eso es lo que vas a hacer en el paso 2.

## Salida del paso

- Lista de 5-10 problemas concretos que has detectado en lo que ha generado el agente.
- Una hipótesis: "si el agente supiera X sobre este repo, no habría cometido este error".

Continúa al paso 2.
