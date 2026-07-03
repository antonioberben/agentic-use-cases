# T01 — Análisis de varianza P&L (real vs presupuesto)

## Identificación

- **Rol principal**: controller / FP&A.
- **Sectores**: transversal (intensivo en banca, telco, retail).
- **Patrón técnico**: Lab 1 — agente analítico sobre datos.
- **Madurez recomendada**: nivel 1 piloto sobre extractos; nivel 3 antes de conectar al ERP en producción.

> Aviso permanente: ficha de adopción. La capa de gobierno se desarrolla en la **Pieza 2 — Plan Director de IA** y aplica sin excepción.

## 1. Caso de uso

Cada cierre mensual el controller dedica 2-3 días a calcular varianzas línea a línea del P&L real frente al presupuesto, identificar las relevantes, redactar comentarios y mandar al CFO un resumen accionable. La tarea es repetitiva, sensible a errores de copia entre hojas y deja poco tiempo para investigar causas antes del comité. En cotizadas las cifras pre-publicación son MNPI.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B sobre extractos CSV anonimizados del ERP. Cliente Continue.dev / Claude Desktop. Prompt: *"Calcula varianza absoluta y % por línea. Filtra materialidad ±5% y ±50k€. Propón 3 hipótesis ordenadas por probabilidad con base en el histórico de 24 meses. No inventes causas; si no hay evidencia, di no hay evidencia."*

### 2.2 Copilot

Copilot for Finance (Excel) sobre el libro del cierre con conector a Dynamics 365 Finance. Etiqueta de sensibilidad `Confidential / Finance`. Procesamiento en data boundary UE para evitar transferencia de MNPI.

### 2.3 Claude Code u otro agente de escritorio

Repo `fpa-close/` con `AGENTS.md` que fija reglas de materialidad, glosario de cuentas, formato de salida (tabla varianza + comentario por línea). Allowlist solo herramientas de lectura (`Read`, `Bash: grep|awk`).

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-sap` | SAP MCP comunitario | `npx @sap/mcp-fi` + `vault://erp/fpa-ro` | `FI.read,CO.read`; jamás `FI.post` |
| `mcp-bi` | Power BI / Tableau MCP | `vault://bi/fpa-ro` | `datasets:read` solo del dataset de cierre |
| `mcp-excel` | Excel/Sheets MCP local | filesystem restringido a `./out/` | `read,write` sobre carpeta de salida |

```json
{"mcpServers":{"sap":{"command":"npx","args":["-y","@sap/mcp-fi"],"env":{"SAP_TOKEN":"${vault://erp/fpa-ro}"}}}}
```

### 2.5 Alternativas

Claude/ChatGPT Enterprise con CSV sanitizado (sin nombres de cuentas internas, sin códigos de centro de coste). Solo piloto.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Tiempo a borrador de varianzas | h por cierre | 16 h | 2 h |
| % comentarios aceptados sin reescritura | calidad | 50% | 80% |
| Varianzas materiales no detectadas | error | 1-2/cierre | 0 |
| Coste por cierre (tokens + plataforma) | € | 0 | <50 € |

Fórmula: *(16 − 2) h × 12 cierres/año × 1 controller = 168 h/año. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si trabajo desde Copilot sin etiqueta de sensibilidad y subo el P&L de junio pre-publicación, las cifras quedan en logs de productividad accesibles a admins de TI generales — MNPI fuera del perímetro estricto."*
- *"Si el MCP del ERP va con scopes `FI.post`, un prompt malicioso desde un PDF descargado puede pedir al agente registrar un asiento de ajuste — fraude posible con identidad humana del controller."*
- *"Si el modelo alucina una causa (`caída por estacionalidad de verano`) y el comité aprueba sin verificar, decisión sobre dato falso."*

**Riesgos típicos:** MNPI fuera de perímetro, scopes ERP excesivos, alucinación de causa, prompt injection desde documentos del cierre.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## Arquitectura de remediación con gobernanza de IA

> **Pendiente: diagrama de arquitectura.** Esta sección incluirá un diagrama que muestra cómo una plataforma de Gobernanza de IA (componentes Solo.io: agentgateway, kagent, agentregistry, kgateway sobre Istio ambient) se interpone entre el agente y las herramientas / datos / modelos de este caso, aplicando identidad propia del agente, allowlist de MCPs, redaction de PII, observabilidad por invocación, control de coste y aislamiento de red.
>
> En iteraciones siguientes, esta sección se expandirá caso por caso para explicar **cómo cada componente de gobernanza resuelve las vulnerabilidades concretas listadas en el bloque 4**.


## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.

## Referencias

- MAR (Reglamento Abuso de Mercado), CNMV, SOX cuando aplique. *Citas exactas pendientes T1.*
- Marco técnico: OWASP LLM Top 10 (LLM06 — Sensitive Information Disclosure).
