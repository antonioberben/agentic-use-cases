# TL03 — Cumplimiento NIS2 / reporte al regulador

## Identificación

- **Rol principal**: CISO telco, oficial de cumplimiento, equipo regulatorio.
- **Sectores**: telco (entidad esencial NIS2), también energía, transporte, sanidad, infra digital.
- **Patrón técnico**: Lab 6 — agente regulatorio.
- **Madurez recomendada**: nivel 2 piloto en mapeo; nivel 3 antes de basar reporte al regulador.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

NIS2 (Directiva (UE) 2022/2555) obliga a entidades esenciales a gestión de riesgos, reporte de incidentes significativos al regulador (en España, INCIBE-CERT / CCN-CERT según ámbito) en plazos breves (alerta temprana 24h, notificación 72h, informe final 1 mes). El agente extrae obligaciones, mapea a controles, ayuda a clasificar significancia del incidente y prepara borrador de reporte.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre Directiva + trasposición nacional + procedimientos internos. Prompt: *"Para el incidente [ID]: ¿es 'significativo' NIS2 art. 23? Justifica con los criterios (impacto en disponibilidad, pérdidas económicas, número de usuarios afectados, daño material/inmaterial). **No envíes; prepara borrador.**"*

### 2.2 Copilot

Microsoft Security Copilot + Sentinel para enriquecer datos del incidente; Copilot M365 para redactar reporte.

### 2.3 Claude Code

Repo `nis2/` con `AGENTS.md` que define criterios de significancia, plazos, plantilla de reporte oficial.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-sentinel` | Sentinel MCP | `vault://ciso/sentinel-ro` | `incidents:read` |
| `mcp-eurlex` | EUR-Lex MCP | público | `documents:read` |
| `mcp-grc` | ServiceNow GRC | `vault://ciso/grc-draft` | `report:draft` |

### 2.5 Alternativas

Claude Projects con corpus normativo + datos del incidente sanitizados.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a clasificación de significancia | 4 h | 30 min |
| Tiempo a borrador de reporte (24h/72h/1m) | horas | minutos |
| % campos del reporte completos en primer borrador | 60% | 95% |
| Cumplimiento de plazo regulatorio | a veces tarde | siempre a tiempo |

Fórmula: *cumplir plazo NIS2 evita sanción (hasta 10M€ o 2% facturación global). (estimación cualitativa, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo clasifica como 'no significativo' lo que sí lo es por sesgo de no-reportar, incumplimiento NIS2 + sanción."*
- *"Si el reporte contiene datos del incidente que también afectan a la confidencialidad del cliente (datos personales comprometidos) y se procesa en LLM externo sin acuerdo, fuga adicional al propio incidente."*
- *"Si el agente envía automáticamente al regulador (scope `submit`), reporte no revisado por humano — fallo de gobernanza."*

**Riesgos típicos:** clasificación errónea de significancia, fuga adicional en el manejo del reporte, envío automático sin revisión, corpus normativo desactualizado.

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo B — Sectorial telco.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `nis2-reporter` clasifica significancia del incidente contra criterios NIS2 art. 23 y prepara borradores 24h/72h/1-mes. **Nunca envía**: prepara, humano CISO firma.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Modelo clasifica "no significativo" lo que sí lo es (**NIS2 art. 23 · sanción hasta 10M€ o 2% facturación**) | agentevals | eval set con 100 incidentes históricos pre-clasificados por oficial NIS2; el agente propone; disagreement > umbral → `escalate:ciso` obligatorio antes de aceptar `no-significativo` |
| Datos personales del incidente a LLM externo → fuga adicional al propio breach (**GDPR art. 34 · NIS2 art. 23**) | agentgateway | tag `incident-in-progress=true` fuerza modelo on-prem; `pii-redact` sobre datos de usuarios afectados; audit trail retenido 10 años según NIS2 |
| Envío automático al regulador (CCN-CERT/INCIBE-CERT) sin revisión humana | kagent | política `report:submit=deny`; el agente escribe a `reports/drafts/{24h,72h,1m}/`; submit al regulador requiere firma CISO + oficial NIS2 |
| Corpus normativo desactualizado (RD de trasposición nacional cambia) | agentgateway | `mcp-eurlex` y MCP de BOE obligados a devolver `version_date + status=in-force`; documentos con `status=draft` rechazados |
| Plazo 24h no cumplido por bloqueo del agente en revisión | agentgateway | SLA interno: el borrador 24h debe estar en `drafts/` en < 2h; alerta a CISO si `t_borrador > 2h`; el gate humano corre en paralelo, no en serie |

## Referencias

- Directiva (UE) 2022/2555 NIS2, trasposición nacional (RD pendiente al cierre), guías ENISA, CCN-CERT, INCIBE-CERT. *Citas T1.*
