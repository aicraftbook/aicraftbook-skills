# Example requests

Illustrative. Recorded test runs are in `../evals/`.

1. "Review this: form → webhook → LLM writes a reply → text and email the lead → log everything to a
   shared sheet." A good review rates the unchecked customer-facing send and the duplicate webhook
   risk as blockers, flags the shared sheet of personal data and SMS consent, and gives a cost formula.
2. "Our support agent can refund up to $500 per call and runs unattended." A good review names prompt
   injection through inbound email as a blocker and recommends approval, a restricted key and caps.
3. "Five agents in a chain build our daily news digest." A good review replaces the category agent with
   a lookup and the formatting agent with a template, and adds a failure alert.
