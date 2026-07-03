---
name: crear-caso-de-uso
description: >
  Crear o revisar una ficha de caso de uso de la Pieza 0 (plataforma de capacitación
  en IA agéntica). Contiene TODO lo necesario: estructura fija de 5 bloques, autoría
  bilingüe ES/EN, convenciones de MCP y scopes, KPIs con marcado de estimación,
  patrón de riesgos + shadow AI, mapeo de remediación a componentes Solo (identidad
  SPIFFE/OIDC/OBO y dónde se aplican las políticas), y el modelo de datos del
  reproductor de escenario. Dispara con: "nuevo caso de uso", "ficha de caso",
  "añade un caso para <rol>", "crear caso de uso", "rellenar bloque 5", "escenario
  del reproductor", "caso de <rol> <tarea>".
---

# Crear un caso de uso (Pieza 0 — capacitación)

Cada caso de uso es una **ficha independiente** que enseña a un rol a resolver una tarea real con IA y muestra los riesgos y su remediación con gobierno. En el website se recorre como un **escenario de 5 etapas** (reproductor arriba) sobre el **mismo texto de 5 bloques** (abajo). No hay dos contenidos: las 5 etapas del reproductor **son** los 5 bloques.

## Reglas no negociables

1. **Idioma: bilingüe ES + EN.** Todo texto visible debe existir en los dos idiomas. La prosa se redacta primero en español (registro directo, sin relleno) y se traduce a inglés. No dejar un bloque solo en un idioma.
2. **Estructura fija de 5 bloques + identificación.** Mismo orden y mismos encabezados en todas las fichas. No inventar secciones nuevas ni reordenar.
3. **Marcar todo dato factual sin fuente** como `*(estimación, T1)*`. Estadísticas, multas, cifras de adopción, benchmarks: T1 aún no volcado (ver `AGENTS.md` §3). No afirmar cifras como verificadas.
4. **Shadow AI siempre presente** en el bloque 4 cuando aplique al caso (casi siempre aplica): un MCP/agente no registrado, una herramienta no aprobada, uso desde un servicio público. Nombrarlo explícitamente.
5. **No inventar comportamiento de producto Solo.** Usar solo lo listado abajo (verificado contra la KB). Si dudas, consultar la KB (`solo-knowledge-base`) o marcarlo como propuesto. Un MCP hipotético se marca `*(propuesto, no GA)*`.
6. **El caso solo aporta datos.** La geometría, las aristas (puertos repartidos, sin cruces) y las anotaciones (badge de identidad, decisión HITL) las gestiona el motor; un caso aporta textos, etiquetas de nodo y estados. No autores coordenadas ni paths.
7. **Productos enterprise sin nombrar "enterprise".** Asume capacidades enterprise (prompt guards con PII, rate limit por tokens, OIDC/JWKS, ExtProc, semantic caching, model failover, OBO, agent registry) pero refiérete a los productos por su nombre a secas: agentgateway, kagent, agentregistry, Istio ambient. No escribas "Solo Enterprise for …" en el contenido de cara al usuario.
8. **Idioma por defecto del sitio: inglés.** El reproductor sigue el locale de Docusaurus. Aun así todo texto se escribe en ES **y** EN.

## Ubicación y nombres

```
pieza-0-alfabetizacion/01-casos-de-uso/por-rol/<NN-rol>/<slug-del-caso>/README.md
```

- `<NN-rol>`: uno de los 13 — `01-manager 02-analista 03-desarrollador 04-operador 05-finanzas 06-legal 07-rrhh 08-ventas 09-marketing 10-soporte 11-it-seguridad 12-ejecutivo 13-frontline`.
- `<slug-del-caso>`: kebab-case en español, corto y estable (ej. `revision-contratos-redlining`). No renombrar sin actualizar `website/sidebars-*.js`.
- El sector (banca, telco, serv. profesionales) va como **metadato** dentro de la ficha, no como carpeta.
- Tras crear la ficha, verificar build limpio: `cd website && npx docusaurus build` (0 broken links).

## La estructura de 5 bloques

Copia `plantilla-caso.md` (en esta carpeta) y rellénala. Encabezados exactos:

### Identificación
Rol principal · sectores · patrón técnico (uno de los labs) · madurez recomendada. Más el aviso permanente de que la capa de gobierno vive en la Pieza 2.

Patrones técnicos (elige uno): `analítico · triage · código · operacional · asistencia (frontline) · documentos (regulatorio/legal) · generación (creativo con control)`.

### 1 · Caso de uso  → etapa **Contexto** del reproductor
El problema cotidiano del rol. Qué se hace hoy, dónde duele, qué se persigue, volumen aproximado. Sin solución todavía.

### 2 · Cómo resolverlo  → etapa **Solución**
Configuración concreta en cada entorno, en este orden:
- **Local (laboratorio):** modelo en máquina (Ollama / LM Studio) + cliente. Incluir el prompt tipo.
- **Copilot:** Microsoft 365 Copilot u homólogo SaaS. Qué activar, qué connector, etiqueta de sensibilidad.
- **Claude Code u otro agente de escritorio:** qué `AGENTS.md` fija (reglas, umbrales, formato de salida), allowlist, sin permisos de envío/escritura salvo que el caso lo exija con gate.
- **MCPs (tabla obligatoria):** MCP concreto · servidor/arranque con `vault://...` · **scopes mínimos**. Incluir snippet `mcp.json` cuando aporte. Regla de oro: **least privilege y read-only por defecto**; cualquier `*:write` exige gate humano.
- **Alternativas:** Claude/ChatGPT/Gemini web + adjuntos, con cláusula de no entrenamiento y solo datos no identificables.

### 3 · KPIs y mejora de rendimiento  → etapa **Impacto**
Tabla de 3-5 KPIs (tiempo/unidad, tasa de error, throughput, coste, calidad) con base vs. con agente. Fórmula simple de ahorro. **Cifras en cursiva marcadas `*(estimación, T1)*`.**

### 4 · Vulnerabilidades y riesgos → gobernanza  → etapa **Riesgo**
Ejemplos concretos en primera persona con el patrón **"Si trabajo desde X…"**. Cubrir según el caso: MCP no auditado, agente sin identidad propia, prompt injection desde fuente externa, **shadow AI** (herramienta/MCP no registrado), coste descontrolado, fuga de PII, decisión automatizada sin gate humano. Citar la normativa aplicable (EU AI Act, GDPR/AEPD, NIS2, DORA + MiFID II/MAR/SOX/MiCA/secreto profesional donde toque). Cierre fijo: estas vulnerabilidades se cubren con la capa de gobernanza de la Pieza 2; no llevar a producción sin ella.

### 5 · Arquitectura de remediación con gobernanza de IA  → etapa **Remediación**
Tabla **riesgo (del bloque 4) → componente Solo → mecanismo (dónde/cómo)** + dos apartados: **cómo se consigue la identidad** y **dónde se aplican las políticas**. Usar solo los mecanismos verificados de la sección siguiente. Cada fila debe cerrar un riesgo concreto del bloque 4.

## Componentes Solo — referencia verificada (no inventar)

Fuente: KB `solo-knowledge-base`. Asumir licencia Enterprise en despliegues Kubernetes.

| Componente | Qué es | Qué aporta a la remediación |
|---|---|---|
| **agentgateway** | Plano de datos unificado para tráfico MCP / A2A / LLM (Envoy en Enterprise K8s; Rust en OSS). | Allowlist de herramientas MCP, **prompt guards con detección de PII** (tarjeta, SSN, SIN), rate limit **por tokens**, semantic caching, model failover, autenticación OAuth2/OIDC + JWT (JWKS remoto), OpenTelemetry. Políticas vía CRD `AgentgatewayPolicy` / `EnterpriseAgentgatewayPolicy`. |
| **kagent** | Orquestación de agentes nativa en Kubernetes (CRD de agente). | Identidad propia del agente y **access policies** integradas con Istio. **OBO (on-behalf-of) token exchange**: el agente actúa con el scope delegado del usuario, no con una credencial compartida. Tracing (OTel/ClickHouse/LangSmith). |
| **agentregistry** | Registro/inventario de agentes y MCP. | Mata el **shadow AI**: lo no registrado no obtiene entrada en la allowlist ni identidad emitida. |
| **Istio ambient** | Malla de servicios (ztunnel L4 + waypoint L7). | **Identidad SPIFFE** por mTLS emitida por istiod y aplicada en ztunnel. `AuthorizationPolicy` (L4 en ztunnel, L7 en waypoint) para segmentación y denegar egress fuera de la allowlist. |
| **agentevals** | Evaluación de agentes basada en trazas. | Evidencia auditable: eval sets, tracing OTel zero-code. |
| **kgateway** | API gateway (ingress) basado en Envoy. | Entrada norte-sur a la malla cuando el caso expone el agente como servicio. |

**Cómo se consigue la identidad (frase canónica):** el agente no es anónimo. En malla ambient recibe una identidad **SPIFFE** vía certificado **mTLS** emitido por istiod y aplicado en **ztunnel**; **agentgateway** valida además su credencial **OIDC/JWT** (JWKS remoto) en cada petición; **kagent** usa intercambio de token **OBO** para que actúe con el scope delegado del usuario.

**Dónde se aplican las políticas (frase canónica):** no viven en el agente. Se aplican en el **plano de datos de agentgateway** (Envoy) vía `AgentgatewayPolicy` — allowlist de MCP, prompt guards con PII, rate limit por tokens — y en la **malla** vía `AuthorizationPolicy` de Istio (L4 en ztunnel, L7 en waypoint) para la segmentación de red. Las access policies de kagent se integran con las de Istio.

## Reproductor de escenario (implementación real)

El reproductor es un componente React en `website/src/components/ScenarioPlayer/`:

- **`casos.js`** — datos: array `CASES` (los casos), `LAYOUT` (nodos), `STEP_META` (coreografía de 5 etapas), `UI` (textos comunes bilingües). **Un caso nuevo se añade aquí**: append a `CASES`.
- **`index.jsx`** — motor (no tocar salvo que cambies comportamiento del reproductor).
- **`styles.css`** — estilos scopeados bajo `.spwrap`.

El componente **sigue el locale de Docusaurus** (por defecto **inglés**); no tiene toggle propio. Todo texto es `{es, en}`.

### Coreografía compartida (común a todos los casos — no se toca por caso)

Las 5 etapas, la topología base y las aristas son comunes (`STEP_META`, `LAYOUT`). Un caso **solo aporta textos y etiquetas de nodo**, no geometría ni rutas.

- **Nodos** (`LAYOUT`, con `appearStage`): `user`, `agent`, `gw` (=agentgateway, aparece en remediación), `llm`, `mcpA`, `mcpB`, `ext` (externo, riesgo), `shadow` (shadow-mcp, riesgo), `trace` (observabilidad, remediación), `registry` (=agentregistry, remediación).
- **Iconos oficiales** por tipo (en `website/static/img/`, transparentes): `agent`→`kagent.png`, `gw`→`agw-favicon.svg`, `mcp`→`mcp.svg`, `registry`→`agentregistry.png`. Los demás nodos usan glyph SVG dibujado. Logo navbar: `solo-wordmark-{white,dark}.svg`. Si falta un icono oficial, se usa placeholder y se marca para sustituir.
- **Aristas**: el motor **reparte los puertos** a lo largo del lado de cada caja (1 flecha→centro; varias→distribuidas) y las dibuja perpendiculares con punta de flecha. **No se autoran paths.**
- **Etapa 4 (remediación)**: `agent→agentgateway→{mcpA,mcpB}` (lectura, verde), `agentgateway→trace` (traza), y bloqueos `agentgateway→ext` y `registry→shadow` (el registro deja fuera al no registrado). Todo el tráfico sale del gateway en abanico radial, sin cruces.
- **HITL como flujo real** (etapa remediación): la arista de la acción sensible (`gw→mcpB`) refleja la **decisión** — `gate` (ámbar, pendiente) → `pass` (verde, Aprobar) / `block` (rojo, Denegar). Botones Aprobar/Denegar + "volver a decidir"; badge y caption cambian con la decisión (`awaitingCap`/`approvedCap`/`deniedCap` de `UI`).
- **Badge de identidad** (etapa solución): ámbar "¿Identidad verificada?" → verde "SPIFFE + OIDC" (automático).
- **Caja informativa de KPIs**: se inyecta sola en el bloque 3 (`UI.kpiNote`): beneficio inmediato pero **no seguro ni compliant** sin gobierno. No se escribe por caso.

### Forma de un caso (objeto del array `CASES`)

```js
{
  id: 'slug',
  role: {es, en}, pat: {es, en},          // rol y patrón técnico (chips)
  gw: ['LLM Gateway', 'MCP Gateway'],     // rol(es) de gateway del caso (chips + eje de filtro)
  title: {es, en}, scTitle: {es, en}, scSub: {es, en},
  n: {                                    // etiquetas de los nodos del caso (l=label, s=sub)
    user: {l: {es, en}, s: {es, en}}, agent: {l: 'x-agent', s: {es, en}}, llm: {s: {es, en}},
    mcpA: {l: 'mcp-x', s: 'scope:read'}, mcpB: {l: 'mcp-y', s: 'scope:read'},
    ext: {l: {es, en}, s: {es, en}}, shadow: {s: {es, en}},
  },
  risk: {es, en},                         // texto del badge de riesgo (etapa 4)
  hitl: {es, en},                         // pregunta de aprobación humana (etapa 5)
  caps: [ {es, en}, x5 ],                 // subtítulo del reproductor por etapa (contexto..remediación)
  comps: [ {cn: 'agentgateway', cd: {es, en}}, ...(4) ],  // tira de componentes en remediación
  blocks: [ {h: {es, en}, body: {es, en}}, ...(5, el de riesgo con sh: true) ],
}
```

Reglas de `blocks` (los 5 bloques = las 5 etapas, `body` es HTML bilingüe):

- Tablas con `class='sp-t'` — la **primera columna se resalta sola**; la columna de componente lleva `class='sp-c'`. Fórmula/estimación con `class='sp-est'`.
- Aviso de cierre del bloque 4 con `class='sp-warn'`; subtítulo "Shadow AI" con `class='sp-sh'`.
- El bloque de **riesgo** lleva `sh: true`.

### Roles de gateway (item 4 — label + chip)

En `gw` marca el rol que juega el gateway en el caso: **LLM Gateway**, **MCP Gateway**, **AgentGateway** (puede haber varios). Es también un eje de filtro del catálogo.

### Extensión multiagente (item 12 — opcional, casos que lo justifiquen)

Para Legal, Finanzas y similares: modelar uno o dos **nodos validadores** (ejecutor + verificadores) que comprueban partes de la salida antes de impacto/remediación, con arista de validación y **elevación al HITL** si un validador falla. Encaje: kagent orquesta A2A, agentgateway da identidad por agente, agentevals es la capa de validación (LLM-as-judge con traza), agentregistry inventaría cada validador. Ver `TODO.md` item 12.

### Verificar

Tras añadir/editar un caso: `cd website && npm run build` (es + en, 0 errores). El túnel en modo `serve` refleja el nuevo build.

## Checklist antes de dar por hecho un caso

- [ ] Carpeta y slug correctos; sidebar actualizado si aplica.
- [ ] Los 5 bloques con sus encabezados exactos + identificación.
- [ ] Texto en **ES y EN**.
- [ ] Bloque 2 con Local + Copilot + Claude Code + tabla de MCPs (`vault://` + scopes mínimos) + alternativas.
- [ ] KPIs con cifras marcadas `*(estimación, T1)*`.
- [ ] Bloque 4 con patrón "Si trabajo desde X…", **shadow AI**, normativa citada y cierre fijo.
- [ ] Bloque 5: tabla riesgo→componente→mecanismo (solo mecanismos verificados) + identidad + dónde se aplican políticas.
- [ ] Si lleva reproductor: caso añadido a `CASES` en `casos.js` (role, pat, gw, title, scTitle, scSub, n, risk, hitl, caps[5], comps[4], blocks[5]) con iconos oficiales por tipo de nodo.
- [ ] Build Docusaurus **es + en** limpio.
- [ ] Afirmaciones factuales nuevas marcadas como borrador-sin-T1.

## Dos artefactos por caso (no confundir)

1. **Ficha markdown** (`pieza-0-alfabetizacion/.../por-rol/<rol>/<slug>/README.md`) — el desarrollo largo escrito, para docs y PDF. Es donde viven las 119 fichas.
2. **Objeto del reproductor** (`CASES` en `casos.js`) — la versión **condensada** que anima el escenario y muestra los 5 bloques en la web. Solo los casos con reproductor lo tienen.

Pueden divergir en extensión (el reproductor es más breve), pero **el fondo debe coincidir**: mismos MCPs/scopes, mismos riesgos, misma remediación.

## Ejemplos de referencia (patrón canónico ejecutado)

- **Reproductor**: los 5 casos piloto en `website/src/components/ScenarioPlayer/casos.js` (`legal`, `finanzas`, `soc`, `ops`, `banca`) — molde del objeto y del tono. `legal` (redlining) es el más completo.
- **Ficha markdown**: `pieza-0-alfabetizacion/01-casos-de-uso/por-rol/06-legal/revision-contratos-redlining/README.md`.
