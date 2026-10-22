# MCP Mechanic

Set up and fix MCP servers without exposing secrets. An AI Craftbook skill that adds and fixes MCP servers in Claude Code, Claude Desktop and Cursor without ever handling your secrets.

This plugin packages one AI Craftbook skill, `mcp-mechanic` 1.0.1, for Claude Code and Cursor. It contains the skill's instructions and reference files only: no MCP servers, hooks, commands or scripts. The same skill is in [aicraftbook/aicraftbook-skills](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/mcp-mechanic); both copies come from one approved release (fingerprint `3f9748d5327f`).

## Install

Claude Code:

```bash
claude plugin marketplace add aicraftbook/aicraftbook-skills
claude plugin install mcp-mechanic@aicraftbook
```

Any agent supported by the Skills CLI:

```bash
npx skills add aicraftbook/aicraftbook-skills --skill mcp-mechanic
```

## Who it is for

- Developers adding MCP servers to Claude Code for themselves or a team.
- People using Claude Desktop or Cursor who hit a connection error.
- Anyone who wants MCP configuration that is safe to commit.

## Permissions

- **files:** Reads its own reference files. Proposes config edits; writes only if the agent's own permissions allow and the user agrees.
- **shell:** Suggests commands such as claude mcp add and claude mcp list. Bundles no scripts.
- **network:** None required.
- **mcp:** Helps configure MCP servers; adds none itself.

## Limits

- Client behaviour changes. The reference files carry the date they were checked; re-check after major client updates.
- Two Windows and PATH fixes come from community reports, not official docs, and the skill says so.
- It cannot see your machine. With shell access disabled it can only suggest commands.
- One answer assumed a Dock-launched macOS app reads ~/.zshrc; it does not. Check env-variable advice for GUI apps.

## Troubleshooting

- **The agent does not use the skill.** Start a new session after installing, then make a request that matches the description below. In Claude Code, `/plugin` lists installed plugins.
- **Wrong version.** Compare `.claude-plugin/plugin.json` with the latest [release](https://github.com/aicraftbook/aicraftbook-skills/releases/tag/mcp-mechanic-v1.0.1).
- **Something in the skill is wrong for your setup.** Open an issue: https://github.com/aicraftbook/aicraftbook-skills/issues/new/choose

When it loads: Adds, configures and fixes MCP servers in Claude Code, Claude Desktop and Cursor without ever handling secret values. Use when someone wants to connect an MCP server, asks where an MCP config file lives, or reports an MCP problem such as "Failed to connect", "Needs authentication", "spawn npx ENOENT", "Connection closed", tools not showing up, or .mcp.json not loading.

Full guide, examples and test results: https://aicraftbook.com/skills/mcp-mechanic?utm_source=claude&utm_medium=referral&utm_campaign=mcp-mechanic

License: MIT. Security reports: https://github.com/aicraftbook/aicraftbook-skills/security
