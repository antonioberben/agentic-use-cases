# Preparación de entrevistas

> **Rol:** rrhh · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Entrevista en 1 hora. Preguntas tipo que se repiten de memoria y no profundizan. Sin diferenciar técnica de conductual.

**Cómo resolverlo.**

- *Local:* Ollama con CV + JD + competencias clave.
- *Copilot M365:* CV en SharePoint + JD, Copilot Chat. *"Genera batería: 5 técnicas alineadas al stack, 5 conductuales (STAR) sobre competencias clave, 3 situacionales sobre dilemas del rol. Marca qué busca cada pregunta."*
- *Claude Code:* repo `entrevistas/` con `AGENTS.md` definiendo competencias por familia.
- *MCPs:* `mcp-greenhouse` o `mcp-workday-recruiting` (CV en lectura), `mcp-graph-files` (banco de preguntas).

NO le pidas predecir rendimiento futuro a partir del CV → prohibido por EU AI Act salvo con garantías.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Min de preparación por entrevista | 30 | 5 |
| % entrevistas con guion estructurado | 40% | 95% |
| Calidad de calibración entre entrevistadores | medida base | +30% |

*Fórmula:* `(25) min × 400 entrevistas/año = 167 h/año por equipo`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo genera preguntas sesgadas (situación familiar, edad, planes personales), riesgo discriminación.*
- *Si la batería se guarda con el CV identificado y se usa en futuras decisiones, tratamiento más allá de finalidad.*

Cubierto en **Pieza 2** con plantillas validadas, prohibición de preguntas discriminatorias y borrado post-proceso.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
