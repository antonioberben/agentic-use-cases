# Sugerencia de producto o servicio

> **Rol:** frontline · **Caso 2.7** (extraído del archivo monolítico en Fase 2).

**1. Caso de uso**

Recomendar al cliente lo que más le encaja según historial y catálogo. Hoy: te basas en lo que tienes en la cabeza, vendes lo que más conoces, no siempre lo que el cliente necesita.

**2. Cómo resolverlo**

- **App del puesto / CRM:** asistente con historial del cliente (compras anteriores, contratos, preferencias) y catálogo. Propone opciones relevantes. Tú filtras y comunicas.
- **Herramientas frecuentes:** Salesforce Einstein Next Best Action, Microsoft Dynamics 365 Sales AI, Pega, herramientas sectoriales (Temenos en banca retail).
- **Cómo lo conecta la empresa:** el modelo accede al CRM en lectura, propone, **no contrata**. La contratación la haces tú con el procedimiento del producto.
- **Alternativa:** catálogo + historial + tu criterio.

Reglas:

- Recomienda lo que el cliente necesita, no lo que el sistema empuja. Si no le encaja, no insistas.
- Sin venta cruzada agresiva basada en perfilado sin base jurídica clara (consentimiento o interés legítimo equilibrado).
- En productos regulados (seguros, financiero, sanidad) la recomendación tiene requisitos formales (idoneidad, conveniencia, test MiFID, deber de información). **La IA propone borrador; tú haces el asesoramiento.**

**3. KPIs y mejora**

| KPI | Antes | Con IA |
|---|---|---|
| Tasa de aceptación de recomendación | 15% | 25-30% |
| Quejas por venta inadecuada | medio | bajo (si se aplica gate) |
| Productos en cartera por cliente | base | +0,3-0,5 |

Fórmula: depende del producto. *En banca retail, +0,4 productos × 500 clientes/año × margen unitario = revenue significativa por oficina. (estimación, T1).*

**4. Vulnerabilidades y riesgos → gobernanza**

Si la recomendación se hace sobre datos de perfilado sin base jurídica (GDPR art. 22 + considerandos sobre perfilado), problema regulatorio. Si en banca recomiendo un producto financiero sin el test de idoneidad / conveniencia hecho, infracción MiFID II. Si en sanidad recomiendo un suplemento sin formación específica, problema sanitario y posiblemente penal. Si la IA empuja productos por margen (no por encaje) y el cliente luego se queja, demanda de "asesoramiento inadecuado". Riesgos típicos: perfilado sin base jurídica, falta de test regulatorio, optimización por margen no por idoneidad. **Cubierto en la arquitectura de remediación (bloque 5).**

## 5. Arquitectura de remediación con gobernanza de IA

**Arquetipo:** *A4 — Chatbot cara al cliente con deflection y guardrails de salida* (ver [`../../arquetipos.md`](../../arquetipos.md)). El agente `frontline-recomendacion-asistente` propone opciones del catálogo según historial (CRM RO); el empleado decide y comunica; en producto regulado no asesora y rutea a test/gestor. Un validador A2A `suitability-validator` verifica idoneidad y base jurídica antes de proponer.

### Particularizaciones de este caso

| Riesgo específico (anclaje regulatorio) | Componente | Mecanismo específico |
|---|---|---|
| Perfilado sin base jurídica para la recomendación (GDPR art. 22 + perfilado) | agentgateway | `mcp-crm` sólo expone atributos con base jurídica declarada; prompt guard bloquea inferencias sobre categorías sensibles |
| Recomendación de producto financiero sin test de idoneidad/conveniencia (MiFID II) | agentgateway | prompt guard de salida: si el producto es regulado, respuesta "propuesta borrador, requiere test y asesoramiento del gestor" + ruteo a humano |
| Optimización por margen y no por idoneidad → venta inadecuada | agentevals | eval set con rubric de idoneidad; `suitability_score < umbral` bloquea la sugerencia |
| Recomendación sanitaria sin formación específica (responsabilidad sanitaria) | agentgateway | dominios sanitarios en denylist de salida; deriva a profesional autorizado |
| Canal del puesto (CRM/tablet) sin control N-S de dispositivo | kgateway | el ingress del asistente termina en kgateway con authn del dispositivo corporativo |

## Referencias

- GDPR/LOPDGDD (art. 22, perfilado), MiFID II (idoneidad/conveniencia), normativa sanitaria y aseguradora. *Citas T1.*
- Marco técnico: OWASP LLM06 (Agencia Excesiva).
