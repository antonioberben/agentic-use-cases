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

Cubierto en la **arquitectura de remediación (bloque 5)** con scopes mínimos (solo políticas, NO nóminas ni expedientes), identidad propia del asistente, validación periódica de salidas y prohibición de "completar" sin fuente.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot con deflection y guardrails de salida* (interno) (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-hr-faq` responde consultas del empleado (RAG) citando el documento y sección, y **deriva a people operations si no hay fuente** — nunca improvisa política.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Improvisación de política (alucina vacaciones extra o beneficio inexistente) → compromiso no contractual | agentgateway + agentevals | prompt guard de salida `no-source-no-answer`; `agentevals` bloquea respuestas sin cita-fuente verificable contra los docs indexados |
| El asistente lee nóminas y expedientes que el empleado no debía ver (GDPR art. 5, minimización) | agentgateway | allowlist restringida a `mcp-graph-files` y `mcp-confluence` sobre el repositorio de políticas; nómina/HRIS **fuera del scope** |
| El agente actúa con tu usuario y el empleado ve respuestas con tu nombre | agentgateway + kagent (OBO) | identidad propia SPIFFE `svc-hr-faq`; no se usa tu credencial personal |
| Datos especialmente protegidos en el histórico de `mcp-servicenow-hrsd` (salud, conflicto) citados al empleado (GDPR art. 9) | agentgateway | prompt guard perfil `art.9` + redaction sobre las respuestas de `mcp-servicenow-hrsd` antes de la salida |

## Referencias

- GDPR art. 5 (minimización), art. 9 (categorías especiales), art. 13/14 (información al empleado), EU AI Act art. 50 (transparencia). *Citas T1.*
- Marco técnico: OWASP LLM09 (Misinformation).
