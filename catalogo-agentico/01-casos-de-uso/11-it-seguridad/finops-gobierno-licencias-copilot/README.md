# IT-SEG — FinOps de IA: gobierno de consumo y licencias de GitHub Copilot

## Identificación

- **Rol principal**: responsable de gobierno de tenants de IA / FinOps de IA (IT-Seguridad + Finanzas).
- **Sectores**: transversal (caso real en **sector público** — administración del Estado).
- **Patrón técnico**: Lab 1 — agente analítico sobre datos, con write-back gated.
- **Madurez recomendada**: nivel 2 piloto (read-only sobre billing, como está hoy); nivel 3 antes de habilitar escritura (gestión activa de presupuestos y reasignación de licencias).

> Aviso permanente: la capa de gobierno vive en la **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

La organización tiene **dos tenants de GitHub Copilot Business** (50 + 38 licencias) para que el personal interno desarrolle con IA, con niveles muy dispares de conocimiento, uso y adopción. El responsable de gobierno debe **optimizar el presupuesto sin generar sobrecoste pero sin infrautilizar** las licencias contratadas.

Hoy existe un agente casero que, a diario:

- Se conecta a **ambos tenants** y recopila el consumo real y la adopción de licencias.
- **Replica la pantalla oficial de billing** (4 ventanas temporales, todos los usuarios × modelos).
- Controla presupuestos y hace **proyección a fin de mes**.
- Emite **recomendaciones económicas** y **alertas** por correo (Teams, en curso).

Tiene tres limitaciones declaradas: (a) se ejecuta a las **17:30 atado al PC del responsable** (si el equipo está apagado, no corre); (b) es de **solo lectura** — el salto de valor es habilitar la **gestión automática** de presupuestos y licencias; (c) no hay cuadro de mando consolidado ni panel web. La hoja de ruta pide: gestión activa de presupuestos (escritura), reasignación de licencias, dashboard consolidado, independencia del PC, panel web, optimización y previsión.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + modelo de razonamiento sobre un export CSV/JSON anonimizado del billing (usuario → *handle* interno). Prompt tipo: *"Con el consumo por usuario/modelo y las 4 ventanas temporales, calcula run-rate, proyección a fin de mes por tenant, licencias activas vs. asignadas y candidatas a reasignar por inactividad ≥ N días. Devuelve JSON: {tenant, proyeccion, riesgo_overspend, infrautilizacion, recomendaciones}. **No propongas quitar licencias nominalmente: agrega por bucket de actividad.**"*

### 2.2 Copilot

Microsoft 365 Copilot para el cuadro de mando: informe narrativo sobre los datos ya consolidados en un Excel/Fabric con etiqueta de sensibilidad **Confidencial — Uso interno**. Copilot no toca las APIs de administración; solo redacta sobre datos ya extraídos y desidentificados.

### 2.3 Claude Code u otro agente de escritorio

Repo `finops-copilot/` con `AGENTS.md` que fija: umbrales de presupuesto por tenant, definición de "licencia infrautilizada" (p.ej. 0 sugerencias aceptadas en 30 días), formato del informe diario, política de alerta (a quién y cuándo), y regla dura: **read-only por defecto; toda escritura (cambiar presupuesto, reasignar/retirar licencia) es una propuesta, nunca una acción**. Allowlist sin permisos de administración del tenant.

### 2.4 MCPs — configuración y conexión

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| `mcp-gh-billing-t1` | `vault://finops/gh-tenant1-ro` | `billing:read, copilot.seats:read` (RO) |
| `mcp-gh-billing-t2` | `vault://finops/gh-tenant2-ro` | `billing:read, copilot.seats:read` (RO) |
| `mcp-gh-seats-admin` | `vault://finops/gh-seats-write` | `copilot.seats:write` — **gated (HITL + OBO)** |
| `mcp-teams` | `vault://finops/teams-post` | `chat:write` al canal FinOps — **gated** |
| `mcp-mail` | `vault://finops/mail-send` | `mail:send` a lista de distribución — **gated** |

Regla de oro: los dos `billing-t*` son read-only y cubren todo lo que hace el agente hoy. `seats-admin`, `teams` y `mail` son escritura/acción y **no se invocan sin gate humano**. Snippet: el MCP de escritura de seats se declara con `gate: true` y solo se activa tras aprobación.

### 2.5 Alternativas

Claude/ChatGPT Enterprise con el export **anonimizado** (sin nombres de funcionarios, IDs mapeados a *handle*), cláusula de **no entrenamiento**, solo para prototipar el análisis. Nunca subir el billing nominal a un endpoint no auditado.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente gobernado |
|-----|------------|------|----------------------|
| Consolidación diaria del billing (2 tenants) | h/día manuales | 1,5 h | ~0 (automático) |
| Disponibilidad del informe | dependencia | atado al PC, 17:30 | 24/7 en cluster |
| Sobrecoste por overspend no detectado a tiempo | € | reactivo (fin de mes) | proyección diaria |
| Utilización de licencias | % licencias activas / contratadas | base | base + reasignación |
| Licencias infrautilizadas recuperadas | nº/mes | 0 (sin write) | propuestas con HITL |
| Latencia de alerta | tiempo | diario 17:30 | casi tiempo real |

Fórmula: *1,5 h/día × 220 días ≈ 330 h/año solo en consolidación, más el sobrecoste evitado por proyección diaria y la infrautilización recuperada al reasignar 88 licencias. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente gana `copilot.seats:write` con una credencial de administración compartida sobre ambos tenants, puede **retirar o reasignar licencias de forma autónoma** — quitarle Copilot a un funcionario sin decisión humana."*
- *"Si ejecuto con mi token de administrador personal, no puedo probar ante la Intervención **quién** ordenó cada cambio de presupuesto o de licencia (sin OBO no hay cadena de responsabilidad)."*
- *"Si el export de billing con **nombres de empleados públicos** y su patrón de uso va al LLM externo, expongo PII y perfilado de rendimiento (GDPR/AEPD; en el sector público, ENS)."*
- *"Si el modelo **alucina la proyección** a fin de mes (cifra plausible pero fabricada), tomo una decisión de presupuesto errónea sobre dinero público."*
- *"Si una tormenta de consultas al billing o al LLM dispara el coste del propio agente de FinOps, el vigilante del gasto se convierte en fuente de gasto."*
- **Shadow AI:** *"El agente corre hoy en un portátil, no está inventariado y guarda credenciales de administración de dos tenants Copilot. Si alguien lo replica o exfiltra esas credenciales, nadie lo sabe: no tiene identidad ni control."*

**Riesgos típicos:** credencial de administración compartida sin OBO, escritura (seats/presupuesto) sin gate humano, fuga de PII de empleados al modelo, alucinación numérica en la proyección, coste descontrolado del agente, shadow AI (agente no registrado con credenciales admin).
**Normativa:** EU AI Act (art. 4 alfabetización, art. 50 transparencia), GDPR/AEPD (art. 22 decisión automatizada, art. 9 datos de rendimiento), **ENS** (Esquema Nacional de Seguridad, sector público), y control de la gestión presupuestaria pública.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción — y sobre todo no habilites la escritura — sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)), combinado con *A2 — Triage con acciones sensibles gated* para las alertas. El agente `finops-copilot` lee el billing de ambos tenants en **modo read-only**, calcula proyección y propone dos tipos de escritura sensible — **cambio de presupuesto** y **reasignación/retirada de licencias** — que nunca ejecuta solo: van por HITL con OBO del responsable presupuestario. Corre **en cluster** (kagent), no en el portátil, lo que resuelve de raíz la dependencia del PC y la ventana fija de las 17:30.

### Mapeo riesgo → componente → mecanismo

| Riesgo (bloque 4) | Componente Solo | Mecanismo — dónde / cómo |
|-------------------|-----------------|--------------------------|
| Escritura de licencias/presupuesto con credencial admin compartida | agentgateway + kagent (OBO) | `mcp-gh-seats-admin` y el cambio de presupuesto salen del scope RO del agente; toda mutación exige HITL y se firma con el **token OBO del responsable presupuestario**, no con una service account compartida |
| Retirada/reasignación de licencia sin gate humano (decisión automatizada sobre una persona) | agentgateway + kagent | la acción es una **propuesta**; el gate humano (badge ámbar→verde) es obligatorio antes del OBO — evita el supuesto del art. 22 GDPR |
| PII de empleados públicos (nombre + patrón de uso) al LLM | agentgateway | prompt guard con detección de PII (nombres, IDs) y **redaction**: el LLM ve *handles* y agregados por bucket, no la identidad; el informe se recompone con los nombres después |
| Alucinación numérica de la proyección a fin de mes | agentevals | eval set con meses cerrados como *golden dataset* + comprobaciones deterministas (cuadre run-rate/consumo) antes del handoff al humano |
| Coste descontrolado del propio agente de FinOps | agentgateway | rate limit por tokens; semantic caching de las consultas de billing repetidas; model failover a modelo barato para la clasificación de actividad |
| Agente no inventariado con credenciales admin de 2 tenants (shadow AI) | agentregistry + Istio ambient | sin registro no hay identidad SPIFFE ni entrada en la allowlist; `AuthorizationPolicy` en ztunnel deniega egress desde una copia no registrada hacia la API de GitHub |
| Independencia del PC / ejecución 24/7 | kagent | el agente corre como CRD en el cluster con su propia identidad y su cron; deja de depender del portátil encendido a las 17:30 |
| Evidencia de cada cambio para la Intervención / auditoría | agentgateway + agentevals | OTel per-invocation (input, tenant, propuesta, decisión HITL, quién firmó el OBO) como pista de auditoría del gasto público |
| Egress a endpoints no aprobados (dos tenants + Teams + mail y nada más) | Istio ambient | `AuthorizationPolicy` L4 en ztunnel con allowlist explícita de destinos; el resto se bloquea |

### Cómo se consigue la identidad

`finops-copilot-agent` recibe SPIFFE `spiffe://finops.example.org/copilot-gov` en **ztunnel** vía mTLS emitido por istiod. **agentgateway** valida además el OIDC/JWT del responsable que invoca la acción (JWKS del IdP corporativo). Cuando el agente va a **cambiar un presupuesto o reasignar una licencia**, **kagent** hace **OBO token exchange** con el token del responsable presupuestario aprobado tras HITL: la escritura contra la API de GitHub se firma con el token del humano, no con la credencial de administración compartida. Esto reconstruye la cadena de responsabilidad que la gestión presupuestaria pública exige.

### Dónde se aplican las políticas

En el **plano de datos de agentgateway** vía `AgentgatewayPolicy`: allowlist de tools (los dos `billing-t*` en `:read`; `seats-admin`, `teams` y `mail` marcados como gated), prompt guard con perfil PII para el billing nominal, rate limit por tokens, semantic caching y model failover. En la **malla Istio** vía `AuthorizationPolicy`: L4 en ztunnel restringe el egress a las APIs de los dos tenants GitHub, Teams y el correo corporativo; L7 en waypoint separa el acceso por tenant. **agentregistry** inventaría el agente y sus MCPs; una copia no registrada del agente-portátil queda fuera de allowlist y sin egress.

## Referencias

- EU AI Act (art. 4, art. 50), GDPR/AEPD (art. 9, art. 22), ENS (Esquema Nacional de Seguridad), OWASP LLM Top 10, OWASP Agentic (Identity and Privilege Abuse). *Citas T1.*
- Input cliente: caso de gobierno de tenants de GitHub Copilot Business en una organización del sector público.
