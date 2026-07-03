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

Cubierto en **Pieza 2** con scope `read-only` sobre cloud APIs, gate humano en CI/CD para PR auto-aplicación e identidad propia del agente.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
