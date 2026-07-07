# B02 — Apoyo KYC / onboarding de cliente

## Identificación

- **Rol principal**: analista de cumplimiento PBC/FT, operaciones de onboarding.
- **Sectores**: banca, seguros, fintech, cripto/MiCA.
- **Patrón técnico**: Lab 6 — agente regulatorio + Lab 2 — triage.
- **Madurez recomendada**: nivel 2 piloto en propuesta de clasificación de riesgo; nivel 3 antes de cualquier decisión sobre alta o bloqueo.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

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

> Cubierto en **arquitectura de remediación (bloque 5)** + Anexo A — Sectorial banca.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A2 — Triage multi-señal con acciones sensibles gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `kyc-analyst` propone **clasificación de riesgo + borrador de EDD**; la decisión de alta o bloqueo la firma un humano. Un sub-agente `evidence-validator` (A2A) contrasta identidad/UBO/match de listas contra la fuente antes de dar nada por bueno. `mcp-core` expone `customer:draft` pero **jamás** `customer:activate`.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Alta automatizada sin decisor humano (**Ley 10/2010 art. 7 · GDPR art. 22 · SEPBLAC**) | agentregistry + agentgateway | scope `customer:activate` **no publicado** al agente; alta requiere ticket firmado por analista con `role=kyc-officer` vía OBO |
| Error OCR silencioso → suplantación de identidad | agentevals | eval set de 300 documentos golden (DNI/pasaportes anonimizados) con umbral de confianza; por debajo de umbral, `escalate:human` obligatorio |
| *Tipping-off* al cliente (**Ley 10/2010 art. 24**) | agentgateway | prompt guard de salida: bloquea si el borrador de comunicación contiene términos `PEP`, `sanción`, `EDD por riesgo`, `SEPBLAC`; sólo salen plantillas neutras |
| Cruce contra World-Check / ComplyAdvantage sin trazabilidad regulatoria | agentgateway | cada llamada MCP emite OTel span con `regulator=SEPBLAC`, `subject_hash`, `list_version`; retención 10 años en cold storage |
| Sesgo del modelo contra perfiles minoritarios (**EU AI Act Anexo III · scoring crediticio de alto riesgo**) | agentevals | eval set con particiones por nacionalidad/edad/género; deriva > 3% → freeze del modelo y auditoría |

## Referencias

- Ley 10/2010 PBC/FT, Reglamento UE 2015/847, MiCA (cripto), guías SEPBLAC, EBA. *Citas T1.*
