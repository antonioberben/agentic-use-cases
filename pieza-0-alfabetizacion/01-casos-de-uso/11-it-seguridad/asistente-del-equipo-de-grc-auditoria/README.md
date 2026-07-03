# Asistente del equipo de GRC / auditoría

> **Rol:** it-seguridad · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Cuestionarios de cliente (300 preguntas), evidencias para auditor, gap assessments. Hoy: equipo GRC saturado en ciclos de auditoría.

**Cómo resolverlo.**

- *Plataformas:* **Vanta AI**, **Drata AI**, **Secureframe AI**, **Hyperproof**, **OneTrust**, **AuditBoard**.
- *Claude Code:* repo `grc/` con evidencias, políticas y `AGENTS.md`.
- *Copilot M365:* Copilot Chat sobre repositorio de evidencias.
- *MCPs:* `mcp-vanta`, `mcp-drata`, `mcp-confluence` (controles documentados), `mcp-graph-files`.

**Prompt:** *"Para esta pregunta del auditor/cliente, busca evidencia o política aplicable. Devuelve respuesta más reciente aprobada con cita. Si no hay, marca [BORRADOR]. NO combines respuestas de controles distintos."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días por cuestionario de cliente | 5 | 1 |
| % preguntas con evidencia citada | 60% | 100% |
| Tiempo a SOC 2 / ISO renewal | medida base | -40% |
| Coste auditoría externa | medida base | -25% |

*Fórmula:* `(4 días × 8h) × 40 cuestionarios/año = 1 280 h/año por GRC team`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo combina respuestas de productos distintos, firmas un compromiso fuera del scope.*
- *Si la evidencia se sube a herramienta no aprobada, expones detalles de controles.*
- *Si el agente firma cuestionario sin gate, vinculación contractual.*

Cubierto en **Pieza 2** con gate humano CISO en firma, allow-list de plataformas con DPA y validación de control vigente vs deprecated.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
