# Finanzas — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: controller, FP&A, contabilidad, tesorería, finance business partner. Perfil con manejo de Excel, ERP y herramientas de BI.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA generativa y agéntica**. Casos de uso, prompts, herramientas, MCPs. Es la mitad que genera valor.

**No está cubierta aquí la otra mitad: gobernanza y seguridad.** Y es la verdaderamente crítica. Adoptar estos casos sin un marco de gobierno significa:

- Datos financieros no públicos (resultados, márgenes, plantilla, salarios, contratos) saliendo del perímetro por una herramienta no aprobada — riesgo regulatorio y de mercado.
- Incumplimiento del **Reglamento Europeo de IA (EU AI Act)**, **GDPR**, **NIS2**, **DORA**, **MiCA**, normativa contable (PGC, IFRS) y la **AEPD**. En entidades financieras además SOX y reporte regulatorio del supervisor.
- Cifras que firmas sin trazabilidad: ¿qué versión del libro mayor? ¿qué tipo de cambio? ¿qué cierre?
- Agentes con acceso al ERP o al sistema de pagos sin gate humano: una sola acción mal ejecutada mueve dinero real.
- Coste descontrolado y dependencia de un proveedor que mañana cambia la política de tratamiento de datos.

Esa otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— se desarrolla en la **Pieza 2 — Plan Director de IA** de este mismo kit. No conectes un agente al ERP, a Treasury o a sistemas de pago sin haber leído antes la parte de gobierno que le corresponde.

:::

## 1. Qué cambia para ti

El trabajo de finanzas es 60% recopilación, conciliación y limpieza; 30% análisis; 10% comunicar a la dirección. La IA comprime el primer bloque y libera tiempo para los otros dos. Lo que no cambia: la cifra que firmas. Da igual quién la haya calculado, si va en el reporte al CFO o al regulador, es tuya.

## 2. Ocho casos típicos

Cada caso en cuatro bloques: caso → cómo resolverlo → KPIs → riesgos.

### 2.1 Cierre mensual / consolidación

**Caso de uso.** Dos semanas cuadrando saldos entre filiales, monedas y planes contables. Trial balances que no casan por tipo de cambio, partidas intercompany sin eliminar, cuentas con saldo inusual. El controller pasa el tiempo en Excel pegando hojas en lugar de analizar el resultado.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 3.1 70B contra trial balances exportados a CSV. Cero conexión al ERP, solo análisis sobre ficheros enmascarados. *"Identifica diferencias entre estos tres TB. Marca las que excedan ±1% o ±10k€."*
- *Copilot M365 + Microsoft Fabric + Power BI Copilot:* el TB se carga en un lakehouse de Fabric, Copilot opera en la capa semántica. Conciliación intercompany asistida sin tocar el ERP de origen.
- *ERP nativo (SAP Joule, Oracle Fusion AI Agents, NetSuite Text Enhance, Workday AI):* asistentes integrados que proponen asientos de ajuste y eliminaciones. Activar solo módulos certificados internamente. Cada propuesta revisada como la de un junior.
- *Claude Code con `AGENTS.md` del repo de papeles de trabajo:* el agente lee el script de consolidación (Python/Excel-VBA), no toca el ERP.
- *MCPs:*

| MCP | Comando / endpoint | Scopes mínimos |
|-----|--------------------|----------------|
| `mcp-sap` (lectura) | `npx @sap/mcp-server` con `vault://sap/finance-readonly` | `FI.read`, `CO.read` — nunca `FI.post` |
| `mcp-snowflake` | `npx mcp-snowflake --warehouse FIN_WH` | rol `FIN_READ` sobre vistas `vw_tb_*` |
| `mcp-graph-files` | servidor M365 oficial | `Files.Read.All` sobre carpeta de papeles |

```json
{
  "mcpServers": {
    "sap": { "command": "npx", "args": ["@sap/mcp-server"], "env": { "SAP_USER": "svc-fin-ro" } },
    "snowflake": { "command": "npx", "args": ["mcp-snowflake"], "env": { "SF_ROLE": "FIN_READ" } }
  }
}
```

- *Alternativa sin integración:* exportar TB, enmascarar importes, pegar en Claude/ChatGPT solo para estructura del análisis.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Días de cierre | 10 hábiles | 6-7 |
| Horas/persona en conciliación | 40 h/mes | 18-22 |
| Diferencias detectadas en T+1 | 60% | 90% |
| Re-aperturas post-cierre | 2-3/trim | < 1 |

*Fórmula:* `(40 − 20) h/mes × 11 meses × FTE = 220 h/año por controller`. *(estimación, pendiente T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si trabajo desde Copilot y conecto un MCP del ERP con permisos de escritura, una propuesta aceptada por error contabiliza un asiento real.* SoD rota y reapertura del cierre.
- *Si pego el TB completo en Claude.ai personal, salgo del perímetro con resultados pre-publicación → MNPI filtrada, infracción MAR/CNMV.*
- *Si el agente usa mi token personal y no `svc-fin-ro`, no hay segregación; tu auditor no puede demostrar quién hizo qué.*

Estas vulnerabilidades se cubren con identidad de agente, MCP allowlisted, allow-list de operaciones de escritura con gate humano y trazabilidad SOX/DORA descritos en **Pieza 2 — Plan Director de IA**. No conectes esto al ERP productivo sin esa capa.

### 2.2 Forecast y presupuesto

**Caso de uso.** Hoja en blanco. Hay que producir un forecast a 12 meses por línea de ingreso y categoría de gasto, con tres escenarios y supuestos defendibles. Hoy se hace pegando histórico en Excel y rellenando con intuición.

**Cómo resolverlo.**

- *Local:* Ollama + Qwen2.5 32B sobre histórico CSV. Genera la estructura del modelo, no el dato final.
- *Copilot Excel + Microsoft Fabric:* serie temporal con Copilot, sensitividad con tablas de datos. No proyectes sobre series con menos de 6 puntos.
- *Plataformas FP&A con IA nativa:* **Anaplan PlanIQ**, **Pigment AI**, **Workday Adaptive AI**, **Cube AI**, **Mosaic**. Todas con conectores ERP/CRM auditados.
- *Claude Code:* el repo de modelado contiene `forecast/` con notebooks; el agente revisa supuestos y consistencia entre escenarios.
- *MCPs:*

| MCP | Para qué |
|-----|----------|
| `mcp-snowflake` / `mcp-bigquery` | Histórico de ventas, costes, headcount |
| `mcp-anaplan` o `mcp-pigment` | Modelo de planificación |
| `mcp-graph-files` | Asunciones y memorias previas |

- *Alternativa:* exportar histórico anonimizado y trabajar en ChatGPT/Claude para la estructura.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo primer borrador forecast | 5 días | 1-2 días |
| Iteraciones hasta validación CFO | 4-6 | 2-3 |
| Cobertura de drivers documentados | 50% | 90% |
| Tiempo en sensitividad | 8 h | 1-2 h |

*Fórmula:* `(5 − 1,5) días × 8 h × 4 ciclos/año = 112 h/año por planner`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" supuestos sin marcarlo, firmas un forecast inventado.* Pide siempre: *"si no tienes dato, dilo, no extrapoles"*.
- *Si subes el forecast a una herramienta no aprobada, los planes y las cifras pre-board son MNPI.* En cotizadas, riesgo MAR.
- *Si el agente tiene escritura sobre Anaplan/Pigment con tu usuario, una propuesta aceptada en bloque sobreescribe escenarios.*

Cubierto en **Pieza 2** con identidad de agente, allow-list de escritura, observabilidad del prompt-to-cifra y control de coste de tokens.

### 2.3 Análisis de varianza (real vs presupuesto)

**Caso de uso.** Mensualmente, P&L real frente a presupuesto. Cuatro horas escribiendo el porqué de cada desviación. Lo importante (las 4 desviaciones grandes) se pierde entre las 40 pequeñas.

**Cómo resolverlo.**

- *Local:* P&L en CSV, Ollama + Llama 70B. *"Varianzas que excedan ±5% o ±50k€. Para cada una: importe, %, hipótesis ordenadas por probabilidad. No inventes causas."*
- *Copilot Excel / Power BI:* tabla pivotada, fórmula condicional, narrative con Copilot. Verifica cada hipótesis con el business partner antes de citarla.
- *Claude Code:* repo `fpa/variance/` con scripts de análisis; el agente compara contra historiales y memorias del mes anterior.
- *MCPs:* `mcp-snowflake` (P&L), `mcp-graph-files` (comentarios management), `mcp-confluence` (memorias previas).
- *Alternativa:* pegar la tabla de varianzas (sin razones sociales si no aprobado) en Claude/ChatGPT solo para estructura del comentario.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas/mes en comentarios de varianza | 6 h | 1,5 h |
| Cobertura de varianzas con causa documentada | 70% | 95% |
| Tiempo de detección de outliers | 2 días | < 1 día |

*Fórmula:* `(6 − 1,5) h × 11 = 49,5 h/año por controller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo inventa una "causa" plausible sin pedírselo, firmas una explicación falsa al comité.* Riesgo de gobernanza interna.
- *Si las cifras viajan a un proveedor SaaS no auditado, fuga de MNPI.*
- *Si conectas al sistema de aprobaciones con escritura, el agente puede cerrar varianzas que requieren revisión.*

Cubierto en **Pieza 2** con trazabilidad de cita-fuente obligatoria, perímetro aprobado y allow-list.

### 2.4 Categorización de gastos y detección de duplicados

**Caso de uso.** Extracto de tarjeta corporativa o AP file con 2.000 líneas. Hay que categorizar, detectar duplicados (mismo proveedor + mismo importe ±7 días), y marcar lo raro.

**Cómo resolverlo.**

- *Local:* Ollama sobre el CSV enmascarado (sin nombres reales si no aprobado). Categorización por regex + LLM.
- *Copilot Excel:* fórmulas de categorización asistida.
- *Plataformas nativas:* **Brex AI**, **Ramp AI**, **Spendesk**, **SAP Concur con AI**. Ya integran detección de duplicados, fraude y categorización.
- *MCPs:* `mcp-concur`, `mcp-coupa`, `mcp-graph-files`. Solo lectura.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de categorización | 6 h/mes | 1 h |
| % duplicados detectados antes de pago | 60% | 95% |
| Errores de categorización contable | 8% | < 2% |

*Fórmula:* `(6 − 1) h × 12 = 60 h/año por contable`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el agente tiene escritura sobre Concur/Coupa, un "marcar como pagado" mal ejecutado libera pagos.*
- *Si subes el AP file con proveedores reales a una herramienta no aprobada, expones la red de proveedores y sus condiciones (información comercial sensible).*
- *Si el modelo categoriza mal sistemáticamente, los reportes a hacienda salen sesgados.*

Cubierto en **Pieza 2** con gate humano antes de pagos, identidad propia del agente, scopes de lectura y observabilidad.

### 2.5 Borrador de informe para comité o auditoría

**Caso de uso.** 10 páginas de informe trimestral o nota técnica al auditor, en el último día. Cifras ya calculadas, falta narrarlas con tono adecuado.

**Cómo resolverlo.**

- *Local:* Ollama + Llama 70B sobre KPIs cerrados en CSV. Genera estructura y prosa; tú validas cifras.
- *Copilot Word / PowerPoint:* tabla de KPIs en Excel + Copilot redactando narrativa en Word. Cada cifra cita su celda fuente.
- *Claude Code:* repo `reports/` con template del informe y un `AGENTS.md` con el tono (comité vs auditor).
- *MCPs:* `mcp-graph-files` (papeles de trabajo), `mcp-confluence` (informes anteriores).
- *Alternativa:* prompt en Claude/ChatGPT con cifras ya públicas o redondeadas.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas para primer borrador | 8 h | 2 h |
| Iteraciones hasta firma | 5 | 2-3 |
| Cifras con cita-fuente | 60% | 100% |

*Fórmula:* `(8 − 2) h × 4 trim = 24 h/año por controller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si el modelo "rellena" una cifra que no le diste, firmas un informe con datos inventados.* Riesgo de auditoría y, en cotizadas, de mercado.
- *Si el borrador del trimestre se sube a una herramienta no aprobada antes de publicación, MNPI fuera del perímetro → MAR/CNMV.*
- *Si el agente escribe directamente en SharePoint compartido con auditoría externa, mezclas borradores con final.*

Cubierto en **Pieza 2** con perímetro de herramientas aprobadas pre-publicación, identidad del agente y workflow de aprobación.

### 2.6 Lectura de contratos financieros

**Caso de uso.** 40 páginas de un leasing, financiación, emisión de deuda o ISDA. Hay que extraer covenants, garantías, tipo de interés, eventos de incumplimiento, penalizaciones. Hoy es tarde-completa de lectura.

**Cómo resolverlo.**

- *Local:* Ollama sobre PDF (texto extraído). Cero envío a la nube si el contrato es confidencial.
- *Copilot M365:* el PDF en SharePoint, Copilot Chat. Extrae estructurado a Excel.
- *Claude Code + Claude Sonnet con contexto largo:* el contrato en `legal/contracts/`; el agente extrae campos a JSON contra un esquema.
- *MCPs:* `mcp-graph-files` (SharePoint), `mcp-icertis` o `mcp-docusign-clm` si hay CLM (solo lectura).
- *Alternativa:* subir el PDF anonimizado a Claude.ai para extracción asistida.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por contrato | 4 h | 1 h |
| Covenants extraídos | 80% | 100% |
| Errores en fechas/importes | 10% | < 2% |

*Fórmula:* `(4 − 1) h × 40 contratos/año = 120 h/año por analista de tesorería`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si subes el contrato a una herramienta no aprobada, expones contraparte, condiciones y covenants — sensible competitivamente y, en M&A, MNPI.*
- *Si el modelo malinterpreta una cláusula de incumplimiento ("ambigüedad"), tomas una decisión de tesorería mal informada.* Pide siempre revisión legal humana de lo extraído.
- *Si el agente tiene escritura en el CLM, puede modificar el master record.*

Cubierto en **Pieza 2** con perímetro de herramientas aprobadas para legal, identidad propia y workflow revisión legal antes de actuar.

### 2.7 Modelado en Excel (fórmulas complejas)

**Caso de uso.** Fórmula con 15 SI anidados que nadie entiende y que da un resultado raro. O necesidad de una fórmula nueva que combine BUSCARX, LET, SUMAR.SI.CONJUNTO y referencias estructuradas.

**Cómo resolverlo.**

- *Copilot Excel:* *"Explica esta fórmula paso a paso. Reescríbela con LET, más legible. Conserva la lógica."*
- *Local:* pegar la fórmula y headers en Ollama/Claude local. La sintaxis ES/EN cambia; especifícalo.
- *Claude Code:* en repo con macros VBA o Python-xlwings, el agente refactoriza el script entero.
- *Alternativa:* Claude/ChatGPT con la fórmula y los headers, sin importes reales.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Tiempo de depuración por fórmula | 45 min | 10 min |
| Fórmulas legibles (con LET) | 20% | 80% |
| Errores tras refactor | 5% | < 1% |

*Fórmula:* `(35 min) × 50 fórmulas/año = 29 h/año por modeller`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si pegas la fórmula con headers que revelan estructura comercial (nombres de clientes, líneas de producto), filtras estructura interna.*
- *Si el modelo refactoriza y cambia silenciosamente la lógica, tu modelo financiero queda mal calibrado.* Test antes y después.

Cubierto en **Pieza 2** con perímetro aprobado para modelado y disciplina de test de regresión sobre modelos críticos.

### 2.8 Benchmarks y análisis competitivo

**Caso de uso.** Hay que comparar márgenes, coste de cliente o DSO con peers públicos. Reportes anuales de comparables, ratios sectoriales. El modelo confunde cifras con frecuencia.

**Cómo resolverlo.**

- *Local:* Ollama con RAG sobre 10-Ks/cuentas anuales descargadas. Solo lectura.
- *Copilot M365:* Copilot Chat con web grounding. *"Compara mis ratios con los últimos reportes anuales de [X, Y, Z]. Si no tienes la fuente, dilo. No inventes."*
- *Plataformas:* **AlphaSense**, **Visible Alpha**, **S&P Capital IQ AI**. Datos verificados, no LLM puro.
- *MCPs:* `mcp-web-fetch` (allow-list a investor relations oficiales), `mcp-bigquery` para tus propios ratios.
- *Alternativa:* Claude con los PDFs adjuntos directamente.

**KPIs y mejora.**

| KPI | Antes | Objetivo |
|-----|-------|----------|
| Horas por benchmark sectorial | 5 h | 1,5 h |
| Cobertura de peers | 5 | 10-15 |
| Ratios con fuente verificable | 60% | 100% |

*Fórmula:* `(3,5) h × 12 benchmarks/año = 42 h/año por FP&A`. *(estimación, T1).*

**Vulnerabilidades y riesgos → gobernanza.**

- *Si citas un ratio inventado por el modelo, llevas al comité una conclusión falsa.* Verifica todo ratio antes de citarlo.
- *Si conectas a fuentes web abiertas vía MCP, prompt injection desde contenidos manipulados puede sesgar conclusiones.*
- *Si el benchmark incluye tu cifra interna no publicada, fuga de MNPI por la vía de la comparación.*

Cubierto en **Pieza 2** con allow-list de fuentes, identidad de agente y validación cita-fuente.

## 3. MCPs: cómo enchufar tus datos al agente

Para finanzas, estos MCPs cubren el grueso del trabajo. Conéctalos en lectura primero, escritura solo con gate humano explícito.

| MCP | Para qué lo usas |
|-----|------------------|
| ERP (SAP / Oracle / NetSuite / Workday Finance / Sage) | Libros mayores, asientos, balances, cuentas auxiliares |
| BI (Power BI / Tableau / Looker) | Dashboards financieros, métricas operativas |
| Hoja de cálculo (Excel / Google Sheets) | Modelos, papeles de trabajo, conciliaciones |
| Procurement (Coupa / Ariba / SAP Procurement) | Pedidos, contratos, gasto comprometido |
| AP / AR (Concur, Tipalti, sistema de facturación) | Facturas pendientes, pagos, cobros |
| Treasury / banca (HSBC Net, Kyriba, sistema interno) | Saldos, posiciones, conciliación bancaria |
| Documentos (SharePoint / Drive) | Contratos, papeles del auditor, normativa interna |

**Reglas adicionales para finanzas:**

- **Lectura por defecto.** Ninguna escritura sobre ERP, Treasury o AP sin gate humano y segregación de funciones (SoD).
- **MNPI:** resultados pre-publicación son materiales no públicos. No los proceses en herramientas no aprobadas; riesgo MAR/CNMV/AEMV.
- **Pista de auditoría obligatoria.** Cada interacción del agente con sistemas financieros trazada (quién, qué, cuándo, qué leyó, qué propuso, qué se aceptó).
- **Datos de empleados** (nóminas, evaluaciones) requieren tratamiento aparte por GDPR. No los mezcles con MCPs financieros generales.

## 4. Cinco hábitos clave

1. **Verifica toda cifra antes de firmar.** Una cifra del modelo no es una cifra auditada. Cuádrala en la fuente original.
2. **Pide trazabilidad por defecto.** *"Cita la fuente de cada número. Si no la tienes, dilo."* Sin esto, no llevas nada al auditor.
3. **Separa estructura de contenido.** El modelo aporta estructura; el dato real lo aplicas tú.
4. **No automatices asientos contables.** Que proponga, vale. Que contabilice, no, salvo entornos con gobierno cerrado.
5. **Sesiones cortas y temáticas.** Una por cierre, otra por forecast, otra por informe. El contexto se ensucia rápido.

## 5. Qué evitar

- Pegar datos no públicos en una herramienta no aprobada.
- Aceptar análisis del modelo sin revisar la lógica subyacente.
- Dejar al agente proponer asientos directamente al ERP sin revisión humana documentada.
- Confiar en benchmarks o ratios sectoriales generados sin fuente verificable.
- Usar IA para decisiones que requieren juicio profesional documentado (provisiones, deterioros, going concern). La IA aporta input; el juicio es tuyo y queda en los papeles.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"**: patrón de 2.1-2.4.
- Lab base **"agente regulatorio/legal sobre documentos"**: patrón de 2.6.
- Guías: `gestion-contexto.md`, `mcp-y-herramientas.md`, `iteracion-critica.md`.
