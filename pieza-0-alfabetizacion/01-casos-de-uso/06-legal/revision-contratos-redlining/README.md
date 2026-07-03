# T03 — Revisión de contratos (redlining)

## Identificación

- **Rol principal**: abogado in-house, paralegal.
- **Sectores**: transversal.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 1 piloto en propuesta de redacción; nivel 3 antes de tocar plantillas vivas o cláusulas regulatorias.

> Aviso permanente: capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- GDPR + LOPDGDD (PII en contratos), Ley de protección del secreto profesional. *Citas T1.*
- Marco técnico: OWASP LLM01 (Prompt Injection desde PDF), LLM06.
