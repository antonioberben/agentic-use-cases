# Visualizaciones rápidas

> **Rol:** analista · **Caso 2.5** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tienes un DataFrame, necesitas gráfico publicable. Reaprender Matplotlib cada vez. Se busca: pides en lenguaje natural y recibes código o gráfico con ejes etiquetados, sin 3D, sin pie charts.

## 2. Cómo resolverlo

**Local.** Notebook + Llama 70B con prompt fijo *"código Plotly. Etiqueta ejes con unidad, título descriptivo, sin pie chart, paleta sobria."*

**Copilot (Excel / Power BI / Fabric).** Lenguaje natural directo.

**Claude Code / ChatGPT.** Mismo prompt → código → tú ejecutas.

**Tableau / Looker / Lightdash con IA integrada.** Lenguaje natural sobre dataset conectado.

**MCPs:** warehouse + BI (`mcp-tableau` / `mcp-powerbi`).

**Alternativa.** Templates propios en `viz/` reutilizables.

## 3. KPIs y mejora

| KPI | Base | Con agente |
|-----|------|------------|
| TT-gráfico | *20-40 min* | *3-5 min* |
| % gráficos con ejes y unidad | *60%* | *> 95%* |
| Iteraciones de formato | *3-4* | *1* |

**Fórmula:** `Ahorro ≈ (T_base − T_nuevo) × graficos_semana × 50`. Ejemplo: 25 min × 8 × 50 / 60 ≈ **167 h/año**.

> *Estimaciones pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

- *"Si el gráfico oculta un eje con escala truncada (default que el modelo a veces aplica), comunico una variación falsa."*
- *"Si subo dataset con clientes nominados al asistente público, fuga PII."*
- *"Si el gráfico se publica externamente sin disclosure de generación con IA y representa datos de personas, EU AI Act art. 50."*

> Estas vulnerabilidades se cubren con la **Pieza 2 — Plan Director de IA**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
