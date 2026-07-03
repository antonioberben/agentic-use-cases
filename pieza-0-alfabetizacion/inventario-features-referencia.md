# Inventario de features de referencia — Pieza 0

> ⚠️ **BORRADOR.** Inventario de features extraídas de aplicaciones de referencia para alimentar los labs y la base de conocimiento de la Pieza 0. Las features aquí listadas son **observaciones directas** de las apps analizadas (no requieren deep-research). Su traslado a contenido del entregable sí debe respetar el recordatorio de §3 de `AGENTS.md` cuando incluya afirmaciones factuales, estadísticas o mapeos normativos.

## Propósito

Recoger, de forma estructurada, las capacidades demostradas por aplicaciones públicas de referencia y mapearlas a (a) los **7 labs base** por patrón técnico (D11) y (b) la **base de conocimiento** de la Pieza 0 (manual por persona, guía de estándares, catálogo de casos). El objetivo no es clonar ninguna app, sino reutilizar sus patrones didácticos y de arquitectura.

## Fuentes analizadas

| Fuente | Tipo | Qué aporta |
|--------|------|------------|
| `zero-trust-agents.vercel.app` | SPA demo (Vite + React + Tailwind + Motion) | Patrón narrativo de gobierno zero-trust de agentes en un dominio regulado (telco, TM Forum). Modelo visual de zonas, MCP, agentes y gating de acciones. |
| `vercel-labs/open-agents` | Plantilla de agente de codificación | Runtime de agente durable, sandbox aislado, integración con repositorios, streaming, gestión de sesión. |
| `vercel-labs/deepsec` | Harness de seguridad agéntico | Escaneo de vulnerabilidades con fan-out, triage por severidad, reducción de falsos positivos, modo diff para CI. |
| `vercel-labs/agent-browser` | Primitivas de navegador para agentes | Automatización de navegador con allowlist de dominios, gates de confirmación, política de acciones, aislamiento de sesión. |

Identidad/origen del SPA `zero-trust-agents`: no es repo público de `solo-io` ni de `tjorourke`; probablemente desplegado desde repo privado en Vercel. Pendiente de confirmar con el autor o desde el panel de Vercel.

---

## A. Features de `zero-trust-agents` — patrones de contenido (seguridad y arquitectura)

Lo que la app **demuestra conceptualmente**. Estos patrones alimentan el contenido de los labs y del catálogo.

| ID | Feature / patrón | Descripción observada | Relevancia Solo |
|----|------------------|------------------------|-----------------|
| C1 | Topología de zonas | Tres clústeres lógicos (Tools, Datacenter, Monitoring), cada uno con identidad y frontera propia. | Istio ambient (segmentación), agentgateway (frontera de zona). |
| C2 | MCP como punto de acceso a sistemas | Cada sistema externo (Policy/PCRF, ITSM/CMDB, Core/IMS, RAN/CEM, Prometheus/xDR) se expone vía un servidor MCP dedicado (`policy-mcp`, `itsm-mcp`, `core-mcp`, `ran-mcp`, `monitoring-mcp`). | agentgateway (mediación MCP), agentregistry (inventario). |
| C3 | Agentes como ciudadanos identificados | Agentes nombrados con función explícita (`cladra-agent`, `act-agent`, `slo-agent`, `core-diagnostic-agent`, `ran-diagnostic-agent`, `reporting-agent`). | Identidad de agente como control de primera clase. |
| C4 | Gating de acciones por estado | Máquina de estados sobre cada flujo: `active` → `gate` → `pass` / `block`, con `trace` para auditoría. Cada llamada cruzada se evalúa contra política. | agentgateway (política, prompt guard), kagent (orquestación). |
| C5 | Remediación de lazo cerrado gobernada | Escenario "happy path" (S1, *Governed Autonomy*): el agente detecta, propone, pasa el gate de política y remedia de forma autónoma pero supervisada. | Caso de uso operacional read/write con control. |
| C6 | Escenarios adversariales | S2 a S6: prompt injection, escalada de privilegios, scope creep, identidad de agente no verificada, agente rogue desplegado (`shadow-mcp`, `test-policy-agent`). El gate **bloquea** y deja traza. | Mapea a OWASP LLM / Agentic Threats; demuestra el valor del control. |
| C7 | Observabilidad / traza como evidencia | Estado `trace` resalta el camino auditable de cada decisión. | Observabilidad y auditoría (Parte III, cap. 13 de Pieza 2). |
| C8 | Encuadre regulatorio / sectorial | Marco TM Forum (telco) como contexto de credibilidad. | Anexo B telco; encaje con núcleo agnóstico + apéndices (D3). |

## B. Features de `zero-trust-agents` — patrones de presentación (cómo construimos el website de labs)

Lo que la app **hace como artefacto interactivo**. Estos patrones informan la construcción del website de labs (D13: Docusaurus + GitHub Pages). Un reproductor de escenarios como este puede embeberse como componente React dentro de Docusaurus.

| ID | Feature de UX | Descripción observada | Uso en Pieza 0 |
|----|---------------|------------------------|----------------|
| U1 | Reproductor de escenarios | Selector S1 a S6 + contador de pasos ("of 23") + play/pause/stop + velocidad 0.5×/1×/2× + Prev/Next. | Patrón para "walkthroughs didácticos" (D11): cada lab es un escenario con pasos navegables. |
| U2 | Diagrama animado de topología | Nodos posicionados + aristas con flujo punteado animado coloreadas por estado. Construido a mano (SVG + Motion), sin librería de diagramas. | Visualizar el patrón técnico de cada lab sin pedir al lector que despliegue nada. |
| U3 | Leyenda y ayuda contextual | Toggle de leyenda de estados; botón de ayuda. | Onboarding del lector no técnico (capítulo puente, D12). |
| U4 | Controles de zoom | −/100%/+ sobre el lienzo. | Accesibilidad del diagrama. |
| U5 | Tema oscuro con tokens | Paleta y tipografía codificadas como variables (Inter + JetBrains Mono, acento kagent-purple). | Base para alinear el website con la identidad Solo/kagent (skill `solo-design`). |

Tokens de diseño observados (referencia, no normativos):

```
--bg-deep:#0a0a14  --bg-surface:#12122a  --bg-card:#1a1a2e  --border-subtle:#2d2d5e
--kagent-purple:#6c3fc5  --kagent-purple-glow:#8b5cf6  --kagent-purple-soft:#9f7aea
--state-active:#3b82f6 --state-gate:#f59e0b --state-pass:#10b981
--state-block:#ef4444  --state-adversarial:#fb923c --state-trace:#a855f7
--mcp-healthy:#00d4aa
--text-primary:#f5f5fa --text-secondary:#a0a0c0 --text-muted:#6c6c8a
```

Stack confirmado: Vite + React + Tailwind + Motion (Framer Motion), fuentes self-hosted, sin librería de diagramas ni backend (SPA estática).

## C. Features reutilizables de proyectos agénticos de Vercel

Capacidades genéricas de construcción de agentes, útiles como material de los labs y del catálogo.

| ID | Feature | Origen | Uso en Pieza 0 |
|----|---------|--------|----------------|
| V1 | Runtime de agente durable (multi-paso, reanudable, streaming) | open-agents | Explicar al lector qué es una "sesión" y por qué un agente no es una llamada única (guía de estándares, gestión de sesiones). |
| V2 | Sandbox aislado con snapshot/resume | open-agents | Patrón de aislamiento y reproducibilidad; refuerza D13 (devcontainer/Codespaces). |
| V3 | Integración con repositorios (clone, branch, commit, PR) | open-agents | Lab 3 (código y AGENTS.md): el agente trabaja sobre un repo real. |
| V4 | Conjunto de herramientas del agente (leer/editar, buscar, shell, web) | open-agents | Catálogo de "qué puede hacer un agente con herramientas"; base del concepto MCP. |
| V5 | Escaneo de seguridad con fan-out + triage por severidad (P0/P1/P2) | deepsec | Lab 2 (triage de eventos) y contenido para persona seguridad/SOC. |
| V6 | Reducción de falsos positivos / revalidación contra historial | deepsec | Enseñar "la IA como crítico iterativo" (guía de estándares, iteración crítica). |
| V7 | Modo diff para CI (escanear solo lo cambiado) | deepsec | Patrón de integración en pipeline; persona desarrollador y plataforma. |
| V8 | Inyección de contexto de proyecto (INFO.md, 50-100 líneas) | deepsec | Paralelo directo a `AGENTS.md`; refuerza la guía de estándares (cap. 01). |
| V9 | Snapshot del árbol de accesibilidad con refs deterministas | agent-browser | Cómo un agente "ve" una interfaz; base de agentes operacionales y frontline. |
| V10 | Allowlist de dominios + gates de confirmación + política de acciones | agent-browser | **Refuerzo clave del mensaje zero-trust**: el control de herramientas no es exclusivo del servidor; el cliente/agente también aplica least-privilege. |
| V11 | Cifrado de estado/credenciales (AES-256-GCM) | agent-browser | Gestión de claves y secretos del agente (Anexo C plantillas). |
| V12 | Servidor MCP con descubrimiento tipado de herramientas | agent-browser | Refuerza C2; cómo se publica una herramienta a un agente. |

---

## Mapeo a los 7 labs base (D11)

Cada lab base es un walkthrough didáctico (no ejecutable en v1). Las features alimentan su guion.

| Lab | Patrón técnico | Features que lo alimentan | Escenario narrativo sugerido (estilo U1) |
|-----|----------------|---------------------------|------------------------------------------|
| 1 — Agente analítico sobre datos | analítico | C2, C7, V1, V4 | Agente consulta métricas vía MCP de monitorización; se traza cada consulta. |
| 2 — Triage de eventos/alertas | triage | C4, C6, V5, V9 | Llega una alerta; el agente clasifica por severidad y propone acción; el gate decide. |
| 3 — Código y AGENTS.md | código | V3, V7, V8 | Agente sobre repo real con AGENTS.md vs sin contexto (ya iniciado). |
| 4 — Operacional read-only | operacional | C3, C4, C5, V9, V10 | Agente de diagnóstico read-only; intento de acción de escritura bloqueado por política. |
| 5 — Asistente frontline | asistencia | C3, V4, V10, V11 | Asistente al empleado con least-privilege e identidad verificada. |
| 6 — Regulatorio/documentos | documentos | C7, C8, V6 | Agente legal/compliance con control de salida y traza auditable. |
| 7 (opc.) — Creativo con control | generación | V6, V10 | Generación con guardrails de salida. |

**Escenario adversarial transversal (de C6):** además de los 7 labs por patrón, se propone un **walkthrough adversarial común** que recorre prompt injection, escalada de privilegios, scope creep, identidad no verificada y agente rogue, mostrando en cada caso cómo el control (agentgateway/kagent) bloquea y deja traza. Reutiliza directamente el patrón S2-S6 del SPA de referencia.

## Mapeo a la base de conocimiento

| Bloque de Pieza 0 | Features aplicables | Cómo se usan |
|-------------------|---------------------|--------------|
| Capítulo puente (D12) | U1, U3, V1 | Explicar sesión, contexto y herramientas con apoyo visual antes de los labs. |
| Manual por persona | C3 (seguridad), V5/V7 (desarrollador, plataforma), V9/V10 (operador, frontline) | Hábitos por rol con ejemplos concretos de las features. |
| Guía de estándares | V8 (AGENTS.md vs INFO.md), V1/V2 (sesiones y aislamiento), V6 (crítico iterativo), C2/V12 (MCP) | Núcleo de la guía operativa. |
| Catálogo de casos | C2, C5, C6, V5 | Fichas con patrón técnico, riesgos y componentes Solo. |
| Website de labs (D13) | U1-U5 | Patrón de construcción: Docusaurus + componente React de reproductor de escenarios con tokens alineados a Solo. |

## Alcance y pendientes

- Confirmar origen del SPA de referencia (repo/propietario en Vercel) antes de reutilizar texto o assets literales; por ahora solo se reutilizan **patrones**, no contenido.
- Los tokens y el stack son referencia; el website propio debe alinearse a la identidad Solo vía skill `solo-design`, no copiar la paleta ajena tal cual.
- Toda afirmación factual derivada (estadísticas de adopción, mapeos OWASP/normativos, cifras de incidentes) queda sujeta al deep-research (T1) pendiente.
