# Review checklist

Use the questions that apply. Skip the rest. A design does not need every item; it needs the items that
match its risk.

## Severity

| Severity | Meaning | Examples |
|---|---|---|
| Blocker | Harm, data loss, wrong customer-facing output, security exposure or runaway cost is likely | Model sends email to customers with no check; untrusted email text reaches an agent that can send money; retries with no limit on a paid API |
| Major | Failures or manual clean-up at normal volume | No duplicate handling on a webhook that retries; no alert when the workflow fails |
| Minor | Good practice, not urgent | Prompt not versioned; logs keep more fields than needed |

## 1. Fit

- Could a rule, regular expression, lookup table or template replace a model step?
- Is an "agent" (model choosing tools in a loop) used where a fixed sequence would do?
- Is the model asked to do arithmetic, date handling or lookups that code does reliably?

## 2. Reliability

- What happens when each external call fails? Retry with backoff and a maximum? Then what?
- Can the trigger fire twice for one event (webhook retries, polling overlap)? Is there an idempotency key or a "processed" check before side effects?
- Are there timeouts on model and API calls?
- If step 4 of 6 fails, are steps 1 to 3 safe to repeat? Is partial state cleaned up or resumed?
- Where do failed events go (error branch, dead-letter queue, failure log) and who looks at them?
- Rate limits: does volume or bursts exceed a service's limits?

## 3. Model output handling

- Is the output parsed against a schema or a fixed set of allowed values before use?
- What happens on empty, malformed, truncated or refused output?
- Are confidence or "unsure" outcomes routed to a person?
- Is the model ever the only check before an irreversible action?

## 4. Human approval

- Which actions are irreversible or customer-facing? Does a person approve them, at least at first?
- Is there a way to move from approve-every-item to spot checks once it proves itself, with a measure that decides when?

## 5. Prompt injection and permissions

- Which inputs are untrusted (inbound email, web forms, scraped pages, uploaded documents, tool results)?
- Can untrusted text reach a model that can call tools, send messages, change records or browse?
- Are instructions and untrusted data kept separate in the prompt, and is the model told to treat the data as data? (This reduces risk; it does not remove it.)
- Do credentials have only the scopes the workflow needs? Is a write token used where a read token would do?
- Could a crafted input make the workflow send data to an outside address?

## 6. Data and privacy

- Which fields are personal or sensitive? Which steps and vendors receive them?
- Are only the needed fields sent to the model?
- What do logs and execution histories keep, and for how long?
- Are there consent, retention or regional rules for this data (for example contact-by-text rules, health or financial data)? Flag them for the owner to check; do not give legal advice.

## 7. Cost

- Calls per run × runs per month × average input and output tokens × price per token, plus retries.
- Is the model size matched to the task? Is a cheaper model enough for classification steps?
- Is anything cacheable (repeated system prompts, repeated lookups)?
- Is there a budget alert or hard cap?

## 8. Operability

- Is there an owner and an alert on failure?
- Can it be paused without losing events?
- Are prompts and workflow versions tracked so a bad change can be rolled back?
- Is there a test set of real-looking inputs that runs before changes go live?
- Are model and API versions pinned?

## 9. Complexity

- Count services, steps and agents. Does each one earn its place?
- Are two tools doing the same job?
- Would one workflow with branches beat several chained workflows?
