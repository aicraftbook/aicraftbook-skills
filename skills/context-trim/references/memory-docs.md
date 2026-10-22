# What the official docs say about instruction files

Checked against the sources at the end on 2026-10-21. Agents change how they load these files. If the
current docs disagree with this page, the docs win; say which version of the docs you relied on.

The repo cannot show which Claude Code version the user runs. Write every version-specific fact on this
page as "per Claude Code docs, checked 2026-10-21", using the quoted wording, never as a fact about the
user's setup.

## Claude Code: CLAUDE.md

**Locations and scope** (listed from broadest to most specific; later ones are read later):

| Scope | Location | Shared with |
|---|---|---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux and WSL `/etc/claude-code/CLAUDE.md`, Windows `C:\Program Files\ClaudeCode\CLAUDE.md` | Everyone on the machine; cannot be excluded |
| User | `~/.claude/CLAUDE.md` | Only you, every project |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | The team, through git |
| Local | `./CLAUDE.local.md` (add it to `.gitignore`) | Only you, this project |

**How files load.**

- `CLAUDE.md` and `CLAUDE.local.md` in the working directory and every directory above it load at launch.
  Files in subdirectories load on demand, when the agent reads or edits a file in that subdirectory.
- All discovered files are **concatenated, not overridden**: content runs from the filesystem root down to
  the working directory, and `CLAUDE.local.md` comes after `CLAUDE.md` in each directory. Two files that
  disagree both reach the model. The docs warn that with contradictory instructions Claude "may pick one
  arbitrarily".
- CLAUDE.md is delivered as context after the system prompt, not as enforced configuration. Anything that
  must happen every time (a check before every commit, blocking edits to a folder) belongs in a hook or CI,
  not a sentence.
- Block-level HTML comments (`<!-- ... -->`) are stripped before loading: useful for maintainer notes.
- A file over 4 MiB is skipped. `claudeMdExcludes` (a setting) can skip other teams' files in a monorepo.
- The project-root CLAUDE.md is re-read after `/compact`; nested files and path-scoped rules reload on demand.

**Imports.**

- `@path/to/file` anywhere in the text imports that file at launch. Relative paths resolve from the file
  that contains the import, not the working directory. Imports can nest up to four hops.
- Imports are **not** read inside code spans or fenced code blocks: `` `@README` `` stays literal.
- A path with spaces needs a backslash before each space (`@Design\ Docs/api.md`). A quoted path is not
  imported at all.
- Imports organise a file but do not save context: imported files load at launch too.
- Imports that resolve outside the working directory in a project file need a one-time approval.

**Rules folder (`.claude/rules/`).**

- Every `.md` file under `.claude/rules/` is discovered recursively. One topic per file is the convention.
- Without frontmatter a rule loads at launch, like `.claude/CLAUDE.md`.
- With `paths:` frontmatter (a YAML list of globs such as `"src/api/**/*.ts"`) the rule loads only when the
  agent works with a matching file. `paths` is the only frontmatter field read; others are ignored. Invalid
  YAML makes the rule load as if it had no `paths`.
- Personal rules for every project live in `~/.claude/rules/`.

**Size and style guidance from the docs.**

- Target under 200 lines per CLAUDE.md. Longer files "consume more context and reduce adherence". Claude
  Code warns at startup when a file is over the recommended length.
- Write instructions concrete enough to verify: "Use 2-space indentation", "Run `npm test` before
  committing", "API handlers live in `src/api/handlers/`".
- Group related instructions under headings and bullets.
- For each line ask whether removing it would cause mistakes; if not, cut it.
- Use emphasis such as "IMPORTANT" on a single line Claude keeps skipping. Emphasis on many lines makes
  none stand out.
- Multi-step procedures and knowledge needed only sometimes belong in a skill; rules for one part of the
  codebase belong in a path-scoped rule.

**Include and exclude** (from the best-practices page):

| Include | Exclude |
|---|---|
| Commands the agent cannot guess | Anything it can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions |
| Testing instructions and preferred runners | Detailed API documentation (link instead) |
| Repository etiquette (branches, PRs) | Information that changes frequently |
| Project-specific architectural decisions | Long explanations or tutorials |
| Environment quirks (required variables) | File-by-file descriptions of the codebase |
| Gotchas that are not self-evident | Self-evident practices like "write clean code" |

**Built-in helpers the user may already have.** `/init` drafts or suggests improvements to a CLAUDE.md.
`/context` lists the memory files that loaded. `/memory` lists and opens them. `/doctor prompt-audit`
reports outdated or conflicting instructions and proposes edits; the docs say "`/doctor prompt-audit`
requires Claude Code v2.1.283 or later" (checked 2026-10-21). Mention these when relevant; they do not
replace checking each command against the repo.

## Claude Code and AGENTS.md

- Claude Code reads `AGENTS.md` as project instructions **only when there is no `CLAUDE.md`,
  `.claude/CLAUDE.md` or `CLAUDE.local.md`** in the working directory or above it. Your
  `~/.claude/CLAUDE.md`, the managed file and `.claude/rules/` do not count for that check.
- Version, quoted from the docs (checked 2026-10-21): "Reading `AGENTS.md` directly requires Claude Code
  v2.1.277 or later." Older versions, and sessions where the built-in plugin is disabled, read
  `CLAUDE.md` files only; the `@AGENTS.md` import works in all of them.
- When it does read them, it loads every `AGENTS.md` and `.claude/AGENTS.md` in the working directory and
  the directories above it at session start, and a subdirectory's `AGENTS.md` when it reads a file there and that subdirectory has no `CLAUDE.md`,
  `.claude/CLAUDE.md` or `CLAUDE.local.md` of its own.
- So a repo with both files usually gets only `CLAUDE.md` in Claude Code. A `CLAUDE.md` that says "read
  AGENTS.md" in words only works if the agent decides to open it. The documented fix is an `@AGENTS.md`
  import in `CLAUDE.md`, or a symlink (the docs advise the import when anyone uses Windows).
- The **Project instructions** setting can load both (`claude-md-and-agents-md`).
- Not read by Claude Code: `AGENTS.local.md`, `AGENTS.override.md`, anything under `.agents/`.
- Check what loaded with `/memory`. The docs say (checked 2026-10-21): "Before v2.1.280, `/memory` and
  `/context` didn't list an `AGENTS.md` that Claude read directly."

## The AGENTS.md convention

- An open format, described as a README for agents, stewarded by the Agentic AI Foundation under the
  Linux Foundation. Plain Markdown, no required fields or headings.
- Put it at the repository root. Large monorepos can add one per subproject. Agents read the nearest file
  in the directory tree: "The closest AGENTS.md to the edited file wins; explicit user chat prompts
  override everything."
- Suggested content: project overview, build and test commands, code style, testing instructions,
  security considerations; also commit and PR guidelines and deployment steps.
- Agents "will attempt to execute relevant programmatic checks" listed in it, so a wrong test command
  costs real time on every task.
- Many agents read it (the site lists Codex, Jules, Aider, Cursor, Gemini CLI, GitHub Copilot coding agent
  and others), some only after a setting change. Check the agent's own docs before claiming it loads.

## Other agents' files

Name them only when they exist in the repo or the user mentions them, and point to that agent's docs for
loading rules rather than guessing: `GEMINI.md` (Gemini CLI), `.github/copilot-instructions.md` (GitHub
Copilot), `.cursorrules` (older Cursor projects; newer ones use rule files in Cursor's rules folder),
`.windsurfrules`, `.clinerules`. Duplicated content across these files drifts; one shared `AGENTS.md` plus
thin pointers is easier to keep true.

## Sources

- Claude Code, How Claude remembers your project: https://code.claude.com/docs/en/memory
- Claude Code, Best practices (Write an effective CLAUDE.md): https://code.claude.com/docs/en/best-practices
- AGENTS.md: https://agents.md/
