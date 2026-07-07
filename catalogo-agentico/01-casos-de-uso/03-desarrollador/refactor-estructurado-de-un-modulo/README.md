# Refactor estructurado de un módulo

> **Rol:** desarrollador · **Caso 3.1** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Módulo de 2-5 KLOC acumulado en seis meses: lógica duplicada, naming inconsistente, tests aplastados contra implementación. Tu PR de "limpieza" lleva tres semanas aplazado porque cada vez que abres el archivo hay otro fuego. Se busca: agente con contexto del repo (`AGENTS.md`, convenciones, tests), propone plan, ejecuta paso a paso con tests verdes en cada commit, tú revisas diff.

## 2. Cómo resolverlo

**Local.** Ollama + Qwen2.5-Coder 32B o DeepSeek-Coder en máquina con GPU decente. Útil para refactors triviales, queda corto en cambios estructurales.

**Copilot (GitHub Copilot Chat / Workspace).** Copilot Workspace acepta una *spec* en lenguaje natural, propone plan, genera diff revisable. Bueno si el repo vive en GitHub Enterprise y la política lo permite.

**Claude Code / Cursor / Aider.** El camino más usado por desarrolladores hoy. Repo con `AGENTS.md` que fija convenciones, estilos, tests obligatorios y prohíbe `git push --force`, `git rebase -i`, modificar `.env`. Comando: *"Refactoriza `src/billing/` siguiendo el plan en `docs/refactor-plan.md`. Ejecuta tests en cada commit. Para si fallan."*

**MCPs (configuración y conexión):**

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| Filesystem | `mcp-filesystem` | `npx @modelcontextprotocol/server-filesystem ${WORKSPACE}` | rutas restringidas al repo del refactor, no `$HOME` |
| Git | `mcp-git` | `npx mcp-git --repo ${REPO}` | commit y branch, **no** `push --force` ni borrado de ramas remotas |
| GitHub | `mcp-github` | `npx mcp-github` | lectura de PRs e issues; sin permisos de merge ni admin |
| Tests / CI | `mcp-pytest` / `mcp-jest` o ejecución local | `pytest -q` por bash tool | sin acceso a secretos de CI |

Identidad propia (`svc-dev-refactor-agent`). El `mcp-git` se limita a operaciones en branch local; el merge a `main` lo hace el desarrollador.

**Alternativa.** Sin MCPs: agente con acceso a filesystem + ejecución de tests local, sin acceso a CI ni red. Refactor en sucesivas iteraciones cortas.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-refactor | Horas para refactor de módulo de 2-5 KLOC | *15-30 h* | *3-6 h* (revisión y diseño) |
| % refactors con tests verdes en todos los commits | Disciplina | *50%* | *> 90%* |
| Bugs introducidos por refactor | Regresiones detectadas en semanas siguientes | *2-4* | *0-1* |
| Refactors emprendidos por trimestre | Throughput | *1-2* | *4-6* |

**Fórmula simple:**

```
Ahorro_anual_h ≈ (TT_base − TT_nuevo) × refactors_año
```

Ejemplo: (22 − 5) h × 16 refactors/año = **272 h/año** por desarrollador. El valor mayor está en la deuda técnica que sí se aborda en lugar de aplazarse indefinidamente.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de filesystem tiene scope `$HOME`, el agente puede leer `.aws/credentials`, `.kube/config`, `.ssh/`. Una *prompt injection* (en un README de dependencia, en un test mal escrito) puede exfiltrar esas credenciales sin que yo lo vea."*
- *"Si el agente tiene `git push --force` permitido y se equivoca de rama, sobrescribe `main` y pierdo historial. Sin protección de rama y sin identidad propia del agente, no hay no repudio: el push queda firmado como mío."*
- *"Si pego código propietario en un asistente externo sin acuerdo de no-entrenamiento, el modelo puede memorizar fragmentos y devolverlos a otros clientes. Es fuga de propiedad intelectual silenciosa."*
- *"Si el agente ejecuta `pytest` con acceso a secretos de CI (DB de pruebas con datos reales, claves de pago de sandbox), esos secretos quedan en el contexto del agente y, si el proveedor del modelo entrena con prompts, salen del perímetro."*

**Riesgos típicos:** filesystem scope excesivo, secretos en variables de entorno leídos por el agente, prompt injection desde dependencias o tests, código propietario a modelo sin no-entrenamiento, `push --force` o merge automatizado sin gate humano, identidad compartida con el desarrollador.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* aplicado a refactor iterativo (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-dev-refactor-agent` propone plan → ejecuta commit → corre tests → repite. **Para si los tests fallan.** Un validador en cadena `symbol-validator` con identidad separada comprueba que el refactor no inventa símbolos ni APIs internas antes de habilitar el push a la rama del agente.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| MCP filesystem con scope `$HOME` → exfiltración de `.aws/credentials`, `.kube/config`, `.ssh/` por injection | agentregistry + agentgateway | `mcp-filesystem` publicado con path prefix limitado al workspace del refactor; `..` y rutas absolutas fuera del workspace deny; scan pre-envío bloquea contenido con patrón `AKIA`, `BEGIN.*PRIVATE KEY` |
| `git push --force` sobre `main` → pérdida de historial sin no repudio (**SOX ITGC · NIS2 art. 21**) | agentgateway + kagent | política per-tool: `git push --force` deny absoluto; `push` a `main`/`release-*` deny; branch protection GitHub + SPIFFE `svc-dev-refactor-agent` distinguible en audit |
| Código propietario a LLM externo sin cláusula de no-entrenamiento (**Directiva 2016/943**) | agentgateway + agentregistry | header `x-no-train` obligatorio; DPA verificado en catálogo; modelo on-prem para repos etiquetados `propietary`, `crypto`, `payments` |
| Secretos de CI en env leídos por `pytest` con acceso a DB de sandbox real | agentgateway | Bash tool ejecuta `pytest` en sandbox aislado con env filtrado (`DB_URL`, `STRIPE_KEY` no visibles); mock de servicios externos vía WireMock local |
| Identidad compartida con el dev (auditoría no distingue) | Istio ambient + agentgateway | SPIFFE `svc-dev-refactor-agent` ≠ identidad del dev; commits con author `Agent (via <dev>)` y trailer `Agent-ID: <spiffe>`; audit trail retenido 24m |
