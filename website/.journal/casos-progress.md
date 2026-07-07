# Journal - Casos del ScenarioPlayer

Tracking del reproductor dentro de `website/`. La bitácora canónica está en `AGENTS.md` (§5 y §6 Handoff); este fichero es el resumen local.

## Estado actual (2026-07-06 cierre)

- Fichero: `src/components/ScenarioPlayer/casos.js`
- **Cobertura: 119/119 casos del catálogo customizados** (objeto `spec` propio por caso; 0 genéricos). Además 12 objetos piloto con id no-catálogo (inofensivos).
- Motor: `compiler.js` compila `spec: {actors, stages}` → layout/steps/viewBox. Los casos NO hardcodean coordenadas.
- Último build ES + EN: **limpio**.
- Datos servidos: `src/data/casos.json` (índice, generado por `scripts/generar-listado-casos.py`) + `src/data/casos-detalle.json` (detalle + reproductor, prebuild `website/scripts/build-cases-data.js`).

## Pendiente

- **Sincronizar fichas README ↔ objeto del reproductor** (divergen: 5 alineados · 89 parcial · 25 sin solape). Fuente de verdad: caso por caso. Plan en `TODO.md §G`. Informe por caso: `website/.journal/sync-divergencia.md`. Bloqueado por límite de gasto de la organización.
- Refuerzo T1 de KPIs/afirmaciones.

## Cómo autorar/editar un caso

1. Skill `crear-caso-de-uso` (modelo de datos del objeto).
2. Añadir/editar objeto en `CASES` de `casos.js` con `spec` declarativo (sin coordenadas).
3. `id` = id de catálogo `<rol>/<slug>` para que reemplace al genérico y sea deep-linkable con `?case=<id>`.
4. `npm run build` (es + en) para verificar.

## Convenciones (recordatorio)

- Bilingüe `{es, en}` en todo texto visible.
- 5 bloques = 5 etapas: Caso · Cómo (tabs Local/Copilot/Claude Code/MCPs/Alternativas) · KPIs (`sp-est` `(estimación, T1)`) · Vulnerabilidades (`sh:true` + `sp-sh` Shadow AI + `sp-warn`) · Remediación (tabs Sin gobierno/Parches DIY/Solo.io).
- Identidad canónica: SPIFFE mTLS + OIDC/JWT + OBO. Políticas: `AgentgatewayPolicy` + `AuthorizationPolicy`.
- Componentes Solo válidos: agentgateway, kagent, agentregistry, Istio ambient, agentevals, kgateway.
- Least privilege: MCPs read por defecto; un solo `*:write/send/approve` con gate (HITL).
