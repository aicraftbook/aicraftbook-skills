# The four labels

Labels describe the relation between a claim and the sources. They say nothing about whether the claim
is true in the world.

| Label | Definition | Needs |
|---|---|---|
| **Supported** | A source passage states the claim, and every element (number, date, name, scope, certainty, cause) matches under the matching rules. | Verbatim quote with location |
| **Partly supported** | No element conflicts with a source, but at least one element is missing from the sources, or the claim is stronger, wider, more precise or more causal than the passage. | Verbatim quote, and the note names what is missing or overstated |
| **Contradicted** | A source passage states something incompatible with at least one element: a different number, date, name, place or direction, or the source denies it. | Verbatim quote of the conflicting passage |
| **Not found** | No passage in any source addresses the claim. | A note that every source was searched; the closest passage if any |

## Decision order

1. Find the best passage or passages.
2. If any element conflicts with a passage → **Contradicted**, even if the rest matches.
3. Else, if any element is missing or overstated → **Partly supported**.
4. Else → **Supported**.
5. If nothing addresses the claim → **Not found**.

Exception: when the sources disagree with each other (one passage matches the claim, another conflicts
with it), the label is **Partly supported**, not Contradicted. Quote both and list the disagreement in
Source notes (see matching.md, "When sources disagree").

## Outside knowledge

Outside knowledge never changes a label. A claim you know to be true but that no source states is
**Not found**. A claim you believe is false but that a source states is **Supported** (add "check
elsewhere" in the note if it matters). This keeps the check reproducible: anyone holding the same sources
reaches the same labels.

## Borderline cases

| Claim | Source passage | Label | Why |
|---|---|---|---|
| Walking lowers blood pressure. | "Participants who walked daily had lower average blood pressure than the control group." | Partly supported | Comparison between groups, stated as a general cause. |
| The study of 84 Europeans … | "84 adults in Denmark" | Partly supported | Scope widened from Denmark to Europe; no conflict, but more than the source says. |
| Revenue rose 21%. | "up 12%" | Contradicted | Different number. |
| Revenue rose about 12%. | "up 11.8%" | Supported | Rounds to 12 at the draft's precision (see matching.md). |
| Sales will grow in 2025. | "We expect sales to grow in 2025." | Partly supported | Expectation stated as certainty (hedge dropped). |
| Growth will accelerate in 2025. | "We expect growth to slow in 2025." | Contradicted | Opposite direction. |
| The plant opened in March 2022. | "The plant opened in 2022." | Partly supported | Draft is more precise than the source. |
| The plant opened in 2022. | "opened in March 2022" | Supported | Less precise but consistent. |
| Founded in 1889. | (no source mentions it; you know it is true) | Not found | Outside knowledge never upgrades. |
| It is the largest plant in Norway. | "our biggest plant" | Partly supported | Source supports "biggest of the company's plants", not in the country. |
| Maria Lindquist said … | "CEO Maria Lindqvist said …" | Partly supported | Same person, name misspelled: flag in Mismatches and correct the spelling. |
| Jan Berg, the CEO, said … | "CFO Jan Berg said …" | Contradicted | Role conflicts. |
| Each ticket costs about 34 euros. | "Tickets for 12 people cost 409.20 euros in total." | Supported | 409.20 / 12 = 34.10, about 34; show the calculation. |
| Costs fell because of the new supplier. | S1 "Costs fell in Q3." S2 "We changed supplier in Q2." | Partly supported | Both facts sourced; the cause is an inference across sources. |
| The tool has 2 million users. | S1 "2 million users", S2 "1.4 million users" | Partly supported | Sources disagree; quote both in Source notes. |

## Notes column

Keep notes short and specific: "hedge dropped: source says 'expect'", "scope: source says Denmark",
"inference across S1 and S2", "draft more precise than source", "check elsewhere".
