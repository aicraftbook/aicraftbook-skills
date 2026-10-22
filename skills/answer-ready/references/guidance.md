# Official guidance this skill relies on

Checked on 2026-10-21. Search engines change their guidance; if a source below says something different
today, the source wins. Cite these by name in the Basis column. Anything not covered here is
**Judgement**. No OpenAI or Perplexity guidance is used; fixes for them are Judgement.

## G1. Google: Creating helpful, reliable, people-first content

https://developers.google.com/search/docs/fundamentals/creating-helpful-content (page last updated 2026-10-05)

- Self-assessment questions ask whether content is original and complete, whether the title and main
  heading give a descriptive, helpful summary rather than an exaggerated one, and whether the page makes
  trustworthiness clear through sourcing, evidence of expertise, and information about the author or
  publisher. Easily verified factual errors are a warning sign.
- "Who, How, and Why": make it clear who created the content, with accurate bylines where readers expect
  them, linked to author background. Explain how content was produced, including automation or AI where
  readers would reasonably wonder. Fabricated authors or credentials are deceptive.
- Trust is the most important part of E-E-A-T (experience, expertise, authoritativeness,
  trustworthiness). E-E-A-T is not itself a ranking factor. Topics that affect health, financial
  stability, safety or society ("YMYL") get more weight on these signals.
- Do not change a page's date to look fresh when the content has not substantially changed. Google has no
  preferred word count.

## G2. Google: AI features and your website

https://developers.google.com/search/docs/appearance/ai-features (page last updated 2025-12-10)

- "There are no additional requirements to appear in AI Overviews or AI Mode, nor other special
  optimizations necessary." No special files or schema.org markup are needed.
- A page must be indexed and eligible to be shown with a snippet. Meeting the requirements does not
  guarantee it will be shown.
- Practices listed: allow crawling, internal links, good page experience, important content in text form,
  supporting images and video where relevant, structured data that matches the visible text.
- Controls: `nosnippet`, `data-nosnippet`, `max-snippet` and `noindex` limit or block use in these
  features.

## G3. Google: General structured data guidelines

https://developers.google.com/search/docs/appearance/structured-data/sd-policies (page last updated 2026-07-10)

- Do not mark up content that is not visible to readers. Structured data must be a true representation
  of the page content. Do not mark up irrelevant or misleading content.
- Use the most specific applicable schema.org type. Put markup on the page it describes.
- Google does not guarantee that structured data produces a rich result.

## G4. Google: byline dates and Article markup

- Byline dates: https://developers.google.com/search/docs/appearance/publication-dates (last updated
  2025-12-10). Show a visible date labelled, for example, "Published" or "Last updated". Use
  `datePublished` and `dateModified` in Article-type markup. Keep visible and structured dates
  consistent. Dates describe the page, not events in it.
- Article markup: https://developers.google.com/search/docs/appearance/structured-data/article (last
  updated 2026-09-08). No required properties. Include every author shown on the page; `author.name`
  holds only the name; add `url` or `sameAs`; use `Person` or `Organization`; ISO 8601 dates with a
  timezone.

## G5. Google: FAQ and HowTo rich results

https://developers.google.com/search/updates

- HowTo rich results were removed in September 2023. FAQ rich results were limited to well-known
  government and health sites in September 2023, deprecated in May 2026 and are no longer shown in Google
  Search (documentation removed June 2026).
- So FAQPage markup is not a route to a Google rich result. A visible Q&A section can still help readers
  and is judged on its content; recommend it only for questions the page really answers.

## M1. Microsoft Bing: Optimizing your content for inclusion in AI search answers

https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers
(Krishna Madhavan, Microsoft Bing, 8 October 2025)

- AI search assistants such as Copilot break pages into sections and assess them; the article says
  "These modular pieces are what get ranked and assembled into answers."
- Recommends descriptive H2 and H3 headings (not generic labels such as "Learn more"); concise one-to-two
  sentence answers that make sense when lifted out; lists, tables and Q&A blocks; questions phrased as
  people search with brief answers; structured data aligned with visible content; title, H1 and meta
  description consistent; specific, measurable details instead of vague claims.
- Warns against long walls of text, key answers hidden in tabs or expandable menus, core information only
  in PDFs, critical details only in images without alt text or HTML equivalents, and vague words such as
  "innovative".
- Says nothing guarantees selection; these practices improve eligibility.

## What no official source says

No source above promises that any content pattern earns rankings or citations. Claims elsewhere that a
specific word count, "citability score" or markup type gets pages cited are not official guidance. Do not
repeat them.
