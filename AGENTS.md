# Plan Director de IA Agéntica — Tracking del proyecto

> Documento vivo. Estado actualizado a medida que avanza el proyecto.

> ⚠️ **RECORDATORIO PERMANENTE — DEEP-RESEARCH PENDIENTE** ⚠️
>
> El deep-research (T1) **NO se ha volcado todavía** en §3. Toda afirmación factual del entregable (estadísticas, multas, casos, cifras de adopción, ejemplos de incidentes reales, mapeos normativos detallados) está hoy redactada en forma cualitativa y **debe ser revisada y respaldada** con fuentes verificadas cuando T1 esté disponible.
>
> **Regla operativa:** antes de cerrar cualquier capítulo o pieza, revisar este punto. Antes de entregar al cliente, sustituir las afirmaciones cualitativas por datos con fuente. Marcar capítulos como "borrador sin deep-research" hasta que se hayan reforzado.
>
> Afecta a: Pieza 1 (resumen ejecutivo), Pieza 2 (todas las partes), Pieza 4 (anexos sectoriales y bibliografía), scorecard (umbrales y benchmarks).
>
> Estado por archivo redactado:
> - `pieza-2-plan-director/parte-1-contexto-y-necesidad.md`: borrador sin deep-research. Pendiente reforzar con datos en capítulos 1, 2 y 3.
> - `pieza-0-alfabetizacion/`: esqueleto creado (README, plantillas de persona y ficha de caso, esqueleto del lab piloto). Contenido por redactar; sin afirmaciones factuales todavía.
> - `pieza-0-alfabetizacion/manual-por-persona/`: **13 fichas completas** (manager, analista, desarrollador, operador, finanzas, legal, RRHH, ventas, marketing, soporte, IT/seguridad, ejecutivo, frontline) + plantilla. Todas con warning de gobernanza inicial citando EU AI Act + GDPR + NIS2 + DORA + AEPD (más MAR/CNMV/SOX/MiCA/LSSI/ePrivacy donde aplica). Borrador sin deep-research: prompts, herramientas y MCPs bien fundados; afirmaciones factuales puntuales (ej. sanciones a despachos por jurisprudencia inventada) pendientes de respaldo T1.
> - `pieza-0-alfabetizacion/catalogo-casos-de-uso/`: plantilla + **README con índice de 20-25 fichas planificadas** + **4 fichas semilla** redactadas (P&L variance, triage tickets soporte, asistente puesto banca, revisión contratos). Resto pendiente — ver §6 Handoff.
> - `pieza-0-alfabetizacion/00-capitulo-puente-fundamentos.md`: borrador sin deep-research. Capítulo conceptual (8 secciones: encuadre, LLMs, generativa más allá del chat, del chat al agente, vocabulario mínimo, coste, riesgos, mapa del kit + checklist de comprensión). Sin cifras ni casos reales.
> - `pieza-0-alfabetizacion/inventario-features-referencia.md`: inventario de features de apps de referencia. Observaciones directas (no factual). El traslado a contenido con cifras/normativa sí requiere T1.
> - `pieza-0-alfabetizacion/guia-estandares/`: redactada (README + 5 capítulos). Conceptual/procedimental, bajo riesgo factual; sin estadísticas inventadas.
> - `website/`: sitio Docusaurus funcional (build limpio). Presentación, no contenido nuevo; sirve las piezas existentes. Pendiente: ajustar `url`/`baseUrl`/`organizationName`/`projectName` al repo real antes de desplegar; añadir piezas 1/3/4; reproductor de escenarios (D14); PDF de marca; refinamiento `solo-design`.

## 1. Objetivo

Crear un **Plan Director de IA** (Agentic AI + IA Generativa): marco estratégico análogo a un Plan Director de Seguridad (estilo INCIBE), aprovechando el boom actual de IA agéntica y generativa.

**Contexto y autores:** lo crean un SE y un AE de Solo.io. No es un documento puramente interno: es un **activo estratégico de campo / habilitación de ventas** para usar con clientes.

**Tres pilares (foco):**

1. **Gobernanza** de la adopción de IA agéntica/generativa.
2. **Seguridad** de agentes, LLMs, uso de herramientas/MCP, identidad y permisos.
3. **Reducción de costes** (consumo de tokens, eficiencia, optimización de tráfico de IA).

**Vínculo con productos Solo:** el plan debe cubrir lo que afecta directa e indirectamente a los productos de Solo.io (agentgateway, kagent, agentregistry, kgateway, Istio ambient) y posicionarlos como controles dentro del marco.

Antes de redactarlo, investigar si ya existe un marco equivalente y qué hueco justifica este plan.

## 1b. Estilo de interacción

- **Preguntas:** respuestas directas, al grano, sin extenderse. Nada de relleno ni recapitulación.
- **Redacción de documentos del plan director:** distinto registro — desarrollo completo, estructurado y extenso según el capítulo lo requiera.

## 2. Decisiones tomadas

- Idioma de entregables: **español**. V1 solo español; inglés se valora más adelante.
- Profundidad de investigación inicial: **profunda y verificada** (harness deep-research, fuentes citadas).
- Tracking en este `AGENTS.md`, cargado vía `CLAUDE.md` (`@AGENTS.md`).

### 2b. Decisiones de producto (sesión 2026-06-28)

| # | Eje | Decisión |
|---|-----|----------|
| D1 | Modelo comercial | Activo **gratuito** de pipeline. Documento autosuficiente, con camino natural a la plataforma Solo. |
| D2 | Audiencia prioritaria | **CISO + CDO** como compradores tipo. CIO/CTO como audiencia técnica secundaria. COO fuera de v1. |
| D3 | Sectorización | **Núcleo común agnóstico + apéndices sectoriales**. Anexo A banca (DORA, MiCA, EBA, AEPD). Anexo B telco (NIS2, CNMC). |
| D4 | Profundidad regulatoria | **Mixta**: cuerpo a nivel ejecutivo con referencias; tabla resumen de obligaciones críticas en anexo. Sin mapeo artículo a artículo en v1. |
| D5 | Auditabilidad / evaluación | **Autoevaluación acompañada por Solo, gratuita**. La metodología de evaluación va incluida en el plan. Asesoría extendida caso a caso, no como producto en v1. |
| D6 | Idioma | **V1 solo en español**. Traducción a inglés diferida hasta validar con clientes piloto. |
| D7 | Alfabetización en IA agéntica | Se añade **Pieza 0 — Alfabetización en IA agéntica** al kit modular. Capa previa al Readiness Assessment del nivel 0. También se incorpora como **dimensión transversal "Talento e instrumentación"** del modelo de madurez. |
| D8 | Estructura del catálogo de casos de uso | **Tres capas**: (a) catálogo escrito amplio (anexo); (b) 5-7 **labs base** ejecutables por patrón técnico (no por caso); (c) **variantes sectoriales** ligeras del lab base en v1.x cuando el sector pese comercialmente. |
| D9 | Sectores cubiertos por el catálogo en v1 | **Banca + telco + un sector horizontal de servicios profesionales**. Construcción y aerolínea quedan para v1.x. |
| D10 | Volumen del catálogo escrito v1 | **20-25 fichas** de casos de uso, centradas en roles transversales bien cubiertos. Crecer a 40-60 en v1.x con casos sectoriales específicos. |
| D11 | Labs base de la Pieza 0 (v1) | Cinco a siete **walkthroughs didácticos** por patrón técnico (no por rol): agente analítico sobre datos, agente de triage de eventos, agente sobre código (AGENTS.md/MCP), agente operacional read-only, asistente al empleado frontline, agente regulatorio/legal sobre documentos; opcional generación creativa con control. **No son labs ejecutables con devcontainer, app o solución técnica.** Son explicaciones guiadas con prompts, salidas típicas, comparativas y aprendizajes por rol. Los labs ejecutables reales (con agentgateway, kagent, agentregistry, devcontainer, app y manifiestos) viven fuera de la Pieza 0 y se construyen cuando se introducen los productos Solo. |
| D12 | Límite de la alfabetización | **Mixta con foco agéntico**: núcleo agéntico/Solo-relevante (AGENTS.md, MCP, contexto, sesiones, control de agentes) + **capítulo puente** introductorio (10-15 pp) sobre fundamentos de IA generativa para no-técnicos. No competimos con Microsoft Learn / DeepLearning.ai / Anthropic Academy: el puente es rampa para entender los labs, no curso sustitutivo. |
| D13 | Construcción y hosting del website de labs | **Construcción interna (SE + AE)** con generador estático open source. Recomendación: **Docusaurus desplegado en GitHub Pages** (alternativas válidas: Hugo, Astro Starlight). Coste cero, despliegue automático desde el repo. Labs reproducibles vía **devcontainer** (con opción de GitHub Codespaces para cero fricción). Cluster local con kind/k3d. Sin clusters compartidos financiados por Solo en v1. |
| D14 | Formato de los labs (revisa D11) | Los labs de la Pieza 0 **incorporan un componente "reproductor de escenarios"** (React, patrón U1/U2 del SPA de referencia `zero-trust-agents`) embebible en Docusaurus: pasos navegables, diagrama de topología animado, estados de gating (`active/gate/pass/block/trace`). Sigue sin haber app/manifiestos ejecutables en la Pieza 0; el reproductor es didáctico. Tokens y stack alineados a identidad Solo vía skill `solo-design`, sin copiar la paleta ajena. |
| D15 | Alcance del website (amplía D13) | **Todo el kit** (las 6 piezas), no solo los labs, se publica como **un único sitio Docusaurus** en **GitHub Pages público** (coherente con D1). Las piezas ejecutivas (1 y 2) además se exportan como **PDF de marca** (skill `solo-whitepaper`). El sitio vive en `website/`; el contenido markdown permanece en las carpetas `pieza-*` y Docusaurus lo sirve vía instancias de `plugin-content-docs` (sin duplicar ni mover). Documentos internos de tracking (`AGENTS.md`, `inventario-features-referencia.md`) quedan **excluidos** del sitio público. |

## 3. Hallazgos de investigación

> ⚠️ **SECCIÓN VACÍA — DEEP-RESEARCH AÚN NO VOLCADO.** Esta sección es la fuente de verdad para todo dato factual del entregable. Mientras esté vacía, los capítulos redactados son borradores cualitativos sin respaldo verificado.
>
> Marcos candidatos a revisar:
> NIST AI RMF (+ perfil GenAI), OWASP Top 10 LLM / OWASP Agentic AI Threats & Mitigations,
> MITRE ATLAS, Google SAIF, Microsoft AI security, CSA MAESTRO, ISO/IEC 42001, EU AI Act,
> Plan Director de Seguridad de INCIBE (plantilla estructural).

_(vacío — se rellena en Fase 1)_

## 3b. Enfoque estratégico y modelo de oferta

### Tesis central: el plan director "cojo" sin generar la necesidad

A diferencia de un Plan Director de Seguridad (donde la necesidad se da por supuesta), en IA la mayoría de organizaciones **aún no ha interiorizado el valor ni usa IA a escala**. Si el documento arranca por gobernanza/seguridad, frena algo que todavía no existe y acaba en un cajón. Hay que **generar primero la necesidad** demostrando beneficio (eficiencia) y, cuando hay adopción real, gobernarla y asegurarla.

Por tanto la oferta NO es solo el plan director: necesita una primera mitad de **adopción / generación de valor**. El término estándar para esa pieza es **Marco de Adopción de IA** (AI Adoption Framework).

### Matiz: la seguridad no va "al final del todo"

No son fases estancas sino **pistas paralelas con énfasis cambiante**. Si se deja escalar la adopción sin control mínimo, se genera *shadow AI* (agentes, MCPs, credenciales y datos sin gestionar) cuyo retrofit es caro o imposible. Desde el minuto uno hay que coser unos mínimos de gobernanza que NO estorben la adopción (inventario, identidad, un punto de control de tráfico). La adopción lidera al principio; la seguridad gana peso conforme escala.

### Estructura de la oferta: dos capas sobre un modelo de madurez

- **Mitad A — Adopción** (genera la necesidad / pipeline): readiness assessment, descubrimiento de casos de uso, pilotos que demuestran eficiencia, ROI.
- **Mitad B — Gobierno** (el Plan Director): identidad/permisos de agentes, seguridad, control de herramientas/MCP, observabilidad, cumplimiento, reducción de costes.

Modelo de madurez (5 niveles) que une ambas mitades:

| Nivel | Estado del cliente | Qué se ofrece | Mitad |
|-------|--------------------|---------------|-------|
| 0 — Ad hoc | Uso individual disperso, *shadow AI* | Readiness assessment, descubrimiento de casos de uso | Adopción |
| 1 — Piloto | POCs sueltos | Demostrar eficiencia, medir ROI | Adopción |
| 2 — Escalado | Varios equipos, empieza el caos | Inventario de agentes/MCP, primeros controles | Bisagra |
| 3 — Gobernado | Uso transversal | Plan Director: identidad, permisos, seguridad, observabilidad | Gobierno |
| 4 — Optimizado | IA como infra crítica | Reducción de costes, cumplimiento, mejora continua | Gobierno |

Narrativa de venta: "te llevamos del nivel 0 al 4; la adopción te da el valor, el plan director evita que ese valor se convierta en riesgo y coste."

### Qué hacen las empresas (referencias a imitar)

El patrón dominante reutiliza el **Cloud Adoption Framework (CAF)** para IA:

- **Microsoft AI Adoption Framework** — fases *Strategy → Plan → Ready → Adopt → Govern → Secure*. La referencia más cercana: empieza por estrategia/valor, termina en gobierno/seguridad. Playbooks de adopción de Copilot.
- **Google Cloud** — "Gen AI value framework" + AI readiness checklist; prioriza casos de uso por valor/viabilidad.
- **AWS** — perspectiva de IA/ML dentro del CAF; guías de adopción de Gen AI.
- **Consultoras (McKinsey, BCG, Deloitte, Big Four)** — "AI transformation": cartera de casos de uso priorizada en matriz **impacto vs. viabilidad**, *value-at-stake*, montaje de un **Center of Excellence (CoE)**, roadmap. Generan la necesidad con un *value discovery workshop*.

**Motion comercial** = clásico SaaS **"land and expand"**:

1. *Land* — taller de descubrimiento → POC que demuestra eficiencia → medir ROI.
2. *Expand* — replicar en toda la empresa → choca con el muro de gobernanza, seguridad y coste.
3. *Monetize* — entra la plataforma de control (plan director + producto).

Clave: **nadie compra gobernanza antes de tener el problema**; la mitad de adopción es el generador de pipeline.

### Encaje con Solo.io

La bisagra (nivel 2→3) es el terreno de Solo: cuando la adopción escala y aparecen decenas de agentes, MCPs y LLMs sin control ni visibilidad de coste. El Marco de Adopción **crea** ese momento de dolor; el Plan Director lo **resuelve** posicionando agentgateway / kagent / agentregistry como los controles.

### Terminología decidida para el documento

- Paraguas: **Marco de Adopción y Gobierno de IA**.
- Mitad 1: *Adopción* (generar valor). Mitad 2: *Plan Director de IA* (gobierno/seguridad/coste).
- Ejes transversales: modelo de madurez (5 niveles), CoE, matriz impacto/viabilidad.

## 3c. Índice propuesto del entregable (borrador T3)

Kit modular, no documento único. **Seis piezas** coherentes (incluida Pieza 0 de alfabetización; ver D7-D11):

### Pieza 0 — Alfabetización en IA agéntica

Capa previa que enseña a usar la IA antes de gobernarla. Audiencia: practitioners de cualquier rol (manager, analista, desarrollador, operador, seguridad, finanzas, legal, etc.).

Contenido:

- **Manual breve por persona** (1-2 páginas por rol): hábitos clave, gestión de contexto, gestión de sesiones, uso de estándares (`AGENTS.md`, MCP), IA como crítico iterativo.
- **Guía de estándares operativos**: cómo escribir un `AGENTS.md` útil, cómo dar contexto a un agente, cuándo abrir nueva sesión, cómo iterar.
- **Catálogo escrito de casos de uso** (20-25 fichas en v1, ver D10): rol, sector(es), problema, patrón técnico aplicable, datos, riesgos, indicadores de éxito, componentes Solo si llega a producción.
- **Labs ejecutables** (5-7 patrones, ver D11): website propio con entornos reproducibles. Cada lab cierra introduciendo el componente Solo correspondiente.

### Pieza 1 — Resumen ejecutivo (20-30 pp)

Dirigido a comité de dirección y al tándem CISO + CDO.

1. Tesis: por qué un Marco de Adopción + Plan Director ahora.
2. Estado del arte: qué hacen Microsoft, Google, AWS y las Big Four (sin atacar, posicionando el hueco).
3. Modelo de madurez de 5 niveles, una página por nivel.
4. ROI esperado y *value at stake* por nivel.
5. Hoja de ruta de 12-24 meses en olas de 90 días.
6. Llamada a la acción.

### Pieza 2 — Plan Director (documento gerencial, ~80 pp)

Núcleo del entregable. Estructura propuesta:

- **Parte I — Contexto y necesidad**
  1. Estado de la adopción de IA agéntica y generativa.
  2. Riesgos emergentes: *shadow AI*, prompt injection, fuga de datos, coste descontrolado, dependencia de proveedor.
  3. Marco regulatorio aplicable (EU AI Act, NIS2, DORA, AEPD, GDPR) — visión ejecutiva.
  4. Por qué un Plan Director clásico no basta: la necesidad de la mitad de Adopción.

- **Parte II — Marco de Adopción (niveles 0-2)**
  5. Readiness assessment: dimensiones (estrategia, datos, talento, plataforma, gobierno mínimo).
  6. Descubrimiento de casos de uso: matriz impacto vs. viabilidad.
  7. Pilotos: criterios de selección, métricas de éxito, evitar el "POC eterno".
  8. Centro de Excelencia (CoE): misión, composición, RACI.
  9. Medición de valor: ROI, productividad, *value at stake*.

- **Parte III — Plan Director (niveles 2-4)**
  10. Identidad y permisos de agentes: agentes como ciudadanos de primera clase, no como servicios anónimos.
  11. Seguridad de LLMs y agentes: OWASP LLM Top 10, OWASP Agentic Threats, MITRE ATLAS, prompt injection, jailbreak, exfiltración.
  12. Control de herramientas y MCP: inventario, *allowlist*, validación de proveedores, *least privilege*.
  13. Observabilidad y auditoría: trazas, *prompt logging*, evidencia para auditor y regulador.
  14. Gestión de coste: medición por agente/equipo, optimización de tokens, *routing* a modelo adecuado, *caching* semántico.
  15. Cumplimiento operativo: gestión de cambios, incidentes, riesgos, terceros.

- **Parte IV — Modelo de madurez y metodología de evaluación**
  16. Los 5 niveles en detalle: criterios objetivos por dimensión.
  17. Dimensiones evaluadas: estrategia, casos de uso, datos, talento, plataforma, identidad, seguridad, coste, cumplimiento.
  18. Cómo ejecutar la autoevaluación (paso a paso, con o sin acompañamiento de Solo).
  19. KPIs de salida por nivel y *gates* para subir de nivel.

- **Parte V — Hoja de ruta**
  20. Olas de 90 / 180 / 360 días con entregables y KPIs de cierre.
  21. Dependencias críticas y riesgos de ejecución.
  22. Modelo de gobierno del programa (comité, cadencia, escalado).

- **Parte VI — Encaje con la plataforma Solo (controles)**
  23. Mapeo de controles del plan a componentes Solo (agentgateway, kagent, agentregistry, kgateway, Istio ambient).
  24. Patrones de despliegue por nivel de madurez.

### Pieza 3 — Scorecard de autoevaluación

Cuestionario de 60-80 ítems agrupados por dimensión. Salida: heatmap por dimensión + nivel global. Formato Excel o web ligera. Es lo que se entrega en la primera reunión con el cliente.

### Pieza 4 — Anexos operativos

- Anexo A — Sectorial banca: DORA, MiCA, EBA/BCE, AEPD; tabla resumen de obligaciones críticas.
- Anexo B — Sectorial telco: NIS2, CNMC; tabla resumen.
- Anexo C — Plantillas de política: uso aceptable de IA, identidad de agentes, *allowlist* de MCP, gestión de claves y LLMs.
- Anexo D — Plantillas de proceso: alta de agente, revisión de modelo, respuesta a incidente de IA.
- Anexo E — Catálogo de casos de uso por sector (banca, telco, seguros).
- Anexo F — Glosario.
- Anexo G — Bibliografía y fuentes.

### Pieza 5 — Dashboard de madurez (futuro, no v1)

Tablero conectado a la plataforma Solo que muestra nivel actual y evolución mes a mes. Diferenciador estructural frente a Big Four. Se documenta como visión en v1; se implementa en v1.x cuando haya cliente piloto.

## 4. Plan de tareas

| ID | Tarea | Estado |
|----|-------|--------|
| T0 | Scaffolding de tracking (AGENTS.md + CLAUDE.md) | ✅ Hecho |
| T1 | Investigación profunda: marcos existentes y análisis de huecos | 🔄 En curso — **bloqueante para validación de todo entregable** |
| T2 | Síntesis de hallazgos en este documento | ⬜ Pendiente |
| T3 | Diseño del índice / estructura del Plan Director | 🔄 En curso (borrador en §3c, pendiente de revisión) |
| T4 | Redacción iterativa por capítulos | 🔄 En curso (Pieza 2, Parte I redactada) |
| T5 | Revisión final y entregable | ⬜ Pendiente |

Leyenda: ✅ hecho · 🔄 en curso · ⬜ pendiente · ⏸️ bloqueado

## 5. Bitácora

- 2026-06-28 Creado el scaffolding e iniciada la Fase 1 (deep-research lanzado en background; pendiente de volcar resultados en §3).
- 2026-06-28 Definido el enfoque estratégico (§3b): oferta en dos capas (Marco de Adopción + Plan Director), modelo de madurez de 5 niveles, análisis de lo que hacen las empresas (CAF, land-and-expand) y encaje con Solo.
- 2026-06-28 Cerradas seis decisiones de producto (§2b): modelo gratuito de pipeline, audiencia CISO+CDO, núcleo común con apéndices sectoriales, profundidad regulatoria mixta, autoevaluación acompañada gratuita, v1 solo en español. Borrador inicial del índice del entregable redactado en §3c (kit modular de 5 piezas).
- 2026-06-28 Redactada la Parte I de la Pieza 2 (`pieza-2-plan-director/parte-1-contexto-y-necesidad.md`): cuatro capítulos (estado de la adopción, riesgos emergentes, marco regulatorio ejecutivo, por qué un plan director clásico no basta).
- 2026-06-28 Añadida **Pieza 0 — Alfabetización en IA agéntica** al kit (D7) y nueva dimensión transversal "Talento e instrumentación" en el modelo de madurez. Estructura del catálogo de casos de uso en **tres capas** (D8): catálogo escrito amplio + 5-7 labs base por patrón técnico (D11) + variantes sectoriales en v1.x. Sectores v1 = banca + telco + servicios profesionales horizontales (D9). Volumen catálogo v1 = 20-25 fichas (D10).
- 2026-06-28 Cerradas D12 (alfabetización mixta con foco agéntico + capítulo puente para no-técnicos) y D13 (website de labs construido internamente con Docusaurus + GitHub Pages, labs reproducibles vía devcontainer/Codespaces). Cerrada la ronda completa de decisiones de la Pieza 0.
- 2026-06-28 Creado esqueleto de la Pieza 0 (`pieza-0-alfabetizacion/`): README maestro con estructura completa, plantilla común del manual por persona, plantilla común de ficha de caso de uso, esqueleto del lab piloto (Lab 3 — código y AGENTS.md, sin Solo todavía).
- 2026-06-28 Redactada ficha de persona del desarrollador y guiones paso 1 y paso 2 del Lab 3 (más `AGENTS.md.template`). **Revisada D11**: los "labs" de la Pieza 0 son **walkthroughs didácticos**, no labs ejecutables. Sin devcontainer, sin app, sin manifiestos. Los labs ejecutables con productos Solo viven fuera de la Pieza 0. Próximos pasos: guiones paso 3-5 del Lab 3, resto de fichas de persona, guías de estándares operativos, fichas del catálogo de casos de uso.
- 2026-06-29 Analizada la app de referencia `zero-trust-agents.vercel.app` (Vite+React+Tailwind+Motion; demo TM Forum telco de gobierno zero-trust de agentes) y proyectos agénticos de Vercel (`open-agents`, `deepsec`, `agent-browser`). Creado `pieza-0-alfabetizacion/inventario-features-referencia.md`: catálogo de features (contenido C1-C8, presentación U1-U5, capacidades agénticas V1-V12) con mapeo a los 7 labs y a la base de conocimiento. La app no es repo público de `solo-io` ni de `tjorourke`; origen probablemente repo privado en Vercel (pendiente confirmar).
- 2026-06-29 Añadida **D14** (revisa D11): los labs incorporan un componente "reproductor de escenarios" React embebible en Docusaurus (patrón U1/U2). Redactada la **guía de estándares operativos** completa (`guia-estandares/`: README + 5 capítulos: AGENTS.md, gestión de contexto, gestión de sesiones, iteración crítica, MCP y herramientas), grounded en las features del inventario. Próximos pasos: construir los labs sobre esta base (empezando por el walkthrough adversarial y el reproductor de escenarios), resto de fichas de persona, fichas del catálogo.
- 2026-06-29 Añadida **D15** (amplía D13): todo el kit se publica como **un único sitio Docusaurus** en GitHub Pages, con PDF de marca para piezas ejecutivas. Montado el website en `website/` (Docusaurus 3.8): sirve `pieza-0` (`/alfabetizacion`) y `pieza-2` (`/plan-director`) sin mover ni duplicar contenido, vía instancias de `plugin-content-docs`; landing con modelo de madurez; tema oscuro púrpura provisional; workflow de despliegue en `.github/workflows/deploy.yml`. Documentos internos excluidos del sitio. **Build verificado limpio** (0 broken links, 0 errores) y render confirmado. `markdown.format='detect'` (.md=CommonMark, .mdx para componentes). Probada exposición a internet vía localtunnel (ngrok sin authtoken). **Estado al cerrar sesión:** procesos de serve/túnel detenidos; nada corriendo.
- 2026-06-29 Configurado supervisor `website/dev-tunnel.sh`: levanta `docusaurus start` (hot reload) y túnel ngrok con respawn automático. Ngrok autenticado con authtoken. `baseUrl` ajustado a `/` para servir por túnel/dev (revertir antes de desplegar a GitHub Pages). Redactado el **capítulo puente** de la Pieza 0 (`00-capitulo-puente-fundamentos.md`): borrador conceptual sin deep-research, 8 secciones (encuadre, LLMs, generativa multi-modal, del chat al agente, vocabulario mínimo: prompt/contexto/system prompt/sesión/tools/MCP/identidad/RAG/fine-tuning, coste, riesgos: alucinación/filtración/prompt injection/sesgo y dependencia, mapa del kit, checklist de comprensión). Sin cifras ni casos reales (T1 pendiente).
- 2026-06-29 Iteración visual del capítulo puente: imagen `evolucion-ia.png` integrada en sección 0; diagramas Mermaid sustituidos por **SVG en línea ilustrados** (paleta púrpura Solo, gradientes, iconos cerebro/engranaje/sobre, flechas con marcadores, acentos rojos para tramos maliciosos) para: LLM, tokenización, bucle del agente, anatomía de invocación, RAG, coste y prompt injection. Sección 3 reescrita: el LLM **decide**, el agente (harness) **ejecuta**. Saneados solapes de labels (LLM movidos debajo de los círculos; labels "paso N" del diagrama de coste consolidadas fuera de la zona de flechas; label problemática del diagrama de prompt injection eliminada).
- 2026-06-30 Redactadas las **13 fichas del manual por persona** (`pieza-0-alfabetizacion/manual-por-persona/`): manager, analista, desarrollador, operador (SRE/DevOps), finanzas, legal, RRHH, ventas, marketing, soporte, IT/seguridad, ejecutivo, frontline. Patrón único: warning de gobernanza con riesgos específicos del rol + 8 casos típicos con "cómo se hace" (Copilot vs alternativa + herramientas concretas) + tabla MCPs + reglas adicionales del rol + 5 hábitos + qué evitar + cómo seguir (apuntando a labs base). Citado en cada warning el marco regulatorio aplicable (EU AI Act, GDPR, NIS2, DORA, AEPD + MAR/CNMV/SOX/MiCA/LSSI/ePrivacy donde aplica). Borrador sin deep-research; afirmaciones factuales puntuales pendientes de T1.
- 2026-06-30 Iniciado el **catálogo de casos de uso** (`pieza-0-alfabetizacion/catalogo-casos-de-uso/`): README con índice de 20-25 fichas planificadas (transversal + sectorial banca/telco/serv. profesionales) y mapping a labs base. Redactadas **4 fichas semilla** representativas de patrones distintos: análisis varianza P&L (analítico, finanzas), triage tickets de soporte (triage, transversal), asistente al puesto en oficina bancaria (frontline, banca), revisión de contratos (regulatorio/legal, transversal). Resto pendiente para próxima sesión (16-21 fichas).
- 2026-06-30 Definido el **patrón de 4 bloques** por caso (§6.1) e input cliente CISO sector público guardado (§6.2). Redactada `T-NEW-a-triage-phishing-usuario.md` como **patrón canónico ejecutado** con la estructura completa. Actualizadas las dos plantillas (`manual-por-persona/plantilla.md` y `catalogo-casos-de-uso/plantilla-ficha.md`) a 4 bloques. **Pendiente próximas sesiones**: aplicar el patrón a los 8-10 casos de cada una de las 13 fichas de rol y a las 19-20 fichas pendientes del catálogo. Empezar por `01-manager.md` caso 2.1 como validación de tono.
- 2026-06-30 Reescrito **`01-manager.md` caso 2.1 (Reporte semanal)** en sitio con la estructura completa de 4 bloques. Sirve como **patrón ejecutado de referencia para fichas de rol**, hermana de `T-NEW-a` (referencia para catálogo). Pendiente: casos 2.2-2.10 de `01-manager.md` + 8-10 casos × 12 fichas restantes + 19-20 fichas catálogo. ~100 reescrituras de caso pendientes; varias sesiones.
- 2026-06-30 (tarde) **7 fichas de rol completas** en formato 4 bloques: `01-manager.md` (10/10), `02-analista.md` (8/8), `03-desarrollador.md` (3/3 + hábitos), `04-operador.md` (8/8 read-only), `05-finanzas.md` (8/8 MNPI/SoD), `06-legal.md` (8/8 privilegio), `07-rrhh.md` (8/8 art.22 GDPR + EU AI Act alto riesgo). Pendiente: `08-ventas`, `09-marketing`, `10-soporte`, `11-it-seguridad`, `12-ejecutivo`, `13-frontline` (~48 casos). Patrón: MCPs con `vault://...` + scopes mínimos + snippet mcp.json, fórmula h/año marcada *(estimación, T1)*, riesgos *"Si trabajo desde X..."*. Sin corregir: heading "Seis casos típicos"→"Diez" en 01-manager.
- 2026-06-30 (noche) **Cerradas las 13 fichas de rol en formato 4 bloques**: `08-ventas.md` (8/8 AE/SDR/CSM, MCPs Salesforce/Gong, `Mail.ReadWrite` no `Send`, NDA + consentimiento grabaciones), `09-marketing.md` (8/8 audience research/contenido/A-B/visuales/SEO/social listening, disclosure EU AI Act art. 50, LSSI/ePrivacy, sin respuesta automática en social), `10-soporte.md` (8/8 triage tickets/KB/logs/respuestas/traducción/VoC/chatbot, disclosure chatbot art. 50, sin compromisos contractuales automáticos, sanitización de logs), `11-it-seguridad.md` (8/8 SOC/IR/threat hunting/phishing/runbooks/IaC/GRC/shadow AI, read-only por defecto sobre SIEM/EDR/IdP, prohibición Domain Admin/root, NIS2/DORA/ISO 27001), `12-ejecutivo.md` (8/8 board pack/síntesis/comunicación/competencia/briefings/decisiones/lectura crítica/agenda, MNPI/MAR/CNMV, "sois patrocinadores y firmantes"), `13-frontline.md` (8/8 app del puesto/traducción/notas/fotos/comunicación/formación/recomendación/emergencias; sin Local ni MCPs por rol, énfasis en "herramienta aprobada por empresa", móvil personal y WhatsApp prohibidos). **Manual por persona completo (13/13)**. Pendiente: heading "Seis"→"Diez" en 01-manager, catálogo de casos (19-20 fichas), refuerzo T1 a todos los warnings.
- 2026-07-01 **Catálogo de casos de uso completo: 24/24 fichas en formato 4 bloques**. Transversales `T01`-`T15` (varianza P&L, triage soporte, redlining contratos, asistente dev con AGENTS.md, diagnóstico incidente, triage SOC, voz del empleado, conciliación bancaria, apoyo regulatorio, brief comercial, resumen reuniones, campaña con guardarraíles, asistente políticas internas, KB de soporte, lectura crítica de planes); banca `B01`-`B03` (asistente puesto oficina, KYC/onboarding, lectura DORA/EBA/BdE); telco `TL01`-`TL03` (triage incidencias de red, atención cliente plan estandarizado, cumplimiento NIS2); serv. profesionales `SP01`-`SP03` (due diligence M&A, respuesta a RFP, gestión documental de proyecto). Cada ficha incluye: identificación, caso de uso, cómo resolverlo (Local + Copilot + Claude Code + tabla MCPs con `vault://...` y scopes mínimos + alternativas), KPIs en tabla con fórmula h/año marcada *(estimación, T1)*, riesgos `"Si trabajo desde X..."` con normativa concreta (MiFID II, MAR/CNMV/SOX, GDPR art. 9/22, EU AI Act Anexo III/art. 50, NIS2, DORA, Ley 10/2010 PBC/FT, MiCA, LSSI/ePrivacy, secreto profesional/chinese walls), componentes Solo (agentgateway/kagent/agentregistry/kgateway), lab asociado, referencias. README del catálogo actualizado a 24/24. Confirmado heading "Diez casos típicos" en `01-manager.md` (ya correcto). **Pendiente para próximas sesiones**: T1 deep-research para sustituir cifras y respaldar afirmaciones factuales; labs ejecutables; reproductor de escenarios (D14); ajustes `url`/`baseUrl` antes de desplegar website.
- 2026-07-01 **Reestructuración Pieza 0 (Fase 1) — casos de uso por rol con subcarpeta por caso**: nueva organización `pieza-0-alfabetizacion/{01-casos-de-uso, 02-fundamentos}`. Cada caso vive en `por-rol/<rol>/<caso>/README.md` con **5 bloques** (añadido bloque 5: **Arquitectura de remediación con gobernanza de IA**, placeholder de diagrama Solo). Borradas `catalogo/`, `plantilla-ficha.md` e `inputs-cliente/`. Los 25 casos del antiguo catálogo redistribuidos vía `scripts/redistribuir-catalogo.py` al rol correspondiente (sector queda como metadato dentro del caso). Los 13 archivos monolíticos por rol renombrados a `_todo-NN-rol.md` (Docusaurus los ignora); son la fuente para Fase 2. Estado por rol: manager 3, analista 0, desarrollador 1, operador 2, finanzas 2, legal 5, rrhh 2, ventas 2, marketing 1, soporte 3, it-seguridad 3, ejecutivo 0, frontline 1. Añadido `02-fundamentos/09-riesgos-y-coste.md` y arreglados todos los links relativos con extensión `.md`. **Build Docusaurus verificado limpio** (0 broken links). **Fase 2 pendiente**: extraer los ~110 casos que aún viven en los `_todo-*.md` a subcarpetas individuales con los 5 bloques y borrar los monolíticos.
- 2026-07-01 (tarde) **Fase 2 completa — 101 casos extraídos** de los 13 archivos monolíticos `_todo-*.md` a subcarpetas individuales vía `scripts/extraer-casos-monoliticos.py`. Total en `por-rol/`: **126 casos** (13/8/4/10/10/13/10/10/9/11/11/8/9 por rol). Cada caso con los 5 bloques y placeholder del bloque 5. Headings normalizados: `### N.M` → `#`, `#### N)` → `## N.`. `por-rol/README.md` actualizado con tabla completa. Build Docusaurus limpio. **Fase 3 pendiente**: deduplicar. Los slugs de Fase 1 (venían del catálogo, ej. `analisis-varianza-pl`) NO coinciden con los generados en Fase 2 desde el título completo del monolítico (ej. `analisis-de-varianza-real-vs-presupuesto`), lo que genera pares casi-duplicados en 10+ roles. Los `_todo-*.md` siguen en disco excluidos del sitio.
- 2026-07-01 (noche) **Fase 3 completa — deduplicación**. Detectados 12 pares casi-duplicados vía `scripts/detectar-duplicados.py` (Jaccard sobre keywords del título). Política aplicada: conservar F1 (catálogo curado), borrar F2 duplicada. Eliminados 7 casos F2 (`01-manager/resumen-de-reuniones`, `05-finanzas/analisis-de-varianza-real-vs-presupuesto`, `05-finanzas/cierre-mensual-consolidacion`, `06-legal/revision-y-redlining-de-contratos`, `06-legal/due-diligence-m-a-financiacion-vendor`, `08-ventas/respuesta-a-rfp-cuestionarios-de-seguridad`, `11-it-seguridad/triage-de-alertas-del-soc`). Conservados como casos independientes (matiz distinto pese a similitud): `06-legal/monitoring-regulatorio` (subset de `apoyo-regulatorio`), `05-finanzas/forecast-y-presupuesto` (forward-looking vs varianza backward). Total tras dedupe: **119 casos** (12/8/4/10/8/11/10/9/9/11/10/8/9). Build Docusaurus limpio. **Pendiente próximas sesiones**: completar bloque 5 (arquitectura de remediación) caso a caso con diagrama Solo real; T1 deep-research; borrar archivos `_todo-*.md` cuando se confirme que no se pierde contenido.
- 2026-07-03 **Fase A del reproductor en el sitio real** (Docusaurus). Componente React `website/src/components/ScenarioPlayer/` (motor data-driven: `casos.js` con los **5 casos piloto** bilingües ES/EN — legal/redlining, finanzas/varianza P&L, IT-seg/triage SOC, operador/incidente read-only, banca frontline; `styles.css` scopeado bajo `.spwrap`; `index.jsx` con hooks). Layout **Hero + apilado** (elegido): reproductor-resumen arriba con enlace "ir al detalle ↓" a cada bloque y "↑ reproductor" de vuelta; badge de identidad (ámbar→verde), badge de riesgo y prompt HITL en la banda del diagrama (sin solapes); iconos por tipo de nodo (glyphs genéricos; oficiales pendientes). Página demo `website/src/pages/reproductor.jsx` (`/reproductor`). **Logo Solo.io** en navbar (todas las páginas) + `static/img/solo-logo.svg`; `navbar.title='solo.io'`. **Build Docusaurus verificado limpio** (0 broken links; `/reproductor` SSR OK). Creado skill `.claude/skills/crear-caso-de-uso/` (SKILL.md + plantilla) y `TODO.md` (backlog: iconos oficiales, productos enterprise sin nombrarlos, chain de agentes, multi-LLM/routing, AgentEvals, migraciones, semantic router ExtProc, Judge LLM, guardrails externos con NeuralTrust vía Guardrail Webhook/ExtMCP, LLM Gateway para asistentes de código, harness en kagent Agent Substrate). KPIs siguen marcados *(estimación, T1)*. Pendiente: embeber el reproductor en las fichas reales de `por-rol/` (requiere .mdx o i18n), iconos oficiales de marca, bilingüe a nivel de Docusaurus.

## 6. Handoff — siguiente sesión

Estado al cerrar la sesión 2026-06-30:

- **Manual por persona**: completo (13 fichas + plantilla). Solo iteración pendiente si se quieren afinar tonos o añadir personas (ej. *researcher*, *product manager*, *data scientist*).
- **Catálogo de casos de uso**: 4/20-25 fichas redactadas. Índice y plantilla listos. Próximas a redactar por orden sugerido:
  1. Asistente al desarrollador con AGENTS.md (Lab 3 — código)
  2. Diagnóstico de incidente de operaciones (Lab 4 — operacional read-only)
  3. Triage de eventos de seguridad SOC (Lab 2 — triage de eventos)
  4. Análisis de encuesta de clima / voz del empleado (Lab 1 — analítico)
  5. Conciliación bancaria / cierre mensual (Lab 1 — analítico, finanzas)
  6. Apoyo regulatorio AEPD/EU AI Act (Lab 5 — regulatorio, transversal)
  7. Brief comercial pre-reunión (Lab 6 — frontline + analítico, ventas)
  8. Resumen de reuniones + extracción de acciones (Lab 6 — frontline, manager)
  9. Generación de borrador de campaña (Lab 7 — creativo con control, marketing)
  10. Sectoriales banca: scoring KYC asistido, lectura de DORA, atención red oficinas.
  11. Sectoriales telco: triage de incidencias de red, atención plan estandarizado, cumplimiento NIS2.
  12. Sectoriales serv. profesionales: due diligence, RFP, gestión documental.
- **Capítulo puente**: redactado, sin datos. Pendiente refuerzo con T1.
- **Pieza 2 Parte I**: redactada, sin datos. Pendiente refuerzo con T1.
- **Labs ejecutables**: Lab 3 con paso 1-2 escritos; pasos 3-5 pendientes.
- **Reproductor de escenarios (D14)**: no implementado todavía; requiere React/Motion en `website/src/components/`.
- **Website**: build limpio. Antes de desplegar: ajustar `url`/`baseUrl`/`organizationName`/`projectName` en `docusaurus.config.ts`.
- **Bloqueante global**: T1 deep-research. Sin él, no se cierran capítulos.

Reglas a respetar en la próxima sesión:

- Idioma: español.
- Estilo: directo, sin relleno. Listas para enumeraciones, prosa para explicaciones.
- Marcar borrador-sin-T1 cualquier afirmación factual nueva.
- No mover ni renombrar archivos sin actualizar `website/sidebars.ts`.

### 6.1 Pedido nuevo (2026-06-30, final de sesión) — reestructurar fichas por rol y catálogo

Para la siguiente sesión, **cada caso de uso de cada rol** (fichas de `manual-por-persona/` y fichas del `catalogo-casos-de-uso/`) debe presentarse en **cuatro bloques fijos**, en este orden:

1. **Caso de uso** — descripción del problema y de la situación cotidiana del rol. Qué se hace hoy, dónde duele, qué se persigue.

2. **Cómo resolverlo** — configuración técnica concreta, paso a paso, en cada entorno:
   - **Local** (modelo en máquina, *ollama*/LM Studio + cliente local).
   - **Copilot** (Microsoft 365 Copilot u homólogo SaaS): qué activar, qué *plugin*/*connector* usar.
   - **Claude Code** u otra herramienta de agente de escritorio: qué `AGENTS.md`, qué *settings*, qué herramientas exponer.
   - **MCPs**: qué MCP concreto, **cómo configurarlo** (servidor MCP recomendado, comando de arranque o URL si es remoto), **cómo conectarlo** con la herramienta del usuario (snippet de config), qué *scopes* mínimos pedir.
   - **Alternativas** (Claude/ChatGPT/Gemini web + adjuntos) cuando no haya integración nativa.

3. **KPIs y mejora de rendimiento** — cuantificar el impacto en la organización:
   - 3-5 KPIs medibles (tiempo por unidad de trabajo, tasa de error, *throughput*, coste, calidad).
   - Estimación de mejora **basada en conocimiento del dominio** (no "inventar" sino razonar a partir de cifras públicas conocidas del rol). Marcar como **estimación cualitativa pendiente de T1** cuando no haya fuente verificada.
   - Si procede, fórmula simple de cálculo (ej. *"horas/semana ahorradas × coste hora × FTEs elegibles"*).

4. **Vulnerabilidades y riesgos → gobernanza** — el aviso de cierre, **concreto y ejemplificado**:
   - Ejemplos del propio caso: *"si trabajo desde Copilot y conecto un MCP remoto no auditado, estoy enviando datos de la empresa a un endpoint sin vigilancia, sin garantía de cifrado en reposo, sin saber si tengo base jurídica para tratarlos, y sin que nadie compruebe si yo estoy autorizado a compartir esa información"*.
   - Riesgos típicos: MCP no auditado, agente sin identidad propia, *prompt injection* desde fuentes externas, *shadow AI*, coste descontrolado, fuga de PII, decisión automatizada sin gate humano.
   - Cierre: *"estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la Pieza 2 — Plan Director de IA. No lleves este caso a producción real sin esa capa."*

**Reglas adicionales para esta reestructuración:**

- Mantener idioma español, estilo directo, sin relleno.
- El warning global del inicio de cada ficha se conserva (advertencia general); el bloque 4 es **por caso**, más concreto y técnico.
- Cuando una herramienta o MCP citado sea hipotético o no esté generalmente disponible, marcarlo (ej. *"MCP X — propuesto, no GA al cierre de sesión"*).
- Marcar **cifras de KPI sin fuente** como "estimación" y dejarlas en cursiva o entre paréntesis para facilitar la sustitución cuando entre T1.
- Las 13 fichas de `manual-por-persona/` ya redactadas necesitan **reescritura caso por caso** para encajar en los 4 bloques. Las del catálogo (4 semillas + las pendientes) se escriben directamente con esa estructura.

**Plan sugerido para la próxima sesión:**

1. Actualizar `plantilla.md` de `manual-por-persona/` y `plantilla-ficha.md` de `catalogo-casos-de-uso/` con los 4 bloques.
2. Reescribir un caso piloto en una ficha de rol (sugerencia: `01-manager.md`, caso 2.1 Reporte semanal) como **patrón de referencia** y validar tono.
3. Replicar el patrón al resto de casos de la misma ficha, luego al resto de roles.
4. En paralelo, redactar las fichas pendientes del catálogo (`T04-T15` + sectoriales) directamente con los 4 bloques.

### 6.2 Inputs reales de cliente (para alimentar fichas)

Carpeta `pieza-0-alfabetizacion/catalogo-casos-de-uso/inputs-cliente/` con material en bruto de conversaciones con clientes. Cada input contiene cita literal + lectura + candidatos a ficha del catálogo + riesgos a desarrollar. Se reescribe en formato de 4 bloques (§6.1) durante la próxima sesión.

- `01-ciso-triage-incidencias.md` — CISO sector público (CCN-CERT: Lucía, Pandora, Remedy, División IV de Explotación). Triage de incidencias COCS + reportes de usuario (phishing, excepciones navegación/WAF). El equipo actúa como filtro humano e intermediario; el CISO declara que **el modelo no escala** con el aumento de incidencias por IA y reclama agentes. Genera candidatos `T06-bis`, `T-NEW-a`, `T-NEW-b`, `T-NEW-c` para el catálogo.
