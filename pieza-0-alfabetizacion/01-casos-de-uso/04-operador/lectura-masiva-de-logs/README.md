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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
