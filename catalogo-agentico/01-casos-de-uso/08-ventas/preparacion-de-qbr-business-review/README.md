# Preparación de QBR / business review

> **Rol:** ventas · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 15 slides del QBR trimestral. Datos de uso, casos abiertos, NPS, roadmap. Hoy: recopilación manual de 8 fuentes en 6 horas.

**Cómo resolverlo.**

- *Copilot PowerPoint:* tabla de KPIs en Excel + Copilot redacta narrative.
- *Claude Code:* repo `qbr/[cliente]/` con datos exportados y plantilla.
- *Local:* Ollama sobre data extract anonimizado.
- *Plataformas CS:* **Gainsight AI**, **ChurnZero AI**, **Catalyst** generan QBR templates.
- *MCPs:* `mcp-salesforce` (oportunidades, casos), `mcp-zendesk` o `mcp-jira-servicedesk` (incidencias del cliente), `mcp-product-analytics` (uso real).

**Prompt:** *"Genera estructura QBR 10 slides: estado relación, valor entregado este trimestre (cifras), incidencias y resolución, plan próximo trimestre, peticiones pendientes, riesgos. Tono ejecutivo. Marca [DATO PENDIENTE] lo que rellene manualmente."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por QBR | 6 h | 1,5 h |
| % QBRs entregados a tiempo | 70% | 95% |
| NRR de cuentas con QBR ejecutado | medida base | +10pp |

*Fórmula:* `(4,5) h × 8 cuentas × 4 trim = 144 h/año por CSM`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si compartes el QBR pre-publicación a herramienta no aprobada, expones métricas internas del cliente.*
- *Si el modelo "inventa" un valor entregado, el QBR pierde credibilidad y pone en riesgo la renovación.*
- *Si el agente accede al sistema del cliente con tu usuario, no hay segregación.*

Cubierto en la **arquitectura de remediación (bloque 5)** con identidad propia, allow-list NDA-friendly y validación cita-fuente.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* + *A7 — Generación creativa con guardrails* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `qbr-builder` agrega uso de producto, casos e incidencias y **genera** la estructura del QBR marcando `[DATO PENDIENTE]` donde falta evidencia; el CSM completa y firma antes de presentar al cliente.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| QBR pre-publicación con métricas internas del cliente enviado a herramienta no aprobada | agentgateway + Istio | redaction de métricas identificables; `AuthorizationPolicy` L4 bloquea egress fuera del perímetro aprobado |
| Valor entregado inventado (cifra fabricada) que arriesga la renovación | kagent (A2A) + agentevals | validador cruza cada cifra contra `mcp-product-analytics`/`mcp-salesforce`; `agentevals` fuerza `[DATO PENDIENTE]` si no hay fuente |
| Acceso al sistema del cliente con el usuario del CSM (sin segregación) | kagent (OBO) + agentregistry | identidad propia del agente registrada; `mcp-zendesk`/`mcp-jira-servicedesk` con scope `read` y token del servicio, no del CSM |
| Costura research→generación: un dato no verificado se cuela en el slide narrativo | agentgateway + agentevals | el generador solo puede citar campos que el sub-agente de research ha marcado como verificados; el resto se emite como `[DATO PENDIENTE]` |
| Coste por consolidación de 8 fuentes cada trimestre | agentgateway | semantic caching de secciones estables (roadmap, plantilla) y rate limit por cuenta |

## Referencias

- NDA con cliente; GDPR (métricas y datos del cliente en el QBR). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
