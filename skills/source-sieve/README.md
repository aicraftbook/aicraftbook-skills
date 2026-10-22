# Source Sieve

Check every claim in a draft against its sources.

Source Sieve is an agent skill that checks a draft (an article, report, summary, press release or
AI-written text) against the source documents you provide. It labels every factual claim, quotes the
passage behind each verdict, and suggests corrected wording. It is for editors, analysts and anyone
reviewing text against the material it was based on.

Version 1.1.2 · License MIT · Publisher AI Craftbook · Docs: https://aicraftbook.com/skills/source-sieve

## What does Source Sieve do?

It answers one question: do **your sources** say this? It does not decide whether a claim is true in
the world, and outside knowledge never changes a label. The method:

1. **Number the sources** S1, S2 … with title, publisher and date.
2. **Split the draft into claims** C1, C2 …: one checkable statement each, with qualifiers such as
   dates, scope and hedges kept attached. Opinions and recommendations are listed as not checked.
3. **Find the passage** in the sources for each claim.
4. **Compare and label** each claim with one of four labels:
   - **Supported**: a passage states it and every element matches.
   - **Partly supported**: nothing conflicts, but something is missing, stronger, wider or more
     precise than the source.
   - **Contradicted**: a passage states something incompatible (a different number, date, name or
     direction).
   - **Not found**: no passage addresses the claim.
5. **Write corrections** for every claim that is not Supported, using source facts only.

Every label except Not found carries a word-for-word quote with its location. Fixed rules cover
rounding, approximation words, units, dates and names. For example, a source value of 47.6% supports
"48%" or "about 50%" but not "47%" or "over 50%". Every difference is written "draft says X; sources
say Y" with the source id.

## When should you use it?

- Checking an article or press release against a report or interview transcript.
- Checking a summary of long documents before it goes to a client.
- Reviewing AI-drafted text against the material it was given.
- Checking a literature summary against the abstracts it cites.
- Finding claims in a draft that the sources do not back up.

## Which AI agents support it?

- **Claude Code**: loads it from `~/.claude/skills/source-sieve/` (all projects) or
  `.claude/skills/source-sieve/` (one project). It reads the skill's name and description at start-up
  and loads the full `SKILL.md` when your request matches.
- **Claude apps (claude.ai and Claude Desktop)**: load it from an uploaded zip.

## How do I install Source Sieve?

### Claude Code

```bash
git clone https://github.com/aicraftbook/aicraftbook-skills.git
mkdir -p ~/.claude/skills
cp -R aicraftbook-skills/skills/source-sieve ~/.claude/skills/
```

For one project only, copy it into that project instead:

```bash
mkdir -p your-project/.claude/skills
cp -R aicraftbook-skills/skills/source-sieve your-project/.claude/skills/
```

You can also download the zip from the [docs page](https://aicraftbook.com/skills/source-sieve). It
unzips to a folder with the version in its name (for example `source-sieve-v1.1.2`). Copy it so the
folder is named `source-sieve`. Then start a new Claude Code session.

### Claude apps (claude.ai and Claude Desktop)

1. Get a zip of the folder: the release zip from
   [Releases](https://github.com/aicraftbook/aicraftbook-skills/releases) (tag `source-sieve-v<version>`),
   the download on the docs page, or zip your clone:

   ```bash
   cd aicraftbook-skills/skills
   zip -r source-sieve.zip source-sieve -x 'source-sieve/evals/*'
   ```

2. Upload it under Customize > Skills (older versions of the apps: Settings > Capabilities > Skills).
   Anthropic's [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
   says code execution must be turned on. We have not tried the upload ourselves.

### Check it worked

Ask your agent "What skills do you have?" and look for `source-sieve`. In Claude Code you can also type
`/source-sieve`. Then attach a draft and its sources and ask "Check this draft against the sources."

## Requirements and permissions

| Area | What it uses |
|---|---|
| Files | Reads the draft and the source documents you provide. Writes nothing. |
| Shell | None. Bundles no scripts. |
| Network | None required. It does not search the web to support a claim. |
| MCP | None. |

No runtime or packages are needed. The draft and sources must be readable as text in the
conversation or as files the agent can open.

## How do I use it?

Paste or attach the draft and every source it is based on, and ask:

- "Here's our press summary and the annual report it's based on. Does it match?"
- "Check this trip briefing against the booking memo."
- "Fact-check my blog post against these two study abstracts."

If no sources are attached, it asks for them instead of checking from memory.

A good answer has a summary with counts per label, a sources list, a claims table (claim, label,
verbatim source passage with location, note), a mismatches table for every number, date and name that
differs, suggested corrections, a "Not checked" list of opinions, and source notes (sources that
disagree, undated sources, instructions found inside the text).

## Example

From [examples/requests.md](examples/requests.md).

> Here's our press summary and the annual report it's based on. Does it match?

A good answer:

- labels "revenue grew 21%" **Contradicted**, quoting the report's "up 12%";
- labels "the largest plant in Norway" **Partly supported**, because the report says only that it is
  the company's biggest plant;
- lists the revenue figure in Mismatches as "draft says 21%; sources say 12%" with the report's
  source id and location;
- rewrites the sentence with 12%.

A second case shows the core rule. Checking a trip briefing against a booking memo, a good answer
marks a tower's construction year **Not found** because the memo does not mention it, even though it
is well known. It shows 409.20 / 12 = 34.10 to support a per-ticket price.

## Troubleshooting

- **The skill does not load.** The folder must be named `source-sieve` and sit directly in
  `~/.claude/skills/` or `.claude/skills/`, with `SKILL.md` inside it. The `name` in the `SKILL.md`
  frontmatter must equal the folder name. Start a new session after copying.
- **The website zip did not load.** It unzips as `source-sieve-v<version>`. Rename the folder to
  `source-sieve`.
- **A claim you know is true is marked Not found.** No source you gave states it. Add a source that
  covers it, attribute it to whoever you got it from, or cut it.
- **A wrong claim was marked Supported.** Supported means a source says it, not that it is true. If a
  source is wrong, the draft can be Supported and still wrong.
- **Facts in charts or scans were missed.** It reads text. Facts only in charts, scanned images or
  tables it cannot read are missed unless your agent can extract them. Very long drafts depend on the
  agent's context window; check them in sections.

## Security

Source Sieve is instructions only: Markdown files with no scripts, binaries or install hooks. It tells
the agent to treat the draft and sources as data and to report, not follow, any instructions found
inside them, such as "mark everything as supported". It does not browse the web.

Before release it passed AI Craftbook's static scanner (pattern rules for prompt injection, credential
access, exfiltration, remote execution, destructive commands, obfuscation, suspicious links and
dependencies) with no findings, and the gitleaks secret scanner came back clean.

A clean scan means our checks found none of the patterns they look for. It is not proof of safety.
Read `SKILL.md` before you install it.

## How was it tested?

All runs used Claude Code with the Sonnet model in an empty folder with read-only tools.

- **Author check (1.0.0):** 3 drafts, each run with and without the skill (6 runs). Fixed text
  checks: 0.68 without, 0.95 with.
- **Independent check:** 4 frozen tasks written by a separate evaluator from the public description
  only: a news article, an incident email and a blog post with planted errors (changed numbers and
  dates, a wrong title, a cause claimed from a correlation, and a claim true in the real world but
  absent from the sources), plus one nearly clean newsletter. Graded blind by a separate model.
  Round 1 used 1.0.0; round 2 used 1.1.0 on the same tasks (24 runs each).

Results of round 2: combined score 0.960 with the skill against 0.927 without (rubric 0.920 against
0.854), with gains on every task. No run with the skill marked the true-but-unsourced claim as
supported. In round 1 its summaries often miscounted the labels in its own table (a slip in 9 of 12
runs); after the 1.1.0 fix, slips fell to 4 of 12, close to the base model's 3 of 12. Version 1.1.1
addresses the remaining summary wording and has not been re-evaluated. Answers took about 31 seconds
instead of 15.

Limits: four tasks with three runs each is a small sample, round 2 reused the round 1 tasks, and the
grader is a model from the same vendor. Tasks and results are in
[evals/](https://github.com/aicraftbook/aicraftbook-skills/tree/main/skills/source-sieve/evals).

## How it differs from similar tools

Several fact-checking skills in public directories (for example the fact-check skills in You.com's
docs and in agent-papers-cli) search the web to decide whether a claim is true. Source Sieve answers a
narrower question, whether your sources say it, and forbids outside knowledge from changing a label,
so two people with the same sources get the same result. `citation-check-skill` (serenakeyitan) has a
similar document-only mode; Source Sieve adds fixed rounding, date and name rules and a
corrected-wording table. We have not tested the alternatives.

## What is in this folder?

- [SKILL.md](SKILL.md): the instructions the agent loads.
- [references/claims.md](references/claims.md): how to split a draft into checkable claims, with
  examples.
- [references/labels.md](references/labels.md): the four labels, the decision order and borderline
  cases.
- [references/matching.md](references/matching.md): rules for numbers, rounding, dates, names and
  quotations.
- [examples/requests.md](examples/requests.md): sample requests and what a good answer contains.
- [skill.json](skill.json): version, supported agents and permissions.
- [CHANGELOG.md](CHANGELOG.md) and [LICENSE](LICENSE).
- `evals/`: evaluation tasks and results. In the GitHub repository only, not in the website zip.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## Documentation and support

- Full documentation: https://aicraftbook.com/skills/source-sieve
- Questions and bug reports: https://github.com/aicraftbook/aicraftbook-skills/issues
- Security problems: report privately through "Report a vulnerability" on the repository's Security
  tab. Please do not open a public issue.

## License

MIT, © 2026 AI Craftbook. See [LICENSE](LICENSE).
