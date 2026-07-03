# 04 — Iteración crítica: la IA como crítico, no como oráculo

> ⚠️ **BORRADOR.** Contenido conceptual y procedimental.

## El hábito que más cambia el resultado

La diferencia entre un practitioner que saca poco valor de un agente y uno que saca mucho rara vez es el prompt inicial: es la **iteración**. El agente produce un primer resultado plausible; el trabajo está en criticarlo, verificarlo y refinarlo. Tratar la primera salida como verdad final es el error más común y más caro.

## La IA se equivoca con seguridad

Un agente puede afirmar algo falso con total aplomo. Los harness serios lo asumen y montan **verificación explícita**: deepsec, tras detectar una posible vulnerabilidad, ejecuta un paso de **revalidación** que revisa el historial de git por si ya está arreglada y re-verifica los hallazgos existentes, precisamente para **reducir falsos positivos** (feature V6). El practitioner debe hacer lo mismo a su escala: no aceptar un hallazgo sin contrastarlo.

## Bucle de iteración crítica

1. **Pide el resultado.** Primera salida del agente.
2. **Critícalo tú o pídele que se critique.** "¿Qué supuestos has hecho? ¿Qué podría estar mal aquí?"
3. **Verifica contra la realidad.** Ejecuta el test, revisa la fuente, comprueba el dato. No te fíes de "parece correcto".
4. **Refina con el fallo concreto.** Dale el error real, no "no funciona".
5. **Repite hasta que pase la verificación**, no hasta que suene bien.

## Usar un segundo agente como crítico

Un patrón potente: que un agente proponga y otro (o el mismo en sesión limpia, cap. 03) intente **refutar**. La diversidad de perspectiva caza errores que la redundancia no. Es el mismo principio que la verificación adversarial: por defecto, asumir que el hallazgo es dudoso hasta que sobreviva al escrutinio.

## Verificar no es opcional según el riesgo

| Tipo de salida | Nivel de verificación |
|----------------|------------------------|
| Borrador de texto interno | Ligera: revisión humana. |
| Código que se va a ejecutar | Alta: tests, lint, revisión. |
| Decisión sobre datos sensibles o de cliente | Máxima: doble verificación y traza. |
| Acción que modifica un sistema | Gate explícito antes de ejecutar (cap. 05). |

## Antipatrones

- **Aceptar la primera respuesta** porque es fluida.
- **"No funciona"** como feedback: no le das al agente el fallo concreto que necesita.
- **Iterar sobre estética** (que suene mejor) en vez de sobre correctitud (que sea cierto).

## Relación con el gobierno

La iteración crítica individual es el germen de la **evaluación** a escala: cómo se mide si un agente hace bien su trabajo antes de darle más autonomía. Conecta con la metodología de autoevaluación (Parte IV de la Pieza 2) y con agentevals como control.
