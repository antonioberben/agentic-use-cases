---
title: "Casos de uso por rol"
sidebar_position: 1
---

# Casos de uso por rol

Trece roles. Cada rol tiene su subcarpeta; cada caso vive en su propia subcarpeta con **5 bloques**:

1. **Caso de uso** — problema y situación cotidiana del rol.
2. **Cómo resolverlo** — configuración técnica (Local, Copilot, Claude Code + MCPs con scopes mínimos).
3. **KPIs y mejora de rendimiento** — métricas y fórmula de valor.
4. **Vulnerabilidades y riesgos → gobernanza** — riesgos concretos con normativa aplicable.
5. **Arquitectura de remediación con gobernanza de IA** — diagrama de integración con la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway). Placeholder pendiente de completar caso por caso.

| Rol | Casos |
|-----|-------|
| [Manager](./01-manager/README.md) | 12 |
| [Analista](./02-analista/README.md) | 8 |
| [Desarrollador](./03-desarrollador/README.md) | 4 |
| [Operador (SRE/DevOps)](./04-operador/README.md) | 10 |
| [Finanzas](./05-finanzas/README.md) | 8 |
| [Legal](./06-legal/README.md) | 11 |
| [RRHH](./07-rrhh/README.md) | 10 |
| [Ventas](./08-ventas/README.md) | 9 |
| [Marketing](./09-marketing/README.md) | 9 |
| [Soporte](./10-soporte/README.md) | 11 |
| [IT / Seguridad](./11-it-seguridad/README.md) | 10 |
| [Ejecutivo](./12-ejecutivo/README.md) | 8 |
| [Frontline](./13-frontline/README.md) | 9 |

**Total: 119 casos** (25 F1 + 101 F2 − 7 duplicados F2 eliminados en Fase 3).

> **Estado**: Fases 1, 2 y 3 completas. **Pendiente**: completar bloque 5 (arquitectura de remediación) caso a caso con diagrama Solo real. Los `_todo-*.md` monolíticos siguen en disco excluidos del sitio.

Si te falta vocabulario (MCP, tokens, agentgateway), pasa antes por [Fundamentos](../02-fundamentos/README.md).
