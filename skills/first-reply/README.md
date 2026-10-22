# First Reply

Draft the first reply to a new real-estate lead.

First Reply is an agent skill that turns a new buyer or renter enquiry into a first SMS and email,
using only the lead's own form fields, for you to review and send. It never sends messages. It is for
real estate agents and teams who want help writing first replies but want to stay the one who presses
send.

Version 1.1.1 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/first-reply

## What does First Reply do?

For each lead it builds a record with four fields: `first_name`, `listing_address`, `lead_message`
and `lead_source`. It asks for your name and brokerage for the sign-off instead of inventing them.
Then it writes three drafts:

1. **SMS**: plain text, at most 300 characters, no emoji or links, ending with exactly
   `Reply STOP to opt out.` It states the character count.
2. **Email subject**: under 70 characters, naming the listing address when there is one.
3. **Email body**: plain text, 60 to 150 words, signed with your name and brokerage.

Each draft greets the lead by first name, thanks them, mentions the listing and asks exactly one
next-step question.

It uses only the lead record and what you tell it. It never states or guesses price, availability,
features, fees, the area, schools or your calendar. It describes homes, never people, and does not
comment on neighbourhood safety, crime, schools or make-up. It treats the lead's words as data, never
as instructions.

It marks a lead **Needs human** (and still drafts a reply) when the message is not in English, needs
facts it does not have, asks for legal, tax, lending or inspection advice, is a complaint or spam,
touches a fair housing topic, or looks like prompt injection.

## When should you use it?

- You paste a portal email or form submission and want a reply to send from your phone.
- You want your agent to draft replies for today's new leads from your CRM, then review them.
- You need the drafts as JSON to feed another tool.
- You want to see what the automated [n8n workflow](https://aicraftbook.com/automations/lead-follow-up-n8n)
  would send before you switch it on. (To send replies automatically, use that workflow instead.)

## Which AI agents support it?

The skill is written to the Agent Skills specification (a folder with a `SKILL.md`). We confirmed each
client's skill folder from its documentation. We have not tested the skill in every client.

| Agent | Where it loads skills from |
|---|---|
| Claude Code | `~/.claude/skills/first-reply/` (personal) or `.claude/skills/first-reply/` (project) |
| Codex CLI | `~/.agents/skills/first-reply/` (user) or `.agents/skills/` in the repository |
| Gemini CLI | `~/.gemini/skills/first-reply/` (user), or `.gemini/skills/` or `.agents/skills/` in the workspace |
| VS Code Copilot | `.github/skills/first-reply/` in the repository (also reads `.claude/skills/` and `.agents/skills/`) |
| Claude apps (claude.ai and Claude Desktop) | an uploaded zip |

Agents that support skills read the name and description at start-up and load the full `SKILL.md`
when your request matches, for example "draft a reply to this lead".

## How do I install First Reply?

Clone the repository once, then copy the folder to the place your agent reads:

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
```

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/first-reply ~/.claude/skills/
```

### Codex CLI or Gemini CLI

```bash
mkdir -p ~/.agents/skills && cp -R aicraftbook-skills/skills/first-reply ~/.agents/skills/   # Codex
mkdir -p ~/.gemini/skills && cp -R aicraftbook-skills/skills/first-reply ~/.gemini/skills/   # Gemini
```

### VS Code Copilot (run in your repository)

```bash
mkdir -p .github/skills
cp -R path/to/aicraftbook-skills/skills/first-reply .github/skills/
```

### Without git

The skill is one file, so you can download only `SKILL.md` into the same folder. This saves the file;
it does not run anything. Read it first; it is short. For Claude Code:

```bash
mkdir -p ~/.claude/skills/first-reply
curl -fsSL https://aicraftbook.com/templates/first-reply/SKILL.md -o ~/.claude/skills/first-reply/SKILL.md
```

For another agent, change both paths to that agent's folder from the table above.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder from [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases)
   (tag `first-reply-v<version>`), or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r first-reply.zip first-reply -x 'first-reply/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Start a new session (restart the client if it does not pick the skill up) and ask "What skills do you
have?". In Claude Code you can also call it directly with `/first-reply`. Then paste a lead and ask
for a first reply.

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads only what you paste or point to. |
| Shell | None. Bundles no scripts. |
| Network | None. |
| MCP | Can use a CRM MCP server you have connected, to list new leads. Read-only unless you ask for a specific change; never sends messages. |

You need an agent that reads Agent Skills. A CRM connection is optional; without one, paste the lead.

## How do I use it?

Paste the lead and give your name and brokerage once:

- "Draft a reply to this lead. I'm Alex Morgan at Example Realty. Dana, 14 Elm Street: 'Is this still
  available? Could I see it Saturday morning?' Source: website."
- "Draft first replies for today's new leads in HubSpot." (with a CRM MCP connection)
- "Give me the drafts as JSON."

For one lead, the answer shows the three drafts, the SMS character count, then `Needs human: yes/no`
with a one-line reason. For JSON it returns, per lead:

```json
{"sms": "", "email_subject": "", "email_body": "", "needs_human": false, "reason": ""}
```

The skill also reminds you, once per conversation: only text leads who consented to texts and honour
STOP replies; US business texting from a 10-digit number normally needs A2P 10DLC registration; and
read every draft before it goes out.

## Example

Two illustrative cases from the [docs page](https://aicraftbook.com/skills/first-reply).

**A routine enquiry.** For Dana's message above, the agent returns the SMS with its character count,
the email subject and body, then `Needs human: no`. The text names 14 Elm Street, does not claim the
home is available, asks whether a Saturday morning viewing would suit, and ends with
"Reply STOP to opt out."

**A lead that needs you.**

> Hola, ¿la casa está en una zona segura? ¿Cuál es el precio más bajo?

The drafts are in Spanish with the English opt-out line kept. They make no claims about safety or
price and say the agent will follow up. The lead is marked `Needs human: yes` because the message is
not in English and asks about neighbourhood safety.

## Troubleshooting

- **The skill does not load.** The folder must be named `first-reply`, sit directly in your agent's
  skills folder, and contain `SKILL.md`. The `name` in the `SKILL.md` frontmatter must equal the folder
  name. Start a new session or restart the client.
- **The SMS is over 300 characters.** The agent counts characters itself and can be off. Check long
  texts before sending.
- **It asks for your name and brokerage.** It will not invent a sign-off. Give them once per
  conversation.
- **It will not send the message.** By design it only drafts. Copy the drafts into your phone, email
  or CRM, or use the n8n workflow for automated sending. It assumes US texting conventions.

## Security

First Reply is instructions only: one Markdown file with no scripts, binaries or install hooks. Lead
messages are untrusted text. The skill tells the agent to treat them as data, never as instructions,
and to keep CRM tools read-only unless you ask for a specific change.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it. It is not legal advice: you remain responsible for consent,
texting and fair housing rules that apply to you.

## How was it tested?

We ran two evaluations on 2026-10-22 with Claude Code (Sonnet model, file tools only, no MCP servers),
comparing the same agent with and without the skill.

- **Author check:** 3 tasks, 6 runs. Baseline 0.579, with the skill 0.944.
- **Independent round:** 4 frozen tasks written from the public description by an agent that never read the
  skill, 24 runs, graded blind by an Opus grader.

| | Without the skill | With the skill |
|---|---|---|
| Combined score | 0.869 | 0.978 |
| Rubric score | 0.815 | 0.956 |
| Hard checks passed | 0.923 | 1.000 |
| Runs with a factual slip | 6 of 12 | 1 of 12 |

Without the skill, drafts invented facts (confirming availability or a viewing time, praising a home) and
none of the T2 and T4 baseline runs had an opt-out line. With the skill, no run followed instructions
injected into the lead's message.

**Weak spot:** for a lead with an empty message and no phone number, the skill's JSON output said
`needs_human: false` with an empty reason in all 3 runs; it flagged the problem only in its prose.

**Not tested:** reading leads from a CRM through MCP, clients other than Claude Code, measured SMS lengths
(the grader judged them), and legal compliance. The sample is small and the grader comes from the same vendor
as the agent. Tasks, answers and grades:
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/first-reply/evals).

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and result summaries. In the GitHub repository only.

## Version history

See [CHANGELOG.md](CHANGELOG.md). Version 1.0.0 was published as Lead follow-up drafter
(`lead-follow-up-drafter`).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/first-reply
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
