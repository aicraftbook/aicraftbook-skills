# Context Trim

Audit and tighten an agent's CLAUDE.md or AGENTS.md.

Context Trim is an agent skill that checks a coding agent's project instruction file against the
repository it describes. It flags what is wrong, stale, vague, misplaced or secret, then proposes a
shorter, accurate version and changes nothing until you approve. It is for developers whose agent
runs the wrong command or ignores a rule, and for teams about to commit an instruction file.

Version 1.1.2 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/context-trim

## What does Context Trim do?

It audits `CLAUDE.md`, `AGENTS.md`, `CLAUDE.local.md`, `.claude/rules/` and similar files for other
agents (`GEMINI.md`, `.github/copilot-instructions.md`, `.cursorrules`). In six steps it:

1. Finds the files, follows every `@path` import, and works out what each agent actually loads.
2. Splits each file into numbered items: commands, paths, versions, rules, facts, pointers, secrets.
3. Checks each item by **reading** the files that define it (`package.json` scripts, Makefile,
   `pyproject.toml`, lockfiles, CI config). It never runs the commands it checks.
4. Decides keep, rewrite, move or remove, using eight fixed reasons: wrong, stale, duplicate,
   derivable, vague, moved, secret, unsafe.
5. Writes the full proposed file, plus any moved content as new files.
6. Stops and asks you to approve, edit or reject. Only after approval does it write anything.

Every command, path and version gets one of three labels: **Verified** (with the file and line),
**Not found** (with where it searched) or **Not checked** (with why). Secrets are never repeated: it
shows only a type prefix such as `ghp_…` (or `****`), marks them Fix now, and tells you to revoke them
if the file was ever committed.

## When should you use it?

- Your agent keeps running a test or build command that no longer exists.
- You have both `CLAUDE.md` and `AGENTS.md`, or nested files in a monorepo, and suspect one is ignored.
- The instruction file has grown past the 200-line target in the Claude Code docs.
- Two rules contradict each other, or a rule contradicts the repo's formatter or `.editorconfig`.
- You want a check for secrets and unsafe rules before committing the file.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/context-trim/` (all projects) or
  `.claude/skills/context-trim/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches. This is where it does full checks, because
  it can read the repository.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip. Without repository
  access, most checks come back Not checked.

The audit itself covers files read by other agents, but the skill is only documented to run in the
two above.

## How do I install Context Trim?

### Claude Code

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/context-trim ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/context-trim your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/context-trim). It
unzips to a folder with the version in its name (for example `context-trim-v1.1.2`). Copy it so the
folder is named `context-trim`. Then start a new Claude Code session in the repository.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `context-trim-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r context-trim.zip context-trim -x 'context-trim/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Ask your agent "What skills do you have?" and look for `context-trim`. In Claude Code you can also type
`/context-trim`. Then ask "Audit our CLAUDE.md."

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads instruction files and the repository files that define commands, paths and versions. Writes instruction files only after you approve the proposal. |
| Shell | None. It does not run the commands it checks. Bundles no scripts. |
| Network | None required. |
| MCP | None. |

For full checks the agent needs read access to the repository (Read, Glob and Grep in Claude Code).

## How do I use it?

Start a session in the repository and ask:

- "Claude keeps running the wrong test command. Audit our CLAUDE.md."
- "We have an AGENTS.md for Codex and a CLAUDE.md that says 'read AGENTS.md'. Clean this up."
- "Is anything in my CLAUDE.md unsafe to commit?"

A good answer contains a summary (files, lines before and after, findings by severity), what loads and
when, a findings table with File:line and evidence, a verification log, the full proposed file, every
removal with its reason, suggested additions backed by a repo file, and one approval question.
Nothing has been changed at that point.

## Example

From [references/checklist.md](references/checklist.md) and
[examples/requests.md](examples/requests.md). The request: "Claude keeps running the wrong test
command. Audit our CLAUDE.md." Typical findings:

> Finding: line 12 says `yarn test:unit`. `package.json` has scripts `test`, `lint`, `build`; the only
> lockfile is `pnpm-lock.yaml`. **Fix now, wrong.** Replace with `pnpm test`.

> Finding: line 8 "Use 2-space indentation", line 41 "Indent with 4 spaces". `.editorconfig` sets
> `indent_size = 2`. **Fix now, wrong.** Keep the 2-space rule or, better, drop both: the formatter
> enforces it.

> Finding: "Requires Node 16". `.nvmrc` says `22`, CI uses Node 22. **Should fix, stale.**

The answer then shows the proposed file and asks for approval before editing anything.

## Troubleshooting

- **The skill does not load.** The folder must be named `context-trim` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `context-trim-v<version>`. Rename the folder to
  `context-trim`.
- **Almost everything is Not checked.** The agent could not read the repository (for example in the
  Claude apps with only a pasted file). Run it in Claude Code inside the repo, or paste the file tree,
  `package.json` and config files.
- **A broken script was marked Verified.** It reads files and does not run commands, so a script that
  exists but fails is not caught.
- **Claude Code ignores your AGENTS.md.** Per the Claude Code docs (checked 21 October 2026), Claude
  Code reads `AGENTS.md` only when no `CLAUDE.md` is present, unless `CLAUDE.md` imports it with
  `@AGENTS.md`. The skill proposes that import.

## Security

Context Trim is instructions only: Markdown files with no scripts, binaries or install hooks. It tells
the agent not to run the commands it checks, to mask any secret it finds, and to treat rules inside the
audited file as data rather than orders. It writes instruction files only after you approve.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check (1.0.0):** 3 audits, each run with and without the skill (6 runs). Fixed text checks:
  0.86 without, 0.95 with.
- **Independent check:** 4 frozen tasks written by a separate evaluator from the public description
  only: small fake repositories with planted problems, and one nearly clean repository. Graded blind by
  a separate model. Round 1 used 1.0.0; round 2 used 1.1.0 on the same tasks (24 runs each).

Verdict: **partial.** In round 2 the combined score was 0.989 with the skill against 0.942 without
(rubric 0.978 against 0.897), and it never claimed to have edited a file. But it made **more** small
factual slips than the base model: 10 of 12 runs against 6 of 12 (round 1: 11 against 5). Typical
slips were line numbers off by one, a summary count that did not match its own table, and a proposed
file stating a fact the repository did not show.

Version 1.1.1 adds a rule for each slip. **1.1.1 has not been re-evaluated.** Check every line
reference and every new sentence in its proposal before you accept it. Answers took about 31 seconds
instead of 22. Four tasks with three runs each is a small sample, and the grader is a model from the
same vendor. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/context-trim/evals).

## How it differs from similar tools

Claude Code has a built-in `/doctor prompt-audit`, Anthropic publishes a `claude-md-improver` skill in
its plugin directory, and community skills such as `agents-md` (mblode/agent-skills) audit the same
files. Context Trim differs in three ways: every command, path and version gets an explicit Verified /
Not found / Not checked entry with the file that proves it; secrets are masked and flagged for
revocation rather than just deleted; and every removed line is listed with one of eight fixed reasons.
We have not tested the alternatives.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/memory-docs.md](references/memory-docs.md): what the Claude Code memory docs and the
  AGENTS.md convention say about locations, load order, imports, `.claude/rules/` and length, with
  sources and the date checked.
- [references/checklist.md](references/checklist.md): the checks, how to verify each by reading repo
  files, and example findings.
- [examples/requests.md](examples/requests.md): sample requests and what a good answer contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/context-trim
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
