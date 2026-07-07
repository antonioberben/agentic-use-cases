# Categorización de gastos y detección de duplicados

> **Rol:** finanzas · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Extracto de tarjeta corporativa o AP file con 2.000 líneas. Hay que categorizar, detectar duplicados (mismo proveedor + mismo importe ±7 días), y marcar lo raro.

**Cómo resolverlo.**

- *Local:* Ollama sobre el CSV enmascarado (sin nombres reales si no aprobado). Categorización por regex + LLM.
- *Copilot Excel:* fórmulas de categorización asistida.
- *Plataformas nativas:* **Brex AI**, **Ramp AI**, **Spendesk**, **SAP Concur con AI**. Ya integran detección de duplicados, fraude y categorización.
- *MCPs:* `mcp-concur`, `mcp-coupa`, `mcp-graph-files`. Solo lectura.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de categorización | 6 h/mes | 1 h |
| % duplicados detectados antes de pago | 60% | 95% |
| Errores de categorización contable | 8% | < 2% |

*Fórmula:* `(6 − 1) h × 12 = 60 h/año por contable`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene escritura sobre Concur/Coupa, un "marcar como pagado" mal ejecutado libera pagos.*
- *Si subes el AP file con proveedores reales a una herramienta no aprobada, expones la red de proveedores y sus condiciones (información comercial sensible).*
- *Si el modelo categoriza mal sistemáticamente, los reportes a hacienda salen sesgados.*

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano antes de pagos, identidad propia del agente, scopes de lectura y observabilidad.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `ap-classifier` categoriza líneas del AP file y detecta duplicados por firma (proveedor + importe ± 7 días); un validador A2A `anomaly-validator` revisa outliers y duplicados antes de proponer cualquier transición de estado. El pago **nunca** lo libera el agente.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Auto-marcar `pagado` en Concur/Coupa libera pago sin gate | agentgateway + kagent (OBO) | `mcp-concur` sin `expense:approve`; toda transición de estado requiere HITL del pagador con OBO |
| Categorización IVA errónea → declaración incorrecta a hacienda (**LGT · AEAT · Modelo 303**) | agentevals | eval set con 200 casos golden por tipo de IVA (21/10/4/0/exento); accuracy `< 98%` bloquea el release del modelo |
| Fuga de red de proveedores + condiciones (información competitiva) | agentgateway | hash determinista sobre `proveedor_nif`; el LLM ve `PROV_a1b2` no la razón social |
| Proveedor autónomo (persona física) → PII (**GDPR art. 6 · LOPDGDD**) | agentgateway | prompt guard con perfil `spanish-pii` (NIF, IBAN, dirección) antes del LLM |
| Falso positivo de duplicado dispara reclamación al proveedor | agentevals | umbral de confianza `> 0.9`; entre 0.5-0.9 pasa a `revisión`, nunca `duplicado`; `< 0.5` se descarta |
