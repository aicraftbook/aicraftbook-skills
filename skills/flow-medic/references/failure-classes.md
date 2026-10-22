# Failure classes and their signatures

The most common reasons one automation run fails, how each shows up on each platform, where the root
cause usually is, the smallest first fix and the check that proves it. Platform wording in quotes comes
from the official pages listed in [platforms.md](platforms.md) (checked 2026-10-21). Rows marked
"pattern" describe common practice rather than an official statement; say so when you rely on one.

Match on evidence in the paste, not on the class that is most common in general.

## Quick table

| Class | Signatures | Usual root cause | First fix | Proof |
|---|---|---|---|---|
| 1. Authentication | n8n 401, or "Forbidden - perhaps check your credentials" (403); Zapier 401; Make AccountValidationError; Actions 401 or "Bad credentials" from an API (pattern) | Expired, revoked or changed credential; password change; app session policy; wrong credential selected on the step | Reconnect the account, or create a new credential and select it on the failing step | The same step succeeds on a re-run with the same input |
| 2. Permission or scope | 403 with a valid login; Zapier 403 "lacks permission"; Actions 403 "Resource not accessible by integration" (pattern) | The account or token lacks a scope or a role; fork PR read-only token; `permissions:` block that sets unlisted permissions to `none` | Grant the one missing scope or permission, nothing broader | Step succeeds; no other permission was widened |
| 3. Rate limit | 429; n8n "429 - The service is receiving too many requests from you"; Zapier 429; Make RateLimitError; Actions API limit for `GITHUB_TOKEN` | Burst of items or runs hitting the service's limit; a loop calling once per item | n8n: **Batching** (**Items per Batch**, **Batch Interval (ms)**) or **Retry On Fail** with a wait; Make: let stored incomplete executions retry; Zapier: autoreplay, or spread the trigger | Next run of the same size completes with no 429 |
| 4. Timeout | Zapier "timed out" with no status code; Make ModuleTimeoutError (about 40 s); n8n Cloud 524 at 100 s on a webhook that waits for the workflow; Actions job cancelled at the 6-hour limit or a `timeout-minutes` value | Slow upstream service; very large payload; webhook waiting for a long workflow | Respond to the webhook first and do the work after; smaller batches; a step timeout that fits | Run completes inside the limit; time per step in the log |
| 5. Bad input data | 400 "Bad request - please check your parameters" (n8n); Zapier 400 or 422; Make DataError, BundleValidationError, DuplicateDataError; app error naming a field | The data sent is wrong, not the step: a mapping points at a field that is empty, renamed, differently cased, nested elsewhere or of another type | Fix the mapping or add a transform at the step that builds the field | The failing step's input shows the field with the expected value, and the step succeeds |
| 6. Empty upstream result | Zapier earlier step "Safely halted" (search found nothing), then a later step errors; n8n node gets no items; Make a search module returns zero bundles | The search or filter step found nothing; a new record that does not exist yet | Handle the empty case: "create if not found" option, a Filter or Paths step, an IF node, a router filter | A run with a no-match input takes the handled path with no error |
| 7. Mapping or expression error | n8n "Info for expression missing from previous node", "Multiple matching items for expression", "'<node-name>' is on another branch" (resolves to null, node still succeeds); "JSON parameter need to be an valid JSON" | An expression references the wrong node or item; an Aggregate, Summarize or Merge changed the items; JSON not wrapped in `{{ }}` | n8n: use `.first()`, `.last()` or `.all()[index]`, or set a Merge node to Combine; validate the JSON | The expression preview shows the expected value for each item |
| 8. Trigger or event mismatch | Nothing ran, or the wrong thing ran: n8n test URL vs production URL, unpublished workflow, path and method already in use; Actions workflow did not start (disabled, `on:` mismatch, default-branch-only event, merge conflict, skip annotation, path filter); Zapier Filtered | The trigger never fired for this event, or fired for a different one | Point live traffic at the production URL and publish; fix the `on:` block or filters | A real event of the expected kind creates a run |
| 9. Platform limit | n8n "Execution stopped at this node (n8n may have run out of memory while executing it)", "Connection Lost", 503; Make ExecutionInterruptedError (45 min, 10 on Free), OperationsLimitExceededError, MaxFileSizeExceededError; Zapier On hold for task limit; Actions billing limit, 6-hour job limit | Too much data in one run, or the plan's quota is used up | Process in smaller batches or sub-workflows; avoid the Code node for heavy data in n8n; check plan usage | Peak memory or run time drops; run completes |
| 10. Network or outage | n8n ECONNREFUSED; Make ConnectionError (502/503/504); Zapier 500; Actions DNS, proxy or certificate errors | Service down, wrong host, or (self-hosted n8n in Docker) `localhost` pointing at the n8n container itself | Check the service's status page. Docker: `host.docker.internal` or the Compose service name. Not Docker and the error shows `::1`: use `127.0.0.1` | The same request succeeds; status page shows recovery |
| 11. Code or command error | Actions: a step ends with "Process completed with exit code N" (pattern) after the real error; n8n Code node error with a line; Zapier Code step error | A bug, a missing dependency or file, a version change in a tool, a missing environment variable or secret | Read the first error above the exit line; fix that one thing | The step passes; the same test or command passes locally (if the user can run it) |
| 12. Secrets not available | Actions: an empty variable where a secret should be, on a run from a fork, in an `if:` that references `secrets`, or in a reusable workflow; Zapier or Make: a connection with an empty field (pattern) | Secrets are not passed to fork-triggered runs, cannot be read directly in `if:`, and are not passed to reusable workflows automatically | Use the documented route: job-level env for conditions, pass secrets to the reusable workflow, run trusted jobs only for same-repo branches | The step sees the value (check that it is set, never print it) |

## Symptom versus root cause: patterns to check

- **The step that errors is downstream of the one that went wrong.** A send-email step fails with a
  missing "To" because a search step two steps earlier found no contact. Trace back (class 6).
- **"Continue" hides the first failure.** In n8n, *On Error: Continue* passes the last valid data on, so a
  later node fails on stale or wrong data. In Actions, `continue-on-error: true` lets a failed step pass.
  Ask whether either is set before blaming the step that failed.
- **"It worked yesterday."** Ask what changed: credential rotated, password changed, app plan or
  permissions changed, a field renamed in the source app, a new version of an action or package (unpinned
  versions change under you), or a new kind of input (empty, very large, different language or format).
- **The scenario or Zap was turned off.** That is the platform reacting to repeated errors (Make: 3
  consecutive by default, or the first error with an instant trigger; Zapier: repeated errors). Find the
  first failed run in history; that is the one to diagnose.
- **Retries made it worse.** A non-idempotent step retried after a timeout may have succeeded the first
  time: look for duplicates before re-running again.
- **Works in test, fails live.** n8n test URL versus production URL; manual runs in n8n use more memory;
  Actions fork PRs get no secrets and a read-only token; test data had every field, live data does not.

## When to stop and ask

Say **Need more information** when:

- the paste has the symptom only (for example "Internal Server Error") and no status code, response
  body, step input or history;
- two classes fit equally and one check would separate them;
- the failing step's input is missing, so you cannot tell class 5 from class 1 or 2.

Ask for at most three items, each with where it lives (from [platforms.md](platforms.md)) and what to
redact: the full error from the log or **Logs** tab; the failing step's input (n8n input panel, Zapier
step data, Make operation input bundle, the Actions step and its environment names, not values); and
whether the same workflow succeeded before and what changed. Give the ranked causes so far, so the user
knows why each item matters.
