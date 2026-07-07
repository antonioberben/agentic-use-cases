# TL01 — Triage de incidencias de red

## Identificación

- **Rol principal**: ingeniero NOC, técnico de red, SRE de telco.
- **Sectores**: telco (fijo, móvil, ISP), también industria con redes propias.
- **Patrón técnico**: Lab 2 — agente de triage + Lab 4 — operacional read-only.
- **Madurez recomendada**: nivel 2 piloto read-only; nivel 3 antes de cualquier acción sobre red.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo B — Sectorial telco.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal* + *A5 read-only* sobre red (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `noc-correlator` agrupa alarmas por proximidad temporal + dependencia topológica, propone hipótesis de causa raíz y prioriza por impacto SLA; un validador A2A `impact-validator` (identidad SPIFFE separada) comprueba impacto y detección seguridad-vs-operación (DDoS, BGP hijack). **NE MCP en modo `show`**: nunca `configure`.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MCP NE con `configure` + prompt injection desde log (`# rollback config`) → outage masivo (**NIS2 art. 21 · CNMC · infra crítica**) | agentregistry + agentgateway | scopes NE Cisco/Juniper: `show`, `get`; verbos `configure`, `commit`, `rollback`, `reload` **no publicados**; contenido de log/alarma marcado `untrusted-content`; spotlighting |
| Topología completa (nodos críticos, capacidades, interconexiones) a LLM externo → info sensible seguridad nacional (**NIS2 · ENS · secreto estadístico**) | agentgateway | procesamiento on-prem forzado (`data-classification=critical-infrastructure`); egress LLM externo deny; audit trail retenido según requisitos NIS2/CNMC |
| Alarma de seguridad (DDoS, BGP hijack) clasificada como degradación normal → ventana de exposición | agentevals | eval set con 200 alarmas históricas etiquetadas `security` vs `operational`; detección `bgp.*hijack`, `ddos`, `route.*flap.*abnormal` → `escalate:soc` obligatorio, no auto-clasificación como operacional |
| Publicación automática de incidente en ServiceNow con topología detallada | kagent | `mcp-snow` con scope `incidents:draft` únicamente; publicación requiere firma humana NOC lead con `role=noc-lead` |
| Coste explosivo con miles de alarmas/hora | agentgateway | dedup por fingerprint topológico antes del LLM; cache TTL 5min de correlaciones; rate-limit y presupuesto por NOC con corte automático |

## Referencias

- NIS2 (infraestructura crítica), Reglamento europeo de ciberseguridad, ENS, CNMC. *Citas T1.*
