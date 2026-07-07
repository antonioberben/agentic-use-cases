# T13 — Asistente al empleado para políticas internas

## Identificación

- **Rol principal**: cualquier empleado; backend RRHH/IT/legal/finanzas.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 1 piloto en políticas no sensibles; nivel 3 antes de respuestas sobre nómina, despido, IT crítico.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot con deflection y guardrails de salida* (interno) (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-hr-assist` responde dudas del empleado citando la política, deriva los casos límite a un humano y abre ticket vía `mcp-servicenow` — **nunca interpreta política ambigua ni decide sobre un proceso laboral**.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Respuesta sobre proceso laboral sensible (despido, baja por salud, incapacidad) con política simplificada (Estatuto de los Trabajadores) | agentgateway + kagent (OBO) | prompt guard de salida detecta intención "despido/baja/incapacidad"; ruteo obligatorio a humano y apertura de ticket con OBO del empleado, sin respuesta autónoma |
| Cita de un borrador no aprobado como política vigente | agentgateway + kagent (A2A) | allowlist de `mcp-sharepoint` restringida a `Sites.Selected` del site de políticas **vigentes**; el repositorio de borradores queda fuera del scope `documents:read`; un validador A2A `source-validator` con identidad SPIFFE separada exige que la cita apunte a política vigente + fecha antes de responder |
| Acceso al HRIS para responder sobre un compañero (salario, evaluación) (GDPR art. 5, minimización) | agentgateway | el HRIS **no está en la allowlist** del agente; solo `mcp-sharepoint` con `documents:read` sobre políticas |
| Apertura de ticket con scope amplio de escritura | agentgateway + kagent (OBO) | `mcp-servicenow` limitado a `incidents:create` categoría `employee assistance`; el ticket se firma con OBO del empleado, no con la SA del agente |

## Referencias

- GDPR (datos del empleado), Estatuto de los Trabajadores. *Citas T1.*
