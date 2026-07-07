# Borrador de postmortem

> **Rol:** operador · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tras resolver incidente serio, redacción del postmortem lleva 3-4 h. Se busca: borrador *blameless* con cronología, causa raíz, factores contribuyentes, action items con dueño. Tú añades contexto humano.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre material del incidente.

**Copilot (Microsoft 365 + PagerDuty connector).** Útil si la organización ya tiene el connector.

**Claude Code.** Repo `postmortems/` con `AGENTS.md` que prohíbe nombres propios y obliga a tono *blameless*. Comando: *"Borrador desde PD-INC-1234 + canal `#war-room-xxx`. Plantilla `templates/postmortem.md`."*

**MCPs:** PagerDuty, Slack y Git en lectura; Statuspage con `postmortem:publish` **con gate** (la publicación requiere aprobación humana).

**Alternativa.** Plantilla + asistente sobre material exportado.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-postmortem | *3-5 h* | *45-60 min* |
| % incidentes con postmortem cerrado en 5 días | *40%* | *> 80%* |
| Action items con dueño y plazo | *50%* | *> 95%* |

**Fórmula:** ≈ (4 h − 0.8 h) × 15 postmortems/año ≈ **48 h/año**. Mayor valor: el postmortem sí se hace y sí se aprende.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente nombra al autor del commit causante, postmortem deja de ser *blameless* y daña cultura."*
- *"Si el borrador contiene info de cliente afectado (correos, IDs), publicación interna inadecuada."*
- *"Si entrenan con el postmortem, detalles de la infra y vulnerabilidades resueltas viajan al modelo externo."*

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `postmortem-drafter` compone cronología + causa raíz + factores contribuyentes + action items desde PagerDuty + canal Slack war-room + Git commits. **Blameless por diseño**: nombres de personas nunca aparecen en el output.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Agente nombra al autor del commit causante → postmortem deja de ser blameless y daña cultura | agentgateway | `pii-redact` sobre nombres propios de commits/Slack antes del prompt: `author_name → role_label` (`sre-a`, `dev-b`); prompt guard salida bloquea si aparecen nombres de personas en el borrador |
| Info de cliente afectado (correos, IDs) en el borrador → publicación interna inadecuada (**GDPR art. 6 · art. 33 notificación breach**) | agentgateway | `pii-redact` sobre `customer_id`, `email`, `order_id`; sustituidos por counts (`~1.2k customers affected`) o hashes en la sección de impacto |
| Postmortem con detalles de infra + vulnerabilidad resuelta usado para entrenamiento externo | agentregistry | procesamiento on-prem forzado (`data-classification=post-incident`); modelos consumer-tier deny; catálogo con solo proveedores con opt-out contractual de training |
| Action items sin dueño ni plazo → postmortem que no cierra ciclo | agentevals | eval determinista: cada `action_item` debe tener `owner + due_date + jira_key`; miss → `[SIN DUEÑO - REVISAR]`; sin action items válidos → borrador rechazado, no *publicado* |
| Cronología reconstruida inventada → falsa memoria del equipo | agentevals | validador A2A: cada evento del timeline debe cruzar contra `event_id` de PagerDuty o `message_ts` de Slack; sin fuente resoluble → línea eliminada |
