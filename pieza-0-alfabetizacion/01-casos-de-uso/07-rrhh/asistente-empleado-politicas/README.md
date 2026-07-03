# T13 — Asistente al empleado para políticas internas

## Identificación

- **Rol principal**: cualquier empleado; backend RRHH/IT/legal/finanzas.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 1 piloto en políticas no sensibles; nivel 3 antes de respuestas sobre nómina, despido, IT crítico.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

El empleado tiene dudas básicas (vacaciones, dietas, gasto, compra, baja, certificados, accesos). Hoy: mail a RRHH/IT/admin, espera 1-3 días, productividad perdida. El asistente conectado al manual del empleado responde con cita de la política, deriva si es un caso límite y abre ticket si requiere gestión humana.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre repo de políticas + FAQ. Prompt: *"Responde con cita exacta de la política (sección, párrafo). Si la respuesta no está, di no está y deriva al canal. **No interpretes política ambigua; deriva.**"*

### 2.2 Copilot

Copilot M365 + Viva. Conectado a SharePoint de políticas. Procesamiento UE.

### 2.3 Claude Code

`AGENTS.md` que defina taxonomía, prohíba inferencia, fije derivación.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-sharepoint` | Graph MCP | `Sites.Selected` site políticas | `documents:read` |
| `mcp-servicenow` | SN MCP | `vault://hr/sn-rw-limited` | `incidents:create` solo categoría 'employee assistance' |

### 2.5 Alternativas

Espressive, AskHR, Moveworks.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a respuesta de política | 1-3 días | 30 s |
| % consultas resueltas sin ticket | 30% | 70% |
| Carga RRHH/IT en dudas básicas | base | base × 0,4 |

Fórmula: *2 días × 10 dudas/empleado/año × plantilla = horas a nivel red. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente responde a un empleado sobre despido o baja por salud aplicando política simplificada, error en proceso laboral con consecuencias jurídicas."*
- *"Si el repo de políticas mezcla política vigente con borradores no aprobados, el modelo cita borrador como vigente."*
- *"Si el empleado pregunta sobre compañero (salario, evaluación), el agente accede a HRIS sin necesidad real — fuga interna."*

**Riesgos típicos:** respuesta sobre proceso laboral sin gate humano, mezcla de versiones de política, acceso indebido al HRIS, sesgo en derivación.

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR (datos del empleado), Estatuto de los Trabajadores. *Citas T1.*
