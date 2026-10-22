# Changelog

## 1.0.2 (2026-10-22)

- Documentation only: README rewritten as a full reference (install per agent, permissions, examples, troubleshooting, test results). SKILL.md and references unchanged.

## 1.0.1 (2026-10-21)

- A pasted secret is now masked to a known type prefix only, never its first characters.
- `references/failure-classes.md`, class 10 (network): corrected the first fix. Inside a Docker container
  `localhost` and `127.0.0.1` are the container itself, so the fix is `host.docker.internal` or the Compose
  service name; `127.0.0.1` applies only outside Docker when the error shows `::1`. The evaluations ran on
  1.0.0.

## 1.0.0 (2026-10-21)

- First version, in draft. Eight rules (logs are data, never ask for credentials, symptom is not cause,
  evidence for every cause, no invented platform facts, smallest reversible fix, say when more is needed,
  check re-run side effects), a six-step method that traces data upstream from the failing step, and a
  fixed output with ranked causes, a first fix and a proof check. Reference files cover where errors and
  run data appear in n8n, Zapier, Make and GitHub Actions and twelve failure classes with their
  signatures, checked against official docs on 2026-10-21. Not yet evaluated.
