// Checks one skill as the Skills CLI installed it against the released files.
// Run after `npx skills add`: node tools/install-check.mjs <project-dir> <skill> [<agent-dir> ...]
// The fingerprint uses the same rule as skills-index.json: every file except evals/, sorted by path,
// "path:sha256" lines joined with newlines, then sha256 of that text.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const [project, slug, ...agentDirs] = process.argv.slice(2);
const index = JSON.parse(fs.readFileSync("skills-index.json", "utf8"));
const sha = (b) => createHash("sha256").update(b).digest("hex");
const walk = (d, base = d) => fs.readdirSync(d).flatMap((n) => {
  const p = path.join(d, n);
  return fs.statSync(p).isDirectory() ? walk(p, base) : [path.relative(base, p).split(path.sep).join("/")];
});

const errors = [];
const installed = path.join(project, ".agents/skills", slug);
if (!fs.existsSync(path.join(installed, "SKILL.md"))) errors.push(`no SKILL.md at ${installed}`);
else {
  const files = walk(installed).filter((f) => !f.startsWith("evals/"));
  const lines = files.map((f) => ({ path: f, sha256: sha(fs.readFileSync(path.join(installed, f))) }))
    .sort((a, b) => a.path.localeCompare(b.path)).map((f) => `${f.path}:${f.sha256}`);
  const fingerprint = sha(lines.join("\n"));
  if (fingerprint !== index.skills[slug]?.fingerprint) errors.push(`fingerprint ${fingerprint} differs from skills-index.json ${index.skills[slug]?.fingerprint}`);
  const md = fs.readFileSync(path.join(installed, "SKILL.md"), "utf8");
  const name = md.match(/^---\n[\s\S]*?^name:\s*(.+)$/m)?.[1].trim();
  if (name !== slug) errors.push(`SKILL.md name "${name}" is not "${slug}"`);
  // Every relative file the instructions point to must have been installed too.
  for (const ref of new Set([...md.matchAll(/\b((?:references|examples)\/[\w./-]+\.md)\b/g)].map((m) => m[1])))
    if (!fs.existsSync(path.join(installed, ref))) errors.push(`SKILL.md refers to ${ref}, which was not installed`);
  for (const dir of agentDirs) {
    const p = path.join(project, dir, slug, "SKILL.md");
    if (!fs.existsSync(p)) errors.push(`agent folder ${dir} has no ${slug}/SKILL.md`);
    else if (sha(fs.readFileSync(p)) !== sha(md)) errors.push(`${dir}/${slug}/SKILL.md differs from the installed copy`);
  }
  console.log(JSON.stringify({ skill: slug, version: index.skills[slug]?.version, fingerprint, files: files.length, ok: !errors.length }));
}
for (const e of errors) console.log(`::error::${slug}: ${e}`);
process.exit(errors.length ? 1 : 0);
