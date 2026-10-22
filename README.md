# AI Craftbook Skills

AI Craftbook Skills is an open-source collection of original agent skills written and maintained by
[AI Craftbook](https://aicraftbook.com). Each skill is a small folder with a `SKILL.md` file that teaches an AI agent such as
Claude Code to do one practical job well: fix an MCP server setup, estimate what an AI feature will cost, check
a prompt or a guide before you ship it, and more. Every skill has a full guide, test results and its security
review at [aicraftbook.com/skills](https://aicraftbook.com/skills).

[![validate](https://github.com/aicraftbook/aicraftbook-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/aicraftbook/aicraftbook-skills/actions/workflows/validate.yml)
License: MIT · Publisher: AI Craftbook · Releases: [GitHub Releases](https://github.com/aicraftbook/aicraftbook-skills/releases)

## Available skills

| Skill | What it does | Works with | Version | Source | Full guide |
|---|---|---|---|---|---|
| **Answer Ready** | Make a web page easier for search and AI answers to use | Claude Code, Claude apps | 1.0.2 | [skills/answer-ready](skills/answer-ready/) | [aicraftbook.com/skills/answer-ready](https://aicraftbook.com/skills/answer-ready) |
| **Blueprint Probe** | Find the flaws in an AI automation before you build it | Claude Code, Claude apps, Cursor | 1.0.1 | [skills/blueprint-probe](skills/blueprint-probe/) | [aicraftbook.com/skills/blueprint-probe](https://aicraftbook.com/skills/blueprint-probe) |
| **Context Trim** | Audit and tighten an agent's CLAUDE.md or AGENTS.md | Claude Code, Claude apps | 1.1.2 | [skills/context-trim](skills/context-trim/) | [aicraftbook.com/skills/context-trim](https://aicraftbook.com/skills/context-trim) |
| **Cost Compass** | Estimate what an AI feature or automation will cost to run | Claude Code, Claude apps, Cursor | 1.0.2 | [skills/cost-compass](skills/cost-compass/) | [aicraftbook.com/skills/cost-compass](https://aicraftbook.com/skills/cost-compass) |
| **First Reply** | Draft the first reply to a new real-estate lead | Claude Code, Claude apps, Codex CLI, Gemini CLI, VS Code (Copilot) | 1.1.1 | [skills/first-reply](skills/first-reply/) | [aicraftbook.com/skills/first-reply](https://aicraftbook.com/skills/first-reply) |
| **Flow Medic** | Diagnose a failed automation run from its error and logs | Claude Code, Claude apps, Cursor | 1.0.2 | [skills/flow-medic](skills/flow-medic/) | [aicraftbook.com/skills/flow-medic](https://aicraftbook.com/skills/flow-medic) |
| **Guide Proof** | Check that a setup guide can actually be followed | Claude Code, Claude apps, Cursor | 1.1.1 | [skills/guide-proof](skills/guide-proof/) | [aicraftbook.com/skills/guide-proof](https://aicraftbook.com/skills/guide-proof) |
| **MCP Mechanic** | Set up and fix MCP servers without exposing secrets | Claude Code, Claude apps, Cursor | 1.0.1 | [skills/mcp-mechanic](skills/mcp-mechanic/) | [aicraftbook.com/skills/mcp-mechanic](https://aicraftbook.com/skills/mcp-mechanic) |
| **Prompt Proof** | Find weak spots in a prompt and write tests for it | Claude Code, Claude apps, Cursor | 1.0.2 | [skills/prompt-proof](skills/prompt-proof/) | [aicraftbook.com/skills/prompt-proof](https://aicraftbook.com/skills/prompt-proof) |
| **Source Sieve** | Check every claim in a draft against its sources | Claude Code, Claude apps | 1.1.2 | [skills/source-sieve](skills/source-sieve/) | [aicraftbook.com/skills/source-sieve](https://aicraftbook.com/skills/source-sieve) |

"Works with" lists only the agents each skill's `skill.json` declares. 

## What are AI Craftbook skills?

An agent skill is a folder of instructions an AI agent loads when a task matches the skill's description.
The folder holds `SKILL.md` (YAML frontmatter with `name` and `description`, then the instructions) and,
when needed, reference files the agent can read. The format is the open Agent Skills format used by
Claude Code and the Claude apps.

AI Craftbook skills are:

- **Original.** Written by AI Craftbook. Nothing here is copied from another skill collection.
- **Instructions only.** No scripts, binaries or install hooks. CI rejects them.
- **Tested.** Each skill is compared against the same agent without the skill on fixed tasks. The results,
  including weak spots, are in each skill's README and on its guide page.
- **Versioned.** Every skill has its own semantic version, changelog and GitHub release.

## Which AI agents are supported?

| Agent | How it loads a skill | Status |
|---|---|---|
| Claude Code | Reads skill folders from `~/.claude/skills/` (all projects) or `.claude/skills/` (one project) | Used for our tests |
| Claude apps (claude.ai, Claude Desktop) | Upload the skill as a zip in the app's skills settings | Declared per skill; see each README |
| Others (Cursor, Codex CLI and so on) | Only where a skill's `skill.json` lists them | See each README |

We list an agent for a skill only when the skill's instructions fit that agent. We do not claim support we
have not checked.

## How do I install a skill?

### Claude Code

```bash
# 1. Get the repository (or download one skill's zip from its release page).
git clone https://github.com/aicraftbook/aicraftbook-skills.git

# 2. Copy one skill folder into your personal skills folder (all projects)...
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/mcp-mechanic ~/.claude/skills/

# ...or into one project's skills folder.
mkdir -p .claude/skills
cp -R aicraftbook-skills/skills/mcp-mechanic .claude/skills/
```

Start a new Claude Code session. Check it worked by asking: "What skills do you have?" The skill's name
should be in the answer.

The folder name must stay the same as the `name` in `SKILL.md` (for example `mcp-mechanic`).

### Claude apps (claude.ai, Claude Desktop)

1. Download the skill's zip from its [release](https://github.com/aicraftbook/aicraftbook-skills/releases) or its guide page.
2. Upload it under **Customize > Skills** (older versions of the apps: Settings > Capabilities > Skills).
   Each skill's README says whether we tried the upload ourselves.
3. Start a new chat and make a request that matches the skill.

### Update or remove a skill

Replace the folder with the new version's folder, or delete the folder. Each skill's `CHANGELOG.md` says what
changed.

## How do I use a skill?

You do not call a skill by name. Describe your task and the agent loads the skill when the task matches its
description. For example, with MCP Mechanic installed:

```text
Claude Desktop says "spawn npx ENOENT" for my filesystem MCP server. Fix it.
```

Each skill's README has example requests and what a good answer contains.

## How are skills reviewed?

Every release passes the same steps, in the private AI Craftbook site repository first and again in this
repository's CI:

1. **Format checks** (`tools/validate.mjs`): `SKILL.md` frontmatter, name matches folder, size budget,
   version and changelog agree, allowed file types only, no executable files.
2. **Static security scan** (`tools/aicb-scan.mjs`): pattern rules for prompt injection, credential access,
   data exfiltration, remote execution, destructive commands, obfuscation and suspicious links.
3. **Secret scan**: gitleaks.
4. **Functional evaluation**: the skill against a no-skill baseline on fixed tasks, graded blind. Results are
   in each skill's README and `evals/` folder.
5. **Owner approval**: a named AI Craftbook reviewer releases each version. Only released versions are exported
   here.

A clean scan means our checks found none of the patterns they look for. It is not a guarantee of safety. Read
a skill's `SKILL.md` before you install it.

## Security and permissions

Skills in this repository contain instructions and reference text only. They run with the permissions your
agent already has: if your agent can edit files or run commands, a skill can ask it to. Each skill's README
lists what it needs (files, shell, network, MCP). Report a security problem privately through the
[Security tab](https://github.com/aicraftbook/aicraftbook-skills/security) ("Report a vulnerability"). See [SECURITY.md](SECURITY.md).

## Troubleshooting

**The agent does not use the skill.**
Check that the folder is directly inside `~/.claude/skills/` or `.claude/skills/` (not nested one level too
deep), that the folder name equals the `name` line in `SKILL.md`, and that you started a new session after
copying it.

**Two versions behave differently.**
Check `skill.json` for the version you have. Compare it with the latest release.

**A step in a skill is wrong for my setup.**
Open an issue with the skill name, your agent and version, and the exact message you saw.

## Frequently asked questions

### Are these skills free to use?

Yes. Every skill is MIT licensed. You can use, change and share them, including commercially, as long as you
keep the license notice.

### Is the GitHub version the same as the download on aicraftbook.com?

Yes. Both are generated from the same approved release. `skills-index.json` records each skill's version, a
fingerprint of its files, and the download link with its SHA-256 checksum.

### Where is the full documentation?

On each skill's guide page at [aicraftbook.com/skills](https://aicraftbook.com/skills). It adds worked examples, comparisons
with similar skills, the full test write-up and related guides.

### Can I suggest a new skill?

Yes. Open an issue with the "Skill request" template.

## Contributing

Issues and pull requests are welcome. Every pull request is checked by CI and reviewed by a maintainer;
nothing is merged or released automatically. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Releases

Each skill is released on its own, with a tag `<skill-name>-v<version>` (for example `mcp-mechanic-v1.0.1`).
Release notes come from the skill's `CHANGELOG.md`. See [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) and
[CHANGELOG.md](CHANGELOG.md) for collection-level changes.

## License

MIT. See [LICENSE](LICENSE). To cite this repository, use the "Cite this repository" button or
[CITATION.cff](CITATION.cff).

## About AI Craftbook

[AI Craftbook](https://aicraftbook.com) is a reference site for putting AI to work: skills, MCP servers, automations, model
comparisons and step-by-step guides, each with sources and the date we checked them. This repository holds the
skills AI Craftbook writes itself.
