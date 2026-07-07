# Investigación de incidente

> **Rol:** it-seguridad · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Línea de tiempo, TTPs y alcance que reconstruir en guardia. Hoy: horas pivotando entre 6 consolas.

**Cómo resolverlo.**

- *Plataformas:* Sentinel Copilot, Charlotte AI, XSIAM, Duet AI — todas con timeline asistido.
- *Local:* Ollama sobre export de eventos correlacionados.
- *Claude Code:* repo `ir-cases/[caso]/` con telemetría exportada y `AGENTS.md`.
- *MCPs (lectura):* `mcp-sentinel`, `mcp-crowdstrike-edr`, `mcp-entra-id`, `mcp-aws-cloudtrail`, `mcp-azure-activity-log`, `mcp-gcp-audit`. Nunca scope de aislamiento o reset.

**Prompt:** *"Reconstruye timeline desde [primera detección] con eventos relacionados con [activo/usuario/IOC]. Mapea a MITRE ATT&CK. Identifica activos potencialmente impactados. Marca lo que requiere acción humana inmediata. NO ejecutes ninguna acción."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas a primer timeline | 4 h | 30 min |
| Cobertura activos impactados | 70% | 98% |
| MTTR | 12 h | 3 h |
| Calidad del informe IR (peer review) | 7/10 | 9/10 |

*Fórmula:* `(3,5) h × 40 incidentes/año = 140 h/año por analista IR`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la salida del modelo se toma como evidencia forense sin validación, la cadena de custodia se rompe.*
- *Si el agente tiene `host:isolate`, un FP aísla un servidor productivo.*
- *Si el case se procesa en herramienta no aprobada, expones detalles del incidente y del atacante.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de herramientas IR, scope read-only, gate humano para acción y trazabilidad para informe regulador (NIS2 art. 23).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `ir-timeliner` reconstruye timeline cruzando Sentinel + EDR + CloudTrail + Entra + Azure/GCP activity, mapea TTPs a MITRE ATT&CK. **Read-only estricto**: cero scope de aislamiento, cero reset de credenciales, cero contain.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Salida del modelo tomada como evidencia forense sin validación → cadena de custodia rota (**LECr · NIS2 art. 23 informe a regulador**) | agentgateway | cada evento en el timeline lleva `source_mcp + event_id + hash` verificable contra la fuente original; el informe IR diferencia claramente eventos verificados vs interpretación del agente |
| Agente con `host:isolate` aísla servidor productivo por FP | agentregistry + kagent | scopes de EDR limitados a `alerts:read`, `processes:read`; `host:isolate`, `credential:reset`, `session:kill` **no publicados** al agente; contención requiere ticket humano L3 |
| Detalles del incidente + TTPs del atacante procesados por LLM público → inteligencia del atacante fuga | agentgateway | tag `case-severity=critical` fuerza modelo on-prem; TTPs y hashes marcados `intel-sensitive` deny egress; audit trail NIS2-grade |
| PII de usuarios afectados en timeline (**GDPR art. 34 · notificación de brecha**) | agentgateway | `pii-redact` sustituye emails/DNIs por handles pseudonimizados en el timeline compartido; mapeo pseudonim↔identidad solo accesible al IR lead |
| Herramienta no aprobada procesa el case → exposición del incidente en curso (**NIS2 · secreto de la investigación**) | agentregistry | catálogo con solo modelos con DPA firmado + data residency EU; consumer-tier deny; el registry es la evidencia audit-ready para el regulador |
