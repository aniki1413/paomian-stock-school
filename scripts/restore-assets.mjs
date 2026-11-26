import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const assetsDir = join(root, "assets-b64");

if (!existsSync(assetsDir)) {
  process.exit(0);
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".b64")) continue;
    const relFromAssets = relative(assetsDir, full);
    const outRel = relFromAssets.slice(0, -".b64".length);
    const dest = join(root, outRel);
    mkdirSync(dirname(dest), { recursive: true });
    const b64 = readFileSync(full, "utf8").replace(/\s+/g, "");
    writeFileSync(dest, Buffer.from(b64, "base64"));
  }
}

walk(assetsDir);
