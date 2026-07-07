# T08 — Conciliación bancaria / cierre mensual

## Identificación

- **Rol principal**: contable, finanzas, treasury.
- **Sectores**: transversal (intensivo en banca, retail, sector público).
- **Patrón técnico**: Lab 1 — agente analítico sobre datos.
- **Madurez recomendada**: nivel 1 piloto en propuestas de match; nivel 3 antes de escribir en el ERP.

> Aviso permanente: capa de gobierno en **arquitectura de remediación (bloque 5)**.

## 1. Caso de uso

Cada mes hay que conciliar extractos bancarios con apuntes contables: cuadrar miles de líneas, identificar diferencias por *timing*, comisiones, errores y abrir incidencias para las no resueltas. Hoy: macro Excel + criterio del contable, 3-5 días de cierre por mes. El agente propone matches con confianza y razón; el humano valida y firma.

## 2. Cómo resolverlo

### 2.1 Local (laboratorio)

Ollama + Llama 3.1 70B con CSV anonimizado de extracto + libro mayor. Prompt: *"Para cada línea del extracto, propón match en el libro con razón (importe exacto, importe ± 0,01€, concepto similar, secuencia adyacente). Confianza 0-1. Marca para revisión las <0,8 y todas las que cambien la cuenta de resultados. **No marques nada como conciliado**; lo firma el contable."*

### 2.2 Copilot

Copilot for Finance (Excel) con conector Dynamics/SAP. Sensibilidad `Confidential / Finance`.

### 2.3 Claude Code u otro agente de escritorio

Repo `close/recon/` con `AGENTS.md` que define reglas de match, tolerancias y prohibición de auto-firma. Allowlist solo lectura sobre el libro y escritura en `proposals/` (no en ERP).

### 2.4 MCPs: configuración y conexión

| MCP | Servidor | Arranque | Scopes mínimos |
|-----|----------|----------|----------------|
| `mcp-sap` | SAP MCP | `vault://erp/recon-ro` | `FI.read`; **nunca** `FI.post` |
| `mcp-bank-statement` | Banking MCP / CSV local | filesystem restringido | `read` |
| `mcp-excel` | Excel/Sheets MCP | filesystem `./proposals/` | `read,write` carpeta de salida |

### 2.5 Alternativas

Claude/ChatGPT Enterprise con CSV anonimizado. Solo piloto.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base | Con agente |
|-----|------------|------|------------|
| Días de cierre mensual | días | 5 | 3 |
| % líneas conciliadas automáticamente | volumen | 60% | 85% |
| Errores detectados a posteriori | calidad | 1-2/cierre | 0 |
| Tiempo a explicación de diferencia | min | 30 min | 5 min |

Fórmula: *2 días × 1 FTE × 12 cierres = 240 h/año. (estimación, T1).*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el MCP de SAP tiene `FI.post` y el agente cierra un asiento de regularización 'porque cuadra', incumplimiento de SoD (segregación de funciones) y posible problema SOX/auditor."*
- *"Si subo el extracto bancario completo (con IBAN del proveedor, ingresos del personal) a un servicio público, fuga de datos personales y comerciales."*
- *"Si la conciliación incluye operaciones intra-grupo no eliminadas y el modelo las cita en una nota, riesgo MAR / precios de transferencia."*

**Riesgos típicos:** ruptura de SoD, fuga de PII financiera, MNPI en operaciones intra-grupo, auto-firma del agente sin gate humano.

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A3 — Analítico con write-back gated* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `bank-recon` propone matches entre extracto bancario y libro mayor con confianza y razón; un validador A2A `controls-validator` comprueba SoD y umbral de materialidad antes de que cualquier propuesta llegue a la hoja de asientos. Cada línea marcada como conciliada la firma el contable — el agente **nunca cierra un asiento**.

### Particularizaciones de este caso

| Riesgo específico | Componente | Mecanismo específico |
|---|---|---|
| Auto-firma de asiento de regularización (rotura SoD / SOX) | agentgateway + kagent (OBO) | `mcp-sap` **no expone** `FI.post` a la identidad del agente; el asiento de ajuste va a `proposals/adjust-YYYYMM.xlsx` y sólo el contable con OBO puede escribirlo en el ERP |
| PII financiera (IBAN proveedor, nómina individual) al LLM externo | agentgateway | prompt guard con detección IBAN, cuentas bancarias, DNI/NIF; hash determinista para conservar match sin exponer el número |
| Cita de operación intra-grupo con implicación de precios de transferencia / MAR | agentgateway + Istio | column-mask sobre columnas `intra_grupo=true`; el agente sólo ve el importe agregado, nunca la contraparte |
| Multi-razón-social: agente ve conciliación de otra sociedad del grupo | Istio + kagent | SPIFFE por razón social; `AuthorizationPolicy` L7 filtra el resultado de `mcp-sap` por `company_code` del SPIFFE ID |

## Referencias

- SOX (control interno financiero), DORA (banca), normativa ICAC en España. *Citas T1.*
- Marco técnico: OWASP LLM06.
