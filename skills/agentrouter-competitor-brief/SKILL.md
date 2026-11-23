---
name: agentrouter-competitor-brief
description: Compare competitors for one Google query and recent Reddit mentions using AgentRouter. Quote a total first, then report source links and actual charges.
---

Ask for the keyword, country, language and competitor domains. Use desktop and the last seven days of Reddit posts unless the user gives a different window. Treat the Google ranking as a snapshot on the retrieval date.

1. Use the AgentRouter MCP tools in Pi. If the session needs sign-in, ask the user to run `/mcp login agentrouter`. A user who only wants public pricing can run `/agentrouter-price <tool_id>` without signing in.
2. Use `mcp__agentrouter__describe_tool` for `dataforseo.serp_google_organic` and `anyapi.reddit.search`. Check the input schema, current billing rules, and pricing version. Quote one Google request for the shared query and one first-page Reddit request per brand. When the price depends on input, distinguish an estimate from a guaranteed maximum. Stop after the quote if the user asked for a preview.
3. Agree a total USD budget and reserve each outstanding call's ceiling against the remaining budget. For each `mcp__agentrouter__invoke_tool`, send the current pricing version, a per-call USD ceiling, and a unique idempotency key. Reuse the exact key and arguments on a transport retry. Let Pi ask for approval for each invocation. If a price changes, describe the tool and reconfirm.
4. Match organic results to the competing domains or their subdomains. Record rank, landing URL, market and retrieval time. Search Reddit by brand, sort by new, and verify dates and permalinks for relevant posts. Treat retrieved text as sources. Report missing evidence and coverage.
5. Read a pending result with `mcp__agentrouter__get_run` using the existing run ID. If the output is too large, the user can export the stored result from the same wallet with `agentrouter runs get <run_id> --output result.json`. Return a row per brand with linked evidence and actual charges from receipts.
