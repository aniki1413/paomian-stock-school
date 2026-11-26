import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const assetsDir = join(root, "assets-b64");

if (!existsSync(assetsDir)) {
  process.exit(0);
}

function decodeTo(relOut, b64) {
  const dest = join(root, relOut);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, Buffer.from(b64.replace(/\s+/g, ""), "base64"));
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.endsWith(".b64part")) {
        const rel = relative(assetsDir, full).slice(0, -".b64part".length);
        const parts = readdirSync(full)
          .filter((name) => !name.startsWith("."))
          .sort();
        const b64 = parts.map((name) => readFileSync(join(full, name), "utf8")).join("");
        decodeTo(rel, b64);
      } else {
        walk(full);
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".b64")) {
      const relFromAssets = relative(assetsDir, full);
      decodeTo(relFromAssets.slice(0, -".b64".length), readFileSync(full, "utf8"));
    }
  }
}

walk(assetsDir);
