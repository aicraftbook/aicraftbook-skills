# Cost Compass

Estimate what an AI feature or automation will cost to run.

Cost Compass is an agent skill that turns a description of an AI feature, agent or automation into a
monthly running-cost estimate you can check line by line. It shows every assumption and the
arithmetic, gives a low / expected / high range, and names the changes that would cut the cost most.
It is for founders, product teams, automation builders and consultants sizing AI work before or
after they build it.

Version 1.0.2 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/cost-compass

## What does Cost Compass do?

It breaks the monthly cost into model calls, input, output and cached tokens, and the other paid
services in the workflow: search, embeddings, vector database, SMS, voice minutes, automation platform
tasks. Every cost line is written as `quantity × unit price = cost`.

It carries **no price table**. Every unit price comes from you, or from a provider pricing page that
you confirm. A missing price stays a visible blank, `[PRICE NEEDED: <item and unit>]`, and no total is
given for a line with a blank. Each assumption is numbered and marked **given**, **derived** or
**assumed**.

It also counts what estimates often miss: system prompts and tool definitions sent on every call,
history re-sent on every agent turn, reasoning or thinking tokens (billed as output), retries, and
non-AI services.

## When should you use it?

- Sizing an AI feature before you build it ("what will this agent cost per month?").
- Checking whether an automation is affordable at a target volume, such as 10,000 runs.
- Comparing two models, two designs, or caching against no caching.
- Putting a running-cost range into a proposal.
- Finding which change would save the most on an existing workflow.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/cost-compass/` (all projects) or
  `.claude/skills/cost-compass/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.
- **Cursor**: Cursor's [Agent Skills documentation](https://cursor.com/docs/context/skills) says it also
  loads skills from `.claude/skills/` and `~/.claude/skills/`, so the Claude Code install below works
  for Cursor. We have not run this skill in Cursor.

## How do I install Cost Compass?

### Claude Code (and Cursor)

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/cost-compass ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/cost-compass your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/cost-compass). It
unzips to a folder with the version in its name (for example `cost-compass-v1.0.2`). Copy it so the
folder is named `cost-compass`. Then start a new session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `cost-compass-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r cost-compass.zip cost-compass -x 'cost-compass/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Ask your agent "What skills do you have?" and look for `cost-compass`. In Claude Code you can also type
`/cost-compass`. Then describe a workload and ask "What will this cost per month?"

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own reference files and any workload or usage file you point at. Writes nothing unless you ask for the estimate to be saved. |
| Shell | None. Bundles no scripts. |
| Network | None required. If your agent already has a web tool, it may read a pricing page you name; you still confirm the figures. |
| MCP | None. |

No runtime or packages are needed. It asks for no credentials or billing access.

## How do I use it?

Describe the workload: unit of work, monthly volume, model calls per unit, rough token counts, other
paid services, and any prices you have. For example:

- "We're adding a support chatbot. About 3,000 conversations a month, 5 turns each. What will it cost?"
- "40,000 emails a month, one extraction call each. Here are our input and output prices."
- "Our voice receptionist takes 1,200 calls a month. We also text a confirmation after bookings."

A good answer has the expected monthly cost and range in one line, a price sheet with sources,
numbered assumptions, the workload arithmetic, cost by line, a Driver | Low | Expected | High table,
two or three savings with their trade-offs, and the usage fields to log after launch. With no prices
given, it counts tokens and calls, leaves blanks, asks for all prices in one message, and gives no
dollar total.

## Example

From [examples/requests.md](examples/requests.md). The prices here are the user's, given in the request.

> 40,000 emails a month, one extraction call each, 1,800 input and 150 output tokens. Input is $1.50
> and output $6.00 per million tokens. 3% get re-run. Each result is needed within a minute of the
> email arriving.

The cost lines a good answer shows:

```text
Input:   40,000 × 1,800 = 72,000,000 tokens × $1.50 / 1,000,000 = $108.00
Output:  40,000 × 150   =  6,000,000 tokens × $6.00 / 1,000,000 =  $36.00
Subtotal                                                          $144.00
Retries: $144.00 × 1.03                                           $148.32
```

It then gives a low / expected / high range from the uncertain drivers, and explains that batch
processing would be cheaper but does not fit the one-minute requirement.

## Troubleshooting

- **The skill does not load.** The folder must be named `cost-compass` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `cost-compass-v<version>`. Rename the folder to
  `cost-compass`.
- **No dollar total, only blanks.** That is by design when a price is missing. Give the prices, or
  confirm the figures it quotes from a pricing page.
- **The total looks wrong.** The estimate is only as good as the workload numbers. Check each numbered
  assumption; in testing it sometimes assumed numbers the workload did not state.
- **Discounts, taxes or free tiers are missing.** They are included only if you describe them.

## Security

Cost Compass is instructions only: Markdown files with no scripts, binaries or install hooks. It tells
the agent to treat pasted pricing pages and workload documents as data. It asks for no credentials or
billing access.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check:** 3 estimates, each run with and without the skill (6 runs). Fixed text checks:
  0.48 passed without the skill, 0.86 with it.
- **Independent check:** 4 tasks written by a separate evaluator from the public description only,
  then frozen: a RAG chatbot and an invoice automation with prices given, a Slack Q&A bot with no
  prices, and an estimate that was already correct. 24 runs, graded blind by a separate model.

Results of the independent check: combined score 0.901 with the skill against 0.778 without (rubric
0.913 against 0.773). On the task with no prices it left prices blank more reliably (0.750 against
0.450), though not every time. The grader flagged a factual or arithmetic slip in 3 of 12 runs with
the skill and 8 of 12 without. Answers took about 21 seconds instead of 15.

Limits: four tasks with three runs each is a small sample, the grader is a model from the same
vendor, and no real provider invoices were checked. The evaluation ran on 1.0.0; 1.0.1 changed only
reference files. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/cost-compass/evals).

## How it differs from similar skills

Several community skills deal with AI cost: `cost-aware-llm-pipeline` in the everything-claude-code
collection teaches cost-saving patterns and ships its own model price table, others (such as
[costea](https://github.com/memovai/costea)) estimate the cost of a coding-agent task from session
history, and `workflow-cost-estimator` in hotak92/vibecoded-orchestrator (AGPL-3.0) sizes a
workflow's monthly cost. Cost Compass carries no price table at all: every rate comes from you or a
pricing page you confirm, missing prices stay as visible blanks, and every line of arithmetic is
shown so you can check it. We have not reviewed or tested those skills.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/cost-model.md](references/cost-model.md): what gets billed and the formulas, with
  sources and the date checked. It contains no current prices.
- [references/worked-examples.md](references/worked-examples.md): three worked estimates using clearly
  labelled invented prices.
- [examples/requests.md](examples/requests.md): sample requests and what a good answer contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/cost-compass
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
