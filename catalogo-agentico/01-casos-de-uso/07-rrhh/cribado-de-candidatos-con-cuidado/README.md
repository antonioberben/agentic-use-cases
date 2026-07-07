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
| `mcp-shortlist` | ATS MCP | `shortlist:advance` con gate humano — el avance lo firma el recruiter |

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

Cubierto en la **arquitectura de remediación (bloque 5)** con identidad de agente, prohibición técnica de scopes de descarte automatizado, DPIA obligatoria, *bias testing* periódico y información a comité de empresa (Ley Rider).

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de compliance* + *A2 — Triage con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-ta-ro` **resume** cada CV en pocas líneas — **nunca puntúa, rankea ni descarta**; el descarte y el avance de shortlist los firma el recruiter. Un sub-validador de sesgo (bias-validator) audita el resumen antes del handoff.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Puntuación o descarte automático de candidatos (GDPR art. 22, EU AI Act Anexo III alto riesgo) | agentgateway + kagent (OBO) | `mcp-greenhouse` con scope `candidates:read`; `reject:write` y `score:write` **fuera de la allowlist**; toda decisión la firma el recruiter con OBO |
| Sesgo en el resumen que reintroduce género/edad/origen (Dir. 2000/78/CE no discriminación) | agentevals | bias-validator LLM-as-judge con rubric de no discriminación; `bias_score > umbral` bloquea el handoff al recruiter |
| Anonimización superficial (queda foto, nombre, fecha de graduación) | agentgateway | prompt guard detecta y redacta identidad (nombre, foto, edad, género) sobre `mcp-graph-files` antes del LLM |
| Retención de CVs para entrenar el modelo (tratamiento sin base jurídica) | agentgateway + Istio | política `no-train` hacia el proveedor; cache scoping por vacante con TTL corto; egress solo al modelo aprobado vía ztunnel |
| Falta de traza segregada para el comité de empresa (Ley Rider) | agentregistry + agentgateway | el agente corre bajo SPIFFE `svc-ta-ro` (no tu usuario); OTel per-invocation; `agentregistry` lo inventaría para la información al comité |

## Referencias

- GDPR art. 22 (decisiones automatizadas), EU AI Act Anexo III (empleo = alto riesgo), Dir. 2000/78/CE (no discriminación), Ley Rider (información al comité de empresa). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
