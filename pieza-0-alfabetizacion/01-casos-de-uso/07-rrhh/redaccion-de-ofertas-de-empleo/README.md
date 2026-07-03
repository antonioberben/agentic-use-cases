# Redacción de ofertas de empleo

> **Rol:** rrhh · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Oferta del puesto anterior, copiada y adaptada. Lenguaje sesgado ("rockstar", "ninja", "nativo"), requisitos infl­ados, sin marca empleadora. Conversión baja.

**Cómo resolverlo.**

- *Local:* Ollama con plantilla + descripción del puesto + banda salarial. Genera oferta inclusiva.
- *Copilot Word:* base + Copilot Chat. *"Redacta oferta inclusiva (lenguaje neutro), estructura: misión, qué harás, qué buscamos, qué ofrecemos. Evita 'rockstar', 'ninja', 'nativo'. Marca como opcionales requisitos que excluyan perfiles válidos."*
- *Claude Code:* repo `vacantes/` con plantillas y `AGENTS.md` con guía de lenguaje inclusivo.
- *Plataformas:* **Textio**, **Datapeople**, **Gender Decoder** para test de sesgo posterior.
- *MCPs:* `mcp-graph-files` (plantillas y ofertas anteriores), `mcp-workday` (banda salarial del puesto en lectura).

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

Cubierto en **Pieza 2** con gate humano en publicación y test de sesgo automatizado pre-publicación.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
