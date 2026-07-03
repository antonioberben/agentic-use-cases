# SP03 — Gestión documental de proyecto

## Identificación

- **Rol principal**: project manager, PMO, consultor.
- **Sectores**: servicios profesionales, construcción, ingeniería, IT services.
- **Patrón técnico**: Lab 1 — analítico + Lab 5 — frontline.
- **Madurez recomendada**: nivel 1 piloto en lectura; nivel 3 antes de comunicar al cliente externo.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Contrato cliente + NDA, GDPR (PII del cliente), confidencialidad profesional. *Citas T1.*
