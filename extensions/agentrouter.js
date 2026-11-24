export default function agentRouter(pi) {
  pi.registerMcpServer('agentrouter', {
    url: 'https://mcp.agentrouter.to/',
    description: 'Search provider tools, quote their price, run an approved query and read its receipt.',
    oauth: { scope: 'read invoke' },
    exposure: 'hidden',
    toolExposure: {
      find_tools: 'direct', describe_tool: 'direct', invoke_tool: 'direct', get_run: 'direct',
    },
  })

  pi.registerCommand('agentrouter-price', {
    description: 'Show current public pricing for a tool ID, without signing in or spending.',
    async handler(args, ctx) {
      const toolId = args.trim()
      if (!toolId) {
        ctx.ui.notify('Usage: /agentrouter-price dataforseo.serp_google_organic', 'info')
        return
      }
      try {
        const response = await fetch('https://api.agentrouter.to/v1/describe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool_id: toolId }), redirect: 'error', signal: AbortSignal.timeout(15000),
        })
        if (!response.ok) throw new Error('HTTP ' + response.status)
        const { title, pricing } = await response.json()
        const cap = pricing.estimated_per_call_usd == null ? pricing.summary : 'Estimated per call: USD ' + pricing.estimated_per_call_usd
        ctx.ui.notify([title, cap].join('\n'), 'info')
      } catch (error) {
        ctx.ui.notify('Could not read the AgentRouter price: ' + error.message, 'error')
      }
    },
  })

  pi.on('tool_call', async (event, ctx) => {
    if (event.toolName !== 'mcp__agentrouter__invoke_tool') return
    const { tool_id, input, pricing_version, max_cost_usd, idempotency_key } = event.input ?? {}
    if (max_cost_usd != null && (typeof max_cost_usd !== 'string' || !/^(0|[1-9]\d*)(\.\d{1,12})?$/.test(max_cost_usd))) {
      return { block: true, reason: 'Quote this call and supply max_cost_usd as a nonnegative decimal string.' }
    }
    if (!tool_id || !pricing_version || typeof idempotency_key !== 'string' || !idempotency_key.trim()) {
      return { block: true, reason: 'Supply the tool ID, quoted pricing version and a stable idempotency key for this call.' }
    }
    if (ctx.hasUI) {
      try {
        const approved = await ctx.ui.confirm('Approve AgentRouter call?', [
          'Tool: ' + JSON.stringify(tool_id), max_cost_usd == null ? 'Billed at actual usage under your account budgets.' : 'Maximum: USD ' + max_cost_usd, 'Input: ' + JSON.stringify(input),
        ].join('\n'))
        if (approved === true) return
      } catch {
        // Pi can lose its interactive client while a confirmation is open.
      }
    }
    return { block: true, reason: 'An interactive approval is required for this AgentRouter call.' }
  })
}
