# Example requests

Illustrative. These show the kind of request the skill is for and what a good diagnosis contains.
Test tasks are in `../evals/tasks.json`.

1. "My n8n workflow fails at the HubSpot node with 400 Bad request. Here's the execution."
   The HubSpot node's input shows `email: ""`, and the webhook output shows the form sent `Email` with a
   capital E. A good diagnosis names the HubSpot error as the symptom and the mapping in the earlier
   Edit Fields (Set) node as the root cause, fixes that one expression, and proves it with **Debug in
   editor** on the same data, warning that later nodes will run again for real.
2. "The Zap errored at the Gmail step: To is required. Should I turn on autoreplay?"
   The step before it, a search for the contact, shows *Safely halted* because nothing was found. A good
   diagnosis traces the missing address to the search, suggests handling the no-match case, and explains
   that autoreplay retries errored runs but cannot fix missing data.
3. "Our Actions job fails with 'Resource not accessible by integration' when it comments on PRs."
   The workflow sets `permissions: contents: read` and the failing run came from a fork. A good diagnosis
   explains that listing one permission sets the others to `none` and that fork pull requests get a
   read-only token, adds only `pull-requests: write`, says that fork runs will still be read-only, and
   gives the re-run and the line in the log that proves the fix.
4. "Make turned my scenario off." A good diagnosis explains that this is the platform's reaction to
   errors, asks for the first failed run in the **History** tab, and does not guess the cause.
