const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  ["text-slate-100", "text-slate-900"],
  ["text-slate-200", "text-slate-800"],
  ["text-slate-300", "text-slate-700"],
  ["text-violet-400", "text-teal-600"],
  ["text-violet-300", "text-teal-700"],
  ["text-violet-500", "text-teal-600"],
  ["from-violet-600", "from-teal-600"],
  ["from-violet-500", "from-teal-500"],
  ["to-violet-500", "to-teal-500"],
  ["to-violet-400", "to-teal-400"],
  ["to-violet-600", "to-teal-600"],
  ["via-violet-600", "via-teal-600"],
  ["bg-violet-500/10", "bg-teal-50"],
  ["bg-violet-500/15", "bg-teal-50"],
  ["bg-violet-500/[0.03]", "bg-teal-50/50"],
  ["bg-violet-600", "bg-teal-600"],
  ["shadow-violet-500/20", "shadow-teal-500/20"],
  ["shadow-violet-500/30", "shadow-teal-500/30"],
  ["hover:from-violet-500", "hover:from-teal-500"],
  ["hover:to-violet-400", "hover:to-teal-400"],
  ["hover:text-violet-400", "hover:text-teal-600"],
  ["hover:text-violet-300", "hover:text-teal-700"],
  ["hover:bg-violet-500/5", "hover:bg-teal-50"],
  ["bg-slate-900/40", "bg-white"],
  ["bg-slate-900/20", "bg-slate-50"],
  ["bg-slate-800/50", "bg-slate-100"],
  ["bg-slate-800/40", "bg-slate-100"],
  ["bg-slate-800/30", "bg-slate-100"],
  ["bg-slate-800/20", "bg-slate-50"],
  ["border-slate-800/40", "border-slate-200"],
  ["border-slate-800/30", "border-slate-200"],
  ["border-slate-700/50", "border-slate-200"],
  ["border-slate-800/20", "border-slate-100"],
  ["border-slate-700/30", "border-slate-200"],
  ["bg-slate-900/30", "bg-slate-50"],
  ["bg-slate-900/60", "bg-slate-100"],
  ["bg-slate-900 border", "bg-white border"],
  ["border-slate-800", "border-slate-200"],
  ["border-l border-slate-800", "border-l border-slate-200"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".tsx")) {
      let content = fs.readFileSync(full, "utf-8");
      let changed = false;
      for (const [from, to] of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content);
        console.log("Updated:", path.relative(ROOT, full));
      }
    }
  }
}

walk(ROOT);
console.log("Done.");
