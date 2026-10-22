// Generated from the AI Craftbook site repository (src/lib/security/scan.ts). Do not edit here.

// scripts/lib/scan-cli.ts
import fs from "node:fs";
import path from "node:path";

// src/lib/security/scan.ts
import { createHash } from "node:crypto";
var SCANNER_VERSION = "aicb-static-1.0.0";
var SEVERITY_ORDER = ["info", "low", "medium", "high", "critical"];
var INSTRUCTION_EXT = /\.(md|markdown|txt|rst)$/i;
var CONFIG_EXT = /\.(json|ya?ml|toml|csv|tsv|ini|env\.example)$/i;
var EXEC_EXT = /\.(sh|bash|zsh|fish|ps1|psm1|bat|cmd|py|pyw|js|mjs|cjs|ts|mts|cts|jsx|tsx|rb|pl|php|lua|go|rs|java|kt|swift|c|cc|cpp|h|exe|dll|so|dylib|bin|jar|app|msi|deb|rpm|command|applescript|scpt|vbs|wasm)$/i;
var ARCHIVE_EXT = /\.(zip|tar|gz|tgz|bz2|xz|7z|rar|zst|dmg|pkg|iso)$/i;
function bytesOf(c) {
  return typeof c === "string" ? new TextEncoder().encode(c) : c;
}
function isBinary(b) {
  const n = Math.min(b.length, 8192);
  for (let i = 0; i < n; i++) if (b[i] === 0) return true;
  return false;
}
function classify(f) {
  const b = bytesOf(f.content);
  if (ARCHIVE_EXT.test(f.path)) return "archive";
  if (isBinary(b)) return "binary";
  if (EXEC_EXT.test(f.path)) return "executable";
  const head = new TextDecoder().decode(b.slice(0, 64));
  if (head.startsWith("#!")) return "executable";
  if (f.mode !== void 0 && (f.mode & 73) !== 0) return "executable";
  if (INSTRUCTION_EXT.test(f.path) || /(^|\/)(LICENSE|LICENCE|NOTICE|COPYING|AUTHORS)$/.test(f.path)) return "instructions";
  if (CONFIG_EXT.test(f.path)) return "config";
  return "other";
}
function sha256(b) {
  return createHash("sha256").update(bytesOf(b)).digest("hex");
}
function combinedHash(files) {
  const lines = [...files].sort((a, b) => a.path.localeCompare(b.path)).map((f) => `${f.path}:${f.sha256}`);
  return sha256(lines.join("\n"));
}
var WEBHOOK_HOSTS = "webhook\\.site|requestbin|pipedream\\.net|ngrok(?:-free)?\\.(?:io|app|dev)|interact\\.sh|oast\\.(?:fun|live|me|pro|site)|burpcollaborator\\.net|canarytokens|discord(?:app)?\\.com/api/webhooks|hooks\\.slack\\.com";
var RULES = [
  // Prompt injection and instruction override
  { id: "PI001", category: "prompt_injection", severity: "high", re: /\b(ignore|disregard|forget|override)\b[^.\n]{0,40}\b(previous|prior|above|earlier|all|your|system|original)\b[^.\n]{0,20}\b(instructions?|directions?|rules|prompts?|guidelines|messages?)\b/i, message: "Tells the agent to ignore or override its existing instructions." },
  { id: "PI002", category: "prompt_injection", severity: "high", re: /\byou are (now|no longer)\b[^.\n]{0,40}\b(unrestricted|jailbroken|DAN|developer mode|without (rules|limits|restrictions))/i, message: "Tries to change the agent's role or remove its limits." },
  { id: "PI003", category: "prompt_injection", severity: "high", re: /\b(do not|don't|never)\b[^.\n]{0,20}\b(tell|inform|alert|notify|show|mention (it |this )?to)\b[^.\n]{0,20}\b(the )?(user|human|operator|owner)\b/i, message: "Asks the agent to hide actions from the user." },
  { id: "PI004", category: "prompt_injection", severity: "high", re: /\b(reveal|print|output|repeat|dump)\b[^.\n]{0,30}\b(system prompt|hidden instructions|initial instructions|developer message)\b/i, message: "Tries to extract the agent's hidden instructions." },
  { id: "PI005", category: "prompt_injection", severity: "medium", re: /<\/?\s*(system|assistant|developer|im_start|im_end)\s*>|\[\/?(INST|SYS)\]/i, message: "Contains chat-role markup that can confuse the agent about who is speaking." },
  { id: "PI006", category: "prompt_injection", severity: "high", re: /\b(as|i am) (the |your )?(system administrator|site owner|system owner|anthropic|openai|your developer)\b[^.\n]{0,40}\b(authori[sz]e|permit|allow|instruct)/i, message: "Claims authority to grant itself permissions." },
  // Attempts to change publishing or security state
  { id: "ST001", category: "status_manipulation", severity: "high", re: /\b(set|mark|change|update|flip)\b[^.\n]{0,30}\b(status|security[_ -]?status|approval|review|verification)\b[^.\n]{0,15}\b(to )?(approved|published|safe|verified|trusted|clean)\b/i, message: "Tries to change a review, approval or publishing status." },
  { id: "ST002", category: "status_manipulation", severity: "high", re: /\b(auto[- ]?(publish|approve)|approve (this|itself|yourself)|publish (this|itself|yourself)|skip (the )?(security )?review)\b/i, message: "Asks to publish or approve itself." },
  // Credentials and private files
  { id: "CR001", category: "credential_access", severity: "high", re: /(~|\$HOME|\/Users\/[^/\s]+|\/home\/[^/\s]+)\/\.(ssh|aws|gnupg|kube|docker|config\/gh|netrc|git-credentials|npmrc|pypirc)\b|\bid_(rsa|ed25519|ecdsa)\b/i, message: "References private key or credential files." },
  { id: "CR002", category: "credential_access", severity: "high", re: /\b(cat|less|more|head|tail|type|read|open|upload|send|copy)\b[^|\n]{0,30}(^|[\s/'"])\.env(\.[a-z]+)?\b/i, message: "Reads a .env file." },
  { id: "CR003", category: "credential_access", severity: "high", re: /\bprintenv\b|\benv\s*(\||>)|\bset\s*\|\s*(curl|nc|grep)|\bexport\s+-p\b|Object\.(keys|entries)\(\s*process\.env\s*\)|JSON\.stringify\(\s*process\.env|dict\(\s*os\.environ\s*\)/i, message: "Dumps environment variables, which often hold secrets." },
  { id: "CR004", category: "credential_access", severity: "high", re: /\bsecurity\s+(find|dump)-(generic|internet)-password\b|\bdump-keychain\b|\bgh auth token\b|\baws configure export-credentials\b|\bgcloud auth print-access-token\b/i, message: "Reads a credential store or prints an access token." },
  { id: "CR005", category: "credential_access", severity: "medium", re: /\b(paste|send|share|give|provide|enter)\b[^.\n]{0,30}\b(api[ _-]?key|secret key|access token|password|private key|seed phrase|recovery phrase)\b[^.\n]{0,30}\b(here|to (me|us|this)|in (the )?chat|below)\b/i, message: "Asks the user to hand over a secret in the conversation." },
  { id: "CR006", category: "credential_access", severity: "medium", re: /\/etc\/(passwd|shadow|sudoers)\b|\bLibrary\/(Keychains|Cookies|Application Support\/Google\/Chrome)\b|\bLogin Data\b/i, message: "References system or browser credential stores." },
  // Exfiltration
  { id: "EX001", category: "exfiltration", severity: "high", re: /\b(curl|wget|http|httpie|Invoke-WebRequest|iwr|Invoke-RestMethod)\b[^\n]{0,120}(\s-d\s|\s--data(-binary|-raw|-urlencode)?\b|\s-F\s|\s--form\b|\s-T\s|\s--upload-file\b|--post-(data|file)|-Method\s+Post)/i, message: "Sends data to a remote server from a command." },
  { id: "EX002", category: "exfiltration", severity: "high", re: new RegExp(`\\b(${WEBHOOK_HOSTS})`, "i"), message: "Mentions a request-capture or webhook host commonly used for exfiltration." },
  { id: "EX003", category: "exfiltration", severity: "critical", re: /\/dev\/(tcp|udp)\/|\bnc\b[^\n]{0,40}\s-e\s|\bncat\b[^\n]{0,40}--exec|\bsocat\b[^\n]{0,60}exec:/i, message: "Opens a raw network shell or socket." },
  // Remote code execution
  { id: "RX001", category: "remote_exec", severity: "critical", re: /\b(curl|wget|fetch)\b[^|\n]{0,200}\|\s*(sudo\s+)?(ba|z|da|k|fi)?sh\b|\b(curl|wget)\b[^|\n]{0,200}\|\s*(sudo\s+)?(python3?|node|perl|ruby|php)\b/i, message: "Downloads a script and pipes it straight into an interpreter." },
  { id: "RX002", category: "remote_exec", severity: "critical", re: /\b(ba|z)?sh\s+<\(\s*(curl|wget)|\bsource\s+<\(\s*(curl|wget)|\beval\s+["']?\$\(\s*(curl|wget)/i, message: "Runs a downloaded script through process substitution or eval." },
  { id: "RX003", category: "remote_exec", severity: "critical", re: /\b(iex|Invoke-Expression)\b[^\n]{0,80}\b(iwr|irm|Invoke-WebRequest|Invoke-RestMethod|DownloadString|Net\.WebClient)\b|\bpowershell(\.exe)?\b[^\n]{0,40}\s-(e|enc|encodedcommand)\s/i, message: "PowerShell download-and-execute or encoded command." },
  { id: "RX004", category: "remote_exec", severity: "high", re: /\b(base64|b64)\b[^|\n]{0,30}(-d|--decode|-D)\b[^|\n]{0,40}\|\s*(sudo\s+)?(ba|z)?sh\b|\becho\s+["']?[A-Za-z0-9+/=]{24,}["']?\s*\|\s*base64\s+(-d|--decode)/i, message: "Decodes an encoded payload and runs it." },
  { id: "RX005", category: "remote_exec", severity: "medium", re: /\b(exec|eval)\s*\(\s*(requests\.get|urllib|fetch|await fetch|atob|Buffer\.from|base64)/i, message: "Evaluates code that is fetched or decoded at run time." },
  // Destructive operations
  { id: "DS001", category: "destructive", severity: "critical", re: /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f?|-[a-zA-Z]*f[a-zA-Z]*r)[a-zA-Z]*\s+(--no-preserve-root\s+)?(\/\*?|~\/?\*?|\$HOME\/?\*?|\*|\.\.?\/?\*?)(\s|$|["';&|])/i, message: "Recursively deletes a home, root or wildcard path." },
  { id: "DS002", category: "destructive", severity: "critical", re: /\bmkfs(\.\w+)?\b|\bdd\s+if=[^\n]{0,60}of=\/dev\/|:\(\)\s*\{\s*:\|:&\s*\};:|\bdiskutil\s+(erase|zero)/i, message: "Formats or overwrites a disk, or a fork bomb." },
  { id: "DS003", category: "destructive", severity: "high", re: /\bchmod\s+-R\s+0?777\s+\/|\bchown\s+-R\b[^\n]{0,40}\s\/(\s|$)|\bfind\s+[/~][^\n]{0,60}-delete\b|\bshred\b/i, message: "Broad permission change or bulk deletion." },
  { id: "DS004", category: "destructive", severity: "medium", re: /\bgit\s+push\b[^\n]{0,30}(--force|-f)\b|\bgit\s+reset\s+--hard\b|\bDROP\s+(DATABASE|SCHEMA|TABLE)\b|\bTRUNCATE\s+TABLE\b/i, message: "Destructive git or database command." },
  // Tampering with the agent's own security controls or persistence
  { id: "AG001", category: "agent_tampering", severity: "high", re: /--dangerously-skip-permissions|\bbypassPermissions\b|--no-sandbox\b|\bdangerouslyDisableSandbox\b|--yolo\b|\bauto-?approve all\b/i, message: "Disables the agent's permission prompts or sandbox." },
  { id: "AG002", category: "agent_tampering", severity: "high", re: /\.claude\/(settings(\.local)?\.json|hooks)|\.cursor\/(mcp|rules)|\.codex\/config|\.gemini\/settings|claude_desktop_config\.json/i, message: "References agent configuration files that control permissions, hooks or servers." },
  { id: "AG003", category: "agent_tampering", severity: "high", re: /(>>?|tee\s+-a)\s*(~|\$HOME)\/\.(bashrc|zshrc|profile|bash_profile|zprofile|zshenv)\b|\bcrontab\s+(-[a-z]\s+)?-?\s*$|\bcrontab\s+-\b|\blaunchctl\s+(load|bootstrap)\b|LaunchAgents\/|\bsystemctl\s+enable\b/i, message: "Installs persistence (shell profile, cron, launch agent, service)." },
  { id: "AG004", category: "agent_tampering", severity: "medium", re: /\b(disable|turn off|remove|bypass|skip)\b[^.\n]{0,25}\b(hooks?|guardrails?|safety checks?|security checks?|permission prompts?|confirmations?|sandbox)\b/i, message: "Asks to disable safety controls." },
  // Privileged access
  { id: "PR001", category: "privilege", severity: "medium", re: /(^|[\s;&|`(])sudo\s+(?!-l\b)|\bchmod\s+[ugo]*\+s\b|\bsetuid\b|\bdoas\s+/i, message: "Runs with elevated privileges." },
  // Package installs worth recording
  { id: "DP001", category: "dependency", severity: "low", re: /\b(npx\s+(-y|--yes)|npm\s+(i|install)\s+-g|pip3?\s+install|pipx\s+install|uvx\s+|brew\s+install|go\s+install|cargo\s+install|gem\s+install)\s+[^\s]+/i, message: "Installs or runs a package. Check the package name and publisher." },
  { id: "DP002", category: "dependency", severity: "high", re: /\bpip3?\s+install\b[^\n]{0,80}(--index-url|--extra-index-url|-i\s+https?:)|\bnpm\s+(i|install)\b[^\n]{0,80}--registry\b/i, message: "Installs packages from a non-default registry." }
];
var KNOWN_HOSTS = [
  "github.com",
  "raw.githubusercontent.com",
  "api.github.com",
  "docs.github.com",
  "githubusercontent.com",
  "anthropic.com",
  "docs.anthropic.com",
  "docs.claude.com",
  "claude.ai",
  "claude.com",
  "code.claude.com",
  "support.anthropic.com",
  "modelcontextprotocol.io",
  "npmjs.com",
  "www.npmjs.com",
  "registry.npmjs.org",
  "pypi.org",
  "nodejs.org",
  "n8n.io",
  "docs.n8n.io",
  "hubspot.com",
  "developers.hubspot.com",
  "supabase.com",
  "notion.so",
  "developers.notion.com",
  "vercel.com",
  "playwright.dev",
  "openai.com",
  "platform.openai.com",
  "developers.openai.com",
  "aicraftbook.com",
  "aicraftbook.vercel.app",
  "apache.org",
  "www.apache.org",
  "opensource.org",
  "choosealicense.com",
  "example.com",
  "example.org",
  "example.net",
  "localhost",
  "127.0.0.1"
];
var SHORTENERS = /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy|ow\.ly|buff\.ly|shorturl\.at|tiny\.cc|rebrand\.ly)$/i;
var PASTE_HOSTS = /^(pastebin\.com|paste\.ee|hastebin\.com|ghostbin\.\w+|transfer\.sh|0x0\.st|file\.io|termbin\.com|ix\.io|sprunge\.us|dpaste\.\w+|controlc\.com|anonfiles\.\w+|gofile\.io|temp\.sh)$/i;
var RISKY_TLD = /\.(zip|mov|top|xyz|tk|ml|ga|cf|gq|click|country|kim|work|rest)$/i;
var URL_RE = /\b(?:https?|ftp):\/\/[^\s<>"'`)\]]+/gi;
function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}
function isKnown(host) {
  return KNOWN_HOSTS.some((k) => host === k || host.endsWith(`.${k}`));
}
function urlFindings(line, file, lineNo, hosts, inCommand) {
  const out = [];
  for (const m of line.matchAll(URL_RE)) {
    const url = m[0];
    const host = hostOf(url);
    if (!host) continue;
    hosts.add(host);
    const f = (ruleId, severity, message) => out.push({ ruleId, category: "url", severity, file, line: lineNo, excerpt: redact(url), message });
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) && host !== "127.0.0.1") f("UR001", "high", "Links to a raw IP address instead of a domain.");
    else if (host.split(".").some((p) => p.startsWith("xn--"))) f("UR002", "high", "Punycode domain, which can imitate a well-known name.");
    else if (PASTE_HOSTS.test(host)) f("UR003", "high", "Paste or anonymous file host, often used to stage payloads.");
    else if (SHORTENERS.test(host)) f("UR004", "medium", "Link shortener hides the real destination.");
    else if (RISKY_TLD.test(host)) f("UR005", "medium", "Domain on a top-level domain often used for abuse.");
    else if (/[^\x00-\x7f]/.test(host)) f("UR006", "high", "Domain with non-ASCII characters.");
    else if (url.startsWith("http://") && !isKnown(host)) f("UR007", "low", "Unencrypted http link to an unknown host.");
    else if (inCommand && !isKnown(host)) f("UR008", "medium", "A command fetches from a host we have not seen before.");
  }
  return out;
}
var HIDDEN_CHARS = /[​-‏‪-‮⁠-⁤⁦-⁩﻿­]/;
var TAG_CHARS = /[\u{E0000}-\u{E007F}]/u;
var B64_BLOB = /[A-Za-z0-9+/]{60,}={0,2}/g;
var HEX_ESC = /(\\x[0-9a-fA-F]{2}){16,}/;
function decodeB64(s) {
  try {
    const txt = Buffer.from(s, "base64").toString("utf8");
    const printable = txt.replace(/[^\x20-\x7e\n\r\t]/g, "").length;
    return printable / Math.max(1, txt.length) > 0.9 ? txt : null;
  } catch {
    return null;
  }
}
function redact(s, max = 100) {
  let t = s.replace(/[A-Za-z0-9+/_\-]{24,}={0,2}/g, (m) => `${m.slice(0, 4)}\u2026[${m.length} chars]`);
  t = t.replace(HIDDEN_CHARS, "\u2420").replace(/[\u{E0000}-\u{E007F}]/gu, "\u2420");
  return t.length > max ? `${t.slice(0, max)}\u2026` : t;
}
var COMMAND_HINT = /^\s*(\$|>|#!|curl|wget|npx|npm|pip|bash|sh|zsh|python|node|iwr|irm|powershell|Invoke-)|`[^`]*(curl|wget|bash|sh -c)[^`]*`/i;
function scanText(text, file, depth, hosts) {
  const out = [];
  const lines = text.split(/\r?\n/);
  let inFence = false;
  for (const m of text.matchAll(/<!--([\s\S]*?)-->/g)) {
    const body = m[1];
    if (/\b(agent|assistant|claude|model|ai|llm|you must|instruction)/i.test(body)) {
      const lineNo = text.slice(0, m.index).split(/\r?\n/).length;
      out.push({ ruleId: "OB004", category: "obfuscation", severity: "medium", file, line: lineNo, excerpt: redact(body.trim()), message: "Hidden HTML comment addressed to the agent. Readers will not see it; the agent will." });
    }
  }
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    for (const r of RULES) {
      if (r.re.test(line)) out.push({ ruleId: r.id, category: r.category, severity: r.severity, file, line: lineNo, excerpt: redact(line.trim()), message: r.message });
    }
    out.push(...urlFindings(line, file, lineNo, hosts, inFence || COMMAND_HINT.test(line)));
    if (HIDDEN_CHARS.test(line) || TAG_CHARS.test(line)) {
      out.push({ ruleId: "OB001", category: "obfuscation", severity: "high", file, line: lineNo, excerpt: redact(line.trim()), message: "Invisible or direction-changing Unicode characters can hide instructions." });
    }
    if (HEX_ESC.test(line)) out.push({ ruleId: "OB002", category: "obfuscation", severity: "medium", file, line: lineNo, excerpt: redact(line.trim()), message: "Long hex-escaped string." });
    for (const m of line.matchAll(B64_BLOB)) {
      const decoded = decodeB64(m[0]);
      if (!decoded) continue;
      out.push({ ruleId: "OB003", category: "obfuscation", severity: "medium", file, line: lineNo, excerpt: redact(m[0]), message: "Base64 text that decodes to readable content." });
      if (depth === 0) {
        for (const inner of scanText(decoded, file, 1, hosts)) {
          out.push({ ...inner, line: lineNo, ruleId: `${inner.ruleId}+B64`, severity: bump(inner.severity), message: `Hidden in base64: ${inner.message}` });
        }
      }
    }
  });
  return out;
}
function bump(s) {
  return SEVERITY_ORDER[Math.min(SEVERITY_ORDER.indexOf(s) + 1, SEVERITY_ORDER.length - 1)];
}
var POPULAR_PACKAGES = [
  "react",
  "react-dom",
  "next",
  "lodash",
  "express",
  "axios",
  "chalk",
  "commander",
  "zod",
  "typescript",
  "dotenv",
  "uuid",
  "moment",
  "dayjs",
  "debug",
  "yargs",
  "inquirer",
  "request",
  "node-fetch",
  "playwright",
  "puppeteer",
  "openai",
  "@anthropic-ai/sdk",
  "@modelcontextprotocol/sdk",
  "requests",
  "numpy",
  "pandas",
  "flask",
  "django",
  "fastapi",
  "pydantic",
  "anthropic",
  "boto3",
  "urllib3",
  "setuptools",
  "beautifulsoup4",
  "selenium",
  "pillow",
  "colorama",
  "cryptography",
  "pyyaml"
];
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
function typosquatOf(name) {
  const n = name.toLowerCase();
  if (POPULAR_PACKAGES.includes(n)) return null;
  for (const p of POPULAR_PACKAGES) {
    const d = editDistance(n, p);
    if (d > 0 && d <= (p.length >= 6 ? 2 : 1)) return p;
  }
  return null;
}
function manifestFindings(f, text) {
  const out = [];
  const base = f.path.split("/").pop() || f.path;
  const dep = (name, spec) => {
    const squat = typosquatOf(name);
    if (squat) out.push({ ruleId: "DP003", category: "dependency", severity: "high", file: f.path, excerpt: redact(name), message: `Package name is one or two letters away from "${squat}" (possible typosquat).` });
    if (/^(git\+|git:|https?:|file:|github:|[\w-]+\/[\w.-]+$)/.test(spec)) out.push({ ruleId: "DP004", category: "dependency", severity: "medium", file: f.path, excerpt: redact(`${name}@${spec}`), message: "Dependency installed from a URL, git or local path instead of the registry." });
  };
  if (base === "package.json") {
    try {
      const pkg = JSON.parse(text);
      for (const hook of ["preinstall", "install", "postinstall", "prepare", "prepublish"]) {
        if (pkg.scripts?.[hook]) out.push({ ruleId: "DP005", category: "dependency", severity: "high", file: f.path, excerpt: redact(`${hook}: ${pkg.scripts[hook]}`), message: `Install hook "${hook}" runs code on install.` });
      }
      for (const group of [pkg.dependencies, pkg.devDependencies, pkg.optionalDependencies]) for (const [n, s] of Object.entries(group || {})) dep(n, String(s));
    } catch {
      out.push({ ruleId: "DP006", category: "dependency", severity: "medium", file: f.path, message: "package.json does not parse." });
    }
  } else if (/^requirements.*\.txt$/.test(base)) {
    for (const line of text.split(/\r?\n/)) {
      const m = line.trim().match(/^([A-Za-z0-9_.\-]+)\s*([=<>!~].*)?$/);
      if (m) dep(m[1], m[2] || "");
      else if (/^(git\+|https?:)/.test(line.trim())) dep(line.trim(), line.trim());
    }
  } else if (base === "pyproject.toml" || base === "setup.py") {
    out.push({ ruleId: "DP007", category: "dependency", severity: "medium", file: f.path, message: "Python build file. Build steps can run code on install; review by hand." });
  }
  return out;
}
var MAX_FILE_BYTES = 1e6;
function scanArtifact(files) {
  const findings = [];
  const hosts = /* @__PURE__ */ new Set();
  const reports = [];
  for (const f of files) {
    const b = bytesOf(f.content);
    const cls = classify(f);
    reports.push({ path: f.path, sha256: sha256(b), bytes: b.length, class: cls });
    const add = (ruleId, severity, message) => findings.push({ ruleId, category: "file_type", severity, file: f.path, message });
    if (f.isSymlink) add("FT001", "high", "Symbolic link. It can point outside the skill folder.");
    if (/(^|\/)\.\.(\/|$)/.test(f.path) || f.path.startsWith("/")) add("FT002", "critical", "Path escapes the skill folder.");
    if (cls === "binary") add("FT003", "high", "Binary file. It cannot be reviewed as text.");
    if (cls === "archive") add("FT004", "high", "Archive inside the skill. Its contents are not reviewed.");
    if (cls === "executable") add("FT005", "medium", "Executable script. A person must read it before anyone runs it.");
    if (cls === "other") add("FT006", "low", "Unexpected file type.");
    if (b.length > MAX_FILE_BYTES) add("FT007", "medium", "File over 1 MB. Only the first 1 MB was scanned.");
    if (cls === "binary" || cls === "archive") continue;
    const text = new TextDecoder("utf-8", { fatal: false }).decode(b.slice(0, MAX_FILE_BYTES));
    findings.push(...scanText(text, f.path, 0, hosts));
    findings.push(...manifestFindings(f, text));
  }
  const seen = /* @__PURE__ */ new Set();
  const unique = findings.filter((x) => {
    const k = `${x.ruleId}|${x.file}|${x.line ?? ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  unique.sort((a, b) => SEVERITY_ORDER.indexOf(b.severity) - SEVERITY_ORDER.indexOf(a.severity) || a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0));
  return {
    scannerVersion: SCANNER_VERSION,
    files: reports,
    artifactHash: combinedHash(reports),
    findings: unique,
    externalHosts: [...hosts].filter((h) => !isKnown(h)).sort()
  };
}

// scripts/lib/scan-cli.ts
function walk(dir, base = dir) {
  return fs.readdirSync(dir).sort().flatMap((n) => {
    const p = path.join(dir, n);
    const st = fs.lstatSync(p);
    const rel = path.relative(base, p).split(path.sep).join("/");
    if (rel.startsWith("evals/")) return [];
    if (st.isSymbolicLink()) return [{ path: rel, content: "", isSymlink: true }];
    return st.isDirectory() ? walk(p, base) : [{ path: rel, content: fs.readFileSync(p), mode: st.mode }];
  });
}
var root = process.argv[2] || "skills";
var bad = 0;
for (const slug of fs.readdirSync(root).filter((s) => fs.existsSync(path.join(root, s, "SKILL.md")))) {
  const res = scanArtifact(walk(path.join(root, slug)));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, slug, "skill.json"), "utf8"));
  for (const f of res.files) if (!["instructions", "config"].includes(f.class)) {
    console.log(`::error file=skills/${slug}/${f.path}::${f.class} file needs a separate security review`);
    bad++;
  }
  for (const f of res.findings) {
    const acked = manifest.acknowledgedFindings?.some((a) => a.ruleId === f.ruleId && a.file === f.file) && f.severity !== "critical";
    const level = SEVERITY_ORDER.indexOf(f.severity) >= SEVERITY_ORDER.indexOf("medium") && !acked ? "error" : "notice";
    console.log(`::${level} file=skills/${slug}/${f.file},line=${f.line ?? 1}::[${f.severity}] ${f.ruleId} ${f.message}${acked ? " (acknowledged; needs reviewer approval)" : ""}`);
    if (level === "error") bad++;
  }
  console.log(`${slug}: ${res.findings.length} finding(s), fingerprint ${res.artifactHash.slice(0, 16)}`);
}
process.exit(bad ? 1 : 0);
