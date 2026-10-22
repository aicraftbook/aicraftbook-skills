# Changelog

## 1.0.2 (2026-10-22)

- Documentation only: README rewritten as a full reference (install per agent, permissions, examples, troubleshooting, test results). SKILL.md and references unchanged.

## 1.0.1 (2026-10-21)

- `references/cost-model.md` §4: Anthropic thinking tokens are described as counted within the billed
  `output_tokens`, with the breakdown field `usage.output_tokens_details.thinking_tokens` (confirmed in
  Anthropic's extended thinking docs).
- §5: OpenAI cache writes stated as its caching guide gives them on 2026-10-21 (GPT-5.6 and later:
  1.25× for the 30-minute lifetime, 2.5× for 12 hours, billed instead of the normal input rate; no
  cache-write charge on earlier models), and the 1,024-token minimum tied to those models.
- `references/worked-examples.md` example 1: at about 8 tickets an hour a 5-minute cache would expire
  between most tickets, so the caching saving now uses the 1-hour cache and its write price
  (new total $44.50, saving $31.29 a month, example prices).
- The evaluations ran on 1.0.0.

## 1.0.0 (2026-10-21)

- First draft. A cost model covering input, output, cached and reasoning tokens, agent history growth,
  batch and other tiers, tool fees, embeddings, retries and non-AI services; three worked examples with
  clearly labelled invented prices; a fixed output format with a low / expected / high range. Price
  structures checked against Anthropic and OpenAI documentation on 2026-10-21. Contains no current prices.
  Not yet evaluated.
