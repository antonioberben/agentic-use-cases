# TL03 — Cumplimiento NIS2 / reporte al regulador

## Identificación

- **Rol principal**: CISO telco, oficial de cumplimiento, equipo regulatorio.
- **Sectores**: telco (entidad esencial NIS2), también energía, transporte, sanidad, infra digital.
- **Patrón técnico**: Lab 6 — agente regulatorio.
- **Madurez recomendada**: nivel 2 piloto en mapeo; nivel 3 antes de basar reporte al regulador.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo B — Sectorial telco.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Directiva (UE) 2022/2555 NIS2, trasposición nacional (RD pendiente al cierre), guías ENISA, CCN-CERT, INCIBE-CERT. *Citas T1.*
