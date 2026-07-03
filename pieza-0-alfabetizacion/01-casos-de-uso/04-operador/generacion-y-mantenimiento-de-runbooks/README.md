# Generación y mantenimiento de runbooks

> **Rol:** operador · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tras un incidente resuelto, el runbook se queda en la cabeza del que estuvo on-call. El próximo on-call lo redescubre. Se busca: agente sintetiza ticket + Slack + comandos + commits en un runbook accionable, versionado en repo.

## 2. Cómo resolverlo

**Local.** Llama 70B con material adjunto del incidente.

**Copilot.** En el cliente con MCPs de PagerDuty + Slack + Git.

**Claude Code.** Repo `runbooks/` con `AGENTS.md` y plantilla `templates/runbook.md`. Comando: *"Genera runbook a partir del incidente PD-INC-1234. Comandos exactos. Métricas de validación. Sin narrativa."*

**MCPs:** PagerDuty, Slack/Teams (sanitizado), Git (escritura solo en `runbooks/` con PR), Datadog (lectura).

**Alternativa.** Plantilla manual rellenada con asistente.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % incidentes con runbook posterior | *20-30%* | *> 80%* |
| TT-runbook | *2-4 h* | *20-30 min* |
| Runbooks actualizados/año | *raro* | *>5×* |

**Fórmula:** ≈ (180 − 25) min × 30 incidentes/año / 60 ≈ **77 h/año** por operador.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el runbook generado incluye nombres de personas ('contactar a Juan si el servicio X falla'), responsabilidad personal sin política. Cuando Juan se vaya, ruido."*
- *"Si el agente accede a Slack para leer el war room y el canal contiene info de cliente, mezcla en el runbook datos que no deberían quedar persistidos."*
- *"Si el runbook propone comandos que el agente inventó sin verificar (flags no existentes), siguiente on-call ejecuta a las 3 AM."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
