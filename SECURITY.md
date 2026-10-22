# Security policy

## Reporting a problem

If a skill here could cause an agent to leak data, run something unsafe or ignore its user, report it
privately through GitHub's "Report a vulnerability" button on this repository's Security tab. Please do
not open a public issue. We aim to reply within 5 working days.

## What we do when a report is confirmed

- We withdraw the affected version from the website and the release downloads at once.
- We publish a fixed version, or retire the skill with a notice that explains what was wrong.
- The skill's changelog records the fix.

## How skills here are checked

Static checks only: pattern rules for prompt injection, credential access, exfiltration, remote
execution, destructive commands, obfuscation, suspicious links and dependencies, plus the gitleaks
secret scanner. Skills in this repository contain instructions only and are never executed by our checks.
Automated checks find known patterns. They do not prove that a skill is safe.
