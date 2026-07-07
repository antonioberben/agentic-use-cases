# SP03 — Gestión documental de proyecto

## Identificación

- **Rol principal**: project manager, PMO, consultor.
- **Sectores**: servicios profesionales, construcción, ingeniería, IT services.
- **Patrón técnico**: Lab 1 — analítico + Lab 5 — frontline.
- **Madurez recomendada**: nivel 1 piloto en lectura; nivel 3 antes de comunicar al cliente externo.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Un proyecto grande genera centenares de documentos: actas, planes, especificaciones, cambios, riesgos, *issues*, comunicaciones con cliente. El PM pierde horas buscando ("¿qué acordamos sobre el alcance del módulo X?"). El agente indexa el repositorio del proyecto, responde con cita exacta, detecta inconsistencias entre documentos y propone borrador de informe de estado.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre carpeta del proyecto. Prompt: *"Sobre el proyecto [X]: responde con cita exacta al documento (nombre, fecha, sección). Detecta inconsistencias entre acta de [fecha1] y [fecha2]. Para informe de estado: avance, riesgos abiertos, hitos próximos. **No interpretes; cita.**"*

### 2.2 Copilot

Microsoft 365 Copilot sobre SharePoint del proyecto. Sensibilidad `Confidential / Project`.

### 2.3 Claude Code

Repo `projects/<proyecto>/` con `AGENTS.md` que define estructura de carpetas, plantillas de informe, prohibe enviar a cliente.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-sharepoint` | Graph MCP | `Sites.Selected` site del proyecto | `documents:read` |
| `mcp-jira` | Atlassian MCP | `vault://pm/jira-ro` | `issues:read,sprints:read` proyecto |
| `mcp-msproject` | MS Project MCP | `vault://pm/project-ro` | `tasks:read,gantt:read` |
| `mcp-report` | Report writer | `vault://pm/report-rw` | `report:write` (espacio del proyecto, **solo con aprobación humana**) |

### 2.5 Alternativas

Claude Projects con documentos subidos.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a respuesta sobre histórico del proyecto | 30 min | 1 min |
| Inconsistencias detectadas entre actas | rara vez | sistemático |
| Tiempo a informe de estado semanal | 4 h | 30 min |
| Disputas con cliente por interpretación | base | base × 0,5 |

Fórmula: *3,5 h × 50 informes/año + 25 min × 200 búsquedas/año = ≈ 250 h/año por PM. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo cita mal un acuerdo del acta (cambia 'fase 2 incluye X' por 'fase 2 incluye X e Y') y se comunica al cliente, **modificación contractual implícita** — disputa o reclamación."*
- *"Si subo el repositorio del proyecto del cliente a LLM externo, ruptura del contrato + NDA."*
- *"Si el agente accede a documentos de otros proyectos por mal aislamiento, fuga cruzada entre clientes (problema clásico de consultoras)."*
- *"Si el informe contiene PII de empleados del cliente (organigramas, valoraciones), riesgo GDPR del responsable de tratamiento."*

**Riesgos típicos:** alteración material del histórico contractual, ruptura de NDA cliente, fuga cruzada entre proyectos/clientes, fuga de PII del cliente.

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* aplicado a proyectos (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-pm-docs-agent` indexa SharePoint/Jira/MS Project del proyecto y responde con cita exacta (documento, fecha, sección). Aislamiento por proyecto en identidad y política.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Cita alterada del acta → modificación contractual implícita en comunicación al cliente | agentevals | validador A2A que verifica `quote_hash` contra el chunk original; miss → respuesta bloqueada; eval set con 30 pares acta-pregunta con citas exactas conocidas |
| Fuga cruzada entre proyectos/clientes (contaminación entre NDAs distintos) | Istio ambient + agentregistry | identidad SPIFFE por proyecto `svc-pm-<proyecto>-agent`; MCPs `mcp-sharepoint` con `Sites.Selected` scope al site del proyecto únicamente; AuthorizationPolicy L7 waypoint bloquea cross-project |
| Ruptura de NDA por subir repo a LLM externo (**contrato + Directiva 2016/943** secretos comerciales) | agentgateway | clasificación `client-nda` fuerza modelo on-prem; egress a APIs LLM públicas deny; DLP scan pre-envío bloquea nombres de cliente/proyecto |
| PII de empleados del cliente en organigramas/valoraciones (**GDPR art. 28** encargado de tratamiento) | agentgateway | pii-redact con diccionario de nombres del proyecto; salida a informe con nombres solo si el prompt viene con flag `client-authorized=true` |
| Consulta cruzada al MCP MS Project por confusión de contexto | agentgateway | política per-tool: `mcp-msproject` acepta solo `project_id` matching el SPIFFE ID del agente |
| Escritura del informe de estado al espacio del proyecto sin control → informe con datos sin verificar publicado | agentgateway (MCP Gateway) + kagent | `mcp-report` con scope `report:write`; **HITL obligatorio antes de escribir**; OBO del PM |

## Referencias

- Contrato cliente + NDA, GDPR (PII del cliente), confidencialidad profesional. *Citas T1.*
