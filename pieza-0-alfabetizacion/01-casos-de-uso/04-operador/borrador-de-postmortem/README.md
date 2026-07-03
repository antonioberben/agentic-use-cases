# Borrador de postmortem

> **Rol:** operador · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tras resolver incidente serio, redacción del postmortem lleva 3-4 h. Se busca: borrador *blameless* con cronología, causa raíz, factores contribuyentes, action items con dueño. Tú añades contexto humano.

## 2. Cómo resolverlo

**Local.** Llama 70B sobre material del incidente.

**Copilot (Microsoft 365 + PagerDuty connector).** Útil si la organización ya tiene el connector.

**Claude Code.** Repo `postmortems/` con `AGENTS.md` que prohíbe nombres propios y obliga a tono *blameless*. Comando: *"Borrador desde PD-INC-1234 + canal `#war-room-xxx`. Plantilla `templates/postmortem.md`."*

**MCPs:** PagerDuty, Slack, Git, Statuspage. Todos lectura.

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

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
