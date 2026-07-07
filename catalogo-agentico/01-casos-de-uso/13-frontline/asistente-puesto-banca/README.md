# B01 — Asistente al puesto en oficina bancaria

## Identificación

- **Rol principal**: empleado de oficina bancaria (gestor, atención al cliente).
- **Sectores**: banca retail.
- **Patrón técnico**: Lab 5 — asistente al empleado frontline.
- **Madurez recomendada**: nivel 2 piloto en oficinas seleccionadas; nivel 3 antes de red completa.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

El gestor alterna entre productos (cuentas, hipotecas, fondos, seguros), normativa (MiFID II, transparencia, PBC/FT), procedimientos internos y herramientas (core, CRM, DAM). Tiempo del cliente: 15-20 min. El asistente del puesto responde dudas operativas con cita al manual; **no contrata, no asesora**.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre procedimientos sanitizados. Prompt: *"Responde con cita al procedimiento. Si la pregunta es de asesoramiento financiero, di 'requiere test MiFID y firma del gestor'. No recomiendes producto."*

### 2.2 Copilot

Microsoft Copilot for Frontline + Core Banking + CRM. Procesamiento UE, data boundary financiero.

### 2.3 Claude Code

Repo `branch-assist/` con `AGENTS.md`: taxonomía, prohibición de asesoramiento sin gate, citación obligatoria.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-core-banking` | Temenos/Finacle MCP | `vault://branch/core-ro` | `accounts:read,transactions:read` solo cliente atendido |
| `mcp-crm` | SFSC MCP | `vault://branch/crm-ro` | `customer:read` solo cliente atendido |
| `mcp-policies` | SharePoint Graph MCP | `Sites.Selected` procedimientos | `documents:read` |

### 2.5 Alternativas

Ninguna pública con datos de cliente bancario.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo medio de atención | 18 min | 12 min |
| % consultas procedimentales sin escalado | 60% | 88% |
| Errores operativos a posteriori | medio | bajo |
| NPS de oficina | base | +5-10 pts |

Fórmula: *6 min × 25 atenciones/día × 220 días = ≈ 550 h/año por gestor. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente recomienda fondo sin test MiFID firmado, infracción de idoneidad MiFID II + compensación posible."*
- *"Si el MCP del core tiene scope amplio, el agente accede a cuentas ajenas — fuga interna + GDPR + sigilo bancario."*
- *"Si responde a pregunta sobre detección de blanqueo, *tipping-off* (delito Ley 10/2010 art. 24)."*

**Riesgos típicos:** asesoramiento sin MiFID, fuga cross-cliente, *tipping-off*, decisión crediticia automatizada sin art. 22 GDPR.

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo A — Sectorial banca.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `banca-puesto-asistente` responde dudas operativas de productos y normativa con cita al procedimiento; ante consulta de asesoramiento financiero personalizado, ruteo obligatorio a gestor con test MiFID. Un validador A2A `suitability-validator` bloquea el handoff si detecta asesoramiento personalizado.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Respuesta con asesoramiento financiero personalizado sin test MiFID (MiFID II idoneidad/conveniencia) | agentgateway | prompt guard de salida detecta patrón "¿debería contratar/invertir en X?" → respuesta canned "requiere test MiFID y firma del gestor" + ruteo a humano |
| Acceso cross-cliente por scope amplio del core (GDPR + sigilo bancario) | agentgateway + Istio | `mcp-core-banking` con scope `accounts:read` restringido al `cliente_actual` del OIDC; `AuthorizationPolicy` L7 filtra por ese id |
| Consulta sobre detección de blanqueo respondida a cliente/tercero: *tipping-off* (Ley 10/2010 art. 24) | agentgateway | prompt guard bloquea patrones PBC/FT en la salida; no revela indicios de comunicación al SEPBLAC |
| Decisión crediticia automatizada sin intervención humana (GDPR art. 22) | agentgateway + kagent (OBO) | el agente propone; la resolución crediticia va con OBO del gestor tras revisión, nunca automática |
| Canal del puesto (tablet/CRM) expuesto sin authn de dispositivo (DORA resiliencia operativa) | kgateway | el ingress N-S del asistente de oficina termina en kgateway con mTLS y authn del dispositivo corporativo |

## Referencias

- MiFID II, Ley 10/2010 PBC/FT, RDL 24/2021, GDPR/LOPDGDD, DORA, EBA, BdE. *Citas T1.*
