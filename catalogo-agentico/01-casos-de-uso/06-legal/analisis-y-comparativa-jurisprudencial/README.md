# Análisis y comparativa jurisprudencial

> **Rol:** legal · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Antes de orientar al cliente interno hay que saber cómo han resuelto los tribunales un punto concreto. Línea mayoritaria, voces discrepantes, tendencia reciente.

**Cómo resolverlo.**

- *Plataformas legales con IA (única vía fiable):* **vLex Vincent**, **Westlaw Edge AI**, **Lexis+ AI**, **Aranzadi Indexa**, **Harvey** (sobre corpus jurisprudencial). Tienen citas verificadas.
- *Claude Code:* sobre PDFs de sentencias ya descargadas y verificadas; nunca pidiendo al modelo que "encuentre" jurisprudencia.
- *MCPs:* `mcp-vlex`, `mcp-westlaw`, `mcp-lexis` (jurisprudencia, `caselaw:read`, cita verificable); `mcp-dms` (`memo:write`, escritura del informe comparativo en el gestor documental bajo HITL). Lectura con cita verificable; la escritura del informe pasa por aprobación humana.
- *Alternativa:* Claude.ai con sentencias adjuntas manualmente. NUNCA chats genéricos para "búscame jurisprudencia": alucinan sentencias completas con tribunal, fecha y número.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por análisis jurisprudencial | 6 h | 1,5 h |
| Sentencias revisadas por análisis | 10 | 40-60 |
| Citas verificables (100% obligatorio) | 100% | 100% |

*Fórmula:* `(4,5) h × 30 análisis/año = 135 h/año por abogado`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si citas una sentencia inventada por el modelo, sanción profesional documentada en varios despachos (EEUU, también ya casos en España).*
- *Si conectas un MCP a un proveedor jurisprudencial pero el agente "completa" cuando no encuentra, el riesgo persiste.* Validación cita-fuente obligatoria.
- *Si el agente accede con tu suscripción personal y no `svc-legal`, no hay traza para el conflict check del despacho.*

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de fuentes jurisprudenciales certificadas, validación cita-fuente obligatoria, identidad propia y prohibición explícita de chats genéricos para jurisprudencia.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `jurisprudence-analyst` **no busca** sentencias por descripción; solo opera sobre resultados de `mcp-vlex`/`mcp-westlaw`/`mcp-lexis` con `ecli_id` verificable. Sin ECLI/CENDOJ resoluble, la sentencia no entra en el análisis: no se "encuentra por vibración semántica".

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Sentencia inventada citada en escrito (**deontología · casos documentados de sanción en EEUU y España**) | agentevals + kagent | cada cita del análisis debe resolver a `ecli_id` o `CENDOJ_id` vía MCP oficial; miss → línea eliminada, no *completed*; validador A2A verifica que el fallo citado coincida con el texto de la sentencia |
| MCP conectado pero agente "completa" cuando no encuentra | agentgateway | prompt guard salida: bloquea si aparece `sentencia STS \d+/\d+` sin `ecli_id` asociado en el mismo bloque; el LLM no puede inventar identificadores porque el gateway los verifica |
| Uso de suscripción personal → sin traza para *conflict check* del despacho (**Estatuto General de la Abogacía**) | Istio ambient (SPIFFE) | mTLS identity `spiffe://.../ns/legal/sa/svc-legal`; el token de vLex/Westlaw se obtiene por OBO desde la SA del servicio, no del abogado; audit trail centralizado |
| Chats genéricos usados para "buscar jurisprudencia" | agentregistry | los MCPs de LLM de propósito general están **deny-listed** para el agente `jurisprudence-analyst`; catálogo restringido a fuentes con corpus verificado |
| Sesgo de "línea mayoritaria" cuando hay Sala discrepante reciente | agentevals | el eval obliga a reportar disidencias con `voto_particular=true` y ordenar por fecha desc; ausencia de análisis de disidencias → `escalate:senior-partner` |
