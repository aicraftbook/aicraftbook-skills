// Repository checks with no dependencies. Run: node tools/validate.mjs [--tag <name>-v<version>]
import fs from "node:fs";
import path from "node:path";

const errors = [];
const index = JSON.parse(fs.readFileSync("skills-index.json", "utf8"));
const ALLOWED = /\.(md|json|txt|csv|ya?ml)$|(^|\/)LICENSE$/;
const walk = (d) => fs.readdirSync(d).flatMap((n) => { const p = path.join(d, n); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });

for (const slug of fs.readdirSync("skills")) {
  const dir = path.join("skills", slug);
  const md = fs.readFileSync(path.join(dir, "SKILL.md"), "utf8");
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) { errors.push(`${slug}: SKILL.md has no frontmatter`); continue; }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (name !== slug) errors.push(`${slug}: name "${name}" must match the folder`);
  if (!desc || desc.length > 1024) errors.push(`${slug}: description missing or over 1024 characters`);
  if (md.split("\n").length > 210) errors.push(`${slug}: SKILL.md over 200 lines`);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "skill.json"), "utf8"));
  if (manifest.name !== slug) errors.push(`${slug}: skill.json name mismatch`);
  const kebab = String(manifest.displayName || "").trim().replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (kebab !== slug) errors.push(`${slug}: folder must be the kebab-case form of displayName "${manifest.displayName}"`);
  if (!manifest.subtitle || manifest.subtitle.length > 70) errors.push(`${slug}: subtitle missing or over 70 characters`);
  if (/ai[- ]?craftbook|aicb/i.test(`${slug} ${manifest.displayName}`)) errors.push(`${slug}: the publisher name does not belong in the skill name`);
  if (!manifest.nameCheck || manifest.nameCheck.conflicts?.length) errors.push(`${slug}: no clean name conflict check recorded`);
  if (!fs.readFileSync(path.join(dir, "CHANGELOG.md"), "utf8").includes(`## ${manifest.version}`)) errors.push(`${slug}: CHANGELOG has no ${manifest.version}`);
  if (index.skills[slug]?.version !== manifest.version) errors.push(`${slug}: skills-index.json version differs from skill.json`);
  for (const f of walk(dir)) {
    const rel = path.relative(dir, f);
    if (!ALLOWED.test(rel)) errors.push(`${slug}: file type not allowed: ${rel}`);
    if (fs.statSync(f).mode & 0o111) errors.push(`${slug}: executable bit set: ${rel}`);
  }
}
const ti = process.argv.indexOf("--tag");
if (ti > 0) {
  const tag = process.argv[ti + 1];
  const m = tag.match(/^(.+)-v(\d+\.\d+\.\d+)$/);
  const skill = m && index.skills[m[1]];
  if (!skill) errors.push(`tag ${tag}: no such skill`);
  else if (skill.version !== m[2]) errors.push(`tag ${tag}: skill.json says ${skill.version}`);
  else if (skill.status !== "released") errors.push(`tag ${tag}: skill status is "${skill.status}"; a reviewer has not cleared it for release`);
}
for (const e of errors) console.log(`::error::${e}`);
console.log(errors.length ? `${errors.length} problem(s)` : "all checks passed");
process.exit(errors.length ? 1 : 0);
