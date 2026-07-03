# Operador — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: SRE, DevOps, ingeniería de plataforma, NOC, on-call. Perfil técnico con responsabilidad sobre infra, despliegues, incidentes y observabilidad.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, agentes de operación, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Y es la verdaderamente crítica. Adoptar estos casos sin un marco de gobierno significa:

- Logs, manifiestos o IaC con credenciales, endpoints internos o topología sensible enviados al modelo de un tercero.
- Incumplimiento del **Reglamento Europeo de IA (EU AI Act)**, **GDPR**, **NIS2**, **DORA** y la normativa de la **AEPD**.
- Agentes con `kubectl`, `terraform`, o acceso a cloud APIs ejecutando acciones sin identidad propia, sin RBAC acotado, sin trazabilidad.
- MCPs de terceros con acceso a tu plano de control de Kubernetes, observabilidad o cloud, equivalentes a un operador humano sin auditar.
- Coste descontrolado en consultas masivas sobre logs y métricas.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA** de este mismo kit. No enchufes un agente a un cluster, cloud o pipeline real sin haber leído antes la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

El operador vivía dos tipos de día: el aburrido (deploys rutinarios, tickets de "necesito acceso a X") y el intenso (incidente, on-call a las 3am). La IA agéntica comprime ambos. El día aburrido se automatiza más; el intenso se vuelve menos ciego, porque el agente cruza logs, trazas, alertas y runbooks en segundos. Lo que no cambia: tú firmas el comando que toca producción. Un agente que tira un servicio es un agente que **tú** dejaste tirar el servicio.

## 2. Ocho casos típicos (con el cómo)

### 2.1 Triage de alertas e incidentes

#### 1) Caso de uso

40 alertas en la última hora. La mitad son síntomas del mismo problema, otras son ruido por flapping y dos importan de verdad. Hoy las miras una a una. Se busca: agente agrupa por causa probable, marca raíz vs síntoma, sugiere runbook aplicable. Tú decides ataque.

#### 2) Cómo resolverlo

**Local.** Inviable porque las alertas viven en SaaS.

**Copilot integrado.** Datadog Bits AI, Dynatrace Davis CoPilot, New Relic AI, PagerDuty AIOps, Sentinel Copilot: ya agrupan y correlacionan. Camino más corto.

**Claude Code / agente de operaciones.** Repo `oncall-triage/` con `AGENTS.md` que prohíbe mitigación automática y obliga a citar evidencia. Comando: *"Triage de alertas activas en prod-eu. Agrupa, marca raíz, propone runbook."*

**MCPs:**

| MCP | Servidor | Scopes mínimos |
|-----|----------|----------------|
| PagerDuty / Opsgenie | `mcp-pagerduty` | lectura de incidentes activos |
| Métricas | `mcp-datadog` / `mcp-prometheus` | lectura sobre servicios del equipo |
| Kubernetes | `mcp-kubernetes` | **solo** `get`/`describe`/`logs` |

Identidad propia (`svc-ops-triage-agent`). Read-only siempre.

**Alternativa.** `holmesgpt`, `kubectl-ai`, `k9s` con plugin de IA.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-triage de tormenta de alertas | *30-60 min* | *5-10 min* |
| % alertas correctamente agrupadas | *50%* | *> 80%* |
| MTTA | base | reducción significativa |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × tormentas_mes × 11 / 60`. Ejemplo: 45 min × 12 × 11 / 60 ≈ **99 h/año** por operador.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el agente tiene `delete`/`apply` y mitiga automáticamente con escalado o restart, una *prompt injection* en una alerta puede desencadenar acciones masivas. DORA y NIS2 exigen control de cambios documentado."*
- *"Si las alertas incluyen detalles de cliente (`order_id`, IPs) y se mandan a modelo externo, hay tratamiento sin base jurídica."*
- *"Si el modelo correlaciona mal y descarta la alerta real como ruido, hay incidente no escalado que viola SLA."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.2 Lectura masiva de logs

#### 1) Caso de uso

200 MB de logs del servicio en una ventana de 2 h. Buscas la causa pero leerlos a ojo es inviable. Se busca: agente resume errores únicos por frecuencia, primer/último timestamp, contexto, hipótesis de causa.

#### 2) Cómo resolverlo

**Local.** Para volúmenes pequeños: Llama 70B sobre logs sanitizados.

**Copilot (Splunk AI, Datadog, Elastic AI Assistant).** Camino más corto si el log vive ahí.

**Claude Code.** Repo con script de filtrado + prompt fijo: *"Resume errores únicos por frecuencia. Primer y último timestamp. Contexto típico. Hipótesis de causa. No inventes stack traces."*

**MCPs:**

| MCP | Servidor | Scopes |
|-----|----------|--------|
| SIEM / logs | `mcp-splunk` / `mcp-elastic` / `mcp-loki` | lectura del índice del servicio |
| Sanitización | `mcp-redact` *(propuesto)* | regex de redacción antes de mandar al modelo |

**Alternativa.** Filtrado y agrupación con `grep`/`jq`/`awk` antes; modelo solo para hipótesis.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-análisis de log de incidente | *60-120 min* | *10-20 min* |
| Errores únicos identificados | *manual: 60-70%* | *> 90%* |
| Falsas causas perseguidas | *30%* | *< 10%* |

**Fórmula:** ≈ (90 − 15) min × 8 incidentes/mes × 11 / 60 ≈ **110 h/año**.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si los logs contienen tokens, cookies de sesión, JWT o claves de cliente y se mandan a modelo externo, exfiltración de credenciales. Esos tokens pueden quedar en logs del proveedor."*
- *"Si los logs incluyen PII (email, IP del usuario), tratamiento sin base jurídica y notificación a la AEPD si hay incidente."*
- *"Si el modelo inventa un stack trace plausible, persigues una causa que no existe y dejas la real."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.3 Análisis de trazas (distributed tracing)

#### 1) Caso de uso

Traza de 80 spans. ¿Dónde se va el tiempo? Se busca: identificación de spans con mayor latencia y oportunidades de paralelización.

#### 2) Cómo resolverlo

**Local.** Inviable a escala; el contexto de la traza es grande.

**Copilot (Datadog APM, New Relic, Honeycomb AI).** Ya integran análisis automatizado.

**Claude Code.** Exporta traza Jaeger/Tempo a JSON, agente analiza: *"Top 3 spans por latencia. % del tiempo total. Hipótesis. Spans en serie paralelizables."*

**MCPs:** `mcp-datadog-apm`, `mcp-jaeger`, `mcp-tempo` (todos lectura).

**Alternativa.** Vista en flame graph y análisis manual.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-análisis traza | *30-60 min* | *5-10 min* |
| % cuellos de botella reales identificados | *60%* | *> 85%* |

**Fórmula:** ≈ (45 − 7) min × 6 trazas/semana × 50 / 60 ≈ **190 h/año**.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si la traza contiene IDs de cliente, datos del payload o headers de autenticación, fuga al modelo externo."*
- *"Si el agente sugiere paralelizar dos spans que mantienen invariantes (orden de escritura en DB), introduce bug grave."*
- *"Si el agente consulta APM con identidad humana, cualquier consulta queda firmada como mía."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.4 Generación y mantenimiento de runbooks

#### 1) Caso de uso

Tras un incidente resuelto, el runbook se queda en la cabeza del que estuvo on-call. El próximo on-call lo redescubre. Se busca: agente sintetiza ticket + Slack + comandos + commits en un runbook accionable, versionado en repo.

#### 2) Cómo resolverlo

**Local.** Llama 70B con material adjunto del incidente.

**Copilot.** En el cliente con MCPs de PagerDuty + Slack + Git.

**Claude Code.** Repo `runbooks/` con `AGENTS.md` y plantilla `templates/runbook.md`. Comando: *"Genera runbook a partir del incidente PD-INC-1234. Comandos exactos. Métricas de validación. Sin narrativa."*

**MCPs:** PagerDuty, Slack/Teams (sanitizado), Git (escritura solo en `runbooks/` con PR), Datadog (lectura).

**Alternativa.** Plantilla manual rellenada con asistente.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| % incidentes con runbook posterior | *20-30%* | *> 80%* |
| TT-runbook | *2-4 h* | *20-30 min* |
| Runbooks actualizados/año | *raro* | *>5×* |

**Fórmula:** ≈ (180 − 25) min × 30 incidentes/año / 60 ≈ **77 h/año** por operador.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el runbook generado incluye nombres de personas ('contactar a Juan si el servicio X falla'), responsabilidad personal sin política. Cuando Juan se vaya, ruido."*
- *"Si el agente accede a Slack para leer el war room y el canal contiene info de cliente, mezcla en el runbook datos que no deberían quedar persistidos."*
- *"Si el runbook propone comandos que el agente inventó sin verificar (flags no existentes), siguiente on-call ejecuta a las 3 AM."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.5 Borrador de postmortem

#### 1) Caso de uso

Tras resolver incidente serio, redacción del postmortem lleva 3-4 h. Se busca: borrador *blameless* con cronología, causa raíz, factores contribuyentes, action items con dueño. Tú añades contexto humano.

#### 2) Cómo resolverlo

**Local.** Llama 70B sobre material del incidente.

**Copilot (Microsoft 365 + PagerDuty connector).** Útil si la organización ya tiene el connector.

**Claude Code.** Repo `postmortems/` con `AGENTS.md` que prohíbe nombres propios y obliga a tono *blameless*. Comando: *"Borrador desde PD-INC-1234 + canal `#war-room-xxx`. Plantilla `templates/postmortem.md`."*

**MCPs:** PagerDuty, Slack, Git, Statuspage. Todos lectura.

**Alternativa.** Plantilla + asistente sobre material exportado.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-postmortem | *3-5 h* | *45-60 min* |
| % incidentes con postmortem cerrado en 5 días | *40%* | *> 80%* |
| Action items con dueño y plazo | *50%* | *> 95%* |

**Fórmula:** ≈ (4 h − 0.8 h) × 15 postmortems/año ≈ **48 h/año**. Mayor valor: el postmortem sí se hace y sí se aprende.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el agente nombra al autor del commit causante, postmortem deja de ser *blameless* y daña cultura."*
- *"Si el borrador contiene info de cliente afectado (correos, IDs), publicación interna inadecuada."*
- *"Si entrenan con el postmortem, detalles de la infra y vulnerabilidades resueltas viajan al modelo externo."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.6 Generación de manifiestos e IaC

#### 1) Caso de uso

Necesitas Deployment + Service + Ingress + PDB + HPA + NetworkPolicy para un servicio nuevo. Se busca: YAML válido siguiendo convenciones del equipo, con `resources`, `securityContext`, labels y probes correctos.

#### 2) Cómo resolverlo

**Local.** Llama 70B + Qwen-Coder. Útil para iteración rápida.

**Copilot (VS Code / Cursor / Claude Code).** Con `AGENTS.md` que fija convenciones internas (naming, labels obligatorias, no `privileged`, recursos con limits, etc.).

**Claude Code.** Repo `platform-iac/` con `AGENTS.md`, ejemplos válidos en `examples/`, validador (`kubeconform`, `kyverno`, `opa`) en pre-commit. Comando: *"Manifiestos para servicio `checkout-api`. Patrón `examples/api-service/`."*

**MCPs:** Filesystem, Git, **NUNCA** `mcp-kubernetes` con `apply` para esto.

**Alternativa.** Plantilla con Helm + values; el agente solo rellena values.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-manifiestos servicio nuevo | *2-4 h* | *20-30 min* |
| % manifiestos que pasan validador a la primera | *50%* | *> 90%* |
| Vulnerabilidades en review (privileged, recursos abiertos) | *frecuentes* | *raras* |

**Fórmula:** ≈ (3 h − 0.4 h) × 25 servicios/año ≈ **65 h/año** por operador.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el agente genera manifiesto con `privileged: true` o `hostNetwork: true` por defecto, abro escalada de privilegios."*
- *"Si copia secretos en `env` directamente en lugar de `secretRef`, los credenciales quedan en YAML del repo."*
- *"Si el agente conecta a Kubernetes y aplica directamente sin gate, una alucinación produce despliegue en producción no aprobado."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.7 Búsqueda en documentación y AGENTS.md de plataforma

#### 1) Caso de uso

*"¿Cómo se hace rollback en Argo CD?"*. 20 min entre Stack Overflow + docs oficiales + Confluence interna. Se busca: respuesta combinando convenciones internas + docs oficiales en segundos.

#### 2) Cómo resolverlo

**Local.** RAG sobre `docs/` con LangChain + Ollama.

**Copilot (M365).** Si Confluence/SharePoint indexado: pregunta directa.

**Claude Code.** Con MCP de Context7, DeepWiki o docs del vendor + repo interno con `AGENTS.md`.

**MCPs:** `mcp-context7`, `mcp-deepwiki`, `mcp-confluence`, `mcp-github` (repo de runbooks).

**Alternativa.** `repomix` para empaquetar el repo y pegarlo al asistente.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-búsqueda de comando/flag | *15-20 min* | *1-3 min* |
| % respuestas correctas a la primera | *60%* | *> 85%* |

**Fórmula:** ≈ 15 min × 6 búsquedas/día × 220 días / 60 ≈ **330 h/año** por operador.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el agente cita una doc oficial obsoleta y el comando que sugiere ya no existe o ha cambiado de comportamiento, ejecuto algo no esperado."*
- *"Si la doc interna contiene info confidencial (endpoints internos, cuentas de servicio) y va a modelo externo, fuga de topología."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

### 2.8 Asistente en on-call

#### 1) Caso de uso

3 AM. Alerta que no habías visto. Servicio en CrashLoopBackOff. Se busca: agente lee estado del cluster, propone tres hipótesis ordenadas con verificación rápida y mitigación. Tú decides y ejecutas.

#### 2) Cómo resolverlo

**Local.** Inviable; el contexto del cluster vive remoto.

**Copilot integrado (Datadog Bits AI, New Relic AI).** Camino más corto.

**Claude Code.** Repo `oncall-assistant/` con `AGENTS.md` que **prohíbe** `kubectl apply/delete/scale`. Solo `get`/`describe`/`logs`/`events`. Comando: *"Pod `checkout-api-xyz` en CrashLoopBackOff hace 8 min en `prod-eu-west-1`/`payments`. Tres hipótesis ordenadas. Cómo verificar cada una. Cómo mitigar."*

**MCPs:**

| MCP | Servidor | Scopes mínimos |
|-----|----------|----------------|
| Kubernetes | `mcp-kubernetes` | rol `view` cluster-wide, **NUNCA** `edit`/`admin` |
| Logs / métricas | `mcp-datadog` / `mcp-loki` | lectura |
| PagerDuty | `mcp-pagerduty` | lectura del incidente |

Identidad propia (`svc-ops-oncall-agent`) con perfil **read-only**. La acción correctiva la ejecuta el ingeniero con su identidad humana.

**Alternativa.** `kubectl-ai` con allowlist de comandos read-only.

#### 3) KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-diagnóstico inicial | *20-40 min* | *3-8 min* |
| % primer comando ejecutado correcto | *60%* | *> 85%* |
| MTTR p50 / p95 | base | reducción significativa |
| Errores de operador en escritura por urgencia | base | reducción notable |

**Fórmula:** ≈ (30 − 5) min × 20 alertas on-call/mes × 11 / 60 ≈ **92 h/año** por operador on-call.

> *Estimaciones pendientes de T1.*

#### 4) Vulnerabilidades y riesgos → gobernanza

- *"Si el agente tiene `edit` o `admin` en cluster de producción, una *prompt injection* desde un log o una alerta puede desencadenar `kubectl delete` masivo. Pérdida de disponibilidad y datos."*
- *"Si el comando sugerido tiene un flag inventado por el modelo y lo ejecuto a las 3 AM sin verificar, tiro el servicio."*
- *"Si el agente entra al cluster con identidad humana (mi kubeconfig), auditoría no distingue mis acciones de las suyas. Sin no repudio."*
- *"Si los logs leídos contienen PII de cliente y se envían a modelo externo, fuga GDPR durante el incidente."*

**Riesgos típicos:** acceso de escritura en producción, alucinación de comandos, identidad compartida, fuga de PII durante triage, *prompt injection* desde la propia infraestructura.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 3. MCPs: cómo enchufar tu plataforma al agente

Para un operador, estos MCPs son los rentables. Conéctalos uno a uno, empezando por lectura.

| MCP | Para qué lo usas |
|-----|------------------|
| Kubernetes (`kubectl` MCP) | Consulta de estado, eventos, logs. Lectura primero, escritura nunca sin gate. |
| Observabilidad (Prometheus / Datadog / Grafana / Loki / Splunk) | Métricas, alertas, queries PromQL/LogQL generadas |
| Incident management (PagerDuty / Opsgenie / Statuspage) | Contexto del incidente actual, histórico |
| Source of truth (GitHub / GitLab) | Lectura de IaC, runbooks, commits asociados a un cambio |
| Cloud (AWS / GCP / Azure) | Estado de recursos, billing, IAM. Solo lectura. |
| Ticketing (Jira / ServiceNow) | Tickets del equipo, change requests |
| Docs internas (Confluence / Notion / repo de runbooks) | Recuperación de procedimiento documentado |

**Reglas adicionales para operador:**

- **Identidad propia del agente** en cada cluster/cloud, con RBAC mínimo. Nunca uses tu identidad personal con permisos de cluster-admin para que el agente "herede".
- **Auditoría obligatoria.** Todo comando que el agente ejecute queda en logs con marca de quién lo aprobó.
- **Gate humano en escritura.** Ninguna acción mutativa (apply, delete, scale, restart, change IAM) sin confirmación explícita en el momento. La automatización viene **después** del plan de gobierno, no antes.
- **Perímetro por entorno.** Agente con permisos en dev no es agente con permisos en prod. Identidades y MCPs separados.

## 4. Cinco hábitos clave

1. **Lectura por defecto, escritura por excepción.** El agente lee siempre, escribe casi nunca, y solo con gate humano explícito.
2. **Contexto antes de cada turno.** Cluster, namespace, versión, ventana temporal. Sin esto, la respuesta es genérica e inútil.
3. **Pide hipótesis ordenadas, no diagnóstico único.** Tres opciones con probabilidad relativa te hacen pensar; una sola respuesta te hace seguidor.
4. **Versiona runbooks generados.** Si el agente te ayuda a redactar un runbook, va al repo. La próxima vez no lo regeneras, lo ejecutas.
5. **Postmortem del agente.** Cuando un agente recomienda mal, anótalo. La memoria del equipo sobre fallos del agente vale tanto como los runbooks.

## 5. Qué evitar

- Pegar logs con credenciales, tokens, IPs internas, datos de cliente, o cabeceras de autenticación en un asistente público no aprobado. Redacta antes.
- Aceptar un manifiesto YAML del modelo sin revisar `resources`, `securityContext`, `RBAC` y `NetworkPolicy`. Los defaults son permisivos.
- Dejar al agente con permiso de escritura sobre producción "para automatizar". Esa decisión se toma en el Plan Director, no en el día a día.
- Confiar en troubleshooting steps que el modelo describe con tono autoritativo. Verifica en docs oficiales antes de ejecutar en prod.
- Conectar MCPs de terceros desconocidos al cluster. El MCP es la API del agente con tu infra: trátalo como integración con TPRM, no como plugin de navegador.

## 6. Cómo seguir

- Lab base **"agente de triage de eventos"** del catálogo: el patrón de 2.1.
- Lab base **"agente operacional read-only"**: el patrón seguro de 2.8.
- Lab base **"agente sobre código (AGENTS.md/MCP)"**: el patrón de 2.6 y 2.7.
- Guías de estándares operativos: `agents-md.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
