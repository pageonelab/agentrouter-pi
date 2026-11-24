import assert from 'node:assert/strict'
import test from 'node:test'
import agentRouter from '../extensions/agentrouter.js'

let gate
agentRouter({ registerMcpServer() {}, registerCommand() {}, on(event, handler) { if (event === 'tool_call') gate = handler } })
const call = { toolName: 'mcp__agentrouter__invoke_tool', input: {
  tool_id: 'example.search', input: { query: 'example' }, max_cost_usd: '0.02', pricing_version: 'v1', idempotency_key: 'brief-1',
} }

test('the caller cannot spend with an invalid cap, missing retry identity, or incomplete approval', async () => {
  const noDialog = { hasUI: true, ui: { confirm: () => assert.fail('unexpected prompt') } }
  for (const fields of [{ max_cost_usd: -1 }, { idempotency_key: '' }, { pricing_version: '' }]) {
    assert.equal((await gate({ ...call, input: { ...call.input, ...fields } }, noDialog)).block, true)
  }
  assert.equal((await gate(call, { hasUI: false })).block, true)
  assert.equal((await gate(call, { hasUI: true, ui: { confirm: async () => false } })).block, true)
  assert.equal((await gate(call, { hasUI: true, ui: { confirm: async () => { throw new Error('disconnected') } } })).block, true)
})

test('approve only the displayed invocation; reading an existing receipt needs no spending approval', async () => {
  let confirmations = 0
  const ctx = { hasUI: true, ui: { confirm: async (_title, details) => {
    confirmations++
    assert.match(details, /example\.search/)
    assert.match(details, /USD 0\.02/)
    assert.match(details, /"query":"example"/)
    return true
  } } }
  assert.equal(await gate(call, ctx), undefined)
  assert.equal(await gate({ toolName: 'mcp__agentrouter__get_run', input: { run_id: 'run_1' } }, ctx), undefined)
  assert.equal(confirmations, 1)
  assert.equal(await gate({ ...call, input: { ...call.input, max_cost_usd: undefined } }, {
    hasUI: true, ui: { confirm: async (_title, details) => { assert.match(details, /actual usage/); return true } },
  }), undefined)
})
