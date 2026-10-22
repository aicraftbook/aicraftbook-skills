# Example requests

Illustrative. These show the kind of request the skill is for and what a good answer contains.
Test tasks are in `../evals/`.

1. "Claude keeps running the wrong test command. Audit our CLAUDE.md."
   A good answer checks every command against `package.json` and the lockfile, marks `yarn test:unit` as
   Not found with the scripts it did find, proposes `pnpm test`, flags any contradiction it sees, and asks
   for approval before editing anything.
2. "We have an AGENTS.md for Codex and a CLAUDE.md that says 'read AGENTS.md'. Clean this up."
   A good answer explains that Claude Code reads only the `CLAUDE.md` here, proposes `@AGENTS.md` as an
   import, moves the 14-step deploy procedure into a skill, and lists every removed line with a reason.
3. "Is anything in my CLAUDE.md unsafe to commit?"
   A good answer masks a connection string password instead of repeating it, says to revoke and replace
   it, moves personal sandbox notes to `CLAUDE.local.md`, and changes nothing until approved.
