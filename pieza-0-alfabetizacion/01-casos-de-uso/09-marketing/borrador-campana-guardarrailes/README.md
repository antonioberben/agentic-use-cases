# T12 — Borrador de campaña con guardarraíles

## Identificación

- **Rol principal**: marketing (content, brand, performance).
- **Sectores**: transversal.
- **Patrón técnico**: Lab 7 — generación creativa con control.
- **Madurez recomendada**: nivel 1 piloto interno; nivel 3 antes de publicar a mercado.

> Capa de gobierno en **Pieza 2 — Plan Director de IA**.

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

> Cubierto en **Pieza 2 — Plan Director de IA**.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- EU AI Act art. 50, LSSI/ePrivacy, Ley General de Publicidad, derechos de imagen. *Citas T1.*
