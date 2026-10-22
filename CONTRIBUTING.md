# Contributing

Thank you for helping. Proposals are welcome as issues and pull requests.

## How contributions are reviewed

1. Every pull request runs CI: format validation, our static security scan and a secret scan.
2. A maintainer listed in `.github/CODEOWNERS` must approve. Pull requests are never merged automatically,
   and an author cannot approve their own pull request.
3. A merged change is not yet released. The release step re-runs the checks and a named AI Craftbook
   reviewer approves the exact files (by their fingerprint) before they appear on the website or in a
   release zip.

## What we accept

- Fixes to facts, with a link to the official documentation that shows the correct behaviour.
- Clearer instructions, shorter instructions, better examples.
- New evaluation tasks that test a real failure.
- New skills: open an issue first. We publish skills that solve a real problem better than existing ones.

## What we do not accept

- Scripts, binaries, archives or install hooks inside a skill (CI rejects them).
- Instructions that ask an agent to read secrets, change its own permissions or settings, or send data
  to outside services.
- Content copied from other skills or documentation without a licence that permits it.
- Claims of tests or measurements without the recorded evidence.

## Names

Each skill has a short, memorable display name (1-2 words), a lowercase kebab-case identifier made from it
(`MCP Mechanic` → `mcp-mechanic`) and a one-line subtitle. The identifier is the folder name and the SKILL.md
`name`. AI Craftbook is the publisher and is not part of any name. New names are checked for conflicts with
existing skills and packages before they are used.

## Style

Short sentences. One instruction per line where possible. Keep `SKILL.md` under 200 lines; put detail in
`references/`.

## Licence of contributions

By opening a pull request you agree that your contribution is licensed under this repository's MIT licence.
Contributors are credited in the skill's `CHANGELOG.md` entry and in the release notes.
