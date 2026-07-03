# Documentación y FAQ del empleado

> **Rol:** rrhh · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
