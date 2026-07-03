---
title: "Riesgos y coste"
sidebar_position: 9
---

# Riesgos y coste

Cierre de los fundamentos: qué puede salir mal y por qué la factura puede dispararse. Sin entrar al detalle de gobernanza (eso es la Pieza 2); solo lo mínimo para que el practitioner entienda por qué los componentes de Solo existen.

## Riesgos típicos

- **Alucinación.** El modelo afirma cosas falsas con seguridad. Mitigación: contexto verificado (RAG), citas obligatorias, revisión humana en decisiones con efecto.
- **Filtración de datos.** PII, secretos o información confidencial que sale al modelo o a un MCP sin base jurídica ni control. Mitigación: redaction en el agentgateway, no-retención, scopes mínimos.
- **Prompt injection.** Un documento, una página web o un MCP malicioso inyecta instrucciones al agente y lo desvía. Mitigación: aislamiento de fuentes, allowlist de MCPs, no ejecutar acciones destructivas sin gate humano.
- **Shadow AI.** Agentes y MCPs desplegados sin inventario, con credenciales personales, sin control de coste. Mitigación: kagent + agentregistry + agentgateway desde el nivel 2 de madurez.
- **Decisión automatizada sin supervisión.** El agente actúa sobre sistemas reales (cierra tickets, lanza pagos, escribe en CRM) sin que nadie compruebe. Mitigación: human-in-the-loop, scopes read-only por defecto, revisión por muestreo.
- **Dependencia de proveedor.** Todo el negocio depende de la API de un único LLM. Mitigación: abstracción por gateway, capacidad de cambiar modelo.

## Coste

El coste de un caso agéntico no es el de un chat: una sesión con herramientas y reintentos puede consumir 20-50 veces más tokens que una conversación equivalente.

Tres palancas:

- **Modelo adecuado.** No usar GPT-4 / Claude Opus para tareas simples. Un modelo barato (Haiku, Mini, Llama 70B) basta para la mayoría.
- **Caching.** Cachear el contexto de sistema (AGENTS.md, esquemas, documentación) entre invocaciones. Reduce 30-70% del coste en muchos patrones.
- **Cuotas.** Límites por agente o por equipo. Evita el bucle infinito que cuesta 500€ antes de que nadie se entere.

Sin medición por agente (lo que ofrece agentgateway), no hay manera de aplicar ninguna de las tres.

## Cierre

Los riesgos no se eliminan: se controlan. La gobernanza que se desarrolla en la Pieza 2 — Plan Director de IA es la capa que convierte la adopción individual (que ya conoces tras leer estos fundamentos) en una adopción a escala que la empresa pueda operar sin sustos.
