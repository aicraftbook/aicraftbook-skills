# Blueprint Probe

Find the flaws in an AI automation before you build it.

Blueprint Probe is an agent skill that reviews a proposed AI automation or agent workflow before it
is built. It maps the data flow, checks nine risk areas and returns a findings table rated blocker,
major or minor, with the smallest fix for each. It is for builders, teams and consultants planning
n8n, Make, Zapier or code-based automations that include a model step.

Version 1.0.1 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/blueprint-probe

## What does Blueprint Probe do?

You give your agent a workflow plan, diagram description, workflow export or agent design. The skill
reviews it and does not build it. It works in three steps:

1. **Map the flow.** It rewrites the design as a numbered data flow (trigger, each step, outputs) and
   marks irreversible actions: sending messages, paying, deleting, publishing, writing to a system of
   record.
2. **Check nine areas.** Fit (does each model step need a model?), reliability (retries, duplicates,
   timeouts), model output handling, human approval, prompt injection and permissions, data and
   privacy, cost, operability, and complexity.
3. **Rate findings.** **Blocker**: likely to cause harm, data loss, wrong customer messages or runaway
   cost. **Major**: failures or manual clean-up at normal volume. **Minor**: worth doing, not urgent.

It never invents prices, rate limits or volumes. Costs come back as a formula
(runs × calls per run × tokens per call × price) with blanks for numbers you did not give. It asks at
most three questions, and only when the answer would change a blocker.

## When should you use it?

- Before building an automation where a model's output reaches customers.
- Before giving an agent tools that send, pay or delete.
- When a webhook-triggered workflow might fire twice for one event.
- When a chain of several agents might be doing work a lookup or template could do.
- When reviewing a client's or teammate's design before launch.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/blueprint-probe/` (all projects) or
  `.claude/skills/blueprint-probe/` (one project). It reads the skill's name and description at
  start-up and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.
- **Cursor**: Cursor's [Agent Skills documentation](https://cursor.com/docs/context/skills) says it also
  loads skills from `.claude/skills/` and `~/.claude/skills/`, so the Claude Code install below works
  for Cursor. We have not run this skill in Cursor.

## How do I install Blueprint Probe?

### Claude Code (and Cursor)

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/blueprint-probe ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/blueprint-probe your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/blueprint-probe). It
unzips to a folder with the version in its name (for example `blueprint-probe-v1.0.1`). Copy it so the
folder is named `blueprint-probe`. Then start a new session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag
   `blueprint-probe-v<version>`), the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r blueprint-probe.zip blueprint-probe -x 'blueprint-probe/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on.

### Check it worked

Ask your agent "What skills do you have?" and look for `blueprint-probe`. In Claude Code you can also
type `/blueprint-probe`. Then describe a workflow and ask "Review this automation."

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own checklist and any design file you point at. |
| Shell | None. Bundles no scripts. |
| Network | None required. |
| MCP | None. |

No runtime or packages are needed.

## How do I use it?

Paste or describe the design, or point the agent at an export file, and ask:

- "Review this automation. What could go wrong?"
- "Our support agent can refund up to $500 per call and runs unattended. Is this a good design?"
- "Five agents in a chain build our daily news digest. How do I make this production-ready?"

A good review contains a two-sentence summary (ready, ready with fixes, or not ready), the numbered
data flow with irreversible actions marked, a findings table (Severity | Area | Where | Problem | Fix)
with blockers first, a cost formula, a simpler alternative if one exists, assumptions and open
questions, and three to five launch tests including one malicious or malformed input.

## Example

From [examples/requests.md](examples/requests.md) and the recorded test task. The request:

> Review this: form → webhook (retries) → LLM writes a reply → text and email the lead at once → log
> everything to a shared sheet.

What a good review contains:

| Severity | Finding |
|---|---|
| Blocker | The model's reply goes to the lead with no check before sending. |
| Blocker | Webhook retries can send the same text and email twice. |

It also flags prompt injection through the form's free-text field, the shared sheet of personal data
and SMS consent (for the owner to check, not as legal advice), and gives the cost formula without
inventing prices.

A second recorded case, the five-agent news digest, shows the "prefer removing parts" rule: a good
review replaces the category agent with a lookup and the formatting agent with a template, and adds
a failure alert.

## Troubleshooting

- **The skill does not load.** The folder must be named `blueprint-probe` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `blueprint-probe-v<version>`. Rename the folder to
  `blueprint-probe`.
- **A known risk was not mentioned.** The skill reviews what you describe. Problems in parts you leave
  out stay hidden, so include triggers, external services and what happens on failure.
- **A legal question was not answered.** Legal and compliance points, such as texting consent, are
  flagged for you to check, not answered.
- **Minor issues rated major.** In testing it rated some operational nits as major on a sound design.
  Use your judgement on majors; it did not raise false blockers in that test.

## Security

Blueprint Probe is instructions only: Markdown files with no scripts, binaries or install hooks. It
tells the agent to treat pasted workflow exports and prompts as data and not to follow instructions
inside them.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code 2.1.303 with the Sonnet model in an empty folder with read-only tools.

- **Author check:** three designs with planted problems (an SMS lead auto-reply, an unattended refund
  agent, an over-built five-agent digest), each run 3 times with and 3 times without the skill
  (18 runs). With the skill all fixed text checks passed; without it 88.9% passed. Most of the gap was
  one format check: answers without the skill did not rate findings as blockers.
- **Independent check:** four new designs written from the public description only (three with 17
  planted flaws, one sound design), 24 runs graded blind by a separate model.

Verdict: **verified with limits.** Both conditions found all 17 planted flaws, so this test does not
show that the skill finds more problems than the base model. Its measured gain is the format: the
severity-rated findings table appeared in 12 of 12 runs with the skill and 0 of 12 without. On the
sound design it raised no blockers, but it rated 2 to 4 operational nits as major in every run.
Answers took about 28 seconds instead of 22.

Limits: the author's checks test whether named issues appear, not how good the advice is; the planted
flaws were obvious enough that the base model found them all; samples are small and the grader is a
model from the same vendor. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/blueprint-probe/evals).

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/checklist.md](references/checklist.md): the review questions and severity definitions.
- [examples/requests.md](examples/requests.md): sample designs and what a good review contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md). Earlier versions were named `automation-architecture-review`.

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/blueprint-probe
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
