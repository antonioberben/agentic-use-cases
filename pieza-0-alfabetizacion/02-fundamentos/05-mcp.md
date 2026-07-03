---
title: "MCP — Model Context Protocol"
sidebar_position: 5
---

# MCP — Model Context Protocol

Protocolo abierto (lanzado por Anthropic) que estandariza cómo un agente accede a herramientas y fuentes de datos externas. Es la forma de conectar el LLM con tu Jira, tu Salesforce, tu base de datos, tu repo de GitHub.

## Por qué importa

Antes de MCP, cada integración era ad hoc: cada cliente de IA implementaba su forma de hablar con cada SaaS. Con MCP hay una única interfaz:

- **Servidor MCP**: un proceso (o endpoint) que expone capacidades (`tools`, `resources`) hablando MCP.
- **Cliente MCP**: el agente (Claude Code, Continue, etc.) consume esos servidores sin saber qué hay detrás.

Resultado: el mismo MCP de GitHub funciona con Claude Code, Cursor, Windsurf, etc. Y al revés: si conectas un MCP nuevo a tu agente, lo entiende sin programar nada.

## Cómo se configura

Ejemplo de `mcp.json` con dos servidores:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${vault://dev/github-pat}"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp-server"],
      "env": {
        "ATLASSIAN_TOKEN": "${vault://dev/jira-ro}"
      }
    }
  }
}
```

## Lo que hay que controlar

Esto es lo que vuelve crítico el control de MCP:

- **Scopes mínimos.** El PAT que le das al MCP debe ser el más restringido posible. Si el agente solo lee, `repo:read`, nunca `repo:write` global.
- **Identidad propia.** El token NO debe ser el tuyo personal (`${USER}-pat`). Debe ser una cuenta de servicio (`svc-agent-ro`) con scopes auditables.
- **Allowlist de MCPs.** Solo MCPs verificados. Un MCP adversarial puede inyectar prompts maliciosos en la respuesta y manipular al agente.
- **Observabilidad.** Quién llamó qué, cuándo, con qué resultado. Sin esto, no hay forma de saber qué hizo el agente.

Esto es lo que cubre la capa de gobernanza (ver [agentgateway](./agentgateway), [kagent](./kagent), [agentregistry](./agentregistry)).
