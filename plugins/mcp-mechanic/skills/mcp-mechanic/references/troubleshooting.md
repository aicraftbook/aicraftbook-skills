# MCP troubleshooting

Match the symptom, check the cause, apply one fix, verify again. "Community-reported" means the fix
comes from user reports, not from the client's official docs. Say so when you use it.

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| `✘ Failed to connect` (local server) | The command fails on its own | Run the exact command and args in a terminal | Fix the command first: install the runtime, correct the package name, pin a version |
| `spawn npx ENOENT` or `command not found` in Claude Desktop | The app does not see your shell's PATH (common with nvm, Volta, asdf) | `which npx` (macOS/Linux) or `where npx` (Windows) in a terminal | Use the absolute path from that command as `"command"`. Community-reported cause; the official docs say to use absolute paths |
| `MCP error -32000: Connection closed` on Windows with `npx` | `npx` is a `.cmd` shim that cannot be launched directly | The config runs `npx` without a wrapper | Community-reported: use `"command": "cmd", "args": ["/c", "npx", "-y", "<package>"]` |
| `${APPDATA}` / ENOENT errors on Windows in Claude Desktop | Variable not expanded for the server process | `mcp-server-<name>.log` | Add the expanded `APPDATA` path to the server's `env`, and install npm globally |
| `! Needs authentication` | Remote server wants OAuth sign-in | `claude mcp list` | Run `/mcp` in a session (or `claude mcp login <name>`) and finish the browser sign-in |
| 401 or 403 from a remote server | Missing, expired or under-scoped token | Is the variable set in the environment Claude Code was started from? | Set the variable and restart; create a new token with the scopes the docs list |
| A `${VAR}` warning, or literal `${VAR}` sent to the server | Variable not set where the client was launched | `echo $VAR` in the same terminal | Export it in the shell profile, open a new terminal, restart the client |
| `⏸ Pending approval` | Project server from `.mcp.json` not yet approved | `claude mcp list` | Approve it when prompted, or `claude mcp reset-project-choices` and restart |
| Server listed but no tools | Server crashed after start, or the client cached old state | Desktop: `mcp-server-<name>.log`; Cursor: MCP Logs | Fix the logged error, then fully restart the client |
| Edits to `.mcp.json` ignored | File read only at session start, wrong location, or invalid JSON | `claude mcp list` shows parse warnings; file is at the project root | Fix JSON, move the file, start a new session |
| Config in `~/.claude/mcp.json` ignored | Claude Code does not read that path | Where the file is | Use `claude mcp add --scope user` instead |
| Times out at startup | Slow first `npx` download or slow server | Run the command by hand and time it | `MCP_TIMEOUT=60000 claude`, or install the package once first |
| Server works for you but not teammates | It was added with the default `local` scope | `claude mcp get <name>` shows the scope | Re-add with `--scope project` and commit `.mcp.json` (variable references only) |
| Tool output cut off | Output larger than the cap | Warning in the session | Ask for less data, or raise `MAX_MCP_OUTPUT_TOKENS` |

## Before adding any server

- Is the publisher the real owner (organisation page, official docs link)?
- Is the package name exactly the one in the docs? Pin a version for `npx -y`.
- What can its tools do? Writing, deleting and sending deserve a read-only mode or a narrow token.
- A remote server sees everything you send to its tools. Use servers from organisations you would trust with that data.
- Tool descriptions and tool results are text the model reads. A malicious server can use them for prompt injection. Prefer servers with published source.
