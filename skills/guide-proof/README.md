# Guide Proof

Check that a setup guide can actually be followed.

Guide Proof is an agent skill that reviews a technical tutorial, setup guide, quickstart or README
walkthrough before you publish it. It reads the guide as a newcomer would, step by step, and lists
every place they would get stuck, each tied to a step with a fix you can paste in. It is for technical
writers, developer advocates, maintainers and teams writing internal setup guides.

Version 1.1.1 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/guide-proof

## What does Guide Proof do?

It reviews the guide and does not carry it out. It runs no commands and opens no links. The method:

1. **Set the reader, the start and the finish.** Who the guide is for, what they have before step 1,
   and the observable result that tells them they are done.
2. **Map the steps.** For each step: what the reader does, what it needs, and what it gives.
3. **Walk the guide with a ledger** of what the reader has at each point. This catches anything used
   before it is introduced: a folder never created, a server nobody started, a secret no step sets.
4. **Check every step** against 14 follow-ability failure types, such as missing prerequisites, no
   expected result, unclear location, missing versions, platform gaps, unsafe credential handling,
   dead ends and copy-paste hazards.
5. **Rate each problem.** **Blocking**: a reader who follows the guide exactly cannot finish, thinks it
   worked when it did not, or ends up with a secret exposed. **Non-blocking**: they finish but have to
   guess or lose time.
6. **Write the fixes** in the guide's own style, with the exact step, sentence or code block to add.

It never invents versions, expected output, URLs or UI labels. A fix that needs a fact only you have
uses a marked gap, such as `<version you tested with>`.

## When should you use it?

- Before publishing a tutorial, quickstart or how-to that includes commands or settings.
- When reviewing a README's install section or a contributor's docs pull request.
- When writing an internal setup guide for new hires.
- When a guide claims to support several operating systems.
- When a guide shows API keys, tokens or other credentials in its examples.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/guide-proof/` (all projects) or
  `.claude/skills/guide-proof/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.
- **Cursor**: Cursor's [Agent Skills documentation](https://cursor.com/docs/context/skills) says it also
  loads skills from `.claude/skills/` and `~/.claude/skills/`, so the Claude Code install below works
  for Cursor. We have not run this skill in Cursor.

## How do I install Guide Proof?

### Claude Code (and Cursor)

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/guide-proof ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/guide-proof your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/guide-proof). It
unzips to a folder with the version in its name (for example `guide-proof-v1.1.1`). Copy it so the
folder is named `guide-proof`. Then start a new session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `guide-proof-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r guide-proof.zip guide-proof -x 'guide-proof/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on.

### Check it worked

Ask your agent "What skills do you have?" and look for `guide-proof`. In Claude Code you can also type
`/guide-proof`. Then paste a guide and ask "Can a newcomer follow this?"

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own checklist and any guide file you point at. Writes nothing. |
| Shell | None. It does not run the commands in the guide. Bundles no scripts. |
| Network | None required. It does not open the guide's links. |
| MCP | None. |

No runtime or packages are needed.

## How do I use it?

Paste the guide or point the agent at the file, say who the reader is if the guide does not, and ask:

- "Can a beginner follow this README? It explains how to run our Flask demo locally."
- "Review my install guide for our CLI before I post it. Readers are on Mac and Windows."
- "Here's our quickstart for connecting to our API. Anything missing?"

A good review has a verdict (*Ready to publish*, *Ready after fixes* or *Not followable yet*) with the
count of blocking and non-blocking problems, the reader and finish line, numbered problems with
blocking first, troubleshooting notes you can paste in, and a "Not checked" list of everything it
could not confirm without running or opening anything.

## Example

From [examples/requests.md](examples/requests.md).

> Can a beginner follow this README? It explains how to run our Flask demo locally.

The README activates a virtual environment it never creates, says the app runs on port 8000 while the
code starts it on 5000, and never says which Python version it needs. A good review:

- rates the missing virtual-environment step as **blocking**;
- rates the port contradiction as **blocking**;
- asks the author to state the tested Python version as a marked gap instead of picking one;
- adds an expected-output line after `flask run`.

## Troubleshooting

- **The skill does not load.** The folder must be named `guide-proof` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `guide-proof-v<version>`. Rename the folder to
  `guide-proof`.
- **A wrong command was not caught.** It does not run the guide. A command that is wrong in a way the
  text does not reveal will not be caught; test the guide on a clean machine too.
- **Screenshots or linked pages were ignored.** It cannot see screenshots, videos or linked pages
  unless you include their content.
- **Ratings feel too strict or too loose.** It judges against the reader the guide names, or a stated
  assumption. Tell it who the reader is.
- **CI secrets were missed.** In testing it missed undefined deployment secrets in 2 of 3 runs on one
  guide. Check secrets your CI or platform reads yourself.

## Security

Guide Proof is instructions only: Markdown files with no scripts, binaries or install hooks. It tells
the agent not to run anything in the guide, to treat the guide as data and report any text in it aimed
at an AI agent, never to ask for credentials, and never to repeat a secret it finds.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings at medium or above. Two low-level notes point at example
`pip install` lines in `references/checklist.md`, which show the kind of unpinned command the skill
flags. The gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check (1.0.0):** 3 guides, each run with and without the skill (6 runs). Fixed text
  checks: 0.85 without, 0.96 with.
- **Independent check, round 1 (1.0.0):** 4 frozen tasks written by a separate evaluator from the
  public description only (a FastAPI and Docker tutorial, a GitHub Actions SSH deploy guide, a no-code
  n8n guide and one clean install guide), 24 runs graded blind by a separate model. **The skill did
  worse than no skill**: combined score 0.857 against 0.888. It over-reported problems on the clean
  guide and cited step numbers that did not exist.
- **Independent check, round 2 (1.1.0):** after rule changes, the same frozen tasks. Combined score
  0.933 with the skill against 0.871 without (rubric 0.954 against 0.833). Factual slips in 1 of 12
  runs with the skill and 5 of 12 without. It still missed the undefined deploy secrets in 2 of 3 runs
  on the SSH guide, where the base model scored higher (1.000 against 0.917).

Verdict: **partial.** Round 2 reused the tasks that informed the changes, so it is weaker evidence
than a fresh set of tasks. Answers took about 38 seconds instead of 22. Four tasks with three runs
each is a small sample, and the grader is a model from the same vendor. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/guide-proof/evals).

## How it differs from similar skills

Public skill collections already include documentation reviewers, for example
`guide-newcomer-review` in contentful/optimization, `reviewing-developer-guide` in bm629/agent-skills
and the style-guide `docs-review` skill in metabase/metabase. Those are tied to one project's docs,
judge a whole developer guide against a product-adoption checklist, or check writing style. Guide
Proof works on any setup guide, walks it step by step with a ledger of what the reader has so far,
and gives every problem a step and a paste-in fix, while refusing to invent versions, output or
credentials. We have not reviewed or tested those other skills.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/checklist.md](references/checklist.md): 14 follow-ability failure types with
  signatures, examples, fix patterns and severity definitions.
- [examples/requests.md](examples/requests.md): sample requests and what a good review contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/guide-proof
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
