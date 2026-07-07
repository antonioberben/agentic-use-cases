# Notas a mano → digital y buscable

> **Rol:** manager · **Caso 2.9** (extraído del archivo monolítico en Fase 2).

## 1. Caso de uso

Tomas notas a mano en libreta durante reuniones de cliente, comités y pasillo. La libreta se llena, no la consultas, las decisiones se pierden. Hoy las notas son un cementerio. Lo que se busca: foto → transcripción estructurada → indexación en tu nota maestra → recuperable por consulta en lenguaje natural ("¿qué decidimos con el cliente X en abril?").

## 2. Cómo resolverlo

**Local.** Para máxima privacidad: foto + OCR local (Tesseract o LM Studio + modelo multimodal local) + Obsidian/Apple Notes para indexar. Más fricción pero el contenido no sale del dispositivo.

**Copilot (Microsoft 365 / OneNote).** Camino aceptable si las notas no son sensibles: foto en OneNote (con OCR integrado) y Copilot indexa contra el notebook. Lectura en lenguaje natural desde Copilot Chat.

**Claude Code o asistentes con visión.** Camino más versátil:

1. Al terminar reunión, foto de la página con el móvil.
2. Subes la imagen a Claude / ChatGPT / Gemini con prompt: *"Transcribe estas notas a mano. Estructura: fecha, contexto si lo identificas, temas, decisiones, acciones con dueño y plazo. Marca [ilegible] lo que no se entienda. No inventes."*
3. Pegas en Notion / OneNote / Obsidian / Confluence con etiquetas por cliente, proyecto y fecha.
4. Recuperas por consulta en lenguaje natural.

**MCPs (configuración y conexión):**

| MCP | Servidor recomendado | Arranque (ejemplo) | Scopes mínimos |
|-----|---------------------|--------------------|----------------|
| Nota maestra | `@notionhq/mcp` / `mcp-graph-onenote` / `mcp-obsidian` | `npx -y @notionhq/mcp` | escritura solo sobre el notebook personal del manager |
| OneDrive / Drive (fotos) | `mcp-graph-files` / `mcp-google-drive` | `npx mcp-graph-files` | `Files.ReadWrite.AppFolder` (carpeta dedicada) |

Identidad propia (`svc-manager-notes-agent`). Carpeta dedicada en el drive personal, **nunca** carpetas compartidas con el equipo.

**Alternativa.** Apps especializadas con pipeline foto → texto → indexación: Goodnotes 6, Notability AI, Granola (reuniones en directo), Mem.ai, Otter. Útiles si no quieres montar MCPs.

## 3. KPIs y mejora de rendimiento

| KPI | Definición | Base estimada | Estimación con agente |
|-----|------------|---------------|------------------------|
| % notas a mano digitalizadas | Cobertura | *< 10%* | *> 80%* |
| TT-recuperación de decisión pasada | Minutos para encontrar "qué dijimos hace 3 meses" | *15-30 min* (a menudo no se encuentra) | *< 2 min* |
| Decisiones perdidas por reunión | Compromisos que se olvidan | *1-2/reunión* | *< 0.3/reunión* |
| % notas con metadatos (cliente, proyecto, fecha) | Disciplina | *0-10%* | *> 90%* |

**Fórmula simple:** difícil cuantificar; el valor aparece cuando llega la pregunta *"¿qué prometimos al cliente X?"* y se responde en segundos en lugar de horas. Métrica útil: número de compromisos cumplidos por confianza recuperada.

> *Estimaciones cualitativas pendientes de T1.*

## 4. Vulnerabilidades y riesgos → gobernanza

**Ejemplos concretos:**

- *"Si subo una foto de notas de reunión de cliente con su nombre, su decisión y comentarios off-the-record a un asistente público no aprobado, esa información sale del perímetro sin contrato. Si el cliente exige eliminación (derecho de supresión GDPR), no puedo garantizar que el proveedor la borre de su cache."*
- *"Si las notas incluyen información sobre evaluación de un trabajador (un comentario informal sobre desempeño anotado en un 1:1), esa anotación se convierte en dato laboral indexado. Si entrenan con ella, el sesgo sobre la persona se replica fuera."*
- *"Si subo notas de un comité con cifras pre-anuncio (revenue del trimestre, decisión de plantilla), en empresa cotizada esa foto contiene información privilegiada (MAR / MiCA)."*
- *"Si mezclo notas de dos clientes en la misma página y el modelo no los separa bien, se filtra información cruzada: cliente A acaba viendo en su histórico decisiones que eran sobre cliente B."*

**Riesgos típicos:** transferencia internacional sin garantías (mayoría de proveedores son EE.UU.), uso de datos para entrenamiento, retención no acotada, contaminación cruzada de clientes en transcripciones, fuga de evaluación de personas, información privilegiada en notas de comité.

**Cierre:**

> Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, control de MCP, observabilidad y gestión de coste de la **arquitectura de remediación (bloque 5)**. No lleves este caso a producción real sin esa capa.

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails* + transcripción multimodal (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `svc-manager-notes-agent` recibe foto → OCR + estructuración → escritura en notebook personal. Nunca escribe en espacios compartidos.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Foto de notas de cliente con off-the-record a LLM público (**GDPR art. 6 · derecho de supresión art. 17 · confidencialidad contractual**) | agentgateway | modelos multimodales on-prem obligatorios para clasificación `client-notes`; egress DALL-E/Gemini Vision deny; DPA verificado en agentregistry |
| Evaluación informal de trabajador transcrita → dato laboral indexado sin base (**EU AI Act Anexo III empleo · GDPR art. 22**) | agentgateway | pii-redact detecta términos evaluativos (`rendimiento`, `motivación`) + nombres de empleados; salida con nombres reemplazados por rol |
| Cifras pre-anuncio en notas de comité (**MAR art. 7 · MiCA · CNMV**) | agentgateway | clasificación por presencia de patrón `€M`, `revenue`, `plantilla` en contexto de comité → modelo on-prem forzado |
| Contaminación cruzada de clientes en la misma página (agente mezcla) | agentevals | validador A2A: si la foto tiene múltiples `client_id` inferidos, separación obligatoria antes de indexar; eval set con 20 páginas multi-cliente |
| Escritura del MCP OneNote/Notion sobre notebooks compartidos por error | agentregistry | `mcp-graph-onenote` publicado con scope solo a `notebook_id` del manager; escritura en notebooks compartidos deny |
