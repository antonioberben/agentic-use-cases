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

Cubierto en la **arquitectura de remediación (bloque 5)** con plantillas validadas, prohibición de preguntas discriminatorias y borrado post-proceso.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-interview-prep` sintetiza CV + JD + competencias sobre `mcp-greenhouse` (o `mcp-workday-recruiting`) y `mcp-graph-files` para generar un guion de preguntas — **no puntúa ni predice rendimiento**; el entrevistador valida el guion.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Predicción de rendimiento futuro a partir del CV (EU AI Act Anexo III alto riesgo) | agentgateway | prompt guard de salida bloquea patrones "predice desempeño/probabilidad de éxito"; la salida se limita a preguntas |
| Preguntas discriminatorias (situación familiar, edad, planes personales) (Dir. 2000/78/CE) | agentevals | LLM-as-judge con rubric de no discriminación; `bias_score > umbral` bloquea el handoff del guion |
| Batería guardada junto al CV identificado y reutilizada en decisiones (GDPR, limitación de finalidad) | agentgateway | `mcp-greenhouse` con scope `candidates:read` sin escritura; cache TTL corto por proceso y borrado post-proceso |
| CV con PII enviado al proveedor del modelo | agentgateway | detección y redaction de identidad (nombre, edad, género) antes del request al LLM |

## Referencias

- EU AI Act Anexo III (empleo = alto riesgo), Dir. 2000/78/CE (no discriminación), GDPR (limitación de finalidad). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
