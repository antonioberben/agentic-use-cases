# T03 — Revisión de contratos (redlining)

## Identificación

- **Rol principal**: abogado in-house, paralegal.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 1 piloto en propuesta de redacción; nivel 3 antes de tocar plantillas vivas o cláusulas regulatorias.

> Aviso permanente: capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

In-house legal recibe 100-300 contratos/año (NDAs, MSAs, DPAs, proveedores). Cada uno requiere comparar contra plantilla de referencia, marcar cláusulas que se desvían, sugerir redacción aceptable y dejar trazabilidad de la negociación. Hoy: lectura manual con cambios marcados, búsqueda repetitiva del precedente en correos. Cuello de botella claro y desgaste alto en redlining mecánico.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B sobre PDF + plantilla interna. Prompt: *"Compara el contrato con la plantilla. Lista cláusula a cláusula: idéntica, desviación menor (OK), desviación material (requiere revisión humana), faltante. Para desviaciones materiales, propón redacción que reduzca al estándar. Cita exacto el texto fuente. No inventes jurisprudencia."*

### 2.2 Copilot

Microsoft 365 Copilot sobre SharePoint del despacho. Sensibilidad `Confidential / Legal`.

### 2.3 Claude Code u otro agente de escritorio

Repo `legal/contracts/` con `AGENTS.md` que fija plantillas de referencia por tipo (NDA, DPA, MSA), umbrales de materialidad, formato de redline (track changes Word). Allowlist sin permisos de envío.

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-ironclad` | Ironclad MCP | `vault://legal/ironclad-ro` | `contracts:read,playbooks:read` |
| `mcp-sharepoint` | Microsoft Graph MCP | `Sites.Selected` solo site `legal-templates` | `documents:read` |
| `mcp-vlex` | vLex Vincent MCP (jurisprudencia) | `vault://legal/vlex-ro` | `cases:read,statutes:read` |

### 2.5 Alternativas

Harvey, Spellbook, Westlaw Edge AI con cláusula de no entrenamiento. Solo piloto con contratos sin partes identificables.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Tiempo medio de redlining por contrato | h | 3 h | 1 h |
| % cláusulas materiales detectadas | calidad | 85% | 97% |
| Reescrituras tras revisión socio | calidad | 30% | 10% |
| Coste por contrato | € | base | base × 0,4 |

Fórmula: *(3 − 1) h × 200 contratos/año = 400 h/año por abogado. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si trabajo desde un servicio público y subo el MSA con el cliente, rompo confidencialidad cliente-abogado y posiblemente NDA bilateral — pérdida de **privilegio legal**."*
- *"Si el modelo alucina jurisprudencia (caso `STS 1234/2023` que no existe) y se cita en una nota al cliente, sanción al despacho y pérdida de credibilidad."*
- *"Si el MCP de Ironclad tiene scope `contracts:write` y el agente firma una cláusula automáticamente, vinculo a la sociedad sin gate humano."*

**Riesgos típicos:** pérdida de privilegio cliente-abogado, alucinación de jurisprudencia, escritura no autorizada en CLM, fuga de cláusulas comerciales sensibles.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)): retrieval documental multi-fuente con sub-agente validador de citas y escritura al CLM bajo HITL. El agente principal `contract-redliner` compara contra plantilla y propone redacción. Un sub-agente `vlex-checker` verifica **cada cita jurisprudencial** contra `mcp-vlex` antes de que el redline llegue al abogado. Si una cita no existe, `agentevals` marca el fail y `kagent` eleva a HITL. La escritura al CLM (Ironclad) nunca ocurre con credencial del agente: se firma con OBO del abogado tras aprobación explícita.

### Mapeo riesgo → componente → mecanismo

| Riesgo (bloque 4) | Componente Solo | Mecanismo — dónde / cómo |
|-------------------|-----------------|--------------------------|
| Pérdida de privilegio cliente-abogado si el prompt sale a un LLM público | agentgateway + Istio ambient | egress restringido por `AuthorizationPolicy` en ztunnel al **endpoint del modelo aprobado en tenant UE**; cualquier otro destino LLM bloqueado en L4 antes de salir |
| Alucinación de jurisprudencia (`STS 1234/2023` inexistente) | kagent (A2A) + agentevals | sub-agente `vlex-checker` valida cada `caso citado` contra `mcp-vlex`; `agentevals` puntúa la traza con LLM-as-judge y bloquea handoff si `citations_verified < 100%` |
| Prompt injection desde el PDF del contrato (cláusula adversarial invisible) | agentgateway | prompt guard trata el texto extraído como `untrusted-content`; spotlighting + patrones de jailbreak antes del LLM |
| Escritura no autorizada en Ironclad (CLM) | agentgateway + kagent (OBO) | `AgentgatewayPolicy` fija `contracts:read` sobre `mcp-ironclad`; el paso `contracts:write` **no lo puede invocar el agente**: requiere HITL y el token OBO del abogado firma la mutación |
| Fuga de nombres de parte e importes al proveedor del modelo | agentgateway | detección de entidades (partes, importes, cuentas bancarias) y **redaction en request** al LLM; el diff se compone después con el texto original |
| Shadow AI (plugin de IA en Word no auditado) | agentregistry + Istio | sin entrada en el registro no se emite identidad SPIFFE; ztunnel deniega el egress del plugin a los MCPs o al LLM corporativo |
| Coste desbordado en MSAs de 200 páginas | agentgateway | rate limit por tokens; **semantic caching** de cláusulas boilerplate NDA/DPA repetidas entre contratos; model failover Sonnet → Haiku para la fase de clasificación cláusula-a-cláusula |
| Auditor pide trazabilidad del redline (por qué se cambió esa cláusula) | agentgateway + agentevals | OTel por invocación (input, tools, citas, decisión HITL); `agentevals` conserva el score del validador y la evidencia de cada cita verificada |

### Cómo se consigue la identidad

`contract-redliner` corre en malla ambient con identidad **SPIFFE** `spiffe://legal.acme.com/redliner` emitida por istiod y aplicada en **ztunnel** vía mTLS. **agentgateway** valida además su credencial **OIDC/JWT** contra el JWKS del IdP corporativo en cada request. Cuando el abogado dispara redlining, **kagent** intercambia el token del abogado por un token **OBO** con scope `contracts:read` para las consultas; **la escritura tras HITL usa el token del abogado directamente**, no una service account del agente. El sub-agente `vlex-checker` tiene identidad SPIFFE distinta (`.../vlex-checker`) para que la traza distinga sus invocaciones y `agentevals` pueda puntuarlo por separado.

### Dónde se aplican las políticas

En el **plano de datos de agentgateway** vía `AgentgatewayPolicy`: allowlist de tools (Ironclad, SharePoint, vLex, todos RO), prompt guard con perfil `legal-privileged` (partes, importes, cuentas), rate limit por tokens, semantic caching. En la **malla Istio** vía `AuthorizationPolicy`: L4 en ztunnel restringe egress a los endpoints aprobados (Azure OpenAI tenant UE, API de vLex, Ironclad, SharePoint corporativo); L7 en waypoint filtra métodos permitidos por servicio (`GET` sobre Ironclad; el `POST` solo desde el flujo HITL). **agentregistry** es la fuente de verdad: sin registro previo del agente o del plugin, ni se emite identidad SPIFFE ni entra en la allowlist.

## Referencias

- GDPR + LOPDGDD (PII en contratos), Ley de protección del secreto profesional. *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection desde PDF), LLM06.
