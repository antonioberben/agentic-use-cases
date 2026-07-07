# Caza de amenazas (*threat hunting*)

> **Rol:** it-seguridad · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Hipótesis vaga ("posible C2 saliente desde finanzas") → consultas concretas a la telemetría.

**Cómo resolverlo.**

- *Plataformas:* Sentinel KQL Copilot, Splunk SPL AI Assistant, Chronicle YARA-L assist.
- *Local:* Ollama + Qwen2.5-Coder 32B (KQL, SPL, SQL).
- *Claude Code:* repo `hunting/` con libreria de queries y `AGENTS.md`.
- *MCPs:* `mcp-sentinel-kql` o `mcp-splunk-spl` (validación de sintaxis sobre schema, sin ejecutar).

**Prompt:** *"Genera consultas KQL (o SPL) para detectar [hipótesis]. Cada una con: descripción, fuente requerida, umbrales, FPs conocidos. NO combines hipótesis en una consulta."*

Valida cada query antes de ejecutar; sintaxis correcta + semántica equivocada = miles de FPs o ocultar TPs.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por hunt | 12 h | 3 h |
| Queries operacionalizadas/trim | 4 | 20 |
| % hunts con detección nueva | 15% | 40% |

*Fórmula:* `(9) h × 20 hunts/año = 180 h/año por hunter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si ejecutas query semánticamente equivocada, sobrecarga el SIEM o pierde TPs.*
- *Si la hipótesis del hunt contiene IOC interno embargado y va a LLM público, expones inteligencia.*

Cubierto en la **arquitectura de remediación (bloque 5)** con validación obligatoria pre-ejecución y allow-list de modelos para IOCs internos.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* (aplicado a KQL/SPL) + *A2* para acciones sensibles (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `hunt-composer` genera queries pero **no las ejecuta** contra el SIEM sin validación: primero pasa por `mcp-sentinel-kql` / `mcp-splunk-spl` en modo `validate-syntax-only`, luego `dry-run` con LIMIT reducido, luego el hunter firma la ejecución completa (`query:execute`, gate humano). Un sub-agente **`hypothesis-validator`** (A2A, SPIFFE separado) contrasta los hallazgos contra la telemetría para reducir falsos positivos antes del handoff.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Query semánticamente equivocada sobrecarga SIEM o oculta TPs | agentevals + agentgateway | validador determinista sobre schema del SIEM antes de `execute`; query sin filtro temporal o con JOIN cartesiano rechazada; librería de queries golden en `hunting/tests/` |
| IOC embargado (info compartida por CCN-CERT o ISAC) enviado a LLM público (**NIS2 art. 29 · TLP:RED**) | agentgateway | tag `tlp=red` en el input → routing forzado a modelo on-prem; IOCs con `embargo=true` deny para egress a proveedor externo; log con retención NIS2 |
| Agente ejecuta queries destructivas o exportaciones masivas (data exfiltration por el propio hunter) | kagent + agentgateway | scope del MCP restringido a `queries:read`; queries con `export:` o `output:csv` rechazadas en el gateway; volumen > 100k rows requiere aprobación L2 |
| Hipótesis del hunt sensible (nombre de ejecutivo objetivo de spear-phishing) filtrada a LLM externo | agentgateway | `pii-redact` sobre nombres propios en la hipótesis antes de mandarla al LLM; hunter usa alias `subject:executive-A` que se resuelve solo en la ejecución local |
| Query legítima pero coste computacional alto no controlado | agentgateway | rate-limit y quota por hunter en el MCP del SIEM; presupuesto mensual por hunt con corte automático |
