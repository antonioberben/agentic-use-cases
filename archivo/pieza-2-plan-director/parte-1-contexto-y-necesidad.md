# Parte I — Contexto y necesidad

> Pieza 2 del kit "Marco de Adopción y Gobierno de IA". Audiencia: CISO + CDO de grandes cuentas españolas (banca, telco, seguros). Registro ejecutivo.

> ⚠️ **BORRADOR SIN DEEP-RESEARCH.** Las afirmaciones factuales de este capítulo (estado de adopción, riesgos, marco regulatorio) están redactadas en forma cualitativa. Pendiente reforzar con datos verificados, fuentes citadas y mapeo normativo concreto cuando el deep-research (T1 en `AGENTS.md`) esté disponible. No entregar al cliente en este estado.

## Capítulo 1. Estado de la adopción de IA agéntica y generativa

### 1.1. De la curiosidad individual al mandato del consejo

En menos de dos años la conversación corporativa sobre IA generativa ha pasado del entusiasmo individual a la presión ejecutiva. Lo que en 2023 era un experimento personal con un asistente conversacional público es hoy un mandato explícito del consejo de administración: integrar IA generativa y agéntica en procesos de negocio, demostrar retorno cuantificable y, en paralelo, evitar incidentes que dañen reputación o atraigan al regulador.

El punto de partida real de la mayoría de organizaciones grandes españolas es heterogéneo. Coexisten cuatro situaciones que conviene nombrar antes de proponer cualquier plan:

- **Uso individual no gobernado.** Empleados que usan asistentes conversacionales públicos desde el navegador para tareas de productividad. La organización no inventaría qué se usa, ni con qué datos, ni con qué contratos.
- **Pilotos de equipo.** Departamentos concretos (legal, marketing, atención al cliente) han contratado o construido un piloto. Suelen vivir fuera del catálogo TI, con credenciales personales o contratos firmados por la línea de negocio.
- **Adopción transversal sin gobierno común.** Varios equipos han desplegado integraciones de IA en producción, cada uno con su pila, su proveedor y sus controles. No hay inventario único, ni política única, ni medición unificada de coste.
- **Agentes operando sobre sistemas críticos.** Casos punta donde un agente ya ejecuta acciones (consulta, escribe, paga, gestiona ticket, abre incidencia) sin supervisión humana en cada paso.

La mayoría de las grandes cuentas españolas vive a caballo entre los dos primeros estadios, con focos aislados del tercero. El cuarto es la excepción, pero crece. El Plan Director debe servir para diagnosticar dónde está cada organización y trazar el camino al siguiente estadio sin saltarse pasos.

### 1.2. Del asistente conversacional al agente autónomo

La diferencia entre un asistente conversacional y un agente no es de grado, es de naturaleza. Un asistente responde cuando un humano pregunta; el humano lee y decide. Un agente recibe un objetivo, planifica, llama herramientas, modifica sistemas, vuelve a planificar y persigue ese objetivo a lo largo de minutos, horas o días. Opera con autonomía variable y, en muchos casos, sin supervisión humana en cada paso intermedio.

Las implicaciones para el CISO y el CDO son inmediatas:

- **El agente es una identidad de primera clase.** No es una sesión humana ni un servicio anónimo. Necesita identidad propia, permisos acotados, ciclo de vida (alta, rotación, baja) y auditoría individualizada.
- **El catálogo de herramientas se convierte en superficie de ataque.** Cada herramienta que un agente puede invocar (un MCP, una API interna, un endpoint externo) amplía simultáneamente lo que puede hacer y lo que un atacante puede inducirle a hacer.
- **El consumo deja de ser predecible.** Un agente puede entrar en bucles, reintentar, escalar a modelos más caros o procesar contextos largos sin que nadie lo decida explícitamente. El coste por unidad de trabajo deja de ser estable.
- **La auditoría exige trazas, no logs.** Un evento ya no es "el usuario X hizo Y", sino "el agente A, en nombre del usuario X, decidió la acción Y tras considerar Z herramientas y el prompt W". Sin esa traza, no hay forma de responder a un auditor interno, a un cliente afectado o al regulador.

Este salto cualitativo es lo que justifica un marco específico. Las prácticas heredadas de seguridad de aplicaciones o de gobierno del dato son condición necesaria, pero no suficiente.

### 1.3. La brecha entre ambición declarada y capacidad operativa

En el discurso público, la mayoría de las grandes empresas afirma haber adoptado IA generativa. En la realidad operativa, esa afirmación rara vez se sostiene cuando se pregunta por elementos básicos:

- ¿Existe un inventario actualizado de los asistentes, agentes y MCP en uso, con responsable, datos accedidos y proveedor?
- ¿Cada agente tiene identidad propia y permisos mínimos, o reutiliza credenciales humanas?
- ¿Se mide el coste de IA por equipo, caso de uso y modelo, o se paga una factura agregada al proveedor?
- ¿Hay una política de uso aceptable difundida, firmada y aplicada técnicamente?
- ¿Se conserva la traza de prompts, respuestas y herramientas invocadas durante el plazo que exige la normativa aplicable?

La brecha entre "tenemos IA" y "tenemos IA bajo control" es lo que el Plan Director está diseñado para cerrar. La premisa de este documento es que cerrarla no se hace frenando la adopción, sino acompañándola: gobierno mínimo desde el primer día, gobierno completo cuando la adopción escala.

## Capítulo 2. Riesgos emergentes

Esta sección no pretende ser exhaustiva. Selecciona los riesgos que con mayor frecuencia se materializan en grandes cuentas y que un comité de dirección debe entender para autorizar el plan.

### 2.1. Shadow AI: el activo invisible

El equivalente al shadow IT de hace una década, ahora aplicado a IA. Empleados y equipos contratan o usan asistentes y agentes fuera del proceso de compra y arquitectura. Cada uno con sus credenciales, sus contratos (o ausencia de contrato), sus datos. El impacto va más allá del riesgo de fuga: cuando llega una solicitud de un regulador o de un cliente preguntando "qué datos se han procesado con IA", la organización no puede responder porque no sabe.

El shadow AI no se elimina con una circular. Se reduce ofreciendo una alternativa autorizada que sea, al menos, igual de rápida y útil. Por eso la mitad de adopción del marco precede a la mitad de gobierno.

### 2.2. Prompt injection y manipulación adversarial

Un agente que lee contenido externo (correo, web, documento, ticket) puede recibir instrucciones ocultas que reescriben su objetivo. La técnica, conocida como prompt injection, está catalogada como riesgo principal en marcos como OWASP Top 10 para LLM Applications y OWASP Agentic AI Threats. Para el CISO es relevante porque sortea controles tradicionales: el atacante no necesita credenciales ni explotar una vulnerabilidad de código; le basta con que el agente lea un documento envenenado.

La mitigación es estructural, no puntual: aislamiento de contextos, validación de salidas, principio de mínimo privilegio en herramientas, y un punto de control de tráfico (gateway) entre el agente y el resto del sistema.

### 2.3. Fuga de datos sensibles hacia LLMs externos

Cuando un empleado pega información del cliente, código fuente o un fragmento de modelo financiero en un asistente público, esa información sale del perímetro de la organización con todos los efectos legales y contractuales que ello implica. En sectores regulados (banca, salud, telco) puede activar obligaciones de notificación de brecha y responsabilidad ante el supervisor.

El control no es solo técnico (DLP, gateway de salida). Es organizativo: catálogo de modelos autorizados, contratos con cláusulas de no entrenamiento, formación específica, y proceso disciplinario claro para el incumplimiento.

### 2.4. Coste descontrolado de tokens

El modelo de precios por token convierte la eficiencia técnica en un problema financiero directo. Un prompt mal diseñado, un agente en bucle, un caching ausente o un routing ingenuo a modelos premium pueden multiplicar la factura mensual por un orden de magnitud sin que ningún sistema lo alerte. Los CFO empiezan a recibir facturas de IA que duplican las previstas; los CDO no tienen herramientas para defender el desvío.

El control de coste no es contabilidad: es arquitectura. Requiere medición por agente y equipo, routing automático a modelo adecuado, caching semántico y políticas de presupuesto técnicamente aplicadas, no solo declaradas.

### 2.5. Dependencia de proveedor y portabilidad

Adoptar un único proveedor de modelo o de plataforma de agentes acelera el arranque pero crea dependencia estructural: contratos, datos, prompts, evaluaciones, integraciones. La portabilidad no es retórica; es una cláusula de continuidad de negocio cada vez más exigida en sectores regulados (DORA en banca, NIS2 en infraestructura crítica).

La respuesta arquitectónica es separar el control (gateway, identidad, registro de agentes, observabilidad) del proveedor de modelo. El control debe ser portable; el modelo, sustituible.

### 2.6. Riesgo agéntico específico: agentes con permisos excesivos

Cuando un agente hereda los permisos de la cuenta de servicio que lo despliega, suele recibir mucho más acceso del que necesita para su caso de uso. Una compromisión de ese agente (vía prompt injection, vía cadena de suministro de un MCP malicioso, vía error de configuración) escala más allá de lo que un atacante humano conseguiría en el mismo tiempo. El control adecuado es identidad de agente con permisos derivados del caso de uso, no del entorno.

Este riesgo es el menos reconocido por los comités de dirección y el más caro de retrofit. Cuanto antes se establezca la disciplina de identidad de agente, más barato resulta llegar a escala.

## Capítulo 3. Marco regulatorio aplicable (visión ejecutiva)

Esta sección presenta el panorama normativo aplicable a una organización española grande. La profundidad de cumplimiento (mapeo artículo a artículo) queda fuera de la v1 del documento; el anexo correspondiente recoge la tabla resumen de obligaciones críticas por sector.

### 3.1. Reglamento Europeo de Inteligencia Artificial (EU AI Act)

Primer marco horizontal europeo específico para IA. Clasifica los sistemas por nivel de riesgo (inaceptable, alto, limitado, mínimo) e impone obligaciones graduadas. Para las grandes cuentas, los puntos relevantes a corto plazo son:

- Identificación y clasificación de sistemas de IA en uso.
- Obligaciones reforzadas para sistemas de alto riesgo (gestión de riesgos, datos, documentación técnica, registro, transparencia, supervisión humana, robustez).
- Obligaciones específicas para modelos de propósito general y modelos con riesgo sistémico.
- Régimen sancionador con multas comparables al RGPD.

La entrada en aplicación es escalonada. El plan debe incorporar un inventario clasificado por riesgo y un proceso de gestión continua de esa clasificación.

### 3.2. NIS2

Directiva europea de ciberseguridad para entidades esenciales e importantes (transpuesta a derecho nacional). No regula IA específicamente, pero amplía obligaciones de gestión de riesgo, notificación de incidentes y responsabilidad de la dirección, que aplican directamente a los sistemas de IA en producción.

Implicaciones para el Plan Director: la gestión de incidentes de IA debe encajar en el procedimiento general NIS2 (plazos de notificación, autoridades competentes, responsabilidad personal de los administradores).

### 3.3. DORA (banca, seguros, infraestructura financiera)

Reglamento europeo de resiliencia operativa digital para el sector financiero. Establece requisitos sobre gestión de riesgo TIC, gestión de proveedores críticos (incluidos proveedores de IA), pruebas de resiliencia y notificación de incidentes graves. En banca española es la referencia más exigente a corto plazo.

Implicaciones específicas: los proveedores de LLM y plataformas de agentes pueden ser clasificados como proveedores TIC críticos, con las obligaciones contractuales y de supervisión que ello conlleva. El plan debe contemplar diligencia debida, cláusulas de salida y portabilidad arquitectónica.

### 3.4. RGPD y criterios de la AEPD

El tratamiento de datos personales por sistemas de IA queda plenamente bajo RGPD. La AEPD ha publicado guías específicas sobre el uso de IA y modelos de lenguaje, con énfasis en base jurídica, minimización, decisiones automatizadas (art. 22), y evaluación de impacto.

Punto crítico operativo: las trazas de prompts y respuestas pueden contener datos personales. Su conservación, acceso y borrado deben estar definidos desde el diseño, no como retrofit.

### 3.5. Otras normas y guías relevantes

- ISO/IEC 42001: sistema de gestión de IA, primer estándar certificable. Útil como ancla de gobierno.
- NIST AI Risk Management Framework (perfil GenAI): de referencia internacional, no obligatorio, útil para alinear vocabulario con HQ multinacionales.
- Guías sectoriales: EBA y BCE para banca, CNMC y ENISA para telco e infraestructura crítica.
- OWASP Top 10 for LLM Applications y OWASP Agentic AI Threats: no son normas, son referencia técnica obligada para el equipo de seguridad.

La estrategia recomendada es alinear el plan con EU AI Act, RGPD y la norma sectorial dominante (DORA en banca, NIS2 en telco) como ejes obligatorios, y usar ISO/IEC 42001 y NIST AI RMF como marcos de organización interna.

## Capítulo 4. Por qué un Plan Director clásico no basta

### 4.1. Lo que un Plan Director de Seguridad asume y la IA rompe

Un Plan Director de Seguridad, en su forma clásica (INCIBE y derivados), asume que la organización ya tiene activos que proteger: aplicaciones, redes, datos, identidades. El problema no es generar la necesidad de seguridad, sino estructurarla, priorizarla y ejecutarla.

En IA agéntica y generativa esa premisa no se cumple. La mayoría de organizaciones no tiene aún una adopción a escala que gobernar. Tiene shadow AI, pilotos aislados y ambición declarada. Un Plan Director que arranque por gobernanza y seguridad sin generar antes adopción real frena algo que todavía no existe y, en la práctica, acaba archivado.

### 4.2. La necesidad de una mitad de Adopción

De ahí la estructura dual del marco: una primera mitad de Adopción (niveles 0 a 2 del modelo de madurez) que ayuda a la organización a descubrir casos de uso valiosos, ejecutar pilotos con métricas de éxito y construir un Centro de Excelencia; y una segunda mitad de Plan Director (niveles 2 a 4) que gobierna, asegura y optimiza la IA cuando ya hay volumen real.

Las dos mitades no son secuenciales puras. Desde el primer día se cosen unos mínimos de gobierno (inventario, identidad de agentes, gateway de observación) que no estorban la adopción y que evitan retrofit caro más adelante. La adopción lidera al principio; el gobierno gana peso conforme escala.

### 4.3. La unión: un Marco de Adopción y Gobierno de IA

El paraguas del entregable es deliberado: **Marco de Adopción y Gobierno de IA**. No es solo un plan director; es la unión coherente de las dos mitades sobre una misma espina dorsal (el modelo de madurez de 5 niveles) y una misma hoja de ruta (olas de 90, 180 y 360 días). El cliente lee un único documento, sigue un único modelo y mide un único progreso.

Esta es la diferencia con la oferta dominante de las grandes consultoras: en lugar de entregar un PDF de roadmap y vender después horas de implementación, el marco se diseña para que el cliente pueda autoevaluarse, ejecutar paso a paso y verificar progreso con KPIs objetivos. El acompañamiento de Solo aporta expertise y los componentes que materializan los controles, pero la propiedad del plan, su ejecución y su medición están en manos del cliente desde el día uno.

Las cinco partes restantes del documento desarrollan, en este orden, esa promesa: la mitad de Adopción (Parte II), la mitad de Plan Director (Parte III), el modelo de madurez y la metodología de evaluación (Parte IV), la hoja de ruta (Parte V) y el encaje con la plataforma Solo como conjunto de controles (Parte VI).
