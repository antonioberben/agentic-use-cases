# Generación de manifiestos e IaC

> **Rol:** operador · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Necesitas Deployment + Service + Ingress + PDB + HPA + NetworkPolicy para un servicio nuevo. Se busca: YAML válido siguiendo convenciones del equipo, con `resources`, `securityContext`, labels y probes correctos.

## 2. Cómo resolverlo

**Local.** Llama 70B + Qwen-Coder. Útil para iteración rápida.

**Copilot (VS Code / Cursor / Claude Code).** Con `AGENTS.md` que fija convenciones internas (naming, labels obligatorias, no `privileged`, recursos con limits, etc.).

**Claude Code.** Repo `platform-iac/` con `AGENTS.md`, ejemplos válidos en `examples/`, validador (`kubeconform`, `kyverno`, `opa`) en pre-commit. Comando: *"Manifiestos para servicio `checkout-api`. Patrón `examples/api-service/`."*

**MCPs:** Filesystem, Git, **NUNCA** `mcp-kubernetes` con `apply` para esto.

**Alternativa.** Plantilla con Helm + values; el agente solo rellena values.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-manifiestos servicio nuevo | *2-4 h* | *20-30 min* |
| % manifiestos que pasan validador a la primera | *50%* | *> 90%* |
| Vulnerabilidades en review (privileged, recursos abiertos) | *frecuentes* | *raras* |

**Fórmula:** ≈ (3 h − 0.4 h) × 25 servicios/año ≈ **65 h/año** por operador.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente genera manifiesto con `privileged: true` o `hostNetwork: true` por defecto, abro escalada de privilegios."*
- *"Si copia secretos en `env` directamente en lugar de `secretRef`, los credenciales quedan en YAML del repo."*
- *"Si el agente conecta a Kubernetes y aplica directamente sin gate, una alucinación produce despliegue en producción no aprobado."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
