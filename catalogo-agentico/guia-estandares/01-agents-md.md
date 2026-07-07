# 01 — Cómo escribir un AGENTS.md útil

> ⚠️ **BORRADOR.** Contenido conceptual y procedimental.

## Qué es y por qué importa

Un `AGENTS.md` es un fichero de texto, en la raíz del proyecto, donde se escriben las **reglas permanentes** que el agente debe respetar en cada sesión: cómo está montado el proyecto, qué convenciones seguir, qué no tocar, cómo verificar el trabajo. Es la memoria de largo plazo del proyecto frente a la memoria de corto plazo de la sesión (cap. 02).

El patrón no es exclusivo de un producto. Herramientas de seguridad agéntica como deepsec inyectan un `INFO.md` de 50 a 100 líneas con los patrones del proyecto (autenticación, middleware, primitivas conocidas) para enfocar al agente antes de que analice nada (feature V8). La idea es la misma: **un contexto estable, curado, que no se repite en cada prompt.**

Sin `AGENTS.md`, el practitioner reexplica el proyecto en cada conversación, el agente improvisa convenciones y los resultados son inconsistentes. El Lab 3 muestra el contraste directo entre trabajar con y sin este fichero.

## Qué incluir

Un `AGENTS.md` útil cubre, de forma breve:

- **Identidad del proyecto:** qué es, para quién, en qué lenguaje/stack.
- **Cómo se ejecuta y cómo se prueba:** el comando que valida un cambio. Es lo primero que el agente necesita para autoevaluarse.
- **Convenciones:** estilo, naming, estructura de carpetas, idioma de los entregables.
- **Lo prohibido:** qué ficheros o áreas no debe tocar, qué patrones están vetados, qué requiere confirmación humana.
- **Cómo verificar:** qué significa "hecho" en este proyecto (tests, lint, build).

## Qué dejar fuera

- Información volátil (estado de una tarea concreta): eso va en el prompt de la sesión, no en el fichero permanente.
- Secretos, credenciales, tokens: nunca en `AGENTS.md` (ver cap. 05 y Anexo C de plantillas de política).
- Documentación exhaustiva: el `AGENTS.md` orienta, no sustituye al README ni a la doc del proyecto. 50 a 150 líneas es un buen rango.

## Estructura recomendada

```markdown
# AGENTS.md

## Qué es este proyecto
(1-3 líneas)

## Cómo ejecutar y probar
(el comando que valida un cambio)

## Convenciones
- Lenguaje / estilo / naming
- Idioma de entregables

## Reglas duras (no negociables)
- Qué no tocar
- Qué requiere confirmación

## Definición de "hecho"
- Tests / lint / build que deben pasar
```

## Antipatrones

- **El fichero enciclopedia:** tan largo que consume la ventana de contexto y diluye lo importante.
- **El fichero fantasma:** existe pero está desactualizado; el agente sigue reglas que ya no aplican. Mantenerlo vivo es parte del trabajo (igual que `AGENTS.md` es el documento vivo de este propio proyecto).
- **Reglas blandas:** "intenta seguir el estilo" no es una regla; "usa comillas dobles, indentación de 2 espacios" sí.

## Relación con el gobierno

Cuando la adopción escala, estos ficheros dejan de ser una buena práctica individual y se convierten en un **control inventariable**: qué agentes operan bajo qué reglas. Es uno de los puentes naturales hacia el gobierno de IA a escala (identidad y control de agentes).
