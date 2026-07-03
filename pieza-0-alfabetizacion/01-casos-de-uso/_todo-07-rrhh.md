# Recursos Humanos — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: HR business partner, talent acquisition, compensación y beneficios, learning & development, relaciones laborales, people analytics.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, herramientas, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Para RRHH el riesgo es máximo: tratáis datos personales especialmente protegidos y tomáis decisiones que afectan a derechos fundamentales. Adoptar estos casos sin un marco de gobierno significa:

- Datos de candidatos y empleados fuera de las bases jurídicas del **GDPR** y la **LOPDGDD**, sin información, sin DPIA, sin minimización.
- Sistemas de **selección, evaluación, promoción o despido apoyados en IA** caen bajo **alto riesgo del EU AI Act**: documentación técnica, gobierno de datos, supervisión humana, registro y transparencia son obligatorios.
- Sesgo algorítmico que reproduce discriminación por género, edad, origen o discapacidad (Estatuto de los Trabajadores, Ley de Igualdad, directivas UE).
- Comité de empresa, conflictos laborales o expedientes disciplinarios en herramientas no aprobadas.
- Decisiones automatizadas sin intervención humana significativa (art. 22 GDPR): prohibidas por defecto.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA**. Antes de conectar un agente al HRIS, al ATS o al sistema de evaluación, lee la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

RRHH es lectura masiva (CVs, evaluaciones, encuestas), redacción repetitiva (ofertas, comunicaciones, políticas) y analítica de plantilla. La IA acelera todo eso. Lo que **no** delegas: la decisión sobre una persona. Contratar, evaluar, promover, sancionar o despedir requiere juicio humano documentado. El modelo prepara; tú decides y firmas.

## 2. Ocho casos típicos

Cada caso en cuatro bloques: caso → cómo resolverlo → KPIs → riesgos.

### 2.1 Cribado de candidatos (con cuidado)

**Caso de uso.** Vacante popular con 300 candidaturas. Hoy: 6-10 h de lectura inicial, riesgo de descartar buenos perfiles por fatiga.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre CVs en PDF anonimizados parcialmente (sin nombre, género, foto, edad). *"Resume cada CV en 5 líneas: experiencia, stack, años en rol equivalente, idiomas, ubicación. No clasifiques, no puntúes, no descartes."*
- *Copilot M365:* CVs en SharePoint, Copilot Chat con prompt arriba. Misma regla: resumir, no puntuar.
- *Claude Code:* repo con `AGENTS.md` que prohíbe puntuación y descarte automático.
- *ATS con IA (con auditoría):* **Workday Recruiting AI**, **SuccessFactors**, **Greenhouse AI**, **Lever**. Pide documentación: cómo se entrena, *bias testing*, qué automatiza.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-greenhouse` | `npx mcp-greenhouse`, `vault://gh/ta-ro` | `candidates:read` — nunca `reject:write` ni `score:write` |
| `mcp-graph-files` | M365 oficial | `Files.Read.All` sobre carpeta de la vacante |

- *Alternativa:* Claude.ai con bloques de CVs anonimizados. Forma incorrecta: *"Puntúa del 1 al 10 y descarta inferiores a 7"* → decisión automatizada ilegal (art. 22 GDPR, EU AI Act alto riesgo).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por criba de 300 CVs | 8 h | 2 h |
| Diversidad en shortlist (género, origen) | medida base | +20-30% |
| % candidatos contactados en 48 h | 40% | 90% |
| Tasa de error de descarte (revisión a posteriori) | 8% | < 3% |

*Fórmula:* `(6) h × 30 vacantes/año = 180 h/año por recruiter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo puntúa y descarta, infringes art. 22 GDPR + EU AI Act Anexo III (alto riesgo).* Sanción AEPD documentada en otros sectores.
- *Si el ATS retiene CVs para entrenar el modelo, tratamiento adicional sin base jurídica.*
- *Si el agente accede con tu usuario y no `svc-ta-ro`, no hay traza segregada para el comité de empresa.*
- *Si la anonimización es superficial (queda foto, género en el nombre, fecha de graduación), el sesgo persiste.*

Cubierto en **Pieza 2** con identidad de agente, prohibición técnica de scopes de descarte automatizado, DPIA obligatoria, *bias testing* periódico y información a comité de empresa (Ley Rider).

### 2.2 Redacción de ofertas de empleo

**Caso de uso.** Oferta del puesto anterior, copiada y adaptada. Lenguaje sesgado ("rockstar", "ninja", "nativo"), requisitos infl­ados, sin marca empleadora. Conversión baja.

**Cómo resolverlo.**

- *Local:* Ollama con plantilla + descripción del puesto + banda salarial. Genera oferta inclusiva.
- *Copilot Word:* base + Copilot Chat. *"Redacta oferta inclusiva (lenguaje neutro), estructura: misión, qué harás, qué buscamos, qué ofrecemos. Evita 'rockstar', 'ninja', 'nativo'. Marca como opcionales requisitos que excluyan perfiles válidos."*
- *Claude Code:* repo `vacantes/` con plantillas y `AGENTS.md` con guía de lenguaje inclusivo.
- *Plataformas:* **Textio**, **Datapeople**, **Gender Decoder** para test de sesgo posterior.
- *MCPs:* `mcp-graph-files` (plantillas y ofertas anteriores), `mcp-workday` (banda salarial del puesto en lectura).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por oferta | 60 min | 15 min |
| Score de inclusión (Textio/equivalente) | 60 | 85+ |
| % candidaturas femeninas (puestos tech) | 18% | 30%+ |
| Tasa de conversión oferta → candidatura | medida base | +25% |

*Fórmula:* `(45) min × 80 ofertas/año = 60 h/año por recruiter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la oferta filtra detalles internos de retribución no comunicados, riesgo laboral.*
- *Si el modelo introduce requisitos discriminatorios sutiles (edad implícita por años exigidos), riesgo Ley de Igualdad.*
- *Si la oferta se publica sin validación, una promesa salarial errónea es vinculante.*

Cubierto en **Pieza 2** con gate humano en publicación y test de sesgo automatizado pre-publicación.

### 2.3 Resumen de encuestas de clima

**Caso de uso.** 2.000 respuestas abiertas de la encuesta anual. Hoy: equipo de 3 personas, 2 semanas codificando manualmente.

**Cómo resolverlo.**

- *Local:* Ollama sobre corpus anonimizado (sin nombre, departamento ni manager directo). *"Identifica 10 temas más mencionados. Por cada uno: % menciones, sentimiento (pos/neutro/neg), 3 citas representativas literales. No infieras causas."*
- *Copilot M365:* corpus en SharePoint, Copilot Chat con el prompt.
- *Plataformas nativas:* **Qualtrics XM Discover**, **Peakon AI**, **Glint**, **Culture Amp**. Diseñadas para esto.
- *Claude Code:* repo `clima/` con corpus exportado y plantillas de reporte.
- *MCPs:* `mcp-qualtrics`, `mcp-peakon`, `mcp-graph-files`. Solo lectura.
- *Alternativa:* Claude.ai con corpus anonimizado adjunto.

**Regla de anonimización seria:** sin nombres, sin departamento, sin manager directo si la muestra es < 10 personas. Agregación mínima de 5.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días para primer informe | 14 | 2 |
| Temas identificados | 8-10 | 15-20 |
| Tasa de re-codificación por sesgo | 15% | < 3% |
| Cobertura sentimiento por unidad | 60% | 100% |

*Fórmula:* `(12 días × 8h × 3 personas) − (2 días × 8h × 1) = 272 h/año ahorradas por encuesta`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la anonimización es débil y los comentarios se cruzan con datos demográficos, la promesa de anonimato se rompe → ruptura de confianza + posible breach GDPR.*
- *Si el modelo etiqueta sentimiento de un empleado y eso se asocia a su unidad, decisión sobre personas con efectos colaterales.*
- *Si el corpus se sube a herramienta que retiene para entrenamiento, tratamiento adicional sin base.*

Cubierto en **Pieza 2** con DPIA de encuestas, allow-list de plataformas con retención cero y validación de agregación.

### 2.4 Borrador de comunicación interna

**Caso de uso.** Nota sobre nuevo plan retributivo, circular de cambio de oficina, mensaje sobre reestructuración. Tono adecuado, claridad legal, calendario realista.

**Cómo resolverlo.**

- *Local:* Ollama con hechos + audiencia + tono + restricciones legales.
- *Copilot Word:* mismo input. *"Genera comunicación para [audiencia]. Tono [empático/neutro/formal]. Estructura: contexto, qué cambia, cuándo, qué hacer, dónde preguntar. No prometas plazos no confirmados."*
- *Claude Code:* repo `comunicaciones/` con histórico y `AGENTS.md` con estilo de la compañía.
- *MCPs:* `mcp-graph-files` (comunicaciones previas), `mcp-confluence` (políticas vigentes).

Para ERE, reestructuración, sanción → redacción con asesoría laboral. La IA es punto de partida, no envío.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por comunicación | 3 h | 45 min |
| Iteraciones con legal | 4 | 2 |
| % preguntas reactivas tras envío | 25% | 10% |

*Fórmula:* `(2,25) h × 40 comunicaciones/año = 90 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la comunicación filtra detalles aún no aprobados (ERE en preparación, salidas), conflicto laboral inmediato y posible MNPI en cotizadas.*
- *Si el modelo "redondea" un plazo, promesa indebida con efecto contractual.*
- *Si la comunicación se envía vía agente con permiso `Mail.Send`, un error de prompt manda algo no validado.*

Cubierto en **Pieza 2** con scope `Mail.ReadWrite` (no `Send`), gate humano en envío y revisión legal obligatoria pre-publicación.

### 2.5 Preparación de entrevistas

**Caso de uso.** Entrevista en 1 hora. Preguntas tipo que se repiten de memoria y no profundizan. Sin diferenciar técnica de conductual.

**Cómo resolverlo.**

- *Local:* Ollama con CV + JD + competencias clave.
- *Copilot M365:* CV en SharePoint + JD, Copilot Chat. *"Genera batería: 5 técnicas alineadas al stack, 5 conductuales (STAR) sobre competencias clave, 3 situacionales sobre dilemas del rol. Marca qué busca cada pregunta."*
- *Claude Code:* repo `entrevistas/` con `AGENTS.md` definiendo competencias por familia.
- *MCPs:* `mcp-greenhouse` o `mcp-workday-recruiting` (CV en lectura), `mcp-graph-files` (banco de preguntas).

NO le pidas predecir rendimiento futuro a partir del CV → prohibido por EU AI Act salvo con garantías.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min de preparación por entrevista | 30 | 5 |
| % entrevistas con guion estructurado | 40% | 95% |
| Calidad de calibración entre entrevistadores | medida base | +30% |

*Fórmula:* `(25) min × 400 entrevistas/año = 167 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera preguntas sesgadas (situación familiar, edad, planes personales), riesgo discriminación.*
- *Si la batería se guarda con el CV identificado y se usa en futuras decisiones, tratamiento más allá de finalidad.*

Cubierto en **Pieza 2** con plantillas validadas, prohibición de preguntas discriminatorias y borrado post-proceso.

### 2.6 Apoyo en evaluación del desempeño

**Caso de uso.** Calibración del ciclo anual, comentarios escritos del manager, resumen de logros del año.

**Cómo resolverlo.**

- *Casos válidos:* *"Resume estos 12 informes mensuales en 1 página de logros."* / *"Reescribe este feedback en tono constructivo, manteniendo el mensaje."* / *"Compara distribución de calificaciones entre equipos y señala outliers para revisar (no corregir)."*
- *Casos NO válidos:* *"Decide la calificación final."* / *"Recomienda promociones."*
- *Copilot M365 / Workday AI / SuccessFactors:* la decisión y la justificación las hace el manager con HR business partner. La IA estructura material.
- *MCPs:* `mcp-workday` (informes y objetivos en lectura), `mcp-graph-files` (notas del manager). Nunca scope de calificación.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas/manager en ciclo de evaluación | 12 h | 4 h |
| Calidad del feedback (encuesta empleado) | medida base | +20% |
| % evaluaciones entregadas a tiempo | 70% | 95% |

*Fórmula:* `(8) h × N managers × ciclos/año`. Para 100 managers, 2 ciclos: `1 600 h/año`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo decide la calificación, decisión automatizada con efecto en retribución y permanencia → art. 22 GDPR + EU AI Act alto riesgo.*
- *Si los inputs incluyen datos sensibles (salud, embarazo, conflictos), tratamiento sin base jurídica clara.*
- *Si el agente publica la evaluación sin gate, el empleado recibe un texto no validado por su manager.*

Cubierto en **Pieza 2** con prohibición técnica de scopes de calificación, gate humano obligatorio, DPIA y registro EU AI Act.

### 2.7 People analytics

**Caso de uso.** Entender rotación, ausentismo, equidad retributiva, *engagement* por unidad. Hoy: extracts ETL manuales + Excel + dashboards estáticos.

**Cómo resolverlo.**

- *Local:* Ollama sobre extract anonimizado y agregado (mínimo 5 personas/celda).
- *Copilot Power BI:* dashboard del HRIS con Copilot Q&A. *"Análisis rotación por unidad y antigüedad últimos 24 meses. Identifica unidades con rotación > media + 1σ. Factores correlacionados (no causales): comp ratio, manager, distancia, cambios. No infieras causalidad."*
- *Claude Code:* repo `people-analytics/` con queries y `AGENTS.md` que prohíbe scoring individual.
- *Plataformas:* **Visier AI**, **Workday Prism**, **One Model**, **Crunchr**.
- *MCPs:*

| MCP | Comando | Scopes |
|-----|---------|--------|
| `mcp-visier` | `npx mcp-visier`, `vault://visier/people-ro` | `analytics:read` agregado |
| `mcp-workday-prism` | oficial | `report:read` con agregación |
| `mcp-snowflake` | sobre `vw_hr_agg_*` | `HR_READ_AGG` |

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por análisis ad-hoc | 5 | 1 |
| % decisiones plantilla con análisis | 30% | 75% |
| Cobertura unidades con análisis trimestral | 40% | 100% |

*Fórmula:* `(4 días × 8h) × 20 análisis/año = 640 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el extract baja a nivel individual y la "anonimización" deja rasgos reidentificables, la promesa de anonimato es ficción.*
- *Si el modelo cruza salud/ausencias con desempeño, tratamiento de datos especialmente protegidos sin base.*
- *Si una predicción de "riesgo de fuga" se usa para decisiones, decisión automatizada sobre personas + sesgo casi garantizado.*

Cubierto en **Pieza 2** con agregación mínima impuesta, prohibición de scoring individual, DPIA y información a comité de empresa.

### 2.8 Documentación y FAQ del empleado

**Caso de uso.** 200 preguntas/semana de empleados sobre vacaciones, retribución variable, beneficios, teletrabajo. Equipo de people operations saturado.

**Cómo resolverlo.**

- *Asistente HR conectado a repositorio de políticas (RAG):* respuesta solo basada en docs indexados. *"Cita el documento y la sección. Si no encuentras, deriva a [contacto]. No improvises política."*
- *Plataformas nativas:* **ServiceNow HR Service Delivery con AI**, **Leena AI**, **Moveworks**, **Espressive**.
- *Copilot M365:* Copilot Chat conectado a SharePoint del repositorio de RRHH.
- *Claude Code:* repo `politicas-hr/` con `AGENTS.md` indicando "no improvisar política".
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-graph-files` (SharePoint políticas) | Fuente primaria |
| `mcp-confluence` | Políticas y manuales |
| `mcp-servicenow-hrsd` | Histórico de casos resueltos |

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Consultas resueltas sin escalado | 40% | 80% |
| Tiempo medio de resolución | 24 h | < 1 h |
| % respuestas con cita-fuente | 30% | 100% |
| Satisfacción del empleado (CSAT) | 6/10 | 8,5/10 |

*Fórmula:* `(23h × 0,6 consultas) × 200/semana × 48 = 132 480 h/año ahorradas a la organización`. *(estimación, T1, depende mucho del CSAT real).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo improvisa política (alucina vacaciones extra, beneficio inexistente), compromisos no contractuales y conflicto laboral.*
- *Si el asistente lee también nóminas y expedientes, expone datos a empleados que no debían verlos.*
- *Si el agente actúa con tu usuario, el empleado ve respuestas con tu nombre — daño reputacional y de confianza.*

Cubierto en **Pieza 2** con scopes mínimos (solo políticas, NO nóminas ni expedientes), identidad propia del asistente, validación periódica de salidas y prohibición de "completar" sin fuente.

## 3. MCPs: cómo enchufar tus fuentes al agente

| MCP | Para qué lo usas |
|-----|------------------|
| HRIS (Workday, SuccessFactors, BambooHR, Sage HR) | Plantilla, posiciones, retribución, ausencias |
| ATS (Greenhouse, Workday Recruiting, Lever, Teamtailor) | Candidatos, vacantes, pipeline |
| LMS (Cornerstone, Docebo, SAP Learning) | Formación, certificaciones, planes de carrera |
| Encuestas (Qualtrics, Peakon, Glint, Culture Amp) | Clima, engagement, eNPS |
| Documentación (SharePoint / Drive / Confluence) | Políticas, convenios, manuales |
| Nómina (ADP, Cegid, Meta4, A3 Innuva) | **Acceso muy restringido**, lectura puntual y trazada |
| Ticketing HR (ServiceNow HRSD, Zendesk) | Consultas del empleado, casos |

**Reglas adicionales para RRHH:**

- **Base jurídica explícita** GDPR por caso de uso. Sin base jurídica documentada, no se trata.
- **Información al empleado.** Política de uso de IA en RRHH publicada (transparencia EU AI Act + art. 13/14 GDPR).
- **DPIA previa** en cualquier sistema de selección, evaluación, promoción o despido con apoyo de IA.
- **Comité de empresa.** Algoritmos que afectan a condiciones de trabajo están sujetos a información al comité (Ley Rider y derivada).
- **Lectura por defecto.** No automatices ofertas, comunicaciones contractuales, cambios de retribución ni decisiones contractuales.
- **Datos especialmente protegidos** (salud, discapacidad, afiliación, orientación, origen): tratamiento aparte y mínimo.

## 4. Cinco hábitos clave

1. **Anonimiza antes de cargar.** Nombres, IDs, manager directo: fuera. Si la muestra es pequeña, agrega más.
2. **Marca lo que no se decide automáticamente.** Toda salida sobre una persona pasa por revisión humana documentada.
3. **Audita el sesgo.** Periódicamente revisa outputs por género, edad, origen, antigüedad. Si el modelo desvía, deja de usarlo.
4. **Pide trazabilidad de la política.** *"Cita el documento y la sección. Si no encuentras, dilo."*
5. **Sesión por proceso, no por persona.** Una sesión por vacante, por ciclo. Nunca por empleado con datos acumulados.

## 5. Qué evitar

- Subir CVs, evaluaciones, nóminas o expedientes a chats no aprobados.
- Decisiones automatizadas sobre personas sin garantías art. 22 GDPR y requisitos EU AI Act.
- Puntuaciones o rankings de empleados generados por IA como input directo a calificaciones, promociones o despidos.
- Predicciones de "potencial", "ajuste cultural" o "riesgo de fuga" como criterio operativo.
- Cargar conversaciones de relaciones laborales, conflictos sindicales o investigaciones internas.
- Anonimización superficial (quitar nombre pero dejar departamento + género + edad + antigüedad).

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"**: patrón de people analytics (2.7) y resumen de encuestas (2.3).
- Lab base **"asistente al empleado frontline"**: patrón del asistente HR (2.8).
- Lab base **"agente regulatorio/legal sobre documentos"**: patrón de revisión de políticas y convenios.
- Guías de estándares operativos: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
