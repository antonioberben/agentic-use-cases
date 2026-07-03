# Paso 2 — Construcción de un AGENTS.md útil

> Objetivo: entender cómo se escribe un `AGENTS.md` útil y qué cambia al repetir la petición del paso 1 con él presente.
>
> **Walkthrough didáctico.** El ejercicio se ilustra con un repo de ejemplo. Aplicable inmediatamente sobre uno de tus propios repos usando `app/AGENTS.md.template`.

## Qué es `AGENTS.md`

Es un estándar open source: un archivo en la raíz del repo que le explica al agente cómo funciona el proyecto. No es documentación humana, es contrato máquina. Sirve para que cualquier agente que trabaje sobre el repo entienda estructura, convenciones, comandos y restricciones sin tener que inferirlos.

Especificación: <https://agents.md>.

## Qué debe contener un AGENTS.md útil

Cinco bloques mínimos:

1. **Propósito del proyecto.** Dos frases. Qué hace, para quién.
2. **Estructura del código.** Dónde está cada cosa. No tienes que listar todos los archivos; basta con explicar la lógica de organización.
3. **Convenciones.** Nombrado, idioma, estilo, formato. Lo que no aplica se omite.
4. **Comandos.** Cómo instalar, cómo correr, cómo testear, cómo formatear. Comandos exactos copiables.
5. **Qué evitar.** Anti-patrones específicos de este proyecto. Es la sección que más valor da y la que más se olvida.

Opcional pero recomendado:

- **Glosario de dominio**: términos que tienen significado específico en este proyecto (cliente, descuento, pedido, etc.) y no son lo que el agente asumiría por defecto.
- **Cómo añadir una funcionalidad nueva**: receta paso a paso.

## Tarea

1. Abre `app/AGENTS.md.template`. Está vacío con los cinco bloques marcados.
2. Inspecciona el repo lo suficiente para llenarlo. Lee `README.md`, mira la estructura de `src/` y `tests/`, abre 2-3 archivos representativos.
3. Rellena cada bloque. Sé concreto. "Tests con pytest, fixtures en `conftest.py`" es útil; "tests siguiendo buenas prácticas" no.
4. La sección "Qué evitar" debe tener al menos tres entradas reales: cosas que un agente genérico haría mal en este repo.

Tiempo objetivo: 20-30 minutos. Si tardas más, estás escribiendo documentación humana, no contrato para agente. Corta.

## Repetir la tarea del paso 1

Con `AGENTS.md` ya en la raíz del repo, abre nueva sesión (importante: nueva sesión, para que no arrastre el contexto malo del paso 1) y lanza la misma petición:

> "Añade una función nueva al proyecto que calcule el descuento aplicable a un pedido en función del tipo de cliente. Incluye tests."

Deja al agente trabajar.

## Qué observar ahora

- ¿Coloca la función en el archivo correcto?
- ¿Usa las convenciones de nombrado del proyecto?
- ¿Reutiliza utilidades existentes en vez de reinventarlas?
- ¿Los tests siguen el framework y la estructura ya presentes?
- ¿Usa el glosario de dominio (si lo añadiste)?

Compara con la lista de problemas que apuntaste en el paso 1. La mayoría debería haber desaparecido. Si alguno persiste, es señal de que tu `AGENTS.md` aún no cubre esa convención: itéralo.

## Lección

El esfuerzo de escribir `AGENTS.md` es proporcional al primer uso. El retorno es proporcional a cuántas veces el agente trabaje sobre el repo. En proyectos vivos, es positivo en la primera semana.

`AGENTS.md` no sustituye a la documentación humana ni al README. Es un activo distinto, con un consumidor distinto (el agente) y un formato más imperativo.

## Salida del paso

- `app/AGENTS.md` rellenado con los cinco bloques.
- Comparativa entre la salida del paso 1 y la del paso 2: cuántos problemas se han resuelto sin tocar el código fuente.

Si la comparativa no es convincente, el `AGENTS.md` no es suficientemente concreto. Itéralo antes de pasar al paso 3.

Continúa al paso 3 (MCP y herramientas).
