# Borrador de políticas, *runbooks* y procedimientos

> **Rol:** it-seguridad · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 30 políticas del SGSI a mantener actualizadas + runbooks IR. Hoy: meses entre revisiones.

**Cómo resolverlo.**

- *Local:* Ollama con plantillas internas + norma aplicable.
- *Copilot Word:* política existente + norma de referencia → borrador.
- *Claude Code:* repo `politicas-seg/` y `runbooks-ir/` con plantillas y diff.
- *Plataformas GRC con IA:* **Vanta AI**, **Drata AI**, **Secureframe AI**, **OneTrust**.
- *MCPs:* `mcp-graph-files` (políticas previas), `mcp-confluence` (procedimientos), `mcp-vanta` o `mcp-drata` (mapping controles).

**Prompts:**
- Política: *"Borrador alineado con [ISO 27001 / NIST CSF / ENS / NIS2 / DORA]. Alcance, definiciones, controles, roles, métricas, revisión. Marca [REVISAR] decisiones de negocio."*
- Runbook: *"Runbook para [incidente]. Detección, contención, erradicación, recuperación, lecciones aprendidas. Cada paso con responsable, herramienta, criterio de éxito. Sin pasos genéricos."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por política | 16 h | 3 h |
| Políticas en ciclo de revisión al día | 60% | 95% |
| Runbooks con dueño asignado | 50% | 100% |

*Fórmula:* `(13) h × 30 políticas/año = 390 h/año por GRC analyst`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la política se redacta con controles "rellenados" por el modelo, firmas obligaciones imposibles.*
- *Si subes política borrador (estructura de control interno) a herramienta no aprobada, expones postura.*

Cubierto en **Pieza 2** con gate humano CISO/CIO en aprobación y allow-list para borradores.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
