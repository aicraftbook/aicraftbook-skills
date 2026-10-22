# Worked examples

> **EXAMPLE PRICES ONLY.** Every price on this page is invented to make the arithmetic easy to follow.
> They are not any provider's current or past rates and must never appear in a real estimate. Real
> prices come from the user or from the provider's pricing page that the user confirms.

Example price sheet used below:

| Item | EXAMPLE unit price |
|---|---|
| Model A input | $2.40 per 1M tokens |
| Model A output | $12.00 per 1M tokens |
| Model B input | $0.30 per 1M tokens |
| Model B output | $1.20 per 1M tokens |
| Cache write (5-minute lifetime) | 1.25 × input price |
| Cache write (1-hour lifetime) | 2.00 × input price |
| Cache read | 0.10 × input price |
| Batch discount | 50% off input and output |
| Web search | $8.00 per 1,000 searches |
| Embeddings | $0.05 per 1M tokens |
| Vector database | $25.00 per month (flat plan) |
| SMS | $0.01 per segment |

## Example 1: support ticket triage and reply drafts

**Workload.** A1 6,000 tickets a month (given). Two calls per ticket: classify on Model B, draft a reply
on Model A (given). A2 classify input 1,200 tokens, output 20 (assumed from a sample ticket). A3 draft
input 3,500 tokens: 3,000 static (system prompt and policy) plus 500 dynamic (ticket and category);
output 300 (assumed). A4 2% of calls are re-run after a failed format check (assumed).

**Per ticket.**

```
Classify input   1,200 × $0.30 / 1,000,000  = $0.000360
Classify output     20 × $1.20 / 1,000,000  = $0.000024
Draft input      3,500 × $2.40 / 1,000,000  = $0.008400
Draft output       300 × $12.00 / 1,000,000 = $0.003600
Per ticket                                    $0.012384
```

**Per month.**

```
Classify   6,000 × $0.000384 = $2.304
Draft      6,000 × $0.012000 = $72.000
Subtotal                      $74.304
With retries  $74.304 × 1.02 = $75.79008  → $75.79
```

**Range.** Volume, reply length and retry rate are the least certain.

| Driver | Low | Expected | High |
|---|---|---|---|
| Tickets per month | 4,000 | 6,000 | 9,000 |
| Draft output tokens | 200 | 300 | 450 |
| Retry rate | 2% | 2% | 5% |
| **Monthly total** | **$45.63** | **$75.79** | **$134.04** |

Low: (0.000384 + 0.0084 + 200 × 12 / 1,000,000) × 4,000 × 1.02 = 0.011184 × 4,000 × 1.02 = $45.63.
High: (0.000384 + 0.0084 + 0.0054) × 9,000 × 1.05 = 0.014184 × 9,000 × 1.05 = $134.04.

**Biggest saving: cache the 3,000-token static prefix with the 1-hour cache.** At about 8 tickets an
hour (one every 7.5 minutes on average) a 5-minute cache would expire between most tickets, so this uses
the 1-hour lifetime and its higher write price. A5 90% of draft calls hit the cache (assumed; the misses
are quiet hours and overnight gaps longer than an hour, so ask for the real arrival pattern).

```
Static tokens   6,000 × 3,000 = 18,000,000
Cache reads     16,200,000 × ($2.40 × 0.10) / 1,000,000 = $3.888
Cache writes     1,800,000 × ($2.40 × 2.00) / 1,000,000 = $8.640
Dynamic input    3,000,000 × $2.40 / 1,000,000          = $7.200
Draft input with caching                                 $19.728  (was $50.40)
New total  ($2.304 + $19.728 + $21.60) × 1.02 = $44.50464 → $44.50
Saving     $75.79 − $44.50 = $31.29 a month
```

Second saving: cap drafts at 200 tokens: 6,000 × 100 × $12.00 / 1,000,000 × 1.02 = $7.34 a month.
Trade-off: shorter replies may need more follow-ups.

## Example 2: research agent with web search

**Workload.** A1 1,000 research tasks a month (given). A2 6 model turns per task on Model A (assumed
typical; worst case 10). A3 each turn sends S + U = 2,200 tokens (system prompt and tools 2,000, task
200). A4 each turn adds G = 1,800 tokens to the history (300-token reply plus a 1,500-token search
result). A5 output 300 tokens on turns 1 to 5 and 800 on the final answer, thinking included. A6 4 web
searches per task.

**Input per task** (section 6 of the cost model):

```
n × (S + U) + G × n × (n − 1) / 2
= 6 × 2,200 + 1,800 × 6 × 5 / 2
= 13,200 + 27,000 = 40,200 tokens
```

Output per task: 5 × 300 + 800 = 2,300 tokens.

```
Input    1,000 × 40,200 = 40,200,000 × $2.40 / 1,000,000  = $96.48
Output   1,000 × 2,300  =  2,300,000 × $12.00 / 1,000,000 = $27.60
Search   1,000 × 4 = 4,000 searches × $8.00 / 1,000       = $32.00
Total                                                      $156.08
```

**Range.**

| Driver | Low | Expected | High |
|---|---|---|---|
| Turns per task | 4 | 6 | 10 |
| Searches per task | 2 | 4 | 7 |
| **Monthly total** | **$83.44** | **$156.08** | **$345.20** |

High input: 10 × 2,200 + 1,800 × 10 × 9 / 2 = 103,000 tokens per task, so 103,000,000 × $2.40 /
1,000,000 = $247.20; output 9 × 300 + 800 = 3,500 per task, $42.00; search 7,000 × $0.008 = $56.00.
Low: input 19,600 per task ($47.04), output 1,700 ($20.40), search 2,000 ($16.00).

**Biggest savings.**

1. Shorten search results fed back to 600 tokens (G = 900): input 13,200 + 900 × 15 = 26,700 per
   task, $64.08, saving $32.40 a month. Trade-off: the agent sees less of each page.
2. Cap the agent at 6 turns: in a high month, token cost falls from $289.20 ($247.20 + $42.00) to the
   expected $124.08 ($96.48 + $27.60), a saving of $165.12. Trade-off: some hard questions end with a
   partial answer.
3. Cache the system prompt, tools and earlier turns: give the saving as a formula with the user's cache
   prices, because most of the input is a repeated prefix.

## Example 3: nightly listing alerts by SMS

**Workload.** A1 20,000 new listings a night, 500 tokens each, embedded once (given). A2 2,000
subscribers get a personal digest every night, 30 nights (given). A3 each digest: one Model B call,
2,500 input tokens (profile plus matched listings), 250 output, run in batch because it can wait until
morning. A4 each subscriber query is embedded: 50 tokens. A5 each SMS is 2 segments (assumed from a
sample digest of about 250 characters).

```
Embed listings   20,000 × 500 × 30 = 300,000,000 × $0.05 / 1,000,000 = $15.00
Embed queries    2,000 × 30 × 50   =   3,000,000 × $0.05 / 1,000,000 = $0.15
Digest input     60,000 × 2,500    = 150,000,000 × $0.30 / 1,000,000 = $45.00
Digest output    60,000 × 250      =  15,000,000 × $1.20 / 1,000,000 = $18.00
Digest with batch  ($45.00 + $18.00) × 0.50                          = $31.50
Vector database                                                       $25.00
SMS              60,000 × 2 segments × $0.01                          = $1,200.00
Total                                                                 $1,271.65
```

**What this shows.** The model is about $47 of a $1,272 bill. SMS is 94% of it. The biggest saving is
not in the model: fitting each digest in one segment saves $600.00 a month; sending a weekly digest
instead of a nightly one saves more but changes the product.

## A blank estimate (prices missing)

When the user gives no prices, the answer still does all the work that needs none:

```
Draft input   6,000 × 3,500 = 21,000,000 tokens × [PRICE NEEDED: Model A input per 1M tokens] / 1,000,000
Draft output  6,000 × 300   =  1,800,000 tokens × [PRICE NEEDED: Model A output per 1M tokens] / 1,000,000
SMS           60,000 × 2    =    120,000 segments × [PRICE NEEDED: SMS price per segment]
Total: not calculated until the three prices above are filled in.
```

Then one message: "To finish the estimate I need three prices: Model A input and output per million
tokens (from the provider's pricing page) and your SMS price per segment. Paste them, or confirm the
figures on the page, and I will complete the totals and the range."
