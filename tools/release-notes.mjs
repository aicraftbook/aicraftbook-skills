// Prints release notes for a tag <name>-v<version>: the CHANGELOG section, the approved download and its checksum.
import fs from "node:fs";

const tag = process.argv[2];
const m = tag?.match(/^(.+)-v(\d+\.\d+\.\d+)$/);
if (!m) throw new Error(`bad tag ${tag}`);
const [, name, version] = m;
const index = JSON.parse(fs.readFileSync("skills-index.json", "utf8"));
const skill = index.skills[name];
const log = fs.readFileSync(`skills/${name}/CHANGELOG.md`, "utf8");
const section = log.split(/^## /m).find((s) => s.startsWith(version))?.replace(/^.*\n/, "").trim() ?? "See CHANGELOG.md.";
console.log(`**${skill.displayName}** ${version}: ${skill.subtitle}

${section}

### Get it

- Source: [skills/${name}](https://github.com/${process.env.GITHUB_REPOSITORY}/tree/${tag}/skills/${name})
- Download (same file as the website): ${skill.download.url}${skill.download.sha256 ? `\n- SHA-256: \`${skill.download.sha256}\`` : ""}
- Fingerprint of the released files: \`${skill.fingerprint}\`
- Full guide, test results and security review: ${index.site}${skill.sitePath}`);
