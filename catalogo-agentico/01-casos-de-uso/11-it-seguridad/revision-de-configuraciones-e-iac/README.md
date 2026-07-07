# Revisión de configuraciones e IaC

> **Rol:** it-seguridad · **Caso 2.6** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** 200 manifiestos Terraform, módulos Helm, políticas IAM, reglas firewall. Hoy: revisiones manuales esporádicas.

**Cómo resolverlo.**

- *Plataformas CSPM/CNAPP:* **Wiz**, **Prisma Cloud**, **Lacework**, **Snyk IaC**, **Checkov**, **Trivy**.
- *Claude Code:* repo IaC con `AGENTS.md` señalando baseline (CIS, NIST 800-53, ENS).
- *Local:* Ollama sobre manifiestos exportados.
- *MCPs:* `mcp-github` (PRs IaC, lectura), `mcp-wiz` o `mcp-prisma` (hallazgos CSPM), `mcp-aws-config` o `mcp-azure-policy`.

**Prompt:** *"Identifica desviaciones respecto a CIS Benchmark / NIST 800-53 / nuestra baseline. Por hallazgo: severidad, recurso, config actual, config esperada, riesgo, fix propuesto. NO corrijas automáticamente; propón."*

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Cobertura IaC con revisión continua | 30% | 100% |
| MTTR config drift | 30 días | 2 días |
| Hallazgos críticos detectados en CI | 50% | 98% |
| Tasa de FP del scanner | 25% | 8% |

*Fórmula:* `(10 h × 4 sem) × 12 = 480 h/año por security architect`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente aplica `terraform apply` automático, una "corrección" rompe infra productiva.*
- *Si conecta a AWS con role amplio (PowerUser/AdminAccess), lateralización si se compromete.*
- *Si el modelo "sugiere" abrir un puerto basado en stack trace, expones el entorno.*

Cubierto en la **arquitectura de remediación (bloque 5)** con scope `read-only` sobre cloud APIs, gate humano en CI/CD para PR auto-aplicación e identidad propia del agente.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A8 — Asistente de código con AGENTS.md* aplicado a IaC (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `iac-reviewer` revisa Terraform/Helm/IAM contra baseline CIS/NIST 800-53/ENS y **propone PR con fix**, nunca hace `terraform apply`. Read-only sobre AWS/Azure/GCP APIs.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Agente aplica `terraform apply` automático → rompe infra productiva | agentregistry + kagent | scopes `terraform:read`, `helm:template`; `apply`, `destroy`, `upgrade` **no publicados**; el agente solo puede abrir PR en GitHub, no mergear ni ejecutar CI/CD |
| Agente con role IAM amplio (PowerUser/AdminAccess) → lateralización si compromiso (**ENS · NIST AC-6 least privilege**) | Istio ambient (SPIFFE) | SA `svc-iac-reviewer` con IAM role de solo lectura (`ReadOnlyAccess` + `IAMReadOnlyAccess`); rotación de credenciales cada 4h vía OBO |
| Modelo "sugiere" abrir puerto basado en stack trace → configuración insegura merged | agentevals | validador post-generación: cada PR generado pasa por `checkov`/`tfsec` antes de aparecer como sugerencia; `severity=critical` en el escaneo → PR descartado, no propuesto |
| Fuga de configuración de infra (topología, security groups, VPC layout) a LLM público → mapa para atacante | agentgateway | `data-classification=infra-topology` fuerza modelo on-prem; consumer-tier LLMs deny; audit trail de qué config ha visto qué modelo |
| Falso positivo del scanner → fricción y bypass ("skip check") | agentgateway + agentevals | política de suppression con TTL y justificación obligatoria en el propio commit; suppression > 30 días → re-review automática; skip-check sin justificación → PR bloqueado |
