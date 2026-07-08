#!/usr/bin/env node
/**
 * Auto-push watcher — commits and pushes changes to GitHub automatically.
 * Usage: npm run auto-push
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEBOUNCE_MS = 5000;

const IGNORE = [
  "node_modules",
  ".next",
  ".git",
  "package-lock.json",
  ".env",
  ".env.local",
];

let timer = null;
let isPushing = false;

function log(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
}

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, stdio: "pipe", encoding: "utf-8" });
}

function hasChanges() {
  try {
    const status = run("git status --porcelain");
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

function pushChanges() {
  if (isPushing) return;
  if (!hasChanges()) {
    log("No changes to push.");
    return;
  }

  isPushing = true;
  try {
    run("git add -A");
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    run(`git commit -m "Auto-sync: ${timestamp}"`);
    run("git push origin main");
    log("Changes pushed to GitHub successfully.");
  } catch (err) {
    const msg = err.stderr || err.message || String(err);
    if (msg.includes("nothing to commit")) {
      log("Nothing new to commit.");
    } else {
      log(`Push failed: ${msg.trim()}`);
    }
  } finally {
    isPushing = false;
  }
}

function schedulePush() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(pushChanges, DEBOUNCE_MS);
}

function shouldWatch(filePath) {
  const rel = path.relative(ROOT, filePath);
  return !IGNORE.some((dir) => rel.startsWith(dir));
}

function watchDir(dir) {
  if (!fs.existsSync(dir)) return;

  fs.watch(dir, { recursive: true }, (event, filename) => {
    if (!filename) return;
    const fullPath = path.join(dir, filename);
    if (!shouldWatch(fullPath)) return;
    log(`Change detected: ${filename}`);
    schedulePush();
  });
}

log("Auto-push watcher started.");
log(`Watching for changes (debounce: ${DEBOUNCE_MS / 1000}s)...`);
log("Press Ctrl+C to stop.\n");

watchDir(path.join(ROOT, "src"));
watchDir(path.join(ROOT, "public"));

// Also watch root config files
["package.json", "next.config.ts", "tsconfig.json"].forEach((file) => {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) {
    fs.watch(full, () => {
      log(`Change detected: ${file}`);
      schedulePush();
    });
  }
});

process.on("SIGINT", () => {
  log("\nStopping auto-push watcher.");
  process.exit(0);
});
