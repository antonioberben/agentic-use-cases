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

> Estas vulnerabilidades se cubren con la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `manifest-generator` genera Deployment/Service/Ingress/PDB/HPA/NetworkPolicy siguiendo `AGENTS.md` del repo `platform-iac/`. **Nunca `kubectl apply`**: solo escribe archivos, valida con `kubeconform`/`kyverno`/`opa` y abre PR.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Manifiesto con `privileged: true` o `hostNetwork: true` por defecto → escalada de privilegios (**CIS Kubernetes · NIST SP 800-190**) | agentevals | pre-commit hook obligatorio: `kyverno` con políticas `disallow-privileged`, `disallow-host-network`; violación → PR descartado, no *softened*; librería de golden manifests como base obligatoria |
| Secretos en `env` directo en vez de `secretRef` → credenciales en YAML del repo (**PCI-DSS · GDPR art. 32**) | agentevals + agentgateway | validador determinista busca patrones `password:`, `apikey:`, `token:` con valor literal → PR bloqueado; obliga a `valueFrom: secretKeyRef`; `gitleaks` en pre-commit adicional |
| Agente con `mcp-kubernetes` en modo `apply` → despliegue en producción no aprobado | agentregistry | scope publicado: `filesystem:rw` sobre repo, `git:pr`; `mcp-kubernetes` **no publicado** para este agente; separación estricta de `manifest-generator` vs `iac-reviewer` |
| Manifiesto sin `resources.limits` → un pod puede consumir todo el node | agentevals | eval determinista: cada container debe tener `resources.requests + resources.limits` (cpu/memory); miss → PR marcado `[FALTA RESOURCE LIMITS]` |
| Copiar convenciones de un producto/entorno a otro (labels de dev en manifiesto de prod) | agentgateway | input schema obligatorio con `environment` y `product_id`; `AGENTS.md` cargado del subdirectorio correcto; labels obligatorias verificadas contra baseline por entorno |
