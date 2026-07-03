# Imágenes y fotos del servicio

> **Rol:** frontline · **Caso 2.4** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Registrar daño visible, estado de un equipo, identificación de pieza, evidencia de incidencia. Hoy: foto con el móvil, descripción a mano, varias búsquedas para identificar el modelo correcto.

**2. Cómo resolverlo**

- **App del puesto con cámara:** foto desde la app corporativa. La IA puede describir lo que se ve (*"daño visible en esquina inferior derecha"*), identificar pieza o modelo (*"es el modelo X de la serie Y"*), comparar con el estándar.
- **Herramientas frecuentes:** ServiceNow Field Service, Salesforce Field Service AI, Microsoft Dynamics 365 Field Service, herramientas sectoriales (TraceParts en industria, sanitarias propias).
- **Cómo lo conecta la empresa:** las fotos se guardan en el sistema corporativo con metadatos del caso, no en la galería personal del móvil. La IA accede al catálogo de piezas/modelos en modo solo lectura.
- **Alternativa:** foto + descripción manual cuando la IA no identifica.

Reglas:

- No tomar fotos donde aparezca el cliente sin permiso. Pixela cara/matrícula si entra en plano.
- En sectores con normativa específica (sanidad, seguridad, ferrocarril): solo lo que el procedimiento permita y donde permita.
- Las fotos no salen del sistema corporativo. Nada de WhatsApp con compañeros para "preguntar qué es esto".

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tiempo de identificación de pieza | 5-10 min | 30 s |
| % incidencias documentadas con foto + descripción | 70% | 95% |
| Errores en identificación de modelo | medio | bajo |

Fórmula: *7 min × 8 piezas/día × 220 días = ≈ 200 h/año por técnico. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la foto incluye al cliente sin permiso y va a un servicio externo de identificación, problema de imagen y de GDPR. Si la pieza fotografiada incluye un número de serie + dato del cliente en el mismo encuadre y la imagen circula por compañeros vía canal no aprobado, fuga. Si en sanidad fotografías una herida y la mandas por WhatsApp para consultar a un colega, dato de salud sin tratamiento conforme. Riesgos típicos: imagen sin consentimiento, fuga vía móvil personal, sectores regulados con foto prohibida. **Cubierto en la Pieza 2 — Plan Director de IA.**

## 5. Arquitectura de remediación con gobernanza de IA

Los riesgos identificados en el bloque 4 no se mitigan con buenas intenciones ni con formación. Se mitigan con una **plataforma de gobierno de IA** que se integra en el flujo del caso y aplica los controles de forma sistemática: identidad propia del agente, control de MCPs y herramientas, redacción de datos sensibles, observabilidad end-to-end, cuota y coste por agente.

> **[Diagrama pendiente]** — arquitectura de referencia con los componentes de la plataforma Solo.io (agentgateway, kagent, agentregistry, kgateway) integrados en este caso concreto. Se completará caso por caso explicando qué vulnerabilidad del bloque 4 cierra cada componente.
