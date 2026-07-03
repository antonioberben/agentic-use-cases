# B01 — Asistente al puesto en oficina bancaria

## Identificación

- **Rol principal**: empleado de oficina bancaria (gestor, atención al cliente).
- **Sectores**: banca retail.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 2 piloto en oficinas seleccionadas; nivel 3 antes de red completa.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

El gestor alterna entre productos (cuentas, hipotecas, fondos, seguros), normativa (MiFID II, transparencia, PBC/FT), procedimientos internos y herramientas (core, CRM, DAM). Tiempo del cliente: 15-20 min. El asistente del puesto responde dudas operativas con cita al manual; **no contrata, no asesora**.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre procedimientos sanitizados. Prompt: *"Responde con cita al procedimiento. Si la pregunta es de asesoramiento financiero, di 'requiere test MiFID y firma del gestor'. No recomiendes producto."*

### 2.2 Copilot

Microsoft Copilot for Frontline + Core Banking + CRM. Procesamiento UE, data boundary financiero.

### 2.3 Claude Code

Repo `branch-assist/` con `AGENTS.md`: taxonomía, prohibición de asesoramiento sin gate, citación obligatoria.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-core-banking` | Temenos/Finacle MCP | `vault://branch/core-ro` | `accounts:read,transactions:read` solo cliente atendido |
| `mcp-crm` | SFSC MCP | `vault://branch/crm-ro` | `customer:read` solo cliente atendido |
| `mcp-policies` | SharePoint Graph MCP | `Sites.Selected` procedimientos | `documents:read` |

### 2.5 Alternativas

Ninguna pública con datos de cliente bancario.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo medio de atención | 18 min | 12 min |
| % consultas procedimentales sin escalado | 60% | 88% |
| Errores operativos a posteriori | medio | bajo |
| NPS de oficina | base | +5-10 pts |

Fórmula: *6 min × 25 atenciones/día × 220 días = ≈ 550 h/año por gestor. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente recomienda fondo sin test MiFID firmado, infracción de idoneidad MiFID II + compensación posible."*
- *"Si el MCP del core tiene scope amplio, el agente accede a cuentas ajenas — fuga interna + GDPR + sigilo bancario."*
- *"Si responde a pregunta sobre detección de blanqueo, *tipping-off* (delito Ley 10/2010 art. 24)."*

**Riesgos típicos:** asesoramiento sin MiFID, fuga cross-cliente, *tipping-off*, decisión crediticia automatizada sin art. 22 GDPR.

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo A — Sectorial banca.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- MiFID II, Ley 10/2010 PBC/FT, RDL 24/2021, GDPR/LOPDGDD, DORA, EBA, BdE. *Citas T1.*
