# Borrador de dictámenes, notas y memorandos

> **Rol:** legal · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Dictamen de 6-15 páginas a partir de notas dispersas, hechos del cliente y normativa. Hoy son 2-4 horas de redacción tras la fase de análisis.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre las notas y la conclusión que defiendes. Borrador entero sin salir de tu equipo.
- *Copilot Word:* aporta hechos + norma + conclusión + plantilla del dictamen. Copilot redacta.
- *Claude Code:* repo `dictamenes/` con plantillas, ejemplos previos y `AGENTS.md` con el tono interno.
- *Harvey, Spellbook:* asistentes jurídicos especializados en redacción de dictamen.
- *MCPs:* `mcp-graph-files` (dictámenes previos), `mcp-vlex` (norma citada).

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

Cubierto en **Pieza 2** con allow-list de herramientas que preserven privilegio, identidad del agente, gate humano de conclusión y trazabilidad.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
