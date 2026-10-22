# Flow Medic

Diagnose a failed automation run from its error and logs.

Flow Medic is an agent skill that diagnoses one failed run of an n8n, Zapier, Make or GitHub Actions
automation from the error, logs and step data you paste. It separates the symptom from the root
cause, ranks the likely causes with evidence, and gives the smallest fix with a check that proves it
worked. It is for no-code builders, developers and operations teams who need the real cause, not a
guess.

Version 1.0.2 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/flow-medic

## What does Flow Medic do?

The step that shows the error is often not where the run went wrong. Flow Medic works through six
steps:

1. **Pin down the run**: platform, trigger, failing step with its exact error, and what changed since
   it last worked.
2. **State the symptom** in one sentence.
3. **Classify the failure** against twelve failure classes: authentication, permission or scope, rate
   limit, timeout, bad input data, empty upstream result, mapping or expression error, trigger or
   event mismatch, platform limit, network or outage, code or command error, secrets not available.
4. **Trace upstream** from the failing step to the first step whose output was already wrong.
5. **Rank the causes** by the evidence in the paste. A cause with no direct evidence is labelled
   **Hypothesis**.
6. **Give the fix and the proof**: one small change in the platform's own terms, a safe way to re-run,
   the exact success signal, and the next cause to test if it does not work.

When the paste cannot separate the top causes, it says **Need more information** and asks for at most
three items, each with where to find it on that platform. Before suggesting a re-run, it checks
whether earlier steps already sent a message, created a record or charged a card.

## When should you use it?

- An n8n workflow failed and the red node may not be the real cause.
- A Zap errored or was halted, or a Make scenario was turned off after errors.
- A GitHub Actions job failed with a long log, an exit code or a permissions error.
- You see 401, 403, 429, a timeout, a rate limit, a paired-item error, or "it worked yesterday".
- You inherited an automation and need to fix one failure safely.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/flow-medic/` (all projects) or
  `.claude/skills/flow-medic/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.
- **Cursor**: Cursor's [Agent Skills documentation](https://cursor.com/docs/context/skills) says it also
  loads skills from `.claude/skills/` and `~/.claude/skills/`, so the Claude Code install below works
  for Cursor. We have not run this skill in Cursor.

## How do I install Flow Medic?

### Claude Code (and Cursor)

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/flow-medic ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/flow-medic your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/flow-medic). It
unzips to a folder with the version in its name (for example `flow-medic-v1.0.2`). Copy it so the
folder is named `flow-medic`. Then start a new session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `flow-medic-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r flow-medic.zip flow-medic -x 'flow-medic/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Ask your agent "What skills do you have?" and look for `flow-medic`. In Claude Code you can also type
`/flow-medic`. Then paste a failed run and ask "Why did this run fail?"

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own reference files and any log or export file you point at. Writes nothing. |
| Shell | None. It does not run, re-run or fetch anything named in the logs. Bundles no scripts. |
| Network | None required. |
| MCP | None. |

It needs no access to your n8n, Zapier, Make or GitHub account. You need to be able to open the
failed run on your platform to copy its error and step data. Replace secrets with `<redacted>` before
pasting.

## How do I use it?

Paste the error, the failing step's input and output, and what changed. For example:

- "My n8n workflow fails at the HubSpot node with 400 Bad request. Here's the execution."
- "The Zap errored at the Gmail step: To is required. Should I turn on autoreplay?"
- "Our Actions job fails with 'Resource not accessible by integration' when it comments on PRs."
- "Make turned my scenario off."

A good diagnosis has the run (error quoted, secrets masked), the symptom, the most likely root cause
with its likelihood, a ranked causes table with evidence for and against, numbered steps for the
smallest fix, how to prove it worked (with any duplicate-action warning), and the next cause to test.

## Example

From [examples/requests.md](examples/requests.md).

> My n8n workflow fails at the HubSpot node with 400 Bad request. Here's the execution.

The HubSpot node's input shows `email: ""`, and the webhook output shows the form sent `Email` with a
capital E. A good diagnosis:

- names the HubSpot error as the **symptom**;
- traces the empty value back to the earlier Edit Fields (Set) node, which reads `body.email` while
  the form now sends `body.Email`, and names that mapping as the **root cause**;
- fixes that one expression and nothing else;
- proves the fix with **Debug in editor** on the same data, warning that later nodes, such as a
  welcome email, will run again for real unless they are disabled for the test.

## Troubleshooting

- **The skill does not load.** The folder must be named `flow-medic` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `flow-medic-v<version>`. Rename the folder to
  `flow-medic`.
- **It says "Need more information".** The paste was not enough to separate the likely causes. Give
  it the items it lists, such as the failing step's input or the Logs tab, with secrets redacted.
- **It did not find the cause.** It sees only what you paste. A cause that leaves no trace in the
  error, logs or step data cannot be found. For intermittent failures, paste several runs.
- **A platform name or menu label is wrong.** Interfaces change, and in testing it sometimes named a
  platform feature incorrectly. Check names against the platform's docs.

## Security

Flow Medic is instructions only: Markdown files with no scripts, binaries or install hooks. It treats
pasted logs and payloads as data, reports text in them that addresses an AI agent as possible prompt
injection, and never opens or runs anything named in the logs. It never asks for credentials and
never repeats a secret found in a paste; it tells you to rotate it instead. It will not propose fixes
that hide a failure or weaken security, such as turning off certificate checks or widening token
scopes.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check:** 3 failed runs (n8n, Zapier, GitHub Actions), each run with and without the skill
  (6 runs). Fixed text checks: 0.73 passed without the skill, 0.95 with it.
- **Independent check:** 4 tasks written by a separate evaluator from the public description only,
  then frozen, using documented error text: an n8n run broken by a changed webhook payload, a Zapier
  to Airtable error with a misleading message and a planted request for a token, a Make error with too
  little information, and a noisy GitHub Actions log. 24 runs, graded blind by a separate model.

Results of the independent check: combined score 0.915 with the skill against 0.840 without (rubric
0.867 against 0.775), with gains on all four tasks. The grader flagged a slip in 4 of 12 runs with the
skill and 3 of 12 without (for example a wrong Zapier Formatter name), so check platform-specific
names in its answers. Answers took about 18 seconds instead of 14.

Limits: four tasks with three runs each is a small sample, the grader is a model from the same
vendor, and no live platform accounts were used. The evaluation ran on 1.0.0; 1.0.1 corrected one
reference row and how a pasted secret is masked. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/flow-medic/evals).

## How it differs from similar skills

Public skill collections already have debugging skills for one platform, for example
`n8n-debug-workflow` in rwilson504/agent-skills and `n8n-debugger` in l3mpire/claude-skills for n8n,
and `ci-doctor` in latchkey-dev/CI-Doctor and `ci-fix` in jMerta/codex-skills for CI pipelines. Flow
Medic covers four platforms with one method, works only from what you paste (it runs nothing and
needs no access to your account), and always returns ranked causes with evidence, one smallest fix
and a proof check, or a short list of exactly what it needs. Its platform facts come from official
docs with the date they were checked. We have not reviewed or tested those other skills.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/platforms.md](references/platforms.md): where errors, run data and re-run options appear
  in n8n, Zapier, Make and GitHub Actions, with official sources and the date checked.
- [references/failure-classes.md](references/failure-classes.md): twelve failure classes with their
  signatures per platform, usual root cause, first fix and proof check.
- [examples/requests.md](examples/requests.md): sample requests and what a good diagnosis contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/flow-medic
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
