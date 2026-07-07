# Arquetipos dinámicos del reproductor — taxonomía extendida

> **Objetivo.** Que los 119 casos NO se vean iguales en el reproductor. Hoy el 59 % comparte la forma "agente + validador + 4 MCPs" y en el 100 % el HITL está en la última etapa. Esta taxonomía introduce variación real en **cuatro ejes** que el motor (`compiler.js`) ya soporta pero los specs no aprovechan.

## Diagnóstico (2026-07-06)

- Solo **9 formas** distintas entre 119 casos; una forma cubre **70 casos**.
- **HITL siempre en la etapa `pass`** (la última): 125/125. Nunca antes.
- La vulnerabilidad mostrada (`c.risk` en la etapa `block`) varía en texto pero el nodo resaltado (`danger`) es casi siempre `shadow` + `ext`.

## Los cuatro ejes de variación (todos soportados por el motor)

El motor renderiza por etapa: `kind`, `on`, `danger` (nodos en rojo), `edges` (con estados `active/pass/mcp/adv/block/gate/trace`), `badge` (`id`/`risk`/`ok`), `hitl` (bool), `gw` (bool). Y por caso: `c.risk`, `c.hitl`, `c.hitlEdge`. Con eso se puede variar:

1. **Forma (topología)** — nº de MCPs (1–5), con/sin validador A2A (`role:'validator'`), con/sin `remote` (agente A2A externo), con/sin `kgateway` (ingress), nº de `external`.
2. **Momento del HITL** — poner `hitl:true` + `badge` en la etapa que corresponda:
   - **HITL temprano** (antes de tocar datos): gate en `solucion` o `impacto`. Casos donde la aprobación autoriza el *acceso* (KYC, discovery, datos art. 9).
   - **HITL tardío** (antes de escribir/enviar): gate en `pass`. Casos de write-back/publicación.
   - **Sin HITL** (solo lectura/deflection): ninguna etapa con `hitl:true`; el control es el guardrail de salida.
   - **Doble control**: gate en `impacto` (validador bloquea) y de nuevo en `pass` (humano firma).
3. **Vector de vulnerabilidad destacado** — `danger:[...]` + `c.risk` apuntan al nodo/riesgo real del caso, no siempre `shadow`:
   - `prompt-injection` → `danger:['ext']` (o el MCP-fuente); arista `adv` desde la fuente al agente.
   - `shadow-mcp` → `danger:['shadow']`.
   - `jailbreak` → `danger:['user']` (turno del cliente adversarial, típico A4).
   - `exfiltración` → `danger:['llm']` (dato sale al proveedor).
   - `excessive-agency / write sin gate` → `danger:['mcpX']` (el MCP con `:write`).
   - `cross-tenant` → `danger:['mcp*']` del tenant vecino.
   - `envenenamiento de datos` → `danger:['mcpA']` (fuente RO comprometida).
4. **Coreografía de aristas** — el orden en que aparecen (`ap` de cada nodo) y los estados (`mcp` para lectura, `adv` para tráfico adversarial, `gate` pendiente, `block` denegado).

## Catálogo de arquetipos dinámicos (base × variante)

Mantener los 8 arquetipos-base (A1–A8, `arquetipos.md`) como **familia**, y añadir un sufijo de **variante** que fija los cuatro ejes. Notación: `A<N>.<v>`.

| Código | Base | Forma | HITL | Vector destacado | Casos típicos |
|---|---|---|---|---|---|
| A1.doc | documental + validador | 3 MCP RO + validador A2A + 1 MCP gate | tardío (`pass`) | alucinación de cita (`danger:['llm']`) | redlining, dictámenes, DD |
| A1.ingest | documental sin write | 2–3 MCP RO, sin gate | ninguno | prompt-injection desde PDF (`danger:['ext']`) | lectura DORA, jurisprudencia |
| A2.soar | triage + acción SOAR | 3 MCP RO + 1 MCP acción (gate) SIN validador | tardío, acción fuera de banda | acción sin gate (`danger:['mcp-soar']`) | triage SOC, phishing, on-call |
| A2.route | triage + enrutado | 2 MCP RO + 1 MCP gate | temprano (`impacto`) | mala clasificación / injection (`danger:['ext']`) | triage tickets/bandeja |
| A3.writeback | analítico write-back | 2–3 MCP RO + 1 MCP `:write` gate + validador de cifras | tardío | write sin gate / SoD (`danger:['mcp-erp']`) | varianza, conciliación, forecast |
| A3.ro | analítico solo lectura | 2–3 MCP RO, sin gate | ninguno | exfiltración a LLM (`danger:['llm']`) | EDA, dashboards, people-analytics |
| A4.chat | chatbot cara al cliente | kgateway ingress + 2 MCP scoped (cliente_actual) + output-guard | ninguno (deflection); escalado gated | jailbreak (`danger:['user']`) + cross-tenant | chatbot, atención, frontline |
| A5.iac | operacional infra | git RO + k8s RO + 1 MCP `apply/PR` gate | tardío (PR) | comando destructivo (`danger:['mcp-k8s-op']`) | IaC, manifiestos |
| A6.web | research multi-fuente | web-fetch (allowlist) + 2 MCP RO, `ext` protagonista | ninguno (o gate en distribuir) | prompt-injection web (`danger:['ext']`) + egress | competitivo, briefing, SEO |
| A7.gen | generación con guardrails | 2 MCP RO (marca/plantillas) + 1 MCP `publish` gate + brand-validator | tardío (publicar) | claim/disclosure (`danger:['llm']`) o marca | contenido, campaña, ofertas |
| A8.code | asistente de código | git RO + repo-fs + issue RO + 1 MCP `push feat/*` gate + symbol-validator | tardío (PR) | secretos al LLM (`danger:['llm']`) / push a main | refactor, revisión PR, triage |

> La tabla es punto de partida. Se pueden crear más variantes (p. ej. `A2.soar` con HITL doble, `A4.chat` con validador de compromisos) siempre que **cambien al menos un eje** respecto a las vecinas.

## Cómo se aplica a cada caso (plan de ejecución — bloqueado por presupuesto)

1. **Mapear cada uno de los 119 casos a un `A<N>.<v>`** según su README real (qué hace, si escribe, si es cara al cliente, cuál es su riesgo estrella). Guardar el mapeo en `casos.json` (nuevo campo `arqDin`) vía el generador.
2. **Reescribir el `spec` de cada caso** para que su forma, momento de HITL, `danger` y `c.risk` coincidan con su variante. Una tanda de subagentes por variante (no por rol), para que dentro de una variante compartan esqueleto pero difieran en etiquetas, y **entre variantes se vean distintos**.
3. Verificar con el mismo script de conteo de formas: objetivo **≥ 11 formas** bien repartidas y **HITL repartido** entre `impacto`/`pass`/sin-HITL (no 125 en `pass`).
4. `npm run build` (es+en) por tanda.

## Regla para casos nuevos (→ skill `crear-caso-de-uso`)

Al autorar un caso, elegir la **variante dinámica** además del arquetipo base, y fijar en el spec: nº real de MCPs del caso, etapa del HITL según cuándo ocurre la acción sensible, `danger` en el nodo del vector real, y `c.risk` describiendo ESE vector. No copiar el molde "4 MCP + validador + HITL en pass" por defecto.
