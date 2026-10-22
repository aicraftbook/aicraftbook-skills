# Cost Compass

Estimate what an AI feature or automation will cost to run. An AI Craftbook skill that estimates the monthly running cost of an AI feature, agent or automation from its workload, with every assumption, the arithmetic and a low-to-high range.

This plugin packages one AI Craftbook skill, `cost-compass` 1.0.2, for Claude Code and Cursor. It contains the skill's instructions and reference files only: no MCP servers, hooks, commands or scripts. The same skill is in [aicraftbook/aicraftbook-skills](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/cost-compass); both copies come from one approved release (fingerprint `d06782dd7c74`).

## Install

Claude Code:

```bash
claude plugin marketplace add aicraftbook/aicraftbook-skills
claude plugin install cost-compass@aicraftbook
```

Any agent supported by the Skills CLI:

```bash
npx skills add aicraftbook/aicraftbook-skills --skill cost-compass
```

## Who it is for

- Founders and product teams sizing an AI feature before building it.
- Automation builders checking whether a workflow is affordable at the target volume.
- Developers comparing two models, two designs or caching versus no caching.
- Consultants putting a running-cost range into a proposal.

## Permissions

- **files:** Reads its own reference files and any workload or usage file the user points at. Writes nothing unless the user asks for the estimate to be saved.
- **shell:** None. Bundles no scripts.
- **network:** None required. If the agent already has a web tool, it may read a pricing page the user names; the figures still need the user's confirmation.
- **mcp:** None.

## Limits

- The estimate is only as good as the workload numbers. Real token counts and volumes after launch can differ.
- It does not look up prices on its own. You supply them or confirm the figures from the provider's pricing page.
- Contract discounts, taxes, free tiers and currency conversion are included only if you describe them.
- Test results for this version: see the test results section.
- May not load when a cost question is phrased as a spreadsheet correction; the agent then answers without the skill's checklist.

## Troubleshooting

- **The agent does not use the skill.** Start a new session after installing, then make a request that matches the description below. In Claude Code, `/plugin` lists installed plugins.
- **Wrong version.** Compare `.claude-plugin/plugin.json` with the latest [release](https://github.com/aicraftbook/aicraftbook-skills/releases/tag/cost-compass-v1.0.2).
- **Something in the skill is wrong for your setup.** Open an issue: https://github.com/aicraftbook/aicraftbook-skills/issues/new/choose

When it loads: Estimates the monthly running cost of an AI feature, agent or automation from a description of its workload. Breaks the cost into model calls, input, output and cached tokens, and other paid services (search, embeddings, vector database, SMS, voice minutes, automation platform), shows every assumption and the arithmetic, gives a low / expected / high range, and names the two or three changes that would cut the cost most. Uses only prices the user gives or confirms from the provider's pricing page and never invents prices. Use when someone asks "how much will this cost to run", "estimate my API bill", "what will this agent cost per month", "is this automation affordable at 10,000 runs", or wants to compare the running cost of two designs or models.

Full guide, examples and test results: https://aicraftbook.com/skills/cost-compass?utm_source=claude&utm_medium=referral&utm_campaign=cost-compass

License: MIT. Security reports: https://github.com/aicraftbook/aicraftbook-skills/security
