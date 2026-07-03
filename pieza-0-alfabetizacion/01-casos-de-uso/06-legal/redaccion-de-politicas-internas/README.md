# Redacción de políticas internas

> **Rol:** legal · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Primer borrador de una política (uso aceptable, privacidad, código de conducta, antisoborno, denuncias internas). Hoy es un fin de semana del responsable.

**Cómo resolverlo.**

- *Local:* Ollama con plantillas internas + marco normativo aplicable como contexto.
- *Copilot Word:* base = política existente + norma aplicable + políticas referencia. Copilot redacta borrador estructurado.
- *Claude Code:* repo `politicas/` con políticas previas, plantillas y normas; el agente genera borrador como markdown diff.
- *MCPs:* `mcp-graph-files` (políticas previas), `mcp-vlex` o `mcp-aranzadi` (norma aplicable), `mcp-confluence` (procedimientos internos).
- *Alternativa:* Claude.ai con norma + plantilla. *"Genera borrador de política de [tema] alineado con [norma]. Estructura: ámbito, definiciones, principios, obligaciones, roles, régimen sancionador, vigencia. Marca con [REVISAR] puntos de decisión de negocio."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas primer borrador | 12 h | 3 h |
| Iteraciones hasta aprobación | 6 | 3 |
| Cobertura de obligaciones normativas | 80% | 98% |

*Fórmula:* `(12 − 3) h × 8 políticas/año = 72 h/año por legal counsel`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" obligaciones que no están en la norma, publicas una política con artículos inventados.* Verificación obligatoria.
- *Si la política se sube como borrador a una herramienta no aprobada, expones estrategia interna de cumplimiento.*
- *Si el agente publica directamente, saltas el órgano competente de aprobación.*

Cubierto en **Pieza 2** con allow-list de herramientas para legal, gate humano en publicación y workflow de aprobación por órgano competente.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
