# Cribado de candidatos (con cuidado)

> **Rol:** rrhh · **Caso 2.1** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Vacante popular con 300 candidaturas. Hoy: 6-10 h de lectura inicial, riesgo de descartar buenos perfiles por fatiga.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre CVs en PDF anonimizados parcialmente (sin nombre, género, foto, edad). *"Resume cada CV en 5 líneas: experiencia, stack, años en rol equivalente, idiomas, ubicación. No clasifiques, no puntúes, no descartes."*
- *Copilot M365:* CVs en SharePoint, Copilot Chat con prompt arriba. Misma regla: resumir, no puntuar.
- *Claude Code:* repo con `AGENTS.md` que prohíbe puntuación y descarte automático.
- *ATS con IA (con auditoría):* **Workday Recruiting AI**, **SuccessFactors**, **Greenhouse AI**, **Lever**. Pide documentación: cómo se entrena, *bias testing*, qué automatiza.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-greenhouse` | `npx mcp-greenhouse`, `vault://gh/ta-ro` | `candidates:read` — nunca `reject:write` ni `score:write` |
| `mcp-graph-files` | M365 oficial | `Files.Read.All` sobre carpeta de la vacante |

- *Alternativa:* Claude.ai con bloques de CVs anonimizados. Forma incorrecta: *"Puntúa del 1 al 10 y descarta inferiores a 7"* → decisión automatizada ilegal (art. 22 GDPR, EU AI Act alto riesgo).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por criba de 300 CVs | 8 h | 2 h |
| Diversidad en shortlist (género, origen) | medida base | +20-30% |
| % candidatos contactados en 48 h | 40% | 90% |
| Tasa de error de descarte (revisión a posteriori) | 8% | < 3% |

*Fórmula:* `(6) h × 30 vacantes/año = 180 h/año por recruiter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo puntúa y descarta, infringes art. 22 GDPR + EU AI Act Anexo III (alto riesgo).* Sanción AEPD documentada en otros sectores.
- *Si el ATS retiene CVs para entrenar el modelo, tratamiento adicional sin base jurídica.*
- *Si el agente accede con tu usuario y no `svc-ta-ro`, no hay traza segregada para el comité de empresa.*
- *Si la anonimización es superficial (queda foto, género en el nombre, fecha de graduación), el sesgo persiste.*

Cubierto en **Pieza 2** con identidad de agente, prohibición técnica de scopes de descarte automatizado, DPIA obligatoria, *bias testing* periódico y información a comité de empresa (Ley Rider).

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
