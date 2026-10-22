# Example requests

Illustrative. These show the kind of request the skill is for and what a good answer contains.
Recorded test runs are in `../evals/`.

1. "Add the Supabase MCP server to Claude Code for this repo so my team gets it too."
   A good answer uses `--scope project` (or `.mcp.json`) with `${SUPABASE_ACCESS_TOKEN}`, never a literal
   token, names the read-only option, and ends with `claude mcp list`.
2. "Claude Desktop says the filesystem server failed. The log says spawn npx ENOENT."
   A good answer explains that the app does not see the shell PATH, uses the absolute path from
   `which npx`, says to fully quit and reopen, and where the logs are.
3. "Notion MCP in Cursor and Claude Code, without an API token."
   A good answer uses the remote URL with OAuth: `claude mcp add --transport http` then `/mcp`,
   and a `"url"` entry in `.cursor/mcp.json`.
