# Rewrite patterns

Every rewrite keeps every fact. After each one, list the facts from the original and tick each one in
the rewrite. Placeholders mark what only the owner can supply.

## 1. Answer-first opening

Before:

> Choosing a heating system is one of the biggest decisions a homeowner makes. We've been in the
> business since 2009 and have seen it all. In this article we'll explore heat pumps. Heat pumps can work
> well in cold climates if they are sized correctly, and our customers in Vermont have used them down to
> -15°C.

After:

> Heat pumps can work well in cold climates if they are sized correctly. Our customers in Vermont have
> used them down to -15°C. We have been in business since 2009.

Facts kept: heat pumps can work in cold climates (with the condition "if sized correctly") ✓; Vermont
customers used them down to -15°C ✓; in business since 2009 ✓. Removed: scene-setting sentences with
no facts.

## 2. Generic heading to a question heading

Before: `## Overview` / `## More info` / `## Learn more`

After: `## How much does a parking permit cost?` / `## How long does approval take?` /
`## Where do I apply?`

Each new heading must match what its section actually answers. If a section answers two questions,
split it.

## 3. A section that relies on context

Before:

> ### Pricing
> As mentioned above, it starts at the same price as the previous plan, and the new tier adds SSO.

After:

> ### How much does Atlas Cloud cost?
> Atlas Cloud starts at the same price as the previous plan [ADD: the price, currency and billing
> period]. The new tier adds single sign-on (SSO).

Facts kept: starts at the same price as the previous plan ✓; new tier adds SSO ✓. The product is named
in full, the acronym is spelled out, and the missing price is a placeholder rather than a guess.

## 4. Unsourced statistic

Before:

> Heat pumps cut energy bills by 50%.

After (owner has a source):

> Heat pumps cut energy bills by 50% [ADD: source and date for the 50% figure, and which homes it
> applies to].

If the owner has no source, the rewrite still keeps the figure with the placeholder, and the Fixes table
says: "Source the 50% figure or remove it." Removing it is the owner's decision; do not write a softer
replacement claim for them, because that would be a new fact.

## 5. Opinion stated as fact

Before:

> This is the easiest permit to get in the region.

After:

> In our experience, this is the easiest permit to get in the region.

Facts kept: none changed; the sentence was an opinion and is now labelled as one. Flag that "easiest"
is a superlative with no source.

## 6. Facts locked in an image or table without text

Before: a price table as an image with the caption "See our prices".

After: the same table in HTML (or a list) with every row and column from the image, and alt text that
names what the image shows. If you cannot read the image, ask for the values; do not reconstruct them.

## 7. Dates and byline

Before: "Updated today" at the top; structured data says `"dateModified": "2026-06-01"`.

After: "Last updated [ADD: the real date of the last substantive change]" and the same date in
`dateModified`. Byline: "By [ADD: author name], [ADD: role]" linked to an author page if one exists.

Do not suggest moving the date forward unless the content really changed.

## What a rewrite must never do

- Add a number, name, date, source, quote, example or claim that is not in the original.
- Drop a hedge or condition ("if sized correctly", "may", "in most cases").
- Merge two facts into a new one ("50% savings in Vermont" when the page gives them separately).
- Change the author's position or recommendation.
