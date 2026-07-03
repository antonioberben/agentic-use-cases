# SP01 — Due diligence asistida

## Identificación

- **Rol principal**: abogado corporate, M&A, consultor financiero, auditor.
- **Sectores**: servicios profesionales (despachos legales, Big Four, consultoras), corporate de cualquier sector.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de cualquier informe a cliente.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

Una *data room* de M&A contiene miles de documentos (contratos, financieros, laborales, fiscales, IP, litigios). Equipo de DD lee, anota *red flags*, redacta informe. Plazos comprimidos. El agente clasifica documentos, extrae cláusulas críticas (cambio de control, exclusividad, indemnidades, vencimientos, *non-compete*), señala *red flags* y produce un borrador de informe por área. El equipo valida.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre data room sanitizada (clean room legal). Prompt: *"Clasifica documento (contrato comercial, laboral, IP, litigio, fiscal). Extrae: partes, fecha, vencimiento, cláusulas materiales (cambio de control, exclusividad, indemnidades, *non-compete*, ley aplicable). Marca red flags. **Cita exacto.**"*

### 2.2 Copilot

Microsoft 365 Copilot sobre SharePoint con sensibilidad `Highly Confidential / M&A`. Procesamiento UE.

### 2.3 Claude Code

Repo `dd/<deal>/` con `AGENTS.md` que define checklist de red flags, taxonomía documental, formato del informe.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-dataroom` | Intralinks/Datasite MCP | `vault://dd/${deal}-ro` | `documents:read` solo deal asignado |
| `mcp-ironclad` | Ironclad MCP | `vault://dd/contracts-ro` | `contracts:read` |
| `mcp-court` | Westlaw/vLex MCP | `vault://dd/vlex-ro` | `cases:read` |

### 2.5 Alternativas

Harvey, Kira Systems, Luminance — siempre con NDA + cláusula de no entrenamiento.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo de DD a primer informe | 4 semanas | 1 semana |
| % cláusulas materiales detectadas | 80% | 97% |
| Coste por DD | € | € × 0,5 |
| Capacidad de deals en paralelo | base | base × 2 |

Fórmula: *3 semanas × equipo de 4 = ≈ 480 h/deal × 20 deals/año = 9.600 h/año por equipo. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si los documentos del *target* salen a LLM externo sin acuerdo, ruptura del NDA + posible problema regulatorio (insider trading si cotizada)."*
- *"Si el modelo alucina una cláusula que no existe o invierte el sentido ('cliente tiene derecho de cancelación' por 'vendedor tiene derecho'), riesgo material en el informe."*
- *"Si el agente accede a documentos de otro deal por mal aislamiento, conflicto de interés del despacho."*

**Riesgos típicos:** fuga de información M&A (MAR/insider trading en cotizadas), alucinación contractual con efecto material, conflicto de interés entre deals, sesgo del modelo a 'todo está bien'.

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- MAR (cotizadas), GDPR (PII en documentos), Estatuto General de la Abogacía (chinese walls), secreto profesional. *Citas T1.*
