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

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
