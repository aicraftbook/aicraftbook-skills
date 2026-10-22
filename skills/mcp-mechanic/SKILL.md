---
name: mcp-mechanic
description: Adds, configures and fixes MCP servers in Claude Code, Claude Desktop and Cursor without ever handling secret values. Use when someone wants to connect an MCP server, asks where an MCP config file lives, or reports an MCP problem such as "Failed to connect", "Needs authentication", "spawn npx ENOENT", "Connection closed", tools not showing up, or .mcp.json not loading.
---

# MCP Mechanic

Get one MCP server working in one client, safely, and prove it works.

## Rules that always apply

1. **Never handle secret values.** Do not ask for a token, API key or password. Do not repeat one, and do not write one into a file or a command. If the user pastes one, do not reuse it. Tell them it is now exposed in this conversation and should be revoked and replaced.
2. **Reference secrets, don't contain them.** Claude Code config uses `${VAR}`. Cursor uses `${env:VAR}`. Claude Desktop does not expand variables, so use a placeholder like `<set in your editor>` and tell the user to type the value into the file themselves. Prefer OAuth (remote servers) when the server offers it.
3. **Never put secrets in shared files.** `.mcp.json` (Claude Code project scope) and `.cursor/mcp.json` are often committed to git. They may only contain variable references.
4. **Use the server's own documentation.** Take the package name, command, URL and required variables from the server's official README or docs. If you cannot see them, ask for the link. Never guess a package name: a near-miss name can be a different, malicious package.
5. **Least privilege.** Suggest the narrowest token scopes and read-only modes the server supports. Say what the server can do once connected (read files, write to a database, send email).
6. **Don't claim it works until it is checked.** End with a verification step and say what output means success.

## Step 1: Pin down the setup

Find out, from the conversation or by asking (at most 3 short questions):

- **Client**: Claude Code, Claude Desktop or Cursor (or several).
- **OS**: macOS, Windows, Linux or WSL.
- **Server**: which one, and its official docs link.
- **Transport**: local process (stdio) or remote URL (HTTP). Remote servers often use OAuth.
- **Who should get it** (Claude Code): just you in this project (`local`, the default), everyone in the repo (`project`, writes `.mcp.json`), or you in every project (`user`).

## Step 2: Write the configuration

Use the exact syntax in [references/clients.md](references/clients.md) for the client. Give one complete, copyable block or command per client. Then list:

- every environment variable the user must set, and where to set it (shell profile, `.env` loaded by their shell, OS settings), never its value;
- what to restart: start a new Claude Code session, fully quit and reopen Claude Desktop, or reload Cursor.

For Claude Code, prefer the `claude mcp add` command over hand-editing JSON, and put `--` before the server's own command so its flags are not read as Claude Code flags.

## Step 3: Verify

- Claude Code: `claude mcp list` (status for each server), `claude mcp get <name>`, or `/mcp` inside a session.
- Claude Desktop: the server and its tools appear in the connectors/tools menu; if not, read the logs listed in the reference.
- Cursor: Settings → MCP shows the server as active; output panel "MCP Logs" shows errors.

Then ask the agent a question that uses one read-only tool from the server, and check the answer.

## Step 4: If it fails, diagnose before changing anything

Read the status or error text first and match it in [references/troubleshooting.md](references/troubleshooting.md). Fix one cause at a time and re-verify after each change. Run a local server's command by hand in a terminal to see its real error. When the cause is a client or OS quirk that only community reports describe, say that it is community-reported.

## Output format

1. **Setup**: client, OS, server, transport, scope (one line each).
2. **Configuration**: the command or JSON block(s).
3. **You set**: the variables or values the user enters themselves, and where.
4. **Restart and verify**: exact steps and the success signal.
5. **What this server can do**: its permissions in one or two sentences, and the least-privilege option.
6. **If it fails**: the two most likely causes for this setup, from the troubleshooting table.
