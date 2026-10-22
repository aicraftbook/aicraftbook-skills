# Matching numbers, dates, names and quotations

Every mismatch found with these rules goes in the Mismatches table, even when the label is only
Partly supported.

## Numbers

- **Exact for counts, money, identifiers and quoted figures** unless the draft signals approximation.
- **Precision decides rounding.** A draft number is supported when the source value rounds to it at the
  draft's precision: source 47.6% → draft "48%" or "about 50%" is supported (50 is the source rounded to
  tens); source 47.6% → "47%" is contradicted (wrong rounding).
- **Approximation words.** "About", "around", "roughly", "some": the rounding rule above. "Nearly",
  "almost", "just under": the source value is below the draft value and rounds to it. "More than",
  "over", "at least": the source value is above (or, for "at least", equal to) it. "Up to": the source
  gives that value as the maximum. A threshold word on the wrong side ("over 50%" for 47.6%) is
  Contradicted.
- **Units and scale must match**: million vs billion, per month vs per year, gross vs net, nominal vs
  inflation-adjusted, fiscal vs calendar year, kW vs kWh.
- **Percent vs percentage points**: a rise from 10% to 12% is 2 percentage points or 20%. Writing "2%"
  for it is Contradicted.
- **Currency**: no conversions from outside rates. A converted figure the sources do not give is Not
  found (or Partly supported if the original amount is sourced).
- **Derived figures**: arithmetic on source figures (totals, per-unit amounts, growth rates) is allowed.
  Show the calculation in the note and apply the rounding rule to the result.
- **Words and numerals are equal**: "a dozen" = 12, "half" = 50%, "a third" = 33.3%.

## Dates and times

- Match at the precision the draft states. Draft less precise but consistent ("2022" for "March
  2022"): Supported. Draft more precise ("March 2022" for "2022"): Partly supported.
- **Relative dates** ("last year", "recently", "now") are resolved against the source's own date. If the
  source has no date, say so in Source notes and label at most Partly supported.
- **Ambiguous formats** such as 03/04/2024 (3 April or 4 March): note the ambiguity rather than guessing.
- **Event date vs publication date**: a source published in 2024 about a 2021 event supports 2021.
- **Durations**: "a 12-week trial" vs "three months" is Partly supported (close, not the same).

## Names

- People, organisations, products, places and titles must match the source spelling. A misspelling of
  the same entity: Partly supported, and the correction goes in Mismatches.
- A different entity (another person, a parent company instead of a subsidiary, a different product
  version) is Contradicted.
- **Roles and titles** are part of the claim: CEO vs CFO, "lead author" vs "co-author".
- **Acronyms**: accept a standard acronym only if the source uses it or spells it out next to it.

## Quotations

- Words inside quotation marks must match the source exactly, apart from `…` for omissions and square
  brackets for clarifying insertions. A paraphrase inside quotation marks is Partly supported; suggest
  removing the quotation marks or using the exact words.
- The speaker and, where given, the occasion must match.
- A quote taken out of a qualifying context ("If prices hold, we expect growth") loses its condition:
  Partly supported.

## When sources disagree

Quote both passages, label the claim Partly supported, and list the disagreement in Source notes. Do not
decide which source is right; the user knows which one is authoritative.
