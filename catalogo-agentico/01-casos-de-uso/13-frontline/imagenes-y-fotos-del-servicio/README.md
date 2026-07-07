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

Si la foto incluye al cliente sin permiso y va a un servicio externo de identificación, problema de imagen y de GDPR. Si la pieza fotografiada incluye un número de serie + dato del cliente en el mismo encuadre y la imagen circula por compañeros vía canal no aprobado, fuga. Si en sanidad fotografías una herida y la mandas por WhatsApp para consultar a un colega, dato de salud sin tratamiento conforme. Riesgos típicos: imagen sin consentimiento, fuga vía móvil personal, sectores regulados con foto prohibida. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A7 — Generación creativa con guardrails de marca y compliance* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-imagen-asistente` describe e identifica piezas o daños desde foto en la app del puesto contra el catálogo (RO) y guarda la evidencia en el sistema corporativo; sin publicación ni salida a canal personal. Un validador A2A `pii-validator` detecta caras/matrículas y PII en la imagen antes de adjuntarla.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Rostro o matrícula del cliente en el encuadre enviado a servicio externo (GDPR derecho a la imagen; art. 9 si hay salud) | agentgateway | redaction visual: pixelado de caras/matrículas y detección de datos en la imagen antes de la request al modelo |
| Número de serie + dato del cliente en la misma foto circulando por canal no aprobado | agentregistry + Istio | la imagen sólo sale hacia el `mcp-dam` corporativo registrado; el egress a móvil/WhatsApp no registrado se deniega |
| Foto en sector con captación prohibida (sanidad, ferrocarril, seguridad) | agentgateway | prompt guard bloquea el flujo si el contexto marca sector con captación restringida y deriva a procedimiento manual |
| Identificación errónea de modelo o pieza presentada como cierta | agentgateway + agentevals | catálogo servido por `mcp-catalogo` (RO); agentevals exige confianza mínima, si es baja marca "requiere verificación manual" |

## Referencias

- GDPR/LOPDGDD (derecho a la propia imagen, art. 9 datos de salud), normativa sectorial de captación de imágenes. *Citas T1.*
- Marco técnico: OWASP LLM02 (Divulgación de Información Sensible).
