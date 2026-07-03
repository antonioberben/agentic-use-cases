# Ejecutivo — Cómo trabajar con IA agéntica en tu día a día

> Audiencia: C-level y dirección general (CEO, COO, CFO, CIO, CTO, CISO, CDO, CRO, CMO, CHRO), directores generales de unidad, miembros del comité.

:::warning Esta ficha cubre solo la mitad del problema

Lo que vas a leer es **cómo aumentar tu eficiencia con IA**. La otra mitad —**gobernanza, seguridad, cumplimiento y control de coste**— vive en la **Pieza 2 — Plan Director de IA**. Para vuestro rol es especialmente sensible: lo que pasa por vuestras manos es lo más confidencial de la organización. Material de comité, M&A, resultados pre-publicación, planes de reestructuración o nóminas C-level en herramientas no aprobadas implican riesgo regulatorio (**MAR/CNMV** sobre MNPI), reputacional y de gobierno corporativo. Decisiones sobre personas apoyadas en IA requieren garantías de **GDPR art. 22** y **EU AI Act** alto riesgo. **Sois patrocinadores del plan y los primeros sometidos a él.**

:::

## 1. Qué cambia para ti

El trabajo ejecutivo es procesar señal en medio del ruido: leer mucho, sintetizar rápido, decidir bajo incertidumbre, comunicar con claridad. La IA acelera la lectura, la síntesis y el primer borrador. Lo que no cambia: la decisión, el riesgo asumido y la responsabilidad fiduciaria. Sigue siendo tuya, con tu firma.

## 2. Ocho casos típicos en formato de 4 bloques

### 2.1 Preparación de comité

**1. Caso de uso**

Doscientas páginas de board pack que tienes que leer entre dos vuelos. Hoy: lectura diagonal, anotación manual, llegada al comité con preparación irregular. Pierdes inconsistencias entre documentos, omisiones y preguntas críticas.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre PDFs descifrados del board pack. *"Resume cada documento en una página: tesis, datos clave con cifra, decisiones que se piden, riesgos señalados, omisiones evidentes. Identifica inconsistencias entre documentos. No interpretes intención; señala hechos. Genera 5 preguntas críticas que un consejero independiente debería hacer."*
- **Copilot M365:** sobre Teams del comité con DLP estricto y `Sensitivity = Highly Confidential`. Nunca chat público.
- **Claude Code:** `AGENTS.md` del board pack — *"Resúmenes en tres niveles (5 líneas / 1 página / 3 páginas). Cita siempre la sección y página de la cifra. Marca con [VERIFICAR] cualquier dato que no se respalde en el documento."*
- **MCPs:**

| MCP | Servidor + arranque | Scopes mínimos |
|---|---|---|
| `mcp-board-portal` | Diligent/Nasdaq Boardvantage MCP con `vault://board/secretaria-ro` | `documents:read` (solo a tu board), no `members:read` |
| `mcp-sharepoint` | Microsoft Graph MCP con `Sites.Selected` sobre el sitio del comité | Solo el site del board |

```json
{
  "mcpServers": {
    "board": {
      "command": "npx",
      "args": ["-y", "@diligent/mcp-board"],
      "env": {"DILIGENT_TOKEN": "${vault://board/secretaria-ro}"}
    }
  }
}
```

- **Alternativa:** Claude/ChatGPT Enterprise con pliego subido a workspace con retención cero. Nunca cuentas personales.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Horas de lectura previa al comité | 6-8 h | 2-3 h |
| Inconsistencias detectadas entre docs | bajas | medias-altas |
| Preguntas críticas preparadas | 2-3 | 6-10 |
| % decisiones con preparación completa | 60% | 90% |

Fórmula: *(7 − 2,5) h × 12 comités/año = 54 h/año por ejecutivo. Con 8 miembros del comité, 432 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si trabajo desde Copilot y subo el board pack a un chat sin sensibilidad etiquetada, el material —que es **MNPI** en cotizada— queda en logs accesibles a admins TI generales y entra en flujos de retención no compatibles con la política del comité. Si uso un MCP no aprobado contra el portal del consejo, abro un canal de exfiltración con mi token de secretaria. Si comparto el resumen por correo sin clasificar, replica el riesgo aguas abajo. Riesgos típicos: violación de MAR/CNMV por circulación indebida de MNPI, ruptura de confidencialidad fiduciaria, evidencia perdida para auditor. **Estas vulnerabilidades se cubren con la capa de gobernanza, identidad de agente, clasificación de datos y observabilidad de la Pieza 2 — Plan Director de IA.**

### 2.2 Síntesis de información estratégica

**1. Caso de uso**

Informes de consultora de 80 páginas, deep-dives de unidad, market research de viernes por la tarde. Llegan a tu mesa más rápido de lo que puedes procesarlos. Hoy: delegas en el chief of staff o llegas a la reunión sin haberlo leído.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B. *"Resumen en tres niveles: (a) 5 líneas para ejecutivo apurado, (b) 1 página para comité, (c) 3 páginas con detalle. Cita cada cifra con sección de origen. Marca lo que el documento no contesta."*
- **Copilot M365:** sobre PDFs en OneDrive corporativo del ejecutivo.
- **Claude Code:** carpeta con `AGENTS.md` que fija el formato 5-líneas/1-pg/3-pg y prohíbe inferencias no respaldadas.
- **MCPs:** `mcp-sharepoint` y `mcp-confluence` para acceder a la biblioteca de papers internos del comité. Servidor MCP con `vault://exec/research-ro`, scopes `documents:read` sobre la biblioteca, sin permisos de escritura.
- **Alternativa:** Claude Projects con el PDF subido.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de digestión de informe 80pp | 3 h | 30 min |
| % informes leídos antes de comité | 50% | 95% |
| Cifras citadas con fuente verificada | medio | alto |

Fórmula: *(3 − 0,5) h × 30 informes/año = 75 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el modelo alucina una cifra y la cito en comité sin verificarla con la sección de origen, la decisión queda apoyada en dato falso. Si subo el informe del consultor (sujeto a NDA bilateral) a un servicio no aprobado, rompo la cláusula de confidencialidad del contrato. Riesgos típicos: alucinación numérica, ruptura de NDA con tercero, citación cruzada de información de varias unidades que individualmente es confidencial. **Cubierto en la Pieza 2 — Plan Director de IA** (controles MCP, *prompt logging*, observabilidad).

### 2.3 Borrador de comunicación interna o externa

**1. Caso de uso**

Nota al equipo sobre resultados, mensaje tras reestructuración, columna del CEO, comunicación al mercado. Hoy: borrador a mano un domingo por la noche o delegado a gabinete con poco contexto.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B con tus 10 últimas comunicaciones para fijar tono propio. *"Redacta comunicación para [audiencia]. Tono [calmo / firme / cercano]. Estructura: contexto, qué cambia, por qué, qué hacemos, dónde preguntar. Sin frases vacías. Sin promesas no acordadas. Marca con [REVISAR] cualquier cifra o compromiso."*
- **Copilot M365:** desde Outlook del CEO. Sensibilidad `Confidential / All Employees` antes de enviar.
- **Claude Code:** `AGENTS.md` del estilo de comunicación corporativo (vocabulario aprobado, palabras prohibidas, palabras que vinculan a la sociedad).
- **MCPs:** `mcp-confluence` para acceder a guías de comunicación, `mcp-historic-comms` (interno) para coherencia con mensajes anteriores. Scopes `documents:read` solo sobre el espacio de comunicación corporativa.
- **Alternativa:** Claude con plantillas. Para **comunicaciones reguladas** (hecho relevante, comunicación al supervisor): **borrador conjunto con asesoría jurídica y comunicación. La IA es punto de partida, no envío.**

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a primer borrador | 90 min | 15 min |
| Iteraciones hasta versión final | 4-5 | 2-3 |
| Coherencia con tono histórico del CEO | media | alta |

Fórmula: *(75 min × 50 comunicaciones/año) = 62,5 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si envío sin revisión un comunicado a empleados generado por IA y contiene una promesa sobre indemnización o futuro de un centro, **vinculo a la sociedad por escrito**. Si la comunicación es a accionistas o mercado y no pasa por asesoría jurídica + comunicación, riesgo de **información engañosa** (MAR art. 12) o de hecho relevante mal calificado. Si la IA mete cifra incorrecta y va al regulador, riesgo de expediente. Riesgos típicos: compromiso no autorizado, MAR/transparencia, suplantación de tono (deepfake de estilo) usada para fraude. **Cubierto en la Pieza 2 — Plan Director de IA** (gates de revisión, trazabilidad, identidad de comunicaciones firmadas).

### 2.4 Análisis competitivo y de mercado

**1. Caso de uso**

Movimiento del competidor, cambio regulatorio, anuncio sectorial. Hoy: pides al director de unidad que lo analice y llega tres días tarde.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre dossiers internos + recortes de prensa filtrados. *"Analiza el anuncio de [X]. Implicaciones para nuestro posicionamiento, precios, propuesta de valor. Tres hipótesis sobre por qué lo han hecho. Tres escenarios de respuesta con pros/contras. Cita fuentes; sin datos inventados; sin inferencias sobre estrategia futura del competidor más allá del hecho público."*
- **Copilot M365:** con conector a Bing/news enterprise filtrado por fuente.
- **Claude Code:** carpeta `competitive/` con un `AGENTS.md` que prohíbe inferir de fuentes no citadas.
- **MCPs:** `mcp-news` (Bloomberg/Reuters MCP) con scopes `articles:read`, `mcp-crm` (Salesforce/Dynamics) con `accounts:read` sobre cuentas estratégicas, `mcp-market-intel` (Gartner/Forrester) con `vault://exec/analyst-ro`.
- **Alternativa:** Claude con dossier subido + búsqueda web supervisada.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo a posición preliminar | 2-3 días | 4 h |
| % movimientos analizados a tiempo | 50% | 85% |

Fórmula: *4 movimientos/mes × ahorro 12 h = 576 h/año a nivel de comité. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si actúo sobre análisis del modelo sin triangular con el director de unidad (que tiene contexto cualitativo del mercado), decido sobre dato superficial. Si el modelo se apoya en rumores no verificados y vinculo nuestra respuesta pública, riesgo de **competencia desleal** o de **información engañosa**. Riesgos típicos: alucinación de movimientos, mezcla de fuentes (rumor con dato verificado), filtración de nuestra reacción si el análisis circula. **Lo que escribe el modelo es punto de partida para discusión, no conclusión. Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.5 Briefing para reuniones

**1. Caso de uso**

Reunión con cliente clave, regulador, consejero o socio en 20 minutos. Hoy: entras sin haber preparado o con un brief desactualizado.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B + exportación CRM + últimas notas/correos. *"Brief de 1 página antes de reunión con [persona] de [organización]. Estructura: estado de relación, últimos 3 contactos relevantes, asuntos abiertos, tema previsto, 3 puntos a plantear, 3 preguntas a esperar. Cita nota o correo de origen."*
- **Copilot M365:** integración Outlook + Teams + Salesforce.
- **Claude Code:** carpeta `briefings/` con `AGENTS.md` que prohíbe inventar contactos pasados.
- **MCPs:** `mcp-crm` (Salesforce/Dynamics) con `vault://exec/crm-ro` y scopes `accounts:read,opportunities:read,activities:read` sobre tus cuentas estratégicas (no toda la cartera); `mcp-mail` (Microsoft Graph) con `Mail.Read` sobre tu buzón, **no** `Mail.Send`; `mcp-calendar` `Calendars.Read`.

```json
{
  "mcpServers": {
    "crm": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp"],
      "env": {"SF_TOKEN": "${vault://exec/crm-ro}"}
    }
  }
}
```

- **Alternativa:** export manual + Claude con dossier.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de preparación | 45 min | 5 min |
| % reuniones con brief al día | 40% | 95% |

Fórmula: *40 min × 200 reuniones/año = 133 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el MCP del CRM va con scopes amplios (`Mail.ReadWrite` o `accounts:read` sobre toda la cartera), el agente puede inferir o extraer información de cuentas que no son tuyas. Si el brief incluye datos personales del interlocutor (familia, salud) extraídos del CRM, problema GDPR de minimización. Si delego en el modelo el envío del *follow-up* tras la reunión, vinculo a la sociedad sin revisión. Riesgos típicos: scope creep del MCP, inferencia GDPR sensible, *follow-up* automático no supervisado. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.6 Decision making: estructurar opciones y trade-offs

**1. Caso de uso**

Decisión compleja con stakeholders en distintas posiciones y datos parciales. Hoy: agenda de 30 min en comité, llegada con la decisión tomada por inercia.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B como sparring. *"Sobre la decisión [X], estructura: objetivo último, opciones disponibles, criterios, trade-offs corto/largo plazo, qué información falta, decisiones reversibles vs irreversibles. **No recomiendes; estructura.**"* Después: *"Plantéame los 5 contraargumentos más fuertes a esta decisión."*
- **Copilot M365:** uso interno como pizarra estructurada.
- **Claude Code:** `AGENTS.md` del marco de decisión corporativo (Bezos one-way/two-way doors, Kahneman pre-mortem, etc.).
- **MCPs:** habitualmente ninguno externo; la decisión se estructura sobre lo que ya tienes en la cabeza. Si procede, `mcp-financial-model` (interno) con scopes `models:read` sobre los modelos relevantes.
- **Alternativa:** Claude Projects para conversación larga estructurada.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Decisiones con pre-mortem documentado | 20% | 70% |
| Decisiones revertidas por información omitida | medio | bajo |

Fórmula: difícil cuantificar; valor en calidad de decisión, no en horas.

**4. Vulnerabilidades y riesgos → gobernanza**

Si trato la salida del modelo como recomendación y no como estructura, sustituyo mi criterio por el suyo en decisiones irreversibles. Si la decisión es sobre personas (despidos, compensación, promoción) y la IA pesó en ella sin las garantías del **GDPR art. 22** y **EU AI Act**, problema regulatorio. Riesgos típicos: delegación implícita en el modelo, decisiones de personas con apoyo IA sin gate humano documentado, ausencia de trazabilidad. **Cubierto en la Pieza 2 — Plan Director de IA** (gate humano sobre alto riesgo, trazabilidad de decisiones IA-asistidas).

### 2.7 Lectura crítica de planes y propuestas

**1. Caso de uso**

Plan estratégico de unidad, business case que te traen a aprobar, propuesta de inversión. Hoy: lectura amable porque te lo presenta gente de confianza, aprobación con menos escrutinio del que merece.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B. *"Lee crítico del plan. Identifica: hipótesis no explicitadas, sensibilidades no testadas, dependencias críticas, métricas que no defienden el caso si fallan, comparativa con benchmarks razonables. Tono de director general que ha visto fracasar planes parecidos. No reescribas el plan; señala."*
- **Copilot M365:** sobre PDF del business case.
- **Claude Code:** `AGENTS.md` con tu rúbrica de revisión de planes (lo que siempre miras: TAM realista, unit economics, supuestos macro, dependencias técnicas, plan B).
- **MCPs:** `mcp-bi` (Power BI/Tableau MCP) con `vault://exec/bi-ro` y scopes `datasets:read` solo sobre datos públicos internos para benchmarkear, no para reescribir.
- **Alternativa:** Claude con PDF y rúbrica al inicio del prompt.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Hipótesis ocultas detectadas por plan | 1-2 | 5-8 |
| Planes aprobados que descarrilan a 12m | medio | bajo |

Fórmula: *valor en planes evitados (orden 10⁵-10⁶ €/plan descarrilado evitado). (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si comparto el business case (que contiene proyecciones de M&A, mercados que estamos por entrar o costes de unidad) con un servicio no aprobado, filtración estratégica directa. Si el modelo inventa benchmarks de mercado y rechazo el plan en base a ellos, decisión errónea con coste reputacional con el director que lo presentó. Riesgos típicos: filtración estratégica, alucinación de benchmarks, sesgo del modelo a estructura "demasiado optimista" sin contexto sectorial. **Cubierto en la Pieza 2 — Plan Director de IA.**

### 2.8 Gestión de calendario y comunicación operativa

**1. Caso de uso**

Ochenta correos sin contestar, decisiones de calendario en conflicto, *follow-ups* que se pierden. Hoy: chief of staff hace lo que puede.

**2. Cómo resolverlo**

- **Local (Ollama):** Llama 3.1 70B sobre export de bandeja para triage local. *"Resume el hilo en 5 líneas, indica decisión pendiente y de quién."*
- **Copilot M365:** triage por prioridad (Superhuman AI / Shortwave equivalentes). **Sin respuesta automática a temas sensibles.**
- **Claude Code:** `AGENTS.md` que enumere temas que nunca se contestan sin tu revisión (consejero, regulador, M&A, RRHH).
- **MCPs:**

| MCP | Servidor + arranque | Scopes mínimos |
|---|---|---|
| `mcp-mail` | Microsoft Graph MCP con `vault://exec/mail-ro` | `Mail.Read` (jamás `Mail.Send`) |
| `mcp-calendar` | Microsoft Graph MCP | `Calendars.Read`; escritura solo del chief of staff humano |
| `mcp-tasks` | Microsoft To Do / Asana MCP | `tasks:read,tasks:write` solo sobre tu lista personal |

```json
{
  "mcpServers": {
    "mail": {
      "command": "npx",
      "args": ["-y", "@microsoft/graph-mcp"],
      "env": {"GRAPH_TOKEN": "${vault://exec/mail-ro}"}
    }
  }
}
```

- **Alternativa:** asistente humano + IA como herramienta del asistente, no del ejecutivo.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Correos pendientes a final de día | 80 | 20 |
| *Follow-ups* perdidos | 20% | 5% |
| Conflictos de calendario | 3/semana | 0,5/semana |

Fórmula: *60 min/día × 220 días = 220 h/año. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si el agente tiene scopes `Mail.Send` y contesta correos del CEO automáticamente, vincula a la sociedad sin gate humano. Si el agente lee mi bandeja con scopes amplios, accede a correos del consejo, asesores externos, asuntos personales del CEO — sin minimización. Si el chief of staff usa el agente con su token personal y se va de la empresa, los accesos quedan sin trazabilidad. Riesgos típicos: respuesta automática sensible, sobre-permisos del agente sobre bandeja del C-level, ausencia de identidad propia del agente (uso de token humano). **Cubierto en la Pieza 2 — Plan Director de IA** (identidad de agente, scopes mínimos, gate humano sobre envío).

## 3. Reglas adicionales para el ejecutivo

- **Datos máximos sensibles solo en entorno corporativo aprobado.** Resultados pre-publicación, M&A, reestructuración, planes de despido, salarios del comité: **nunca** en chats públicos.
- **Información material no pública (MNPI).** En cotizadas, materiales que afectan a la cotización son MNPI. Tratamiento conforme a **MAR**, **CNMV**, política interna de información privilegiada.
- **Chief of staff o secretaría como gate.** Comunicaciones externas significativas pasan por gabinete o asesoría antes de salir.
- **Trazabilidad de decisiones.** Si la decisión se apoyó parcialmente en IA, queda en acta o nota interna. Auditoría interna y gobierno corporativo lo agradecerán.
- **Sed el modelo.** El resto de la empresa replicará vuestro comportamiento.

## 4. Cinco hábitos clave

1. **Confidencialidad antes del prompt.** ¿Esta información puede salir del perímetro? Si no, herramienta aprobada y nada más.
2. **Tres niveles de resumen.** 5 líneas / 1 página / 3 páginas. Pide los tres.
3. **El modelo como sparring, no como oráculo.** Para contraargumentar, no para decidir.
4. **Revisa lo que firmas con tu nombre.** La IA es borrador, no firma.
5. **Documenta cuándo y cómo usas IA.** Para decisiones materiales, queda escrito.

## 5. Qué evitar

- Pegar materiales de comité, planes estratégicos, M&A o resultados pre-publicación en chats no aprobados.
- Enviar comunicaciones a empleados, accionistas o mercado generadas por IA sin revisión humana.
- Apoyarse en análisis competitivo sin verificar las cifras citadas.
- Tratar la salida del modelo como conclusión. Es input para discusión, no decisión.
- Aprobar tácitamente el uso laxo de IA en el resto de la organización.
- Olvidar que MAR, CNMV, GDPR, NIS2, DORA y EU AI Act os aplican personalmente como administradores.

## 6. Cómo seguir

- Lab base **"agente analítico sobre datos"** (2.2, 2.4, 2.7).
- Lab base **"agente regulatorio/legal sobre documentos"** (2.1, 2.3).
- Lab base **"asistente al empleado frontline"** (2.5, 2.8).
- **Pieza 1 — Resumen ejecutivo** del kit: lectura corta para tu rol.
- **Pieza 2 — Plan Director de IA**: la otra mitad. Sois patrocinadores y firmantes.
