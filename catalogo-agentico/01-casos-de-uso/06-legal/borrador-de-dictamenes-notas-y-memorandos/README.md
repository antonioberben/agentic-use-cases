# Borrador de dictámenes, notas y memorandos

> **Rol:** legal · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Dictamen de 6-15 páginas a partir de notas dispersas, hechos del cliente y normativa. Hoy son 2-4 horas de redacción tras la fase de análisis.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre las notas y la conclusión que defiendes. Borrador entero sin salir de tu equipo.
- *Copilot Word:* aporta hechos + norma + conclusión + plantilla del dictamen. Copilot redacta.
- *Claude Code:* repo `dictamenes/` con plantillas, ejemplos previos y `AGENTS.md` con el tono interno.
- *Harvey, Spellbook:* asistentes jurídicos especializados en redacción de dictamen.
- *MCPs:* `mcp-vlex` y `mcp-aranzadi` (norma citada, `law:read`), `mcp-graph-files` (dictámenes previos, `precedents:read`), `mcp-dms` (`memo:write`, finalización del dictamen en el gestor documental bajo HITL).

**Regla:** la conclusión la decides tú **antes** de pedir el dictamen. La IA no decide el sentido; lo articula.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas redacción primer borrador | 3 h | 45 min |
| Iteraciones hasta versión final | 4 | 2 |
| Cobertura de norma citada | 80% | 100% |
| Errores de cita en versión final | 8% | 0% |

*Fórmula:* `(2,25) h × 80 dictamenes/año = 180 h/año por abogado`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo decide la conclusión y firmas un dictamen articulado en sentido contrario al que defenderías, fallo profesional directo.*
- *Si los hechos del cliente viajan a una herramienta no aprobada, posible pérdida de privilegio.*
- *Si el agente "infiere" hechos del contexto del cliente sin pedírtelo, firmas un dictamen con hechos inventados.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de herramientas que preserven privilegio, identidad del agente, gate humano de conclusión y trazabilidad.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `dictamen-drafter` recibe **conclusión fijada por el abogado** como input obligatorio y solo redacta articulación. No propone, no infiere hechos: si un hecho no está en las notas, escribe `[HECHO A CONFIRMAR]` y no lo rellena.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Modelo decide conclusión → dictamen firmado en sentido opuesto al que defenderías (**deontología · responsabilidad profesional**) | kagent | input schema obligatorio con campo `conclusion_by_lawyer: string`; sin ese campo el agente rechaza la invocación con `422` |
| Hechos del cliente a herramienta no aprobada → pérdida de privilegio | agentregistry + agentgateway | catálogo restringido a proveedores con DPA + no-training; `pii-redact` sobre nombres del cliente en logs (hashing pseudonimizado) |
| Agente "infiere" hechos de contexto → dictamen con hechos inventados | agentevals | eval set de 30 dictámenes golden; validador determinista comprueba que cada hecho del dictamen aparece textualmente en las notas de entrada; miss → `[HECHO A CONFIRMAR]` |
| Cita normativa inventada (`art. X inexistente`) | agentgateway + agentevals | validador A2A contra `mcp-vlex`/`mcp-aranzadi` por CELEX/BOE; cita no resoluble → línea eliminada |
| Estilo/tono del despacho perdido → dictamen "genérico" no defendible | agentgateway | policy `style-guide` inyecta `AGENTS.md` del repo `dictamenes/` con tono interno; deriva estilística detectada por eval de similitud contra corpus de dictámenes previos |
