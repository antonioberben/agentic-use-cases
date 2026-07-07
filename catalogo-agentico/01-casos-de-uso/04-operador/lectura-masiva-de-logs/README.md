# Lectura masiva de logs

> **Rol:** operador · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

200 MB de logs del servicio en una ventana de 2 h. Buscas la causa pero leerlos a ojo es inviable. Se busca: agente resume errores únicos por frecuencia, primer/último timestamp, contexto, hipótesis de causa.

## 2. Cómo resolverlo

**Local.** Para volúmenes pequeños: Llama 70B sobre logs sanitizados.

**Copilot (Splunk AI, Datadog, Elastic AI Assistant).** Camino más corto si el log vive ahí.

**Claude Code.** Repo con script de filtrado + prompt fijo: *"Resume errores únicos por frecuencia. Primer y último timestamp. Contexto típico. Hipótesis de causa. No inventes stack traces."*

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| SIEM / logs | `mcp-splunk` / `mcp-elastic` / `mcp-loki` | lectura del índice del servicio |
| Sanitización | `mcp-redact` *(propuesto)* | regex de redacción antes de mandar al modelo |

**Alternativa.** Filtrado y agrupación con `grep`/`jq`/`awk` antes; modelo solo para hipótesis.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-análisis de log de incidente | *60-120 min* | *10-20 min* |
| Errores únicos identificados | *manual: 60-70%* | *> 90%* |
| Falsas causas perseguidas | *30%* | *< 10%* |

**Fórmula:** ≈ (90 − 15) min × 8 incidentes/mes × 11 / 60 ≈ **110 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si los logs contienen tokens, cookies de sesión, JWT o claves de cliente y se mandan a modelo externo, exfiltración de credenciales. Esos tokens pueden quedar en logs del proveedor."*
- *"Si los logs incluyen PII (email, IP del usuario), tratamiento sin base jurídica y notificación a la AEPD si hay incidente."*
- *"Si el modelo inventa un stack trace plausible, persigues una causa que no existe y dejas la real."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A5 — Operacional con acciones sobre infraestructura* (variante read-only sobre logs, ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `log-reader` agrupa errores únicos por frecuencia y propone hipótesis con `first_seen`/`last_seen`. **No inventa stack traces**: si no hay evidencia en el log, no aparece en la hipótesis.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Tokens, cookies, JWT, claves de cliente en logs enviados a LLM externo → exfiltración de credenciales (**PCI-DSS req 3 · GDPR art. 32**) | agentgateway | `mcp-redact` como paso obligatorio pre-LLM: regex para `Bearer\s+[A-Za-z0-9\-_.]+`, `sk-[A-Za-z0-9]{40,}`, cookies de sesión; ejecución local antes de que el prompt salga del cluster |
| Logs con PII (email, IP) → tratamiento sin base jurídica + notificación AEPD si breach (**GDPR art. 6 · art. 33**) | agentgateway | `pii-redact` sobre `email\.pattern`, `ipv4/ipv6`, DNI/NIF; procesamiento forzado on-prem para logs con clasificación `contains-pii=true` |
| Modelo inventa stack trace plausible → SRE persigue causa fantasma | agentevals | eval determinista: cada línea de stack citada debe existir textualmente en el log de entrada (hash-lookup); miss → hipótesis descartada, no *softened* |
| Volumen: 200MB de log × N incidentes/día → coste explosivo | agentgateway | preprocesamiento local con `grep`/`jq` antes del LLM (top-K errores por frecuencia); rate-limit por operador; cache TTL 1h sobre fingerprint de log |
| Agente con scope de escritura sobre logs (borrado, modificación) → tampering de evidencia (**LECr · NIS2 art. 23**) | agentregistry | `mcp-splunk`/`mcp-elastic`/`mcp-loki` publicados con scope `read` únicamente; `delete`, `retention:modify`, `index:write` no publicados |
