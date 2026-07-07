---
title: "agentgateway"
sidebar_position: 6
---

# agentgateway

Punto único de salida del tráfico de agentes hacia LLMs y MCPs externos. Equivalente conceptual a un API gateway, pero diseñado para el patrón agéntico.

## Para qué sirve

- **Allowlist de modelos y MCPs.** Lo que no está en la lista, no sale. Bloquea *shadow AI* y MCPs no verificados.
- **Redaction de PII / secretos** antes de salir al modelo. Lo que sale del perímetro va sin nombres, sin DNIs, sin tarjetas, sin claves.
- **Política de no-retención** con proveedores que la soporten (Anthropic, OpenAI Enterprise, etc.). Garantiza que tus prompts no entrenan el modelo.
- **Observabilidad por agente.** Quién hizo qué prompt, contra qué modelo, con qué coste, con qué resultado.
- **Control de coste.** Cuotas, límites por agente o por equipo, ruteo a modelo más barato para tareas simples.

## Por qué no basta con un firewall de salida

Un firewall ve direcciones IP y puertos. No entiende:

- Que ese POST a `api.openai.com/v1/chat/completions` lleva PII en el body.
- Que ese MCP del lado del servidor te puede inyectar un prompt malicioso en la respuesta.
- Que el agente está pagando 100€ en tokens por una sesión que se está repitiendo en bucle.

El agentgateway opera en la capa del protocolo agéntico: ve prompts, herramientas, costes y resultados.

## Dónde entra en los casos de uso

Todas las fichas del catálogo mencionan agentgateway en el apartado "Componentes Solo cuando llega a producción". Mientras el caso está en piloto local, no hace falta. Cuando se despliega a varios equipos en la organización, sin agentgateway aparece *shadow AI*, fuga de PII y coste descontrolado.
