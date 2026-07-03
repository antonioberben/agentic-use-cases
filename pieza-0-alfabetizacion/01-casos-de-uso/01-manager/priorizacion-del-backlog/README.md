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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
