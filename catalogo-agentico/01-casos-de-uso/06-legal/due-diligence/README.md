# SP01 — Due diligence asistida

## Identificación

- **Rol principal**: abogado corporate, M&A, consultor financiero, auditor.
- **Sectores**: servicios profesionales (despachos legales, Big Four, consultoras), corporate de cualquier sector.
- **Patrón técnico**: Lab 6 — agente regulatorio / legal sobre documentos.
- **Madurez recomendada**: nivel 2 piloto; nivel 3 antes de cualquier informe a cliente.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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
| `mcp-report` | Gestor documental / informe DD MCP | `vault://dd/${deal}-report` | `memo:write` (gate, HITL) |

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

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A1 — Documental multi-fuente con validador A2A* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `dd-analyst` se instancia **por deal** con identidad SPIFFE `spiffe://.../sa/dd-<deal-hash>`. No hay agente compartido entre deals: cada uno tiene su waypoint y su scope MCP restringido a `deal_id=<X>`. Un agente A2A `clause-verifier` re-lee la cláusula citada antes de que aparezca como red flag.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Documentos del *target* a LLM externo → ruptura NDA + *insider trading* si cotizada (**MAR art. 7 · MAR art. 14**) | agentgateway + agentregistry | egress deny a cualquier LLM que no tenga DPA de M&A firmado; tag `MNPI=true` fuerza modelo on-prem; audit trail de 10 años |
| Alucinación contractual con efecto material (invertir sentido de una cláusula) | agentevals + kagent | validador A2A `clause-verifier`: re-lee el párrafo citado y compara claim vs texto; disagreement → red flag descartada, no *softened* |
| Cross-contamination entre deals del despacho (**chinese walls · Estatuto General de la Abogacía**) | Istio ambient + agentgateway | waypoint por deal; `AuthorizationPolicy` L4 en ztunnel niega tráfico entre namespaces `dd-<deal-A>` y `dd-<deal-B>`; `mcp-dataroom` scope filtrado por `deal_id` en el token OBO |
| Sesgo "todo está bien" del modelo (LLMs infra-reportan red flags) | agentevals | eval set con 50 contratos golden que **contienen** red flags; recall < 90% en el eval → freeze del agente hasta re-tuning |
| Retención del *data room* por proveedor LLM para entrenamiento | agentregistry | catálogo restringido a proveedores con cláusula explícita de no-training; consumer-tier bloqueados; el registro es la evidencia audit-ready ante el cliente |

## Referencias

- MAR (cotizadas), GDPR (PII en documentos), Estatuto General de la Abogacía (chinese walls), secreto profesional. *Citas T1.*
