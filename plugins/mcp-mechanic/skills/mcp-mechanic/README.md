# MCP Mechanic

Set up and fix MCP servers without exposing secrets.

MCP Mechanic is an agent skill that adds, configures and fixes MCP servers in Claude Code, Claude
Desktop and Cursor. It writes the configuration, tells you how to check that it works, and diagnoses
common errors, without ever asking for, repeating or writing your secret values. It is for developers
adding MCP servers for themselves or a team, and for anyone stuck on a connection error.

Version 1.0.1 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/mcp-mechanic

## What does MCP Mechanic do?

It gets one MCP server working in one client, safely, and proves it works. It follows six rules:

1. **Never handle secret values.** It does not ask for a token, key or password, repeat one, or write
   one into a file or command. If you paste one, it tells you to revoke and replace it.
2. **Reference secrets instead.** Claude Code config uses `${VAR}`; Cursor uses `${env:VAR}`. Claude
   Desktop does not expand variables, so it leaves a placeholder for you to fill in yourself. It
   prefers OAuth when a remote server offers it.
3. **No secrets in shared files.** `.mcp.json` and Cursor's project config are often committed, so they
   get variable references only.
4. **Use the server's own docs** for the package name, command, URL and variables. It never guesses a
   package name, because a near-miss name can be a different, malicious package.
5. **Least privilege.** It suggests the narrowest token scopes and read-only modes, and says what the
   server can do once connected.
6. **Verify before claiming success.** It ends with a check and says what output means success.

For Claude Code it prefers the `claude mcp add` command over hand-editing JSON, and picks the right
scope: `local` (you, this project), `project` (everyone in the repo, via `.mcp.json`) or `user` (you,
every project). When something fails, it matches the error to a symptom-to-fix table and changes one
thing at a time.

## When should you use it?

- Adding an MCP server to Claude Code for yourself or your whole team.
- Connecting a remote server with OAuth instead of an API token.
- Claude Desktop or Cursor reports a server failed, or its tools do not show up.
- Errors such as "Failed to connect", "Needs authentication", "spawn npx ENOENT" or "Connection closed".
- `.mcp.json` edits seem to be ignored.
- You want MCP configuration that is safe to commit.

## Which AI agents support it?

The skill runs in, and writes configuration for, these clients:

- **Claude Code**: loads it from `~/.claude/skills/mcp-mechanic/` (all projects) or
  `.claude/skills/mcp-mechanic/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.
- **Cursor**: Cursor's [Agent Skills documentation](https://cursor.com/docs/context/skills) says it also
  loads skills from `.claude/skills/` and `~/.claude/skills/`, so the Claude Code install below works
  for Cursor. Our tests ran the skill in Claude Code only, editing Cursor config files there.

## How do I install MCP Mechanic?

### Claude Code (and Cursor)

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/mcp-mechanic ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/mcp-mechanic your-project/.claude/skills/
```

Then start a new session. The website shows the `SKILL.md` text but does not offer a folder download
for this skill yet. Copy the whole folder: `SKILL.md` points to the two reference files.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag
   `mcp-mechanic-v<version>`), or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r mcp-mechanic.zip mcp-mechanic -x 'mcp-mechanic/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on.

### Check it worked

Ask your agent "What skills do you have?" and look for `mcp-mechanic`. In Claude Code you can also type
`/mcp-mechanic`. Then ask, for example, "Where does Claude Code read project MCP servers from?"

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own reference files. Proposes config edits; writes only if the agent's own permissions allow and you agree. |
| Shell | Suggests commands such as `claude mcp add` and `claude mcp list`. Bundles no scripts. |
| Network | None required. |
| MCP | Helps configure MCP servers; adds none itself. |

No runtime or packages are needed. With shell access turned off, it can only suggest commands.

## How do I use it?

Say which client, operating system and server you mean, and link the server's official docs if you
have them:

- "Add the Supabase MCP server to Claude Code for this repo so my team gets it too."
- "Claude Desktop says the filesystem server failed. The log says spawn npx ENOENT."
- "Notion MCP in Cursor and Claude Code, without an API token."

A good answer gives the setup (client, OS, server, transport, scope), one copyable command or JSON
block per client, the variables you set yourself and where, what to restart, how to verify with the
success signal, what the server can do and its least-privilege option, and the two most likely causes
if it fails.

## Example

From [examples/requests.md](examples/requests.md) and
[references/troubleshooting.md](references/troubleshooting.md).

> Claude Desktop says the filesystem server failed. The log says spawn npx ENOENT.

A good answer:

- explains that the app does not see your shell's PATH, which is common with nvm, Volta and asdf;
- has you run `which npx` (macOS and Linux) or `where npx` (Windows) in a terminal;
- uses that absolute path as the server's `"command"` instead of `npx`;
- says to fully quit and reopen Claude Desktop, not just close the window;
- says where the logs are (on macOS, `~/Library/Logs/Claude`) to confirm the fix;
- notes that the PATH explanation is community-reported, while the official docs say to use absolute
  paths.

## Troubleshooting

- **The skill does not load.** The folder must be named `mcp-mechanic` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **It cannot find the reference files.** Copy the whole folder, not only `SKILL.md`.
- **It asks for the server's docs link.** It will not guess a package name or command. Give it the
  official README or docs page.
- **A fix says "community-reported".** Two Windows and PATH fixes come from user reports, not official
  docs, and the skill labels them that way.
- **A client changed.** Client behaviour changes. The reference files carry the date they were checked
  (21 October 2026); check the client's current docs after major updates.

For MCP errors themselves (`Failed to connect`, `Needs authentication`, `Pending approval`, timeouts,
missing tools), see the symptom, cause, check and fix table in
[references/troubleshooting.md](references/troubleshooting.md).

## Security

MCP Mechanic is instructions only: Markdown files with no scripts, binaries or install hooks. It never
asks for, repeats or writes secret values, and it keeps shared config files free of secrets.

Before release it went through AI Craftbook's static scanner (pattern rules for prompt injection,
credential access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links
and dependencies) and the gitleaks secret scanner, which came back clean. The scanner flags one
high-severity rule (AG002) because the skill names the MCP config files of Cursor and Claude Desktop. That is its
purpose: it tells you where to edit, and it does not change permissions or security settings. The
finding is recorded in [skill.json](skill.json), and a security reviewer read the text and approved it.

A clean or approved scan is not proof of safety. Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code 2.1.303 with the Sonnet model in a fresh folder.

- **Author check:** three requests (a team setup with a pasted token, Claude Desktop failing with
  `spawn npx ENOENT`, a remote OAuth server in two clients on Windows), each run 3 times with and
  3 times without the skill (18 runs, read-only tools). With the skill all 45 fixed checks passed;
  without it 43 of 45 passed (in 2 of 3 Desktop runs the answer suggested `sudo`).
- **Independent check:** five tasks written from the public description only, where the agent edited
  real Claude Code, Claude Desktop and Cursor config files in a scratch folder with fake secrets.
  30 runs, graded blind by a separate model.

Results of the independent check:

| | Without skill | With skill |
|---|---|---|
| All hard file checks passed | 12 of 15 | 15 of 15 |
| Runs that leaked a secret | 3 of 15 | 0 of 15 |
| Rubric mean (blind grader) | 0.79 | 0.95 |
| Combined score | 0.88 | 0.98 |
| Mean time per answer | 13 s | 19 s |

Verdict: **pass** for adding and fixing project-level MCP configuration on the five tested tasks.
Failures seen: in 2 of 3 runs on one task it said "two syntax errors" while fixing three, and one
answer overstated what a GUI-launched Cursor can see. Not tested: starting real MCP servers, OAuth
sign-in, or vaguer requests. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/mcp-mechanic/evals).

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/clients.md](references/clients.md): configuration syntax per client, with sources and
  the date checked.
- [references/troubleshooting.md](references/troubleshooting.md): symptom, cause, check and fix table.
- [examples/requests.md](examples/requests.md): sample requests and what a good answer contains.
- [skill.json](skill.json): version, supported agents, permissions and the acknowledged scan finding.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only.

## Version history

See [CHANGELOG.md](CHANGELOG.md). Earlier versions were named `mcp-setup-assistant`.

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/mcp-mechanic
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
