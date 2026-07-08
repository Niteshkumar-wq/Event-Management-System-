const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  ["text-white", "text-slate-900"],
  ["bg-slate-800/60", "bg-teal-50"],
  ["bg-slate-800", "bg-slate-100"],
  ["hover:bg-slate-800", "hover:bg-slate-100"],
  ["hover:bg-violet-500", "hover:bg-teal-600"],
  ["text-emerald-400", "text-emerald-600"],
  ["text-amber-400", "text-amber-600"],
  ["text-blue-400", "text-blue-600"],
  ["text-purple-400", "text-purple-600"],
  ["text-pink-400", "text-pink-600"],
  ["text-cyan-400", "text-cyan-600"],
  ["text-red-400", "text-red-600"],
  ["text-slate-400 border", "text-slate-600 border"],
  ["text-xs font-semibold text-slate-400 uppercase", "text-xs font-semibold text-slate-500 uppercase"],
  ["text-sm text-slate-400", "text-sm text-slate-600"],
  ["p-4 text-left text-xs font-semibold text-slate-400", "p-4 text-left text-xs font-semibold text-slate-600"],
];

const BUTTON_WHITE_PATTERNS = [
  /bg-teal-600[^"]*text-slate-900/g,
  /bg-emerald-600[^"]*text-slate-900/g,
  /bg-red-500[^"]*text-slate-900/g,
  /bg-gradient[^"]*text-slate-900/g,
  /from-teal-500[^"]*text-slate-900/g,
  /btn-primary[^"]*text-slate-900/g,
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".css")) {
      let content = fs.readFileSync(full, "utf-8");
      let changed = false;
      for (const [from, to] of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      // Restore white text on colored buttons/avatars
      content = content.replace(/text-slate-900/g, (match, offset) => {
        const lineStart = content.lastIndexOf("\n", offset) + 1;
        const lineEnd = content.indexOf("\n", offset);
        const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
        if (
          line.includes("bg-teal-") ||
          line.includes("bg-emerald-") ||
          line.includes("bg-red-") ||
          line.includes("bg-gradient") ||
          line.includes("from-teal-") ||
          line.includes("btn-primary") ||
          line.includes("text-white") ||
          (line.includes("rounded-full") && line.includes("font-bold"))
        ) {
          return "text-white";
        }
        return match;
      });
      if (changed) {
        fs.writeFileSync(full, content);
        console.log("Updated:", path.relative(path.join(__dirname, ".."), full));
      }
    }
  }
}

walk(ROOT);
console.log("Done.");
