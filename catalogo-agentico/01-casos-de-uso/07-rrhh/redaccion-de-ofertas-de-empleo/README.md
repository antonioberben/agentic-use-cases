# Redacción de ofertas de empleo

> **Rol:** rrhh · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Oferta del puesto anterior, copiada y adaptada. Lenguaje sesgado ("rockstar", "ninja", "nativo"), requisitos infl­ados, sin marca empleadora. Conversión baja.

**Cómo resolverlo.**

- *Local:* Ollama con plantilla + descripción del puesto + banda salarial. Genera oferta inclusiva.
- *Copilot Word:* base + Copilot Chat. *"Redacta oferta inclusiva (lenguaje neutro), estructura: misión, qué harás, qué buscamos, qué ofrecemos. Evita 'rockstar', 'ninja', 'nativo'. Marca como opcionales requisitos que excluyan perfiles válidos."*
- *Claude Code:* repo `vacantes/` con plantillas y `AGENTS.md` con guía de lenguaje inclusivo.
- *Plataformas:* **Textio**, **Datapeople**, **Gender Decoder** para test de sesgo posterior.
- *MCPs:* `mcp-graph-files` (plantillas y ofertas anteriores, `templates:read`), `mcp-workday` (banda salarial del puesto en lectura, `salary:read`), `mcp-ats` (`job:publish` con gate humano de RRHH).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo por oferta | 60 min | 15 min |
| Score de inclusión (Textio/equivalente) | 60 | 85+ |
| % candidaturas femeninas (puestos tech) | 18% | 30%+ |
| Tasa de conversión oferta → candidatura | medida base | +25% |

*Fórmula:* `(45) min × 80 ofertas/año = 60 h/año por recruiter`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si la oferta filtra detalles internos de retribución no comunicados, riesgo laboral.*
- *Si el modelo introduce requisitos discriminatorios sutiles (edad implícita por años exigidos), riesgo Ley de Igualdad.*
- *Si la oferta se publica sin validación, una promesa salarial errónea es vinculante.*

Cubierto en la **arquitectura de remediación (bloque 5)** con gate humano en publicación y test de sesgo automatizado pre-publicación.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-job-posting` redacta una oferta inclusiva a partir de `mcp-graph-files` (plantillas) y la banda salarial de `mcp-workday` — deja el borrador en draft; **la publicación la firma RRHH**.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Requisitos discriminatorios sutiles (edad implícita por años exigidos, lenguaje sesgado tipo "rockstar") (Dir. 2000/78/CE, Ley de Igualdad) | agentevals | LLM-as-judge con rubric de inclusión (estilo Textio); `bias_score > umbral` bloquea el handoff |
| Filtración de retribución interna no comunicada o detalles internos | agentgateway | la banda salarial de `mcp-workday` se trata como confidencial; prompt guard de salida redacta importes no aprobados para publicación |
| Publicación automática con promesa salarial vinculante | agentgateway + kagent (OBO) | `mcp-graph-files` con scope `draft`; la publicación vía `mcp-ats` (`job:publish`) requiere HITL de RRHH y OBO |
| Coste desbordado al generar múltiples variantes de la oferta | agentgateway | cuota por vacante y semantic caching de variantes cercanas |

## Referencias

- Dir. 2000/78/CE (no discriminación), Ley Orgánica 3/2007 de Igualdad, EU AI Act (empleo). *Citas T1.*
- Marco técnico: OWASP LLM06 (Sensitive Information Disclosure).
