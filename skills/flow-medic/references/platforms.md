# Where errors and run data appear, per platform

Checked against each platform's official documentation on 2026-10-21. Sources are listed under each
platform with the date. Platforms change their interfaces and limits; if this file disagrees with the
current docs, the docs win. Anything below marked "not in the docs checked" is a common pattern, not
an official statement, and should be presented to the user that way.

Use this file to tell the user exactly where to look, what a status means, and how to re-run safely.

## n8n

**Where the failed run is**
- In the workflow, the **Executions** tab lists its runs. The instance-wide executions list has a
  **Status** filter with *Failed*, *Running*, *Success* and *Waiting*, plus filters for workflow and
  execution start time. Filtering by saved custom data needs a higher plan.
- A run only appears if the workflow saves it. Workflow settings control this: **Save failed production
  executions**, **Save successful production executions**, **Save manual executions** and **Save
  execution progress**. If the user cannot find the failed run, check these first. Deleting a workflow
  deletes its execution history.
- Open the execution to see each node's input and output and the node that failed.

**Re-run safely**
- On a failed execution, **Debug in editor** copies that run's data into the workflow and pins it to the
  first node, so the user can fix the workflow and re-run it with the same data (successful runs show
  **Copy to editor**). Available on all n8n Cloud plans and on self-hosted Registered Community,
  Business and Enterprise editions.
- Pinned data replays the trigger, not the side effects: nodes after the trigger run again for real.
  Disable or pin nodes that send, create or charge before re-running.

**Error handling settings that change what the user sees**
- Node **Settings**: **Retry On Fail** (with **Max Tries** and **Wait Between Tries (ms)**), **On Error**
  (*Stop Workflow*, *Continue*, *Continue (using error output)*), **Always Output Data** (returns an empty
  item when the node has no data; the docs warn this can loop on IF nodes) and **Execute Once**.
- *Continue* passes the last valid data on, so a later node can fail far from the real error. Ask
  whether any node uses it.
- Workflow settings: **Error Workflow (to notify when this one errors)** runs a workflow that starts with
  the **Error Trigger** node. Its data holds `execution.id`, `execution.url`, `execution.retryOf`,
  `execution.error.message`, `execution.error.stack`, `execution.lastNodeExecuted`, `execution.mode`,
  and `workflow.id` and `workflow.name`. When the trigger node itself failed, it holds a `trigger`
  object instead and there is no `execution` id. The **Stop And Error** node fails a run on purpose.
- **Timeout Workflow** cancels a run after **Timeout After**; n8n Cloud caps the timeout per plan.
- **Timezone**: if neither the workflow nor the instance sets one, n8n uses America/New_York. Schedule
  "ran at the wrong time" problems start here.

**Webhooks**
- Each Webhook node has a **Test URL** (after **Listen for test event**, it listens for 120 seconds and
  shows data in the editor) and a **Production URL** (works while the workflow is published, and does not
  show data in the editor). Live traffic sent to the test URL, or a production URL on an unpublished
  workflow, does not start a run.
- Only one webhook per path and HTTP method; a clash shows that the path and method are already in use.
- n8n Cloud: requests that get no response within 100 seconds fail with status 524 at Cloudflare.
- A Webhook node accepts one HTTP method unless **Allow Multiple HTTP Methods** is on.

**Self-hosted logs**: memory failures show "Allocation failed - JavaScript heap out of memory" in the
server logs; in the editor the user sees "Execution stopped at this node (n8n may have run out of memory
while executing it)", or "Connection Lost" or "503 Service Temporarily Unavailable".

Sources (accessed 2026-10-21):
- Error handling: https://docs.n8n.io/flow-logic/error-handling/
- Debug and re-run past executions: https://docs.n8n.io/workflows/executions/debug/
- All executions: https://docs.n8n.io/workflows/executions/all-executions/
- Workflow settings: https://docs.n8n.io/workflows/settings/
- Node settings: https://docs.n8n.io/workflows/components/nodes/
- HTTP Request common issues: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/common-issues/
- Webhook common issues: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/
- Item linking errors: https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-errors/
- Memory-related errors: https://docs.n8n.io/hosting/scaling/memory-errors/

## Zapier

**Where the failed run is**
- **Zap history** lists runs with a status. Click a run to open its **Zap run details** page, find the
  errored step, then use the **Troubleshoot** tab (AI-generated fix suggestions to review, not evidence)
  or the **Logs** tab, which shows the HTTP status code, error message and API endpoint. Expanding the
  log shows the request method, endpoint, parameters, headers and body.
- If a step failed because required information was missing, there is no log for it. Then the step's
  mapped fields are the evidence.
- In the Zap editor, the **Zap runs** sidebar lists runs; **Go to step** opens the errored step.

**Run and step statuses**

| Status | Meaning |
|---|---|
| Successful | Every step completed |
| Errored | The run hit a problem. Later steps that use fields from it also error. A Zap that errors repeatedly is turned off automatically |
| Handled error | A step errored and a custom error handler ran an alternate path. Repeats do not turn the Zap off |
| Filtered | A Filter step's conditions were not met; later steps did not run |
| Safely halted | Stopped on purpose, usually because a search step found no results. Later steps still run but error if they need fields from that step. Repeats do not turn the Zap off |
| On hold | Waiting for an issue to be fixed (disconnected account, task limit, plan change). Trigger data is kept |
| Delayed | A Delay step is postponing the run |
| Needs review | A person must review the step first (Zapier Agents or Human in the Loop) |
| Running | In progress |
| Scheduled | A failed run is queued to re-run because autoreplay is on |
| Skipped | A step did not run because an earlier step's result prevented it (step status only) |

**Status codes, as Zapier's troubleshooting page explains them**: 400 missing required values, invalid
characters or malformed request; 401 expired or revoked credentials, a password change or an app session
policy (reconnect the app account); 403 the connected account lacks permission; 404 the record does not
exist in the app; 422 data in the wrong format or required data missing; 429 Zapier's or the app's rate
limit exceeded; 500 generic, possibly temporary or an outage; "timed out" with no code, the app
responded too slowly.

**Re-run safely**
- **Replay** a run (or single steps) from Zap history after fixing the cause. Held runs can be replayed
  once the issue is fixed. Replay repeats every action step that runs again, so check for duplicates.
- **Autoreplay** (Professional, Team and Enterprise plans) replays errored runs automatically and does not
  replay safely halted runs. It helps with temporary failures; it cannot fix bad data or a broken mapping.
- Deleting a run that is Running, Needs review, On hold, Delayed or Scheduled stops it; for other
  statuses deleting only removes the record and undoes nothing.

Sources (accessed 2026-10-21):
- Review run statuses in Zaps: https://help.zapier.com/hc/en-us/articles/20505304170637
- How to troubleshoot errors in Zaps: https://help.zapier.com/hc/en-us/articles/8496037690637
- Replay and autoreplay: https://help.zapier.com/hc/en-us/articles/8496241726989

## Make

**Where the failed run is**
- Open the scenario, then the **History** tab. Each run shows date and time, status (*Success*,
  *Warning*, *Error*), duration, operations, credits and data size. **Details** opens the run: bundles
  processed, each module's output bundles, and a simple or advanced log.
- In the scenario editor, the bubble above a module shows its operations; expand one to see the input
  and output bundles it processed.
- Runs stored for later completion are in the **Incomplete Executions** tab. How much history is kept
  depends on the plan.
- The **Make DevTool** browser extension shows the raw HTTP requests and responses; the docs suggest it
  for reproducing errors.

**Error types and default behaviour** (from Make's "Fix errors and warnings" page)

| Error | Meaning | Default |
|---|---|---|
| AccountValidationError | Make cannot authenticate with the app (credentials expired or changed, 401/403) | Run ends with an error; error handlers cannot catch it; leads to scheduling being disabled (the two pages checked differ on whether at once or after repeated attempts) |
| BundleValidationError | A bundle fails validation (type mismatch, missing required field) | Error; repeats disable scheduling |
| ConnectionError | The app is unavailable (502, 503, 504) | Scheduled scenarios pause; retried automatically when incomplete executions are stored |
| DataError | The app rejects the data, or a function gets the wrong data type | In the trigger, the scenario is deactivated at once |
| DuplicateDataError | Data that must be unique already exists | Error; repeats disable scheduling |
| IncompleteDataError | Only part of the data could be fetched (for example a file still uploading) | Error; counts toward the consecutive-error limit |
| ModuleTimeoutError | No response in about 40 seconds (some modules allow 60) | Fails unless a retry handler and stored incomplete executions are set up |
| RateLimitError | Too many requests (429) | As ConnectionError |
| MaxFileSizeExceededError | A file is larger than the plan allows | In the trigger, deactivates the scenario |
| OperationsLimitExceededError, DataSizeLimitExceededError | Credits or data transfer used up | Fatal; scheduling disabled at once |
| InconsistencyError | Rollback failed because another scenario changed the data store | Fatal |
| RuntimeError | Anything else | Error; repeats disable scheduling |

Warnings: **ExecutionInterruptedError** when a run passes 45 minutes (10 on the Free plan) and
**OutOfSpaceError** when a data store or incomplete-execution storage is full. Both skip the remaining
bundles but keep scheduling.

**Deactivation rules**: with no error handler and incomplete executions off, the default is
*Rollback* (the run stops, changes in transaction-capable modules are reverted, status *Error*). The
default limit is 3 consecutive errors before Make disables the scenario. Scenarios with an instant
(webhook) trigger are disabled at the first error. "The scenario was turned off" is therefore often a
consequence, not the cause: find the first failed run.

**Error handlers** (names as on the help page checked; older pages and many community posts call the
first two *Ignore* and *Break*): *Skip* drops the bundle and continues (Success); *Retry* stores the bundle
as an incomplete execution and lets the rest run (Warning); *Resume* substitutes a set output (Success);
*Commit* stops and keeps changes so far; *Rollback* stops and reverts (Error).

**Automatic retries**: incomplete executions from RateLimitError, ConnectionError and
ModuleTimeoutError are retried up to eight times with backoff (about 1 minute up to about 8 hours after
the original run). The Retry handler with automatic completion defaults to 3 attempts, 15 minutes apart.
Other error types need a manual fix.

**Re-run safely**: fix the cause, then resolve the stored incomplete execution or run the scenario once
with the same input. Modules before the failure that created or sent something will do it again.

Sources (accessed 2026-10-21):
- Fix errors and warnings: https://help.make.com/fix-errors-and-warnings
- Overview of error handling: https://help.make.com/Overview-of-error-handling
- Automatic retry of incomplete executions: https://help.make.com/automatic-retry-of-incomplete-executions
- Scenario history: https://help.make.com/scenario-history

## GitHub Actions

**Where the failed run is**
- **Actions** tab, the workflow in the left sidebar, the run, then the job. Each job log starts with
  **Set up job** and ends with **Complete job**. Failed steps expand automatically. **Search logs**
  searches expanded steps only. A line number gives a shareable link.
- Gear icon (**Show options**) > **Download log archive**. After a partial re-run, the archive holds only
  the re-run jobs. Viewing logs needs read access and a signed-in account.
- Why a job ran or was skipped: in the log archive, `JOB-NAME/system.txt` has `Evaluating`, `Expanded`
  and `Result` lines showing how each `if:` was evaluated.

**More detail**
- Set `ACTIONS_STEP_DEBUG` and `ACTIONS_RUNNER_DEBUG` to `true` as a repository secret or variable
  (the secret wins if both exist), or choose debug logging when re-running. Runner diagnostic logs are in
  the `runner-diagnostic-logs` folder of the log archive.
- For tools, the docs suggest their verbose flags (for example `npm install --verbose`).

**Facts that explain common failures**
- `permissions`: once any permission is set in a workflow or job, every permission not listed is `none`.
- `pull_request` runs from a fork get a read-only token (write permissions become read) unless an admin
  turned on "Send write tokens to workflows from pull requests". Secrets other than `GITHUB_TOKEN` are not
  passed to the runner for workflows triggered from a fork.
- Secrets cannot be used directly in `if:` conditions, and are not passed to reusable workflows
  automatically.
- Events caused by `GITHUB_TOKEN` do not start new workflow runs (except `workflow_dispatch` and
  `repository_dispatch`). `GITHUB_TOKEN` expires when the job ends. Its API limit is 1,000 requests per
  hour per repository (15,000 for GitHub Enterprise Cloud resources).
- Limits: a job on a GitHub-hosted runner can run 6 hours, on a self-hosted runner 5 days; a workflow
  run 35 days; a job can wait in the queue 24 hours before it is cancelled. A step's `timeout-minutes`
  can be at most 360. `continue-on-error: true` lets a job pass when that step fails.
- Workflow did not start: the workflow is disabled; the `on:` events do not match; `issues` and
  `schedule` only run from the default branch; `pull_request` does not run while the PR has a merge
  conflict; a skip annotation in the commit message; branch, tag or path filters (only the first 3,000
  changed files are checked); scheduled runs can be delayed or dropped at busy times, especially on the
  hour; a schedule stops if the actor's account is suspended or removed.
- A run that will not cancel often has `always()` in a condition; the docs suggest `!cancelled()`.
- Billing limits on minutes or storage can block runs.

**Re-run safely**: **Re-run failed jobs** or **Re-run all jobs**, optionally with debug logging. A
re-run repeats deploys, releases and API writes in the jobs it re-runs.

Not in the docs checked (common log wording, present it as such): a step that fails ends with
`Process completed with exit code N`, and the real error is in the lines above it; a 403 from the GitHub
API with "Resource not accessible by integration" usually means the token lacks a permission or is the
read-only fork token.

Sources (accessed 2026-10-21):
- Using workflow run logs: https://docs.github.com/en/actions/how-tos/monitor-workflows/use-workflow-run-logs
- Enabling debug logging: https://docs.github.com/en/actions/how-tos/monitor-workflows/enable-debug-logging
- Troubleshooting workflows: https://docs.github.com/en/actions/how-tos/troubleshoot-workflows
- Workflow syntax (permissions, steps): https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- GITHUB_TOKEN: https://docs.github.com/en/actions/concepts/security/github_token
- Using secrets: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
- Limits: https://docs.github.com/en/actions/reference/limits
