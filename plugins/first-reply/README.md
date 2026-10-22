# First Reply

Draft the first reply to a new real-estate lead. An Agent Skill that drafts a first SMS and email to a new real estate lead from the lead's own fields, for you to review and send.

This plugin packages one AI Craftbook skill, `first-reply` 1.2.0, for Claude Code and Cursor. It contains the skill's instructions and reference files only: no MCP servers, hooks, commands or scripts. They are byte-identical to the [released skill](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/first-reply) (release fingerprint `6b3dcf7ff0f4`); its README, changelog and test results are there.

## Install

Add it from Anthropic's plugin directory once listed, or in Claude Code run `/plugin marketplace add aicraftbook/aicraftbook-skills`, then `/plugin install first-reply@aicraftbook`. Other agents: see the [install guide](https://aicraftbook.com/skills/first-reply#install).

## Who it is for

- Paste a portal email or form submission and get a reply to send from your phone.
- Ask your agent to draft replies for today's new HubSpot leads (with an MCP connection), then review them.
- Produce JSON drafts to feed another tool.
- Check what the automated [n8n workflow](https://aicraftbook.com/automations/lead-follow-up-n8n) would send before you switch it on.

## Permissions

- **files:** Reads only what the user pastes or points to.
- **shell:** None. Bundles no scripts.
- **network:** None.
- **mcp:** Can use a CRM MCP server the user has connected, to list new leads; never sends messages.

## Limits

- Drafts only. It does not send, schedule or log messages.
- The agent does not count SMS characters; check long texts with a counter before sending.
- Assumes US texting conventions and an English opt-out line.
- Not legal advice. You remain responsible for consent and fair housing compliance.
- Not yet tested by us in every listed client.
- Test results for this version: see the test results section.
- Lead data (names, phone numbers, messages) passes through the agent's context; the skill stores and sends nothing itself.

## Troubleshooting

- **The agent does not use the skill.** Start a new session after installing, then make a request that matches the description below. In Claude Code, `/plugin` lists installed plugins.
- **Wrong version.** Compare `.claude-plugin/plugin.json` with the latest [release](https://github.com/aicraftbook/aicraftbook-skills/releases/tag/first-reply-v1.2.0).
- **Something in the skill is wrong for your setup.** Open an issue: https://github.com/aicraftbook/aicraftbook-skills/issues/new/choose

When it loads: Drafts the first SMS and email reply to a new real estate lead from the lead's own form fields, for a human to review before sending. Use when the user pastes or points to a new buyer or renter enquiry (name, listing address, message, source) and wants a first reply, or asks to draft follow-ups for new leads in their CRM. Does not send messages.

Full guide, examples and test results: https://aicraftbook.com/skills/first-reply?utm_source=claude&utm_medium=referral&utm_campaign=first-reply

License: MIT. Security reports: https://github.com/aicraftbook/aicraftbook-skills/security
