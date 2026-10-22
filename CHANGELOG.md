# Changelog

Collection-level changes. Each skill has its own `skills/<name>/CHANGELOG.md` and its own GitHub release.

## 2026-10-22 (later)

- Install with the Skills CLI: `npx skills add aicraftbook/aicraftbook-skills --skill <name>`. New `install-test` workflow installs every skill for Claude Code, Cursor and Codex in a clean runner (telemetry off) and checks the files against `skills-index.json`.
- Added `plugins/` with Claude Code and Cursor plugin packages for Cost Compass, First Reply and MCP Mechanic, and root marketplace files (`claude plugin marketplace add aicraftbook/aicraftbook-skills`). The plugin folders hold byte-identical copies of the released skills.
- First Reply 1.2.0.

## 2026-10-22

- First public release of the repository, with the skills listed in the README.
- Added CI: format and version checks, static security scan, gitleaks secret scan, link check and citation check.
- Added `llms.txt`, `llms-full.txt` and `CITATION.cff`.
