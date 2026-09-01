#!/usr/bin/env node
// Fails if any module file declares ambient globals, which bypass no-restricted-imports
// (no import statement exists, so the module boundary lint rule can't see the dependency).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const MODULES_ROOT = join(import.meta.dirname, "..", "src", "modules");
const FORBIDDEN = /\bdeclare\s+global\b/;
const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (![".ts", ".tsx"].includes(extname(entry))) continue;
    if (FORBIDDEN.test(readFileSync(full, "utf8"))) offenders.push(full);
  }
}

walk(MODULES_ROOT);

if (offenders.length > 0) {
  console.error(
    "`declare global` is forbidden inside src/modules/** — it makes symbols globally " +
      "visible without an import, bypassing the no-restricted-imports module boundary rule.\n" +
      "Offending files:"
  );
  for (const f of offenders) console.error(`  - ${f}`);
  process.exit(1);
}
