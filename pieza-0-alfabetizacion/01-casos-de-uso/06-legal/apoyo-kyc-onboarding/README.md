# B02 — Apoyo KYC / onboarding de cliente

## Identificación

- **Rol principal**: analista de cumplimiento PBC/FT, operaciones de onboarding.
- **Sectores**: banca, seguros, fintech, cripto/MiCA.
- **Patrón técnico**: Lab 6 — agente regulatorio + Lab 2 — triage.
- **Madurez recomendada**: nivel 2 piloto en propuesta de clasificación de riesgo; nivel 3 antes de cualquier decisión sobre alta o bloqueo.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

## 1. Caso de uso

Onboarding KYC: revisar documentación (DNI/pasaporte, justificante de domicilio, declaración de fondos), cruzar con listas de sanciones / PEP, evaluar riesgo, decidir alta o EDD (enhanced due diligence). Hoy lleva días por caso complejo. El agente extrae, cruza, propone riesgo y borrador de informe. El analista decide y firma.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B sobre PDFs sanitizados. Prompt: *"Extrae datos KYC del set documental. Valida coherencia entre documentos. Cruza con listas adjuntas. Propón nivel de riesgo (bajo/medio/alto) con justificación. **No decidas alta ni bloqueo.**"*

### 2.2 Copilot

Copilot for Finance/Dynamics + conectores a Refinitiv World-Check, Dow Jones Risk Center, ComplyAdvantage. Data boundary UE.

### 2.3 Claude Code

Repo `kyc/` con `AGENTS.md` que define rúbrica de riesgo, prohíbe decisión y obliga doble validación humana en alto riesgo.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-worldcheck` | Refinitiv WC MCP | `vault://kyc/wc-ro` | `screening:read` |
| `mcp-comply` | ComplyAdvantage MCP | `vault://kyc/comply-ro` | `screening:read` |
| `mcp-core` | Core banking MCP | `vault://kyc/core-rw-limited` | `customer:draft` (nunca `customer:activate`) |
| `mcp-ocr` | Document AI MCP | local con modelos OCR | `read` sobre `./docs/` |

### 2.5 Alternativas

Ninguna pública con datos KYC.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo medio de onboarding | 3 días | 6 h |
| % expedientes con alerta materializada en EDD | base | +20% |
| Falsos positivos PEP/sanciones | alto | medio-bajo |
| Coste por alta | € | € × 0,4 |

Fórmula: *2,5 días × 500 onboardings/mes = ≈ 15.000 h/año por entidad mediana. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el agente activa el alta automáticamente (`customer:activate`), incumplimiento del deber de diligencia debida (Ley 10/2010, art. 7) y posible sanción SEPBLAC."*
- *"Si el OCR confunde DNI parecidos y el modelo da por buena la verificación, alta con identidad incorrecta — abre puerta a suplantación."*
- *"Si el modelo *tippea* al cliente con explicaciones sobre por qué se le pide EDD ('su perfil coincide con PEP'), *tipping-off* (delito Ley 10/2010 art. 24)."*

**Riesgos típicos:** decisión automatizada en alta/bloqueo (art. 22 GDPR + PBC/FT), error OCR no detectado, *tipping-off*, sesgo de modelo contra perfiles minoritarios.

> Cubierto en **Pieza 2 — Plan Director de IA** + Anexo A — Sectorial banca.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- Ley 10/2010 PBC/FT, Reglamento UE 2015/847, MiCA (cripto), guías SEPBLAC, EBA. *Citas T1.*
