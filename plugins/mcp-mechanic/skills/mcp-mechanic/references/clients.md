# Client configuration reference

Checked against the official documentation on 2026-10-21. Client behaviour changes; if something here
disagrees with the current docs, the docs win. Sources are listed at the end.

## Claude Code

**Add with the CLI (preferred).**

```bash
# Remote server over HTTP (OAuth or headers)
claude mcp add --transport http <name> <url>
claude mcp add --transport http <name> <url> --header "Authorization: Bearer $API_TOKEN"

# Local server (stdio). Everything after -- is the server's own command.
# "$API_TOKEN" is filled in by your shell from your environment, so the agent never sees the value.
# The value is then saved in ~/.claude.json, a private file in your home folder.
claude mcp add <name> --env API_TOKEN="$API_TOKEN" -- npx -y <package>@<version>

# Choose who gets it
claude mcp add --scope project ...   # writes .mcp.json in the project root (shared via git)
claude mcp add --scope user ...      # you, in every project
                                     # default scope is local: you, in this project only
```

- `--transport sse` still exists but is deprecated; use `http` for remote servers.
- Put `--` before the server command. Without it, server flags such as `--port` are parsed as Claude Code flags.
- `claude mcp add-json <name> '<json>'` adds a raw JSON entry. An entry with a `url` but no `"type"` is treated as stdio and fails.
- `claude mcp add-from-claude-desktop` imports Desktop servers (macOS and WSL only).

**Where it is stored.** `local` and `user` scopes live in `~/.claude.json` (`%USERPROFILE%\.claude.json` on Windows). `project` scope lives in `.mcp.json` at the project root. Claude Code does **not** read `~/.claude/mcp.json` or `~/.claude/.mcp.json`. When the same name exists in several scopes, the order is local, then project, then user. Entries are not merged.

**`.mcp.json` shape.**

```json
{
  "mcpServers": {
    "example-local": {
      "command": "npx",
      "args": ["-y", "<package>@<version>"],
      "env": { "API_TOKEN": "${API_TOKEN}" }
    },
    "example-remote": {
      "type": "http",
      "url": "https://example.com/mcp",
      "headers": { "Authorization": "Bearer ${API_TOKEN}" }
    }
  }
}
```

- For a shared `.mcp.json`, never let the shell fill in values: write `${VAR}` references by hand (or with `add-json` in single quotes) so each teammate's own environment supplies them.
- `${VAR}` and `${VAR:-default}` expand in `command`, `args`, `env`, `url` and `headers`. An unset variable with no default is left as-is and shows a warning.
- Project servers from `.mcp.json` need approval the first time. `claude mcp reset-project-choices` resets those choices.
- `.mcp.json` is read when a session starts. Restart after editing.

**Authenticate and inspect.**

- `/mcp` inside a session lists servers and runs OAuth sign-in in the browser. From the shell: `claude mcp login <name>`, `claude mcp logout <name>`.
- `claude mcp list` shows each server's status. `claude mcp get <name>` shows one server. `claude mcp remove <name>` removes it and its stored OAuth tokens.
- Status text: `✔ Connected`, `! Needs authentication`, `✘ Failed to connect`, `✘ Connection error`, `⏸ Pending approval`, `⊘ Disabled`.
- Startup timeout defaults to 30 seconds: `MCP_TIMEOUT=60000 claude` raises it to 60. `MAX_MCP_OUTPUT_TOKENS` caps tool output (default 25,000).

## Claude Desktop

- Config file: macOS `~/Library/Application Support/Claude/claude_desktop_config.json`; Windows `%APPDATA%\Claude\claude_desktop_config.json`. Open it from Settings → Developer → Edit Config.
- Shape: the same `"mcpServers"` object with `command`, `args`, `env`. Use absolute paths.
- No `${VAR}` expansion. Values in `env` are literal, so the user types any secret into the file in their own editor. Never write it for them.
- Fully quit the app (not only close the window) and reopen after every change.
- Logs: macOS `~/Library/Logs/Claude`; Windows `%APPDATA%\Claude\logs`. Read `mcp.log` and `mcp-server-<name>.log`.

## Cursor

- Config: `.cursor/mcp.json` in the project, or `~/.cursor/mcp.json` for all projects. Same `"mcpServers"` shape; remote servers use `"url"`.
- Variables: `${env:NAME}`, plus `${userHome}` and `${workspaceFolder}`. `envFile` works for stdio servers only.
- OAuth is supported for remote servers.
- Errors: Output panel → "MCP Logs".

## Sources

- Claude Code MCP: https://code.claude.com/docs/en/mcp
- Claude Code MCP quickstart and troubleshooting: https://code.claude.com/docs/en/mcp-quickstart
- Connect local servers to Claude Desktop: https://modelcontextprotocol.io/docs/develop/connect-local-servers
- Cursor MCP: https://cursor.com/docs/context/mcp
