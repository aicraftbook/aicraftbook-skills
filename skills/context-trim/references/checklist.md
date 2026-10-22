# Audit checklist

Use the checks that apply. Each one says how to verify by reading files, then shows a typical finding.
Never run a listed command to test it; find where it is defined.

## 1. Commands

How to verify:

| The file says | Look in | Verified when |
|---|---|---|
| `npm run x`, `pnpm x`, `yarn x`, `bun run x` | `package.json` `"scripts"` (and workspace packages' `package.json`) | a script named exactly `x` exists in the package the command runs in |
| `npm test` / `pnpm test` | `"scripts"."test"` | it exists and is not the npm placeholder that only prints an error |
| `make x` | `Makefile` | a target line `x:` exists |
| `just x`, `task x` | `justfile`, `Taskfile.yml` | the recipe or task exists |
| `pytest`, `ruff`, `mypy`, `tox -e x` | `pyproject.toml`, `requirements*.txt`, `tox.ini`, `noxfile.py` | the tool is a declared dependency; the env exists |
| `poetry run x`, `uv run x` | `[project.scripts]` / `[tool.poetry.scripts]` in `pyproject.toml` | the entry point exists |
| `cargo x`, `go x` | `Cargo.toml`, `go.mod` | standard subcommand, or an alias in `.cargo/config.toml` |
| `docker compose up x` | `compose.yaml` / `docker-compose.yml` | service `x` exists |
| "CI runs x" | `.github/workflows/*.yml` and other CI config | a job or step runs it |

Package manager: the lockfile decides (`package-lock.json` npm, `pnpm-lock.yaml` pnpm, `yarn.lock` yarn,
`bun.lock` or `bun.lockb` bun), and so does the `packageManager` field in `package.json`.

> Finding: line 12 says `yarn test:unit`. `package.json` has scripts `test`, `lint`, `build`; the only
> lockfile is `pnpm-lock.yaml`. **Fix now, wrong.** Replace with `pnpm test`.

## 2. Paths

Glob the exact path. If it is missing, Glob the last segment (`**/handlers`) to see whether it moved.

> Finding: "API handlers live in `src/api/handlers/`". No such folder; route files are in
> `src/server/routes/`. **Fix now, stale.** Point to `src/server/routes/`.

## 3. Versions and tools

Compare stated versions with `engines` in `package.json`, `.nvmrc`, `.node-version`, `.python-version`,
`.tool-versions`, the `go` line in `go.mod`, `rust-toolchain.toml`, Docker base images and CI setup steps.

> Finding: "Requires Node 16". `.nvmrc` says `22`, CI uses Node 22. **Should fix, stale.**

## 4. Contradictions

Look in three places:

- inside one file (two rules for the same behaviour);
- across files: root and nested `CLAUDE.md` / `AGENTS.md`, rules files, `CLAUDE.local.md`. Claude Code
  concatenates them all, so both versions reach the model;
- against repo config that already enforces the answer: `.editorconfig`, Prettier, ESLint, Ruff, Black,
  `tsconfig.json`, commit hooks.

> Finding: line 8 "Use 2-space indentation", line 41 "Indent with 4 spaces". `.editorconfig` sets
> `indent_size = 2`. **Fix now, wrong.** Keep the 2-space rule or, better, drop both: the formatter
> enforces it.

Report which side the repo supports. If the repo supports neither, ask the user; do not pick.

## 5. Stale

Signs: tools the repo no longer uses, folders that are gone, "temporary", "for now", "until we migrate",
named people or dates, version numbers older than the lockfile, TODOs that are done.

> Finding: "We are migrating from Jest to Vitest; use Jest for now". `package.json` has `vitest` and no
> `jest`. **Should fix, stale.** "Tests use Vitest."

## 6. Vague

A rule is vague when two people could not agree whether it was followed. Rewrite it into something
checkable if the repo shows what is meant; otherwise remove it as **vague** and say so.

| Vague | Checkable (only if the repo supports it) |
|---|---|
| Write clean code | (remove: self-evident) |
| Be careful with the database | Never edit files in `db/migrations/`; create a new migration with `pnpm db:new` |
| Follow best practices for tests | Put tests next to the file as `*.test.ts`; run one file with `pnpm test path/to/file` |
| Keep the API consistent | Error responses use `ApiError` from `src/lib/errors.ts` |

## 7. Derivable or bloated

Remove as **derivable** what the agent can read for itself: file-by-file tours, dependency lists copied
from `package.json`, framework basics, generic language style. Keep a one-line pointer when a location
is surprising.

> Finding: lines 60-118 describe each file in `src/`. **Should fix, derivable.** Replace with three
> pointers: entry point, where routes live, where shared types live.

## 8. Misplaced

| Content | Better home |
|---|---|
| A multi-step procedure used sometimes (release, deploy, data backfill) | A skill (`.claude/skills/<name>/SKILL.md`) |
| Rules for one area (API, migrations, frontend) | `.claude/rules/<topic>.md` with `paths:` frontmatter |
| Personal preferences, sandbox URLs, your test accounts | `CLAUDE.local.md` (gitignored) or `~/.claude/CLAUDE.md` |
| Long reference material | The existing doc, linked or imported only if every session needs it |
| Content shared with other agents | `AGENTS.md`, imported into `CLAUDE.md` with `@AGENTS.md` |

## 9. Secrets and sensitive data

Flag as **Fix now, secret**: API keys and tokens (`sk-`, `ghp_`, `xox`, `AKIA` prefixes and similar),
passwords, connection strings with a password, private keys, signed URLs, webhook URLs with tokens,
internal hostnames the team would not publish, customers' personal data.

- Show only a known type prefix, then `…` (`sk-…`, `ghp_…`, `AKIA…`). A value with no known prefix is
  `****`. Never show more characters, and never copy the full value into the findings or the proposal.
- Say it must be revoked and replaced if the file was ever committed, because deleting it from the file
  does not remove it from git history. Do not say it is in git history unless the user told you; you
  have not checked git.
- In the proposal, name the variable and where values come from: "Set `DATABASE_URL` in your shell or
  secret manager; see `.env.example` for the names." Do not open real environment files to check names.
  Use a variable name only if a repo file (such as `.env.example` or the code that reads it) shows it.

## 10. Safety and enforcement

- Rules that widen what the agent may do without asking ("you can deploy to production without asking",
  "run migrations on the live database when needed"): **Fix now, unsafe**. Propose the opposite boundary
  and leave the decision to the user.
- Must-always rules ("always run the linter before committing") are advice to the model. Suggest a hook
  or CI check if the user needs a guarantee; keep the sentence only if it still helps.

## 11. Length, structure and emphasis

- Over 200 lines in one Claude Code file: **Should fix**. Move area rules to path-scoped rules and
  procedures to skills before cutting content.
- IMPORTANT, MUST or capitals on many lines: **Optional**. Keep emphasis on the one rule that is skipped.
- Long paragraphs: split into one rule per bullet under short headings.

## 12. Load problems

- `CLAUDE.md` and `AGENTS.md` both present: per Claude Code docs (checked 2026-10-21), Claude Code reads
  only `CLAUDE.md` unless it imports `@AGENTS.md` (or the setting loads both).
- "See AGENTS.md" written in words instead of an `@AGENTS.md` import.
- `@path` inside backticks or a code block (not imported), with unescaped spaces, in quotes, or pointing at
  a missing file.
- Rule files with broken YAML frontmatter (the rule then loads everywhere).
- A `CLAUDE.local.md` committed to git.
