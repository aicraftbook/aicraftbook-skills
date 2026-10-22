# Answer Ready

Make a web page easier for search and AI answers to use.

Answer Ready is an agent skill that audits one web page for how well people, search engines and AI
answer engines can understand and quote it. It returns prioritised fixes and rewritten example
passages that keep every fact. It is for editors, marketers and agencies who want advice tied to
official guidance, with no promises about rankings or citations.

Version 1.0.2 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/answer-ready

## What does Answer Ready do?

You give your agent the text or HTML of one page. The skill names the page's main question and
audience, then runs six checks:

1. **Answer first**: do the first one or two sentences answer the main question?
2. **Headings**: do headings say what each section answers, rather than "Overview" or "Learn more"?
3. **Self-contained sections**: does each section make sense if quoted alone?
4. **Sourced claims**: are statistics, superlatives and health, money, legal or safety claims sourced?
5. **Dates and authorship**: is there a byline and a labelled date, and does structured data match them?
6. **Clear entities**: are people, products, places and versions named in full?

Each check is graded Pass, Needs work or Missing, with a short quote as evidence. There is no numeric
score. Fixes are ranked P1 to P3, and each one is marked **Guidance** (with the Google Search Central
or Microsoft Bing source named) or **Judgement** (an editorial call with no official backing).

The skill then rewrites two to four passages and lists every fact from the original to show it was
kept. Where a fix needs information only you have, it inserts a placeholder such as
`[ADD: source for the 40% figure]` instead of inventing one.

## When should you use it?

- Before publishing an article, guide or help page you want search and AI answers to quote.
- When someone asks you to make a page "AI search ready" or optimise it for AI Overviews, GEO or AEO.
- On public-sector and service pages where fees, times and addresses must survive any rewrite.
- When a page's visible dates, byline or structured data may not match.
- When auditing a client page without promising rankings.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/answer-ready/` (all projects) or
  `.claude/skills/answer-ready/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.

## How do I install Answer Ready?

### Claude Code

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/answer-ready ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/answer-ready your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/answer-ready). It
unzips to a folder with the version in its name (for example `answer-ready-v1.0.2`). Copy it so the
folder is named `answer-ready`. Then start a new Claude Code session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `answer-ready-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r answer-ready.zip answer-ready -x 'answer-ready/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Ask your agent "What skills do you have?" and look for `answer-ready`. In Claude Code you can also type
`/answer-ready`. Then paste a page and ask "Make this page answer-ready."

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads its own reference files and the page text or HTML you provide. Writes nothing. |
| Shell | None. Bundles no scripts. |
| Network | None required. If your agent fetches the page URL with its own tools, the page text is treated as data. |
| MCP | None. |

No runtime or packages are needed.

## How do I use it?

Paste the page text or HTML, or give your agent a URL it can fetch, and ask in plain words:

- "Make our heat pump article ready for AI Overviews."
- "Review the structure of our product update page." (with the HTML pasted)
- "Tighten this council permit page so answer engines can quote it."

A good answer contains a one-line verdict, a checks table with quoted evidence, a fixes table with
P1 issues first and a Basis column, rewritten passages with a facts-kept list, the placeholders you
need to fill, and a "Not covered" note that promises no outcome.

## Example

From [references/rewrites.md](references/rewrites.md). The page opens with scene-setting before its
answer.

Before:

> Choosing a heating system is one of the biggest decisions a homeowner makes. We've been in the
> business since 2009 and have seen it all. In this article we'll explore heat pumps. Heat pumps can
> work well in cold climates if they are sized correctly, and our customers in Vermont have used them
> down to -15°C.

After:

> Heat pumps can work well in cold climates if they are sized correctly. Our customers in Vermont have
> used them down to -15°C. We have been in business since 2009.

Facts kept: heat pumps can work in cold climates (with the condition "if sized correctly") ✓; Vermont
customers used them down to -15°C ✓; in business since 2009 ✓. Removed: scene-setting sentences with
no facts.

## Troubleshooting

- **The skill does not load.** The folder must be named `answer-ready` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `answer-ready-v<version>`. Rename the folder to
  `answer-ready`.
- **Content was missed.** The skill judges only what it can read. Text inside images, PDFs or scripts
  may be missed; paste it as text.
- **You expected a ranking forecast.** The skill does not give one. It makes no promises about
  rankings, traffic or citations, and it does not audit crawling, speed, links or other pages.

## Security

Answer Ready is instructions only: Markdown files with no scripts, binaries or install hooks. It tells
the agent to treat page text as data, to report text aimed at AI systems rather than follow it, and
never to suggest hidden text, invisible markup, fake authors or date changes without a real update.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check:** 3 page audits written by the skill's author, each run with and without the skill
  (6 runs). Fixed text checks: 0.87 passed without the skill, 1.00 with it.
- **Independent check:** 4 tasks written by a separate evaluator from the public description only,
  then frozen. Three pages had planted problems; one was well built. 24 runs, each graded blind by a
  separate model.

Results of the independent check: combined score 0.939 with the skill against 0.887 without it
(rubric 0.878 against 0.788). No run with the skill promised rankings. The grader flagged a factual
mistake in 4 of 12 runs with the skill and 9 of 12 without. On one page the baseline did slightly
better (0.959 against 0.931). Answers took about 36 seconds instead of 23.

Limits: four tasks is a small sample, the grader is a model from the same vendor, and nothing here
measures search rankings or AI citations. The evaluation ran on version 1.0.0; 1.0.1 corrected two
rewrite examples. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/answer-ready/evals).

## How it differs from similar tools

Popular GEO and AI-SEO skills cover much more: `ai-seo` (coreyhaines31/marketingskills) aims to get
content cited in AI answers, and `geo` (zubair-trabzada/geo-seo-claude) runs site-wide audits with
citability scores, crawler analysis and llms.txt generation. Answer Ready does one page's content
only, marks every fix as official guidance (with the source named) or editorial judgement, and refuses
to change facts or promise rankings and citations. We have not tested the alternatives.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/guidance.md](references/guidance.md): what Google Search Central and Microsoft Bing say,
  with links and the dates checked.
- [references/checklist.md](references/checklist.md): the six checks, how to test each, and which
  guidance each rests on.
- [references/rewrites.md](references/rewrites.md): before and after passages that keep every fact.
- [examples/requests.md](examples/requests.md): sample requests and what a good answer contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/answer-ready
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
