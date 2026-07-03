# TL01 — Triage de incidencias de red

## Identificación

- **Rol principal**: ingeniero NOC, técnico de red, SRE de telco.
- **Sectores**: telco (fijo, móvil, ISP), también industria con redes propias.
- **Patrón técnico**: Lab 2 — agente de triage + Lab 4 — operacional read-only.
- **Madurez recomendada**: nivel 2 piloto read-only; nivel 3 antes de cualquier acción sobre red.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

El NOC recibe miles de alarmas por hora (degradaciones, cortes, pérdidas de sincronización). Filtrar ruido y agrupar alarmas relacionadas en un mismo incidente raíz (correlación) es el cuello de botella. El agente correlaciona, propone hipótesis de causa raíz y prioriza por impacto en SLA / clientes. **No reconfigura nada.**

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre export de alarmas + topología. Prompt: *"Agrupa alarmas en incidentes por proximidad temporal, dependencia topológica y patrón conocido. Para cada incidente: causa probable, dispositivos implicados, impacto estimado (clientes, SLA). **No propongas comandos; solo diagnóstico.**"*

### 2.2 Copilot

Microsoft Security Copilot no aplica; herramientas específicas de telco: Cisco AI Network Analytics, Nokia AVA, Huawei iMaster NAIE.

### 2.3 Claude Code

Repo `noc/` con `AGENTS.md` que define inventario de red, dependencias y formato JSON de salida.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-netcool` | IBM Netcool MCP | `vault://noc/netcool-ro` | `alarms:read,topology:read` |
| `mcp-elasticsearch` | ES MCP sobre logs de red | `vault://noc/es-ro` | `read` solo índices NOC |
| `mcp-ne` | Network Element MCP (Cisco/Juniper) | `vault://noc/ne-ro` | `show` only; **nunca** `configure` |
| `mcp-snow` | ServiceNow ITSM | `vault://noc/sn-draft` | `incidents:draft` (humano publica) |

### 2.5 Alternativas

Solo entorno corporativo. Datos de red son críticos NIS2.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| MTTD (alarma a incidente raíz) | 15 min | 3 min |
| % alarmas agrupadas correctamente | 60% | 90% |
| MTTR | 60 min | 35 min |
| Coste por incidente | € | € × 0,5 |

Fórmula: *12 min × 1.000 alarmas/día × 365 = ≈ 73.000 h/año. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP del NE tiene `configure` y un prompt injection desde un log (`# rollback config`) ejecuta cambio en producción, outage masivo."*
- *"Si la topología completa (incluye nodos críticos, interconexiones, capacidades) sale a LLM externo, **información sensible para seguridad nacional** (telco es infra crítica NIS2)."*
- *"Si el agente clasifica una alarma de seguridad (DDoS, BGP hijack) como degradación normal, ventana de exposición."*

**Riesgos típicos:** acción no autorizada sobre la red (NIS2 crítico), fuga de topología (infra crítica), confusión seguridad/operación, prompt injection desde logs/alarmas.

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo B — Sectorial telco.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- NIS2 (infraestructura crítica), Reglamento europeo de ciberseguridad, ENS, CNMC. *Citas T1.*
