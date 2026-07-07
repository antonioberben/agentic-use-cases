# Traducción y atención multilingüe

> **Rol:** frontline · **Caso 2.2** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Cliente en un idioma que no manejas. Hoy: buscas a un compañero, usas Google Translate del móvil personal con el cliente esperando, o pierdes la venta/atención.

**2. Cómo resolverlo**

- **App del puesto:** traducción en tiempo real integrada en la plataforma de contact center o tienda (Genesys, Talkdesk, NICE CXone). Auriculares con interpretación en vivo en algunos sectores.
- **Apps aprobadas por la empresa para móvil/tablet del puesto:** Microsoft Translator, Google Translate Enterprise, DeepL Pro, Pocketalk (terminal físico en hostelería, retail, sanidad).
- **Cómo lo conecta la empresa:** habitualmente como **add-on de la plataforma de atención**, con datos cifrados y retención conforme a política. No usar la app personal de Google Translate gratuita con datos del cliente.
- **Alternativa para temas con matiz legal/sanitario:** servicio de intérprete oficial telefónico contratado por la empresa.

Reglas:

- Frases cortas, una idea por frase. La IA traduce mejor frases simples.
- Para legal, financiero o sanitario donde la decisión depende del matiz: intérprete oficial.
- Confirma con el cliente que se ha entendido: *"¿Es así lo que me pide?"*.

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| % atenciones cerradas sin barrera idiomática | 60% | 92% |
| Tiempo medio en atención multilingüe | +50% sobre base | +15% sobre base |
| Satisfacción cliente (NPS) en atención multilingüe | bajo | medio-alto |

Fórmula: depende del volumen multilingüe de tu centro. *En contact center con 15% de llamadas no nativas, ≈ 200 h/año por agente en atenciones que antes se escalaban.* (estimación, T1).

**4. Vulnerabilidades y riesgos → gobernanza**

Si uso Google Translate gratuito con conversación de cliente, los textos pueden quedar en logs del servicio para entrenamiento futuro — incumple GDPR de minimización y de transferencia internacional. Si la traducción simplifica un matiz legal (*"podemos resolver"* traducido como compromiso firme cuando era una posibilidad), vinculas a la empresa por error. Si en sanidad la traducción de un síntoma se pierde y se administra mal una medicación, daño al paciente. Riesgos típicos: traductor personal sin cobertura legal, pérdida de matiz contractual, error sanitario. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-traduccion-asistente` traduce en tiempo real la conversación con el cliente en la plataforma de atención; ante matiz legal, sanitario o financiero, deriva a intérprete oficial. Un validador A2A `meaning-validator` comprueba que la traducción no altera ningún compromiso antes del envío.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Google Translate personal gratuito con la conversación → texto en logs de entrenamiento (GDPR minimización + transferencia internacional) | agentregistry + Istio | sólo `mcp-traduccion` corporativo registrado tiene identidad; el egress a traductores públicos no registrados se deniega en ztunnel |
| Pérdida de matiz contractual (*"podemos resolver"* → compromiso firme) que vincula a la empresa | agentgateway | prompt guard de salida marca términos de compromiso; en matiz legal/financiero fuerza ruteo a intérprete oficial |
| Error de traducción de un síntoma en sanidad → daño al paciente (art. 9 + responsabilidad sanitaria) | agentgateway + agentevals | dominios sanitarios: eval set de terminología clínica; baja confianza → intérprete oficial obligatorio |
| Falta de disclosure de traducción automatizada al cliente (EU AI Act art. 50) | agentgateway | la plataforma informa al cliente de que la atención usa traducción asistida por IA |
| Canal externo de contact center (voz/chat) sin control N-S | kgateway | el canal entrante termina en kgateway antes de llegar al agente de traducción |

## Referencias

- EU AI Act art. 50 (disclosure), GDPR/LOPDGDD (minimización, transferencias internacionales), responsabilidad sanitaria. *Citas T1.*
- Marco técnico: OWASP LLM09 (Desinformación).
