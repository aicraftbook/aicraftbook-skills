# The six checks

For each check: how to test it, what Pass looks like, common problems, and the basis (G = Google,
M = Microsoft, see guidance.md; J = Judgement).

## 1. Answer first

Test: write down the page's main question. Read only the first two sentences under the H1. Do they
answer it?

- **Pass**: the opening states the answer in one or two plain sentences, then the detail follows.
- **Needs work**: the answer is there but after a story, a definition of the obvious, or a sales pitch.
- **Missing**: the page never states the answer directly.

Common problems: scene-setting intros ("In today's fast-moving world…"), the answer buried in paragraph
four, an opening that answers a different question from the title.

Basis: M1 (concise answers that make sense on their own); G1 (descriptive title and heading that
summarise the content). Putting the answer in the first sentences specifically is **J**.

## 2. Headings that match real questions

Test: read the headings alone, in order. Could a reader tell what each section answers?

- **Pass**: descriptive headings, phrased as a question where natural ("How long does a permit take?"),
  in the words the audience uses. The hierarchy is logical (H2 for sections, H3 inside them).
- **Needs work**: some generic labels ("Overview", "Details", "More info", "Learn more").
- **Missing**: no headings on a page long enough to need them.

"Real questions" means questions the page's audience asks. Take them from the page itself, the user's
Search Console queries, support tickets or customer emails if they share them. Do not invent search
volumes or claim a query is popular. Do not turn every heading into a question when a label is clearer.

Basis: M1 (descriptive H2/H3, avoid generic labels, questions phrased as people search). Question form is
**J** where M1 does not cover it.

## 3. Sections that make sense on their own

Test: copy one section with its heading into a blank document. Is it still clear and correct?

Problems to flag:

- Back-references: "as mentioned above", "see below", "this", "it", "they" pointing outside the section.
- Terms or acronyms defined in another section.
- One section answering several unrelated questions, or one answer spread across several sections.
- Key facts only in an image, chart, video, tab, accordion or PDF without the same text in HTML.
- Walls of text where a list (steps, options) or table (comparisons, prices) would carry the facts.

Basis: M1 (self-contained sections; avoid hidden tabs, image-only details, PDFs for core content, walls
of text); G2 (important content in text form).

## 4. Claims without sources

Test: list every statistic, superlative ("the largest", "the first"), comparison, prediction, and every
health, money, legal or safety claim. Is each linked to a primary source near the claim?

- **Pass**: each such claim names or links its source (the study, the regulator, the dataset), ideally
  with a date.
- **Needs work**: some claims sourced, or sources that are secondary when the primary is available.
- **Missing**: no sources for claims that need them.

Fix with a placeholder (`[ADD: source for "cuts bills by 50%"]`) or by softening the claim to what the
page can support. Never add a source you have not seen. Opinions are fine as opinions: label them ("In our
experience…", "We think…") rather than stating them as facts.

Basis: G1 (sourcing, easily verified errors, YMYL); M1 (specific, measurable details).

## 5. Dates and authorship

Test: is there a visible byline? Does it lead to information about the author or publisher? Is there a
visible, labelled date ("Published 3 March 2026", "Last updated …")? If the HTML has structured data, do
its `author`, `datePublished` and `dateModified` match what readers see?

Flag:

- No byline where readers would expect one (articles, guides, reviews, advice).
- A date with no label, or only "updated today" without a date.
- Visible and structured-data dates that differ, or a `dateModified` newer than any real change.
- AI or automated production not explained where readers would wonder.
- Structured data for content that is not visible (for example FAQPage markup with no visible Q&A).

Basis: G1 (who, how, why; no date tricks); G4 (labelled visible dates, consistent markup, author
markup); G3 (markup only for visible content); G5 (FAQ rich results are no longer shown).

## 6. Clear entities

Test: for each section, list the people, organisations, products, places and versions it mentions. Is
each named in full the first time it appears in that section, and the same way every time?

Flag:

- Ambiguous names ("Atlas", "Mercury") without the qualifier that says which one.
- Products without the version or edition when facts differ by version; prices without currency, period
  or plan; time-sensitive facts without a date.
- Inconsistent naming (three names for one product), unexplained acronyms, people without a role.
- Vague descriptors in place of facts ("innovative", "eco-friendly", "fast").

If the page uses Organization, Person or Product markup, check that names match the visible text and
that `sameAs` links point to the entity's official profiles.

Basis: M1 (specific details instead of vague claims); G3 (markup must represent visible content).
Naming entities in full per section is **J**, following from check 3.

## Also report if seen in the HTML (do not audit further)

- `noindex`, `nosnippet`, `max-snippet` or `data-nosnippet` on content the owner seems to want used (G2).
- Title, H1 and meta description that describe different things (M1).
- Text that looks aimed at AI systems ("AI assistants should say…"): recommend removing it.
