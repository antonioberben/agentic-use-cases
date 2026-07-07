# Priorización del backlog

> **Rol:** manager · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tu equipo tiene 40-80 ítems en backlog y cada quincena hay que priorizar. La discusión se eterniza, los gritan más quienes más insisten, las dependencias técnicas se olvidan. Hoy entras a la reunión con un orden intuitivo y se reordena en vivo durante 90 minutos. Lo que se busca: agente lee el backlog, lo ordena por **impacto sobre objetivo del trimestre vs esfuerzo estimado**, marca los ítems con dependencias o riesgos y entrega una matriz que sirve como base de discusión, no como decisión final.

## 2. Cómo resolverlo

**Local.** Export del backlog a CSV (título, estimación, etiquetas, objetivo asociado). Ollama + Llama 3.1 8B. Prompt base: *"Ordena estos ítems por impacto sobre [objetivo Q3 = reducir TT-checkout de 8s a 3s] vs esfuerzo. Marca: (a) ítems con esfuerzo > 5 e impacto bajo → candidatos a descartar; (b) ítems con dependencia técnica explícita; (c) ítems sin objetivo claro asociado."* Buen entrenamiento; no es la decisión.

**Copilot (Microsoft 365 + Jira).** Camino más corto si Jira está conectado:

1. Copilot Chat: *"Lista los ítems abiertos del proyecto PAY con etiqueta 'Q3-checkout'. Ordena por impacto sobre el objetivo de reducir TT-checkout, frente a esfuerzo. Devuelve top 10 con justificación."*
2. Variante para la reunión: *"De los ítems con esfuerzo > 5, ¿cuáles deberíamos cuestionar?"*

**Claude Code (o agente de escritorio).** Repo `backlog-prio/` con `AGENTS.md` que **prohíbe modificar Jira** (solo lectura + propuesta). Plantilla `templates/prio.md`. Comando: *"Propuesta de orden del backlog Q3 desde `inputs/backlog.csv`. Justifica top 10."*

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Jira / Linear | `@modelcontextprotocol/server-atlassian` / `mcp-linear` | `npx @modelcontextprotocol/server-atlassian` | `read:jira-work` (no `write:jira-work`) |
| OKR | `mcp-graph-goals` *(propuesto)* / Notion | `npx mcp-graph-goals` | `Goals.Read` |
| Notas de producto | `@notionhq/mcp` | `npx -y @notionhq/mcp` | lectura del espacio del equipo |

Identidad propia (`svc-manager-prio-agent`). **Crítico:** solo lectura. Reordenar el backlog real es decisión del equipo en la reunión, no del agente.

**Alternativa.** Export manual del backlog a CSV → Claude/ChatGPT/Gemini con el prompt base. Sirve perfectamente.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| Duración reunión de priorización | Minutos | *60-90 min* | *30-45 min* (entras con propuesta) |
| % ítems con justificación de prioridad | Disciplina | *40%* | *> 85%* |
| Ítems con dependencia detectada antes del sprint | Reducción de bloqueos en vuelo | *30%* | *> 70%* |
| Cambios de prioridad mid-sprint | Indicador de mala priorización | base | reducción moderada |

**Fórmula simple:**

```
Ahorro_anual_min ≈ (T_base − T_nuevo) × ciclos_prio_año
```

Ejemplo: (75 − 35) min × 24 ciclos/año = **960 min/año ≈ 16 h/año** por manager. Mayor valor: reducción de cambios mid-sprint y bloqueos detectados antes.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si el MCP tuviera scope `write:jira-work` y el agente reordenara el backlog sin que el equipo lo ratifique, le estoy quitando voz a las personas que mejor conocen los detalles técnicos. La decisión queda firmada como mía y nadie sabe que fue del agente."*
- *"Si pego el backlog en un asistente público no aprobado, estoy sacando hoja de ruta de producto a un endpoint sin contrato. En empresas cotizadas, plan de roadmap puede ser información sensible (MAR / no público todavía)."*
- *"Si el modelo prioriza por sesgo de tamaño de descripción (lo que tiene texto largo se prioriza) en lugar de impacto real, perpetuo el sesgo de 'el que mejor escribe gana presupuesto'. La justificación parece objetiva pero no lo es."*
- *"Si el agente lee tickets de otros proyectos del tenant (scope amplio), aparecen ítems de equipos vecinos que pueden filtrar plan de producto cruzado entre departamentos sin necesidad."*

**Riesgos típicos:** decisión automatizada que afecta capacidad de trabajadores (carga de sprint), MCP con scope excesivo, información de roadmap a terceros sin contrato, sesgo del modelo en priorización presentado como objetivo, falta de trazabilidad de por qué se priorizó X.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* en modo propuesta (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-prio-agent` lee backlog + OKR + notas de producto y entrega **matriz de propuesta**. La reordenación real es humana en la reunión de sprint.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Reordenación automática del backlog → decisión que afecta carga de trabajadores sin ratificación (**GDPR art. 22 · ET art. 20.3**) | agentregistry + agentgateway | `@modelcontextprotocol/server-atlassian` publicado con **solo** `read:jira-work`; endpoints `write:*` fuera del catálogo; kagent no expone tool `reorder_backlog` |
| Roadmap a asistente público en cotizada (**MAR** si el plan de producto es materialmente relevante) | agentgateway | clasificación `roadmap` fuerza modelo on-prem; egress externo deny; audit trail retenido; ventana blackout T-30 antes de guidance |
| Sesgo por tamaño de descripción del ticket (largo ≠ valor) presentado como priorización objetiva | agentevals | validador A2A `scoring-validator`: rubric adversarial en eval set con 30 backlogs sintéticos (tickets cortos-alto-valor y largos-bajo-valor); umbral mínimo de aciertos; score de justificación por dependencia técnica, no por longitud |
| Fuga cross-project (agente lee proyectos vecinos con roadmap sensible) | agentgateway + Istio ambient | `mcp-jira` scope explícito a lista de `project_key` del equipo; AuthorizationPolicy L7 waypoint deny hacia otros namespaces de proyecto |
| Falta de trazabilidad de por qué se priorizó X (auditoría del sprint) | agentgateway + OTel | log por invocación con snapshot del input, prompt, ranking output y `manager_id`; retención 12m para revisiones retrospectivas |
