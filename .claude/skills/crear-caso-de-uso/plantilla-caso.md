# <ID> — <Título del caso, ES> / <Title, EN>

> Redactar cada bloque en **español y luego inglés**. Marcar cifras sin fuente como *(estimación, T1)*.

## Identificación

- **Rol principal / Primary role**: <rol> · <role>
- **Sectores / Sectors**: <transversal | banca | telco | serv. profesionales>
- **Patrón técnico / Technical pattern**: <analítico | triage | código | operacional | asistencia | documentos | generación>
- **Madurez recomendada / Recommended maturity**: <nivel piloto / gobernado>

> Aviso permanente: la capa de gobierno vive en el **bloque 5 (arquitectura de remediación)**.
> Permanent notice: the governance layer lives in **block 5 (remediation architecture)**.

## 1. Caso de uso / Use case  · etapa: Contexto

**ES:** <problema cotidiano, qué se hace hoy, dónde duele, volumen, qué se persigue>

**EN:** <same, translated>

## 2. Cómo resolverlo / How to solve it  · etapa: Solución

### 2.1 Local (laboratorio)
<modelo local + cliente + prompt tipo>

### 2.2 Copilot
<qué activar, connector, etiqueta de sensibilidad>

### 2.3 Claude Code / agente de escritorio
<AGENTS.md: reglas, umbrales, formato; allowlist; read-only por defecto>

### 2.4 MCPs — configuración y conexión

| MCP | Servidor / arranque | Scopes mínimos |
|-----|---------------------|----------------|
| `mcp-<x>` | `vault://<ruta-ro>` | `<recurso>:read` |

<snippet mcp.json opcional. Regla: least privilege; *:write exige gate humano>

### 2.5 Alternativas
<web + adjuntos, cláusula no-entrenamiento, solo datos no identificables>

## 3. KPIs y mejora de rendimiento / KPIs  · etapa: Impacto

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| <tiempo/unidad> | h | <x> | <y> |
| <tasa error / calidad> | % | <x> | <y> |
| <coste> | € | base | base × <k> |

Fórmula / Formula: *(<ahorro> · estimación, T1)*

## 4. Vulnerabilidades y riesgos → gobernanza / Risks  · etapa: Riesgo

- *"Si trabajo desde <X>, entonces <consecuencia concreta: fuga de PII / rotura de base jurídica / privilegio…>."*
- *"Si el MCP tiene scope <write>, el agente <acción no autorizada> sin gate humano."*
- **Shadow AI:** *"Si uso <herramienta/MCP no registrado>, nadie lo inventarió y opera sin identidad ni control."*

**Riesgos típicos / Typical risks:** MCP no auditado · agente sin identidad · prompt injection desde <fuente> · shadow AI · coste descontrolado · fuga de PII · decisión automatizada sin gate.
**Normativa / Regulation:** <EU AI Act art. X · GDPR/AEPD · NIS2 · DORA · MiFID II/MAR/SOX/MiCA/secreto profesional según caso>.

> Estas vulnerabilidades se cubren con la capa de gobernanza descrita en el **bloque 5 (arquitectura de remediación)**. No llevar a producción sin ella. / Covered by the governance layer described in **block 5 (remediation architecture)**. Do not ship without it.

## 5. Arquitectura de remediación con gobernanza de IA / Remediation  · etapa: Remediación

| Riesgo (bloque 4) | Componente Solo | Mecanismo — dónde / cómo |
|-------------------|-----------------|--------------------------|
| Prompt injection desde <fuente> | agentgateway | prompt guard inspecciona la entrada en el plano de datos antes del LLM |
| Scope `*:write` | agentgateway + kagent | allowlist de tools (`AgentgatewayPolicy`) deja solo `*:read`; kagent restringe tools |
| Exfiltración a endpoint externo | Istio ambient | `AuthorizationPolicy` en ztunnel niega el egress fuera de la allowlist |
| PII sensible al modelo | agentgateway | detección de PII y redaction en request/response |
| Agente anónimo | Istio + agentgateway + kagent | SPIFFE mTLS + OIDC/JWT (JWKS) + OBO token exchange |
| Shadow AI (no registrado) | agentregistry | inventario obligatorio; sin registro no hay allowlist ni identidad |
| Coste de tokens | agentgateway | rate limit por tokens + semantic caching + model failover |
| Sin traza para auditor | agentgateway + agentevals | OpenTelemetry por invocación + tracing de evaluación |

**Cómo se consigue la identidad:** SPIFFE (mTLS en ztunnel) + validación OIDC/JWT en agentgateway + OBO en kagent.
**Dónde se aplican las políticas:** plano de datos de agentgateway (`AgentgatewayPolicy`) + malla (`AuthorizationPolicy` L4 ztunnel / L7 waypoint).

## Objeto del reproductor / Player object (append a `CASES` en `casos.js`)

La geometría y las aristas son compartidas; el caso solo aporta textos. Añade este objeto al array `CASES` de `website/src/components/ScenarioPlayer/casos.js`:

```js
{
  id: '<slug>',
  role: {es: '<Rol>', en: '<Role>'}, pat: {es: '<patrón>', en: '<pattern>'},
  gw: ['MCP Gateway'],                              // + 'LLM Gateway' / 'AgentGateway' según el caso
  title: {es: '<...>', en: '<...>'},
  scTitle: {es: '<Gobernado>', en: '<Governed ...>'},
  scSub: {es: '<rol · volumen>', en: '<role · volume>'},
  n: {
    user: {l: {es: '<Usuario>', en: '<User>'}, s: {es: 'usuario', en: 'user'}},
    agent: {l: '<x>-agent', s: {es: 'agente', en: 'agent'}},
    llm: {s: {es: 'razona', en: 'reasons'}},
    mcpA: {l: 'mcp-<x>', s: '<res>:read'}, mcpB: {l: 'mcp-<y>', s: '<res>:read'},
    ext: {l: {es: 'endpoint externo', en: 'external endpoint'}, s: {es: 'no auditado', en: 'unaudited'}},
    shadow: {s: {es: 'no registrado', en: 'unregistered'}},
  },
  risk: {es: 'Prompt injection + shadow-mcp', en: 'Prompt injection + shadow-mcp'},
  hitl: {es: '¿Aprobar <acción sensible>?', en: 'Approve <sensitive action>?'},
  caps: [   // subtítulo del reproductor por etapa: contexto, solución, impacto, riesgo, remediación
    {es: '<contexto>', en: '<context>'},
    {es: '<solución>', en: '<solution>'},
    {es: '<impacto/KPIs>', en: '<impact/KPIs>'},
    {es: '<riesgos + shadow AI>', en: '<risks + shadow AI>'},
    {es: '<remediación: agentgateway/Istio/registry + HITL>', en: '<remediation ...>'},
  ],
  comps: [  // tira que se resalta en remediación (normalmente estos 4)
    {cn: 'agentgateway', cd: {es: '<mecanismo>', en: '<mechanism>'}},
    {cn: 'kagent', cd: {es: '<identidad/OBO>', en: '<identity/OBO>'}},
    {cn: 'agentregistry', cd: {es: '<shadow fuera>', en: '<shadow kept out>'}},
    {cn: 'Istio ambient', cd: {es: '<SPIFFE/egress>', en: '<SPIFFE/egress>'}},
  ],
  blocks: [ // los 5 bloques (HTML bilingüe); el de riesgo con sh:true
    {h: {es: 'Caso de uso', en: 'Use case'}, body: {es: '<p>...</p>', en: '<p>...</p>'}},
    {h: {es: 'Cómo resolverlo', en: 'How to solve it'}, body: {es: "...<table class='sp-t'>...", en: '...'}},
    {h: {es: 'KPIs y mejora', en: 'KPIs & gain'}, body: {es: "<table class='sp-t'>...<p class='sp-est'>... (estimación, T1)</p>", en: '...'}},
    {sh: true, h: {es: 'Vulnerabilidades y riesgos', en: 'Vulnerabilities & risks'}, body: {es: "<ul>...</ul><h4 class='sp-sh'>Shadow AI</h4>...<div class='sp-warn'>...</div>", en: '...'}},
    {h: {es: 'Remediación (Solo.io)', en: 'Remediation (Solo.io)'}, body: {es: "<table class='sp-t'>...<td class='sp-c'>agentgateway</td>...", en: '...'}},
  ],
}
```

Recordatorios: iconos oficiales por tipo de nodo (kagent/agentgateway/mcp/agentregistry) los pone el motor; la caja informativa de KPIs y el flujo HITL (gate→pass/block) son automáticos; no autores coordenadas ni aristas. Verifica con `npm run build` (es + en).

## Referencias / References

- <normativa, marcos OWASP LLM/Agentic, fuentes>. *Citas T1.*
