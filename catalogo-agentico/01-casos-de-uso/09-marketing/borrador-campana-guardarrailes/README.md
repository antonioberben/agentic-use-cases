# T12 — Borrador de campaña con guardarraíles

## Identificación

- **Rol principal**: marketing (content, brand, performance).
- **Sectores**: transversal.
- **Patrón técnico**: Lab 7 — generación creativa con control.
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de publicar a mercado.

> Capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Marketing produce decenas de piezas por campaña: copys de email, social, ads, landing, asunto, A/B. Producir el primer borrador a mano lleva días. El agente genera variantes alineadas con brand voice, claims aprobados y disclosure obligatorio. El humano selecciona, edita y firma.

## 2. Cómo resolverlo

### 2.1 Local

Ollama + Llama 3.1 70B con guía de estilo + biblioteca de claims aprobados. Prompt: *"Genera 5 variantes de [pieza] para [audiencia]. Tono [brand voice]. Usa solo claims de `claims-approved.md`. No prometas resultados sin disclaimer. Longitud ≤ 280 caracteres."*

### 2.2 Copilot

Copilot M365 + Adobe GenAI / Microsoft Designer. Sensibilidad `General` salvo material confidencial pre-lanzamiento.

### 2.3 Claude Code

Repo `marketing/campaigns/` con `AGENTS.md`: brand voice, claims aprobados, palabras prohibidas (las que vinculen comercialmente), formato de salida.

### 2.4 MCPs

| MCP | Servidor | Arranque | Scopes |
|-----|----------|----------|--------|
| `mcp-dam` | Brandfolder / Bynder MCP | `vault://mkt/dam-ro` | `assets:read,brand:read` |
| `mcp-cms` | Contentful/HubSpot MCP | `vault://mkt/cms-draft` | `content:draft` (nunca `publish`) |

### 2.5 Alternativas

Claude/ChatGPT con guía de estilo subida.

## 3. KPIs

| KPI | Base | Con agente |
|-----|------|------------|
| Tiempo a primer borrador de campaña | 3 días | 4 h |
| Nº de variantes A/B testeadas | 2 | 6-10 |
| CTR sobre baseline | base | +10-20% |

Fórmula: *20 h × 30 campañas/año = 600 h/año por equipo. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el modelo genera claim no aprobado ('reduce 50% el riesgo') y se publica, **publicidad engañosa** (Ley General de Publicidad, art. 5 LGDCU; en sector financiero, infracción CNMV)."*
- *"Si el agente publica directamente (scope `publish`), pieza no revisada llega al mercado — riesgo reputacional."*
- *"Si la imagen es deepfake de persona real sin consentimiento, derechos de imagen + EU AI Act art. 50 (disclosure obligatorio)."*

**Riesgos típicos:** claim no autorizado, publicación sin revisión, falta de disclosure de IA en contenido, infracción de derechos de imagen.

> Cubierto en **arquitectura de remediación (bloque 5)**.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). Agente `campaign-copy-drafter`: genera variantes de copy alineadas a brand voice y claims aprobados en `draft`; comms/legal firman antes de publicar.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Claim no aprobado ("reduce 50% el riesgo") publicado = publicidad engañosa (Dir. 2005/29/CE; art. 5 LGDCU; CNMV si financiero) | agentgateway | prompt guard de salida contra `claims-approved.md`; claim fuera de la lista bloquea el handoff |
| Falta de disclosure de contenido generado por IA (EU AI Act art. 50) | agentgateway + kagent (OBO) | inserción obligatoria del disclosure en la salida; `publish` sin flag de disclosure bloqueado |
| Publicación directa sin revisión (scope `publish`) | agentgateway + kagent (OBO) | `mcp-cms` scope `content:draft`; `publish` requiere HITL y OBO de comms/legal |
| Imagen/deepfake de persona real sin consentimiento (derechos de imagen; EU AI Act art. 50) | agentgateway | prompt guard bloquea nombres de personas reales; watermark + metadata C2PA en visuales |
| Envío email/SMS sin gestión de consentimiento/bajas (LSSI, ePrivacy) | agentgateway + kagent (OBO) | el agente no dispara envíos; el push a MAP va con OBO tras verificación de opt-in |

## Referencias

- EU AI Act art. 50, LSSI/ePrivacy, Ley General de Publicidad, derechos de imagen. *Citas T1.*
