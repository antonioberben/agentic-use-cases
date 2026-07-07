# Redacción de políticas internas

> **Rol:** legal · **Caso 2.3** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Primer borrador de una política (uso aceptable, privacidad, código de conducta, antisoborno, denuncias internas). Hoy es un fin de semana del responsable.

**Cómo resolverlo.**

- *Local:* Ollama con plantillas internas + marco normativo aplicable como contexto.
- *Copilot Word:* base = política existente + norma aplicable + políticas referencia. Copilot redacta borrador estructurado.
- *Claude Code:* repo `politicas/` con políticas previas, plantillas y normas; el agente genera borrador como markdown diff.
- *MCPs:* `mcp-graph-files` (`policies:read`, políticas previas), `mcp-vlex` (`law:read`, norma aplicable), `mcp-confluence` (`procedures:read`, procedimientos internos); `mcp-publish` (`policy:publish`, publicación bajo HITL del órgano competente).
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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de herramientas para legal, gate humano en publicación y workflow de aprobación por órgano competente.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `policy-drafter` produce borrador estructurado; el commit a `politicas/publicadas/` requiere el workflow de aprobación del órgano competente (comité de dirección, comisión de nombramientos, etc.).

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Modelo "rellena" obligaciones inexistentes en la norma → política publicada con artículos inventados | agentevals | validador A2A: cada obligación citada resuelve a URL BOE/EUR-Lex + artículo; miss → sección marcada `[VERIFICAR - CITA NO RESUELTA]` |
| Borrador con estrategia interna de cumplimiento fuera del perímetro (**secreto empresarial · Directiva 2016/943**) | agentgateway | egress deny para el output completo hacia LLMs externos; solo `mcp-graph-files` (SharePoint interno) puede recibir el commit; audit trail por sección |
| Publicación directa saltándose órgano competente de aprobación | kagent | política `publish:decide=deny`; el agente escribe a `politicas/borradores/`; commit a `politicas/publicadas/` requiere flow con firmas del órgano competente registradas |
| Política incoherente con políticas previas vigentes (contradice antisoborno con nueva de compras) | agentevals | eval "consistency-check" cruza el borrador contra el corpus de políticas vigentes; contradicciones detectadas → `escalate:legal-counsel` |
| Uso de IA en la política no divulgado (**AI Act art. 50 · buen gobierno corporativo**) | agentgateway | metadata `generated-with-ai=true` anexa automáticamente como campo del documento; el workflow de aprobación lo muestra explícitamente al órgano competente |
