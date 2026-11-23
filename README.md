# AgentRouter for Pi

Look up what a provider tool costs, run a query with a USD cap, and retrieve the result and receipt. A bundled skill compares competitors across Google search results and Reddit discussions. Browse the [AgentRouter tool catalog](https://www.agentrouter.to/tools?utm_source=pi&utm_medium=plugin).

## Install

Use Pi 1.6 or later in the 1.x series.

```sh
pi install npm:@agentrouter/pi
pi
```

To install from source, run `pi install git:github.com/pageonelab/agentrouter-pi@v0.1.0`. In an existing Pi session, use `/reload`.

## Try a free price check

In interactive Pi, enter:

```text
/agentrouter-price dataforseo.serp_google_organic
```

This reads the current public pricing without signing in or charging a wallet. The [Google organic search tool page](https://www.agentrouter.to/tools/dataforseo.serp_google_organic?utm_source=pi&utm_medium=plugin) includes the input fields and billing details.

## Run a competitor brief

In Pi, run `/mcp login agentrouter` and finish the browser sign-in. Pi stores the OAuth credentials. Open `/mcp` to inspect the connection. If a configuration file already defines a server called `agentrouter`, Pi uses that definition first. Check that it points to `https://mcp.agentrouter.to/`.

> /skill:agentrouter-competitor-brief Compare vercel.com and netlify.com for “frontend hosting” in US English. Show me the prices first.

The extension exposes four MCP tools: find, describe, invoke and get run. A paid invocation requires the current pricing version, an idempotency key, a USD ceiling, and interactive confirmation before the request goes to AgentRouter. Provider inputs go to AgentRouter and the selected provider. Use the returned run ID to retrieve a receipt. When using RPC, the client must handle approval dialogs. Print and JSON modes block paid calls.

[AgentRouter MCP and account setup](https://docs.agentrouter.to/integrations/mcp?utm_source=pi&utm_medium=plugin) · [Research examples with receipts](https://docs.agentrouter.to/examples?utm_source=pi&utm_medium=plugin) · [Pi MCP guide](https://docs.pi.dev/latest/mcp)
