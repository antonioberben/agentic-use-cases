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

Si uso Google Translate gratuito con conversación de cliente, los textos pueden quedar en logs del servicio para entrenamiento futuro — incumple GDPR de minimización y de transferencia internacional. Si la traducción simplifica un matiz legal (*"podemos resolver"* traducido como compromiso firme cuando era una posibilidad), vinculas a la empresa por error. Si en sanidad la traducción de un síntoma se pierde y se administra mal una medicación, daño al paciente. Riesgos típicos: traductor personal sin cobertura legal, pérdida de matiz contractual, error sanitario. **Cubierto en la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
