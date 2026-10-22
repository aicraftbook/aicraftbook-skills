# Splitting a draft into claims

A claim is the smallest statement that a source could confirm or deny on its own. Splitting text into
small checkable facts is the approach used in research on factual precision (for example FActScore,
which breaks generated text into "atomic facts" and checks each against a knowledge source). Here the
only knowledge source is the documents the user gave you.

## The rules

1. **One fact per claim.** Split when parts could be independently true or false.
2. **Keep qualifiers with their fact.** Time, place, unit, currency, scope, population and hedges stay
   attached. "Revenue rose 12% in 2024" is one claim, not two: the year qualifies the rise.
3. **Keep the draft's words.** Write each claim as close to the draft's wording as possible, filling in a
   pronoun with what it refers to ("It opened in 2022" → "The Oslo plant opened in 2022").
4. **Make the implicit explicit.** Superlatives, comparisons, causes, "first", "only", "now", "new" and
   "since" all carry a checkable fact.
5. **Attributions are two claims when it matters.** "Lindqvist said growth will slow" checks both who
   said it and what was said. Text in quotation marks must match word for word (see matching.md).
6. **Do not split definitions or framing** that carry no fact ("In this report, 'small business' means
   fewer than 50 staff" is the author's definition, not a claim).

## Examples

| Draft sentence | Claims |
|---|---|
| Acme, founded in Berlin in 2015, raised $20M last year. | C1 Acme was founded in 2015. C2 Acme was founded in Berlin. C3 Acme raised $20M last year. |
| The tool cut support tickets by 30% because it answers billing questions. | C1 The tool cut support tickets by 30%. C2 The cut happened because it answers billing questions (cause). |
| Nearly half of the 1,200 respondents use AI daily. | C1 There were 1,200 respondents. C2 Nearly half of them use AI daily. |
| It is the largest solar farm in Spain. | C1 It is the largest solar farm in Spain (superlative: needs a passage that says so). |
| Dr Okafor, the lead author, called the result "a clear signal". | C1 Dr Okafor is the lead author. C2 Dr Okafor said "a clear signal" (exact words). |
| Prices start at €9 a month for up to 3 users. | C1 Prices start at €9 a month. C2 That plan covers up to 3 users. |

## Not claims (list under Not checked)

- Opinions and evaluations: "a smart move", "the best option for most teams".
- Recommendations and instructions: "You should back up first."
- Questions and rhetorical devices.
- The author's own plans and promises: "We will publish part two next week."
- Common connective text: "In short", "As a result" (the result itself may be a claim).

Pull facts out of opinions: "The best tool, used by 70% of teams" contains C1 "70% of teams use it".
An evaluation word inside a factual sentence ("a record 12% rise") makes the evaluation a claim too
("record" is a superlative).

## Numbering

Number claims C1, C2 … in draft order and note where each comes from (heading or paragraph number). When
one sentence yields several claims, keep them adjacent so a reader can see they share a sentence.
