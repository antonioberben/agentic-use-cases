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

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano CISO/CIO en aprobación y allow-list para borradores.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `secops-policy-drafter` produce borrador de política SGSI o runbook IR desde plantilla + norma aplicable, leyendo con MCP en lectura `mcp-graph-files` (políticas), `mcp-confluence` (procedimientos) y `mcp-vanta` (controles). Un sub-agente **`control-validator`** (A2A, SPIFFE separado) verifica cada control citado contra la norma antes del handoff. El commit a `politicas-seg/publicadas/` (`mcp-git-policies`, `publish:write`) requiere firma CISO/CIO.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Modelo "rellena" controles inexistentes → política firma obligaciones imposibles de cumplir (**ISO 27001 A.5 · NIS2 art. 21**) | agentevals | validador A2A: cada control citado (ISO 27001 A.X, NIST CSF ID.X) resuelve a URL oficial de la norma + versión; miss → sección marcada `[CONTROL A VERIFICAR]` |
| Borrador con estructura de control interno (postura SGSI) a herramienta no aprobada → exposición para atacante | agentgateway | procesamiento on-prem forzado (`data-classification=security-posture`); egress a LLM externo deny; salida a proveedor SaaS requiere clasificación `public-summary` |
| Runbook IR con pasos genéricos ("aísla el host") sin responsable ni criterio de éxito | agentevals | eval determinista: cada paso del runbook debe tener `owner`, `tool`, `success_criteria` no vacíos; miss → `[REVISAR - PASO GENÉRICO]` |
| Publicación directa saltándose comité de seguridad | kagent | política `policy:publish=deny`; el agente escribe a `politicas-seg/borradores/`; commit a `publicadas/` requiere flujo con firma `role=ciso` + `role=cio` |
| Incoherencia con políticas existentes (política nueva contradice política antisoborno vigente) | agentevals | eval "consistency-check" cruza borrador contra corpus de políticas SGSI vigentes; contradicciones detectadas → `escalate:grc-lead` |
