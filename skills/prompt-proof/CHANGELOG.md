# Changelog

## 1.0.2 (2026-10-22)

- Documentation only: README rewritten as a full reference (install per agent, permissions, examples, troubleshooting, test results). SKILL.md and references unchanged.

## 1.0.1 (2026-10-21)

- `references/failure-modes.md` §4 (injection): the "After" example no longer removes the author's
  `issue_refund` tool; it keeps the tool behind human approval, says that dropping it would be a change of
  intent, and adds stripping or escaping the closing tag (or JSON-encoding the value) before the customer
  text is inserted.
- `references/test-template.md`: the example prompt now states its priority rule for messages that fit
  more than one category, and test T4 checks for the category that rule gives.
- The evaluations ran on 1.0.0.

## 1.0.0 (2026-10-21)

- First draft. Six failure modes (ambiguity, conflicting rules, missing output contract, injection
  exposure, empty and unexpected input, over-long instructions) with before/after examples, impact levels,
  a fixed output format, and a test case template. Guidance checked against Anthropic, OpenAI and OWASP
  sources on 2026-10-21. Not yet evaluated.
