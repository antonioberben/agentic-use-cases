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

Inventario inicial → contacto con equipos → onboarding al programa de gobierno (Pieza 2).

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

Cubierto en **Pieza 2** con base jurídica de control documentada, información al empleado, gate humano en bloqueos masivos y onboarding al programa de gobierno antes de prohibir.

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

## 4. Cinco hábitos clave

1. **Lectura por defecto, escritura por excepción.** Sobre todo en SOC, IdP y cloud.
2. **Verifica la query antes de ejecutar.** Sintaxis correcta + semántica equivocada = FPs o TPs ocultos.
3. **Documenta uso de IA en investigaciones.** Prompt y versión del modelo en el ticket.
4. **Trata el LLM como un servicio expuesto.** Sanitiza entradas, filtra salidas, no le des secretos.
5. **Predica con el ejemplo.** Vuestro equipo es el modelo del resto de la empresa.

## 5. Qué evitar

- Pegar IOCs internos, configuraciones, resultados de auditoría o hallazgos pentest en chats no aprobados.
- Dar a un agente roles privilegiados directamente (Domain Admin, root, IAM amplios).
- Confiar en una conclusión de IR del modelo sin verificación humana.
- SOAR con IA con acciones de alto impacto (aislamiento, bloqueo masivo, reset privilegiado) sin gate.
- Vigilancia de empleados con IA sin base jurídica completa (GDPR + ET).
- Asumir que chatbot interno de seguridad no necesita mismos controles que cara al cliente.

## 6. Cómo seguir

- Lab base **"agente de triage de eventos"**: patrón SOC asistido (2.1, 2.2, 2.3).
- Lab base **"agente operacional read-only"**: patrón IR y hunting (2.2, 2.6).
- Lab base **"agente regulatorio/legal sobre documentos"**: patrón GRC (2.5, 2.7).
- Guías: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
- **Pieza 2 — Plan Director de IA**: la otra mitad. Para vuestro rol es trabajo propio, no lectura.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
