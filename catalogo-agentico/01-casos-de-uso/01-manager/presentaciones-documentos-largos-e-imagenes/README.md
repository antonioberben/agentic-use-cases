# Presentaciones, documentos largos e imágenes

> **Rol:** manager · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Te piden un deck de 8 slides para el comité ejecutivo el viernes, un one-pager de propuesta para un proveedor y un par de imágenes ilustrativas para el blog interno. Cada cosa por separado son 2-4 horas; juntas, una tarde y media de bloqueo creativo. Hoy partes de página en blanco. Lo que se busca: el agente entrega el primer 70% (estructura del deck, borrador del one-pager, código Mermaid del diagrama, prompt de imagen) y tú dedicas el tiempo al 30% que importa: mensaje, narrativa, decidir qué eliminar.

## 2. Cómo resolverlo

**Local.** Ollama + Llama 3.1 8B para outlines, drafts y prompts de imagen. Para imágenes propias (Stable Diffusion local) si la organización lo permite. Útil para piezas internas, no para material con datos reales.

**Copilot (Microsoft 365).** Camino más corto:

1. **PowerPoint:** *Copilot → Create a new presentation from* → pasas el brief o un documento de Word. Genera deck con plantilla corporativa. Reordenas, recortas, reescribes lo flojo.
2. **Word:** Copilot redacta el one-pager desde el brief. Pide siempre estructura fija (contexto, problema, opciones, recomendación, riesgos).
3. **Imágenes** dentro de Copilot (Designer): *"Ilustración isométrica, paleta corporativa, 16:9, sin texto"*.

**Claude Code (o agente de escritorio).** Repo `decks-drafts/` con `AGENTS.md` que prohíbe inventar cifras y obliga a citar fuente para cada dato del deck. Plantillas en `templates/`. Comando: *"Outline + bullets por slide para el deck descrito en `brief.md`. No inventes cifras: si falta dato, marca '[DATO PENDIENTE]'."* Para diagramas, salida en Mermaid o PlantUML (texto versionable).

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Plantillas corporativas (SharePoint) | `mcp-graph-files` | `npx mcp-graph-files` | `Files.Read.All` sobre la biblioteca de plantillas |
| Generación de imágenes | API de DALL·E, Firefly, etc. (no MCP estándar todavía) | — | API key dedicada del equipo de comunicación, no personal |
| Mermaid render | mermaid.live (online) o `mermaid-cli` (local) | `npx -p @mermaid-js/mermaid-cli mmdc` | sin scope (texto local) |
| Composición del deck | `mcp-deck` *(propuesto)* | `npx mcp-deck` | `deck:write` (crear/compartir el deck, **solo con aprobación humana**) |

Identidad propia (`svc-manager-deck-agent`). Para imágenes públicas, **revisa con Legal y Marketing** antes de publicar (derechos de autor de generativa están en zona gris en varios contratos).

**Alternativa.** Sin Copilot ni MCPs: outline en Claude/ChatGPT/Gemini → Gamma / Beautiful.ai / Pitch (generan deck desde outline) → ajustes finales tú. Para diagramas, pídele Mermaid y lo pegas en Notion/Confluence/mermaid.live.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| TT-deck | Tiempo para deck de 8 slides | *3-5 h* | *45-75 min* (revisión + narrativa) |
| TT-one-pager | Tiempo para propuesta de 2-3 páginas | *2-3 h* | *30-45 min* |
| TT-diagrama | Tiempo de un diagrama de proceso | *30-60 min* | *5-10 min* |
| % piezas con datos verificados | Disciplina antes de enviar | *70%* | *> 90%* (agente marca [DATO PENDIENTE]) |

**Fórmula simple:**

```
Ahorro_anual_h ≈ (T_base − T_nuevo) × piezas_año
```

Ejemplo: (4 h − 1 h) × 30 decks/año + (2.5 h − 0.5 h) × 50 one-pagers/año = 90 + 100 = **190 h/año** por manager (cifra alta porque las piezas creativas pesan).

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si el deck para el comité incluye cifras financieras y se redacta con un asistente público no aprobado, los datos del comité (presupuesto, plantilla, decisiones) salen del perímetro. En cotizadas puede ser información privilegiada (MAR)."*
- *"Si el modelo alucina una cifra en una slide (un benchmark de mercado inventado, un número de clientes mal copiado) y la presento al comité, decidimos sobre ficción. La responsabilidad es mía aunque el deck lo escribiera el agente."*
- *"Si genero una imagen 'inspirada en' un estilo concreto (un cómic conocido, un fotógrafo) y la publico externamente, hay riesgo de infracción de derechos de autor. Algunos contratos de proveedores de imagen generativa lo cubren; otros no."*
- *"Si el deck contiene fotos de personas (empleados, clientes) generadas o modificadas con IA y no hay consentimiento informado, hay vulneración de derechos de imagen (LO 1/1982) y GDPR."*

**Riesgos típicos:** alucinación numérica en piezas de comité, información privilegiada, derechos de autor de generativa, derechos de imagen sin consentimiento, **disclosure obligatorio del EU AI Act art. 50** cuando el contenido se publica externamente sin marca clara de IA.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-deck-agent` produce outline + bullets + Mermaid + prompts de imagen; nunca acepta cifras sin fuente y marca `[DATO PENDIENTE]` cuando falta.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Cifras de comité a asistente público → información privilegiada (**MAR art. 7/14 · MiCA · CNMV**) | agentgateway | clasificación `board-material` con patrón detector (revenue, plantilla, guidance) → modelo on-prem forzado; egress externo deny; ventana blackout T-30/T+2 |
| Alucinación numérica en slide del comité | agentevals | política de salida: cifra sin `source_id` cita → sustituida por `[DATO PENDIENTE]`; validador A2A cruza cifras contra `mcp-graph-files` de plantillas y datasets internos; eval set de 30 decks con cifras conocidas |
| Infracción de derechos de autor por imagen "inspirada en" estilo/artista | agentgateway + agentregistry | prompt guard bloquea nombres propios de artistas/franquicias en prompts de imagen; solo proveedores de imagen con indemnización contractual (Adobe Firefly, DALL-E enterprise) publicados en agentregistry |
| Derechos de imagen sin consentimiento en fotos de personas (**LO 1/1982 · GDPR**) | agentgateway | prompt guard bloquea generación de imágenes con instrucciones tipo "foto realista de empleado/cliente"; deepfakes de personas deny absoluto |
| Falta de disclosure de contenido IA en publicación externa (**EU AI Act art. 50** transparencia) | agentgateway | metadata C2PA/watermark obligatorio en output de imagen; el asset sale con `ai-generated=true` en manifest |
| Creación/compartición del deck sin control → deck con datos sin verificar distribuido al comité | agentgateway (MCP Gateway) + kagent | `mcp-deck` con scope `deck:write`; **HITL obligatorio antes de crear/compartir**; OBO del manager |
