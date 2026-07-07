# 02 — Gestión de contexto

> ⚠️ **BORRADOR.** Contenido conceptual y procedimental.

## El recurso escaso

Un agente razona sobre una **ventana de contexto** finita: todo lo que "tiene presente" en un momento dado (el `AGENTS.md`, la conversación, los ficheros abiertos, las salidas de herramientas). Cuando se llena, la información antigua deja de pesar o se resume. Gestionar contexto es decidir, en cada petición, **qué entra y qué se queda fuera.**

El runtime de un agente moderno es multi-paso y durable: no es una llamada única sino una ejecución que encadena razonamiento, llamadas a herramientas y resultados (feature V1). Cada paso consume contexto. Por eso el contexto no es "cuanto más, mejor": es "lo justo y relevante".

## Regla práctica: contexto suficiente, no máximo

| Mete en el contexto | Deja fuera |
|---------------------|------------|
| El objetivo concreto de esta tarea | Historia irrelevante de tareas anteriores |
| Los ficheros/datos que la tarea toca | El repositorio entero "por si acaso" |
| El error o la salida que quieres que analice | Logs enteros sin filtrar |
| Las restricciones específicas de esta petición | Reglas permanentes (esas ya están en `AGENTS.md`) |

Dar el repositorio entero o pegar 5.000 líneas de log no ayuda: diluye la señal y empeora la respuesta. Los agentes de navegador, por ejemplo, trabajan sobre un **snapshot del árbol de accesibilidad con referencias deterministas** en vez de volcar el DOM completo (feature V9); es la misma lógica de "dar la vista útil, no todo".

## Cómo dar contexto bien

1. **Empieza por el objetivo, no por el detalle.** Una frase de qué quieres lograr antes de los datos.
2. **Acota el alcance.** "En `pago.py`, la función `validar()`" es mejor que "en el proyecto".
3. **Filtra antes de pegar.** De un log de 2.000 líneas, las 20 que rodean el error.
4. **Referencia, no dupliques.** Si el agente ya tiene un fichero, no lo vuelvas a pegar.
5. **Separa lo permanente de lo volátil.** Lo que vale para todas las tareas va en `AGENTS.md` (cap. 01); lo de esta tarea, en el prompt.

## Señales de mala gestión de contexto

- El agente "olvida" algo que dijiste hace tres mensajes: la ventana se llenó. Abre sesión nueva (cap. 03) o resume.
- Respuestas genéricas pese a haber dado mucha información: probablemente diste volumen, no relevancia.
- El agente contradice una regla del proyecto: o no está en `AGENTS.md`, o el contexto la sepultó.

## Relación con el gobierno

A escala, la gestión de contexto se vuelve un asunto de **coste y observabilidad**: cada token de contexto se paga, y el contexto que se inyecta a un agente es parte de lo que hay que poder auditar. Conecta con la gestión de coste y con la observabilidad a escala.
