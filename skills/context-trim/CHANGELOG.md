# Changelog

## 1.1.2 (2026-10-22)

- Documentation only: README rewritten as a full reference (install per agent, permissions, examples, troubleshooting, test results). SKILL.md and references unchanged.

## 1.1.1 (2026-10-21)

- Secrets are shown only as a known type prefix (`sk-…`, `ghp_…`, `AKIA…`) or `****`, never the first
  characters of the value. The audit says to revoke a secret if the file was ever committed, and no longer
  claims a value is in git history without evidence.
- Version-specific Claude Code behaviour (for example which version reads `AGENTS.md` directly) is now
  quoted from the Claude Code docs with the date checked, and presented as "per Claude Code docs, checked
  2026-10-21", not as a fact about the user's setup. `references/memory-docs.md` adds `.claude/AGENTS.md`.
- Line numbers are copied from Read, summary counts must add up to the Findings table, and the proposed
  file may contain only facts kept from the original or verified in Step 3.
- The independent evaluation ran on 1.1.0.

## 1.1.0 (2026-10-21)

- Line counts now come from Read's line numbers and the summary is written last from the findings table. An independent evaluation of 1.0.0 found answers that misstated file lengths.

## 1.0.0 (2026-10-21)

- First version, written for the AI Craftbook pre-launch expansion. Not yet evaluated or released.
