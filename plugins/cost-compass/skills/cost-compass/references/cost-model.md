# How to model the running cost of an AI feature

This file explains **what** gets billed and **how** to calculate it. It contains no current prices.
Price structures below were read on provider documentation on 2026-10-21 (sources at the end) and are
there so you know which questions to ask. Before using any multiplier, discount, fee or free allowance
in an estimate, the user confirms the current figure on the provider's pricing page.

## 1. Notation

| Symbol | Meaning |
|---|---|
| N | Units of work per month (tickets, conversations, documents, calls) |
| c | Model calls per unit of work |
| I_s | Static input tokens per call (system prompt, tool definitions, fixed reference text) |
| I_d | Dynamic input tokens per call (user input, retrieved text, history) |
| O | Output tokens per call, including reasoning or thinking tokens |
| p_in, p_out | Price per 1,000,000 input / output tokens (from the user) |
| r | Retry rate: extra calls as a share of calls (0.03 = 3%) |

## 2. The core formula

Cost of one call with no caching or batch:

```
call_cost = (I_s + I_d) × p_in / 1,000,000  +  O × p_out / 1,000,000
```

Monthly model cost for one step:

```
step_cost = N × c × call_cost × (1 + r)
```

Add every step, then the per-call fees and the non-AI services. Work in full precision and round only
the final figures.

## 3. Input tokens: what to count

- **System or developer prompt**, every call. It is re-sent each time unless cached.
- **Tool definitions.** Names, descriptions and schemas count as input. Anthropic's pricing page also
  adds a fixed tool-use system prompt per request when tools are present, listed per model.
- **Retrieved context** (RAG chunks, fetched pages, file contents). Anthropic's web fetch docs give rough
  sizes: an average 10 kB web page is about 2,500 tokens and a 100 kB documentation page about 25,000.
- **Conversation history.** Chats and agents re-send earlier turns. See section 6.
- **Tool results** fed back to the model.
- **Images, audio and files**, which providers bill by their own rules (per image, per minute or as tokens).

**Measuring tokens.** Characters-to-tokens rules of thumb are rough and differ by language and content.
Prefer the provider's token counter or the `usage` numbers from a few real requests. Tokenizers differ
between models: Anthropic's pricing page notes that its newer models' tokenizer produces about 30% more
tokens for the same text than earlier ones. Never reuse a token count across model families without
saying so.

## 4. Output tokens: what to count

- The visible reply.
- **Reasoning or thinking tokens.** OpenAI's reasoning guide says reasoning tokens are billed as output
  tokens and reports them in `usage.output_tokens_details.reasoning_tokens`. Anthropic's thinking docs
  count thinking tokens within the billed `output_tokens` and break them out in
  `usage.output_tokens_details.thinking_tokens`.
  These can be several times the visible reply; ask whether thinking or reasoning effort is on.
- Tool-call arguments the model writes.
- Output is usually priced several times higher per token than input, so long replies matter.

## 5. Prompt caching

Caching lowers the price of a repeated **prefix** (the static start of the prompt). Model it as three
parts of the input:

```
input_cost = uncached × p_in + cache_writes × p_in × m_write + cache_reads × p_in × m_read
```

- `m_write` and `m_read` are the provider's multipliers. On 2026-10-21 Anthropic listed a 5-minute
  cache write at 1.25× the base input price, a 1-hour write at 2×, and reads at 0.1× for most models
  (lower on some newer models). OpenAI's caching guide described, for GPT-5.6 and later models, reads at
  0.1× on most of them and cache writes at 1.25× for the default 30-minute lifetime or 2.5× for a 12-hour
  lifetime (a write is billed at that rate instead of the normal input rate, not on top of it), and no
  cache-write charge on earlier models. **Confirm the current multipliers with the user.**
- A hit needs an **exact prefix match**: put stable content first, changing content last.
- Providers have a **minimum cacheable length** (OpenAI: 1,024 tokens for GPT-5.6 and later on
  2026-10-21) and a **cache lifetime**. If requests arrive less often than the lifetime, most calls are
  writes, not reads. Estimate the hit rate from the request rate: 200 requests a day spread over 12 hours
  is one every 3.6 minutes on average, which is close to a 5-minute lifetime.
- State the hit rate as an assumption. Never assume caching unless the user's platform supports it.

## 6. Multi-turn chats and agent loops

Each turn re-sends everything before it. With S = static tokens per turn (system prompt, tools), U = new
input per turn (user message or task), G = tokens added to history per turn (previous reply plus tool
result or user message), and n turns:

```
total_input_per_conversation = n × (S + U) + G × n × (n − 1) / 2
total_output_per_conversation = sum of output per turn
```

The history term grows with the square of the turns: doubling turns roughly quadruples it. Cap turns,
trim or summarise old turns, and shorten tool results to control it. Ask for the typical and the worst
number of turns; they make natural low and high values.

## 7. Batch and other processing tiers

- **Batch**: on 2026-10-21 both Anthropic and OpenAI described a 50% discount on input and output for
  batch requests, which complete asynchronously (OpenAI: within 24 hours). Use it only for steps that can
  wait. Confirm the discount and whether it stacks with caching (Anthropic says its batch and caching
  discounts combine).
- **Priority, fast or flex tiers** change the price up or down. Ask which tier the user will use.
- **Long-context tiers**: some models charge more per token above an input size threshold. Ask for the
  rule if inputs are large.
- **Regional or data-residency endpoints** can carry an uplift (both providers listed about 10% on
  2026-10-21). Ask if the user needs a region.

## 8. Per-call tool and platform fees

Some built-in tools add a fee on top of tokens, and their results also count as input tokens:

- **Web search**: billed per search or per 1,000 calls, plus the search results as input tokens.
- **File search, code execution, containers**: per call, per session, per hour or per GB of storage,
  often with a free allowance.
- **Web fetch** (Anthropic, 2026-10-21): no extra fee; the fetched content is billed as input tokens.

Count how many tool calls happen per unit of work, not per conversation.

## 9. Embeddings and vector databases

- **Embeddings** are priced per input token; there are no output tokens. Count three things: the
  initial corpus, re-embedding when documents change, and one embedding per user query.
- **Vector database**: often a plan fee plus storage, reads or writes. Ask for the plan.
- Retrieved chunks then become input tokens for the generation call (section 3).

## 10. Retries, failures and validation

- Count re-runs you trigger yourself (output failed a schema check, timeout, a second "judge" call) as
  extra calls through `r`.
- Whether the provider bills a failed request depends on how it failed. Anthropic's pricing page, for
  example, says a web search that errors is not billed. Do not assume either way; label it.
- A validation step that re-asks the model on failure is cheap only if failures are rare. Use the
  user's measured failure rate when they have one.

## 11. Non-AI services

These often cost more than the model. Ask about each that the workflow uses:

| Service | Typical unit | Watch for |
|---|---|---|
| SMS | per message segment | Long or non-Latin text uses more segments; carrier and registration fees |
| Voice and telephony | per minute, often from two vendors (voice platform plus phone carrier) | Minimums per call, rounding up to the minute |
| Email sending | per 1,000 emails or plan | Plan limits |
| Automation platform | per task, operation or execution, or plan tier | Each step can count as a task; loops multiply them |
| OCR or document parsing | per page | Multi-page PDFs |
| Search or data APIs | per request or plan | Rate-limit tiers |
| Hosting, queues, logging | per month or usage | Fixed costs that do not scale with volume |

## 12. The range

Choose the drivers you are least sure of and set each to a realistic low and high:

| Driver | Where to get low and high |
|---|---|
| Volume | The user's quiet and busy months, or launch versus target |
| Output length | Short and long real examples |
| Agent turns | Typical versus worst case, or the turn cap |
| Retrieved context | Fewest and most chunks or pages per call |
| Cache hit rate | Quiet versus busy periods |
| Retry rate | Measured, or 0% and a stated pessimistic value |

Compute low with all low values together and high with all high values together, and say so. The real
bill can still fall outside the range if the workload changes.

## 13. After launch: what to measure

Ask the user to log per request: input tokens, output tokens, cached read and write tokens, reasoning or
thinking tokens, tool-call counts, model name and retries. Both providers return these in the response
`usage` object. A week of real numbers replaces most assumptions.

## Sources (read 2026-10-21)

- Anthropic pricing (structure: cache multipliers, batch, long context, tool-use tokens, web search and web fetch, data residency, tokenizer note): https://platform.claude.com/docs/en/about-claude/pricing
- Anthropic extended thinking (thinking tokens in billed output, `usage.output_tokens_details.thinking_tokens`): https://platform.claude.com/docs/en/build-with-claude/extended-thinking
- OpenAI pricing (structure: cached input, batch, flex and priority tiers, built-in tool fees, embeddings, regional uplift): https://developers.openai.com/api/docs/pricing
- OpenAI prompt caching (prefix match, minimum length, cache-write and read rates, cached token reporting): https://developers.openai.com/api/docs/guides/prompt-caching
- OpenAI Batch API (50% discount, 24-hour window): https://developers.openai.com/api/docs/guides/batch
- OpenAI reasoning models (reasoning tokens billed as output): https://developers.openai.com/api/docs/guides/reasoning
