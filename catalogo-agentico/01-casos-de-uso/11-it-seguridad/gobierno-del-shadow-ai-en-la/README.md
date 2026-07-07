# Gobierno del *shadow AI* en la propia organización

> **Rol:** it-seguridad · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

**Caso de uso.** Descubrir qué herramientas de IA usa ya el negocio sin que seguridad lo sepa. Hoy: aprende por incidentes (filtración, breach).

**Cómo resolverlo.**

- *Plataformas con discovery IA:* **Netskope**, **Zscaler**, **Microsoft Defender for Cloud Apps**, **Lakera Guard**, **Prompt Security**, **Lasso Security**.
- *Claude Code:* repo `shadow-ai-inventory/` con scripts y `AGENTS.md`.
- *Copilot Power BI:* dashboard sobre data del CASB.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-netskope` o `mcp-zscaler` | Tráfico web a proveedores IA |
| `mcp-defender-cloudapps` | Apps SaaS descubiertas |
| `mcp-entra-id` | OAuth grants a apps IA |
| `mcp-concur` o `mcp-coupa` | Cargos tarjeta corporativa a proveedores |

**Prompt:** *"Identifica accesos a dominios de proveedores IA (openai.com, anthropic.com, gemini.google.com, ...) y cargos tarjeta corporativa últimos 90 días. Agrupa por usuario, equipo, proveedor. Marca volúmenes inusuales."*

Inventario inicial → contacto con equipos → onboarding al programa de gobierno (la arquitectura de remediación (bloque 5)).

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| % IA herramientas catalogadas | desconocido | 95% |
| Usuarios IA sin política firmada | 70% | < 5% |
| Tiempo desde uso hasta gobierno | nunca | < 30 días |
| Incidentes por shadow AI | 4/año | 0 |

*Fórmula:* difícil cuantificar, pero un breach por shadow AI puede costar 6-7 cifras. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el descubrimiento incluye datos personales de usuarios (qué hace cada uno) sin base GDPR, vigilancia de empleados → ET + LOPDGDD.*
- *Si los datos del CASB se exfiltran, mapa completo de uso interno de IA expuesto.*
- *Si bloqueas masivamente sin acompañamiento, los equipos buscan VPN y dispositivos personales — shadow AI más oscuro.*

Cubierto en la **arquitectura de remediación (bloque 5)** con base jurídica de control documentada, información al empleado, gate humano en bloqueos masivos y onboarding al programa de gobierno antes de prohibir.

## 3. MCPs: cómo enchufar tus fuentes al agente

| MCP | Para qué lo usas |
|-----|------------------|
| SIEM (Sentinel, Splunk, Chronicle, Elastic, QRadar) | Alertas, eventos, *hunting* |
| EDR / XDR (CrowdStrike, SentinelOne, Defender, Cortex) | Endpoint, procesos, telemetría |
| IdP (Entra ID, Okta, Ping) | Identidad, *sign-ins*, riesgo |
| Cloud (AWS / Azure / GCP) | Configuración, IAM, logs |
| CSPM / CNAPP (Wiz, Prisma, Lacework) | Postura, derivas, vulnerabilidades |
| Vuln mgmt (Tenable, Qualys, Rapid7) | Hallazgos, criticidad, *patching* |
| GRC (Vanta, Drata, OneTrust) | Políticas, controles, evidencias |
| Ticketing (ServiceNow, Jira) | Casos, *change management* |

**Reglas adicionales para IT y seguridad (las más estrictas):**

- **Aislamiento del plano de control.** Agente con MCP sobre IdP, EDR o firewall: **lectura por defecto**. Toda escritura: gate humano + SoD + registro inmutable.
- **Datos sensibles fuera de modelos públicos.** IOCs internos no publicados, pentest, listas de activos críticos: solo modelos aprobados con cláusulas contractuales.
- **No le des al agente las llaves del Reino.** Global Admin, Domain Admin, root jamás como identidad de agente. Identidad propia, least privilege, rotación, auditoría.
- **Defensa específica contra ataques al LLM.** Prompt injection, tool poisoning, data exfil via context: mismas guardas que apps expuestas.
- **Auditoría completa.** Input, modelo+versión, output, herramientas invocadas, decisión humana.
- **Vigilancia del proveedor de IA.** Cambios de política, sub-processors, regiones.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)) + **agentregistry como pieza central** (no es opcional: es lo que hace desaparecer el shadow AI). El agente `shadow-ai-hunter` cruza CASB (Netskope/Zscaler) + Defender Cloud Apps + Entra OAuth grants + Concur/Coupa. Un sub-agente **`risk-validator`** (A2A, SPIFFE separado) valida los hallazgos (matching de proveedor por dominio) para descartar falsos positivos antes del handoff. Todo hallazgo se compara contra el catálogo de agentregistry: lo que no está en el registry es shadow AI.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Descubrimiento con datos personales de empleados sin base jurídica (**GDPR art. 6 · LOPDGDD · ET art. 20.3**) | agentgateway | agregación forzada por equipo (no por usuario individual) por defecto; drilldown a usuario solo con `role=dpo` + justificación registrada; DPIA obligatoria al despliegue |
| Datos del CASB (mapa completo de uso IA interno) exfiltrados por LLM público | agentgateway | procesamiento forzado on-prem (`data-classification=confidential-strategy`); output solo accesible a `role=ciso` y `role=dpo` |
| Bloqueo masivo sin acompañamiento → equipos usan VPN + dispositivos personales (shadow AI más oscuro) | kagent | política `block:decide=deny` para el agente; el agente propone `onboarding-track` (catalogar en agentregistry) por defecto, no bloqueo; bloqueo requiere aprobación CISO + comité |
| Falso positivo (proveedor lícito confundido con IA no aprobada) → fricción injustificada | agentevals | catálogo de proveedores IA con `official=true` cargado en agentregistry; matching por dominio + hash de organización; sin match doble, no se etiqueta shadow |
| El propio agente `shadow-ai-hunter` es shadow AI hasta que se autorregistre | agentregistry | el primer paso del despliegue es registrar el agente en el propio agentregistry con SPIFFE ID, MCPs, alcance y DPIA; "eat your own dogfood" audit-ready |
