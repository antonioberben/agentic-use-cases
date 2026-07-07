# Benchmarks y análisis competitivo

> **Rol:** finanzas · **Caso 2.8** (extraído del archivo monolítico en Fase 2).

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

Cubierto en la **arquitectura de remediación (bloque 5)** con allow-list de fuentes, identidad de agente y validación cita-fuente.

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

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A6 — Investigación multi-fuente con síntesis* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `bench-analyst` cruza ratios internos (`mcp-bigquery`) contra 10-Ks/cuentas anuales de peers publicadas (`mcp-web-fetch` con allowlist); un validador A2A `source-validator` comprueba cita-fuente y fecha antes del handoff. Cada ratio comparado lleva `source_url` y `as_of_date`. Sin fuente resoluble, no aparece en el output; la publicación del análisis pasa por gate humano.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Ratio inventado o desactualizado citado ante comité | agentevals | validador determinista: cada ratio debe resolver a una URL de IR oficial + fecha; sin match la línea se elimina, no se "suaviza" |
| Prompt injection desde página de IR o blog manipulado | agentgateway | `mcp-web-fetch` con allowlist estricta (dominios IR oficiales, CNMV, SEC EDGAR); contenido marcado `untrusted-content` con spotlighting |
| Cifra interna no publicada (margen, EBITDA pre-anuncio) usada en comparación (**MAR art. 7 · CNMV · MiFID II**) | agentgateway | column-mask sobre columnas `pre_announcement=true`; el agente ve el peer set, no el propio dato hasta post-anuncio |
| Egress fuera de la allowlist a agregadores no aprobados | Istio | `AuthorizationPolicy` L4 en ztunnel: allowlist explícita de dominios financieros (IR corporativos, CNMV, SEC, EDGAR) |
