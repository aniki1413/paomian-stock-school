/**
 * Build Capacitor icon/splash sources from the approved 1024 icon.
 * Splash background is the game page color (#f6d2ae), with the icon centered.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "native-assets");
const page = { r: 246, g: 210, b: 174, alpha: 1 };

const candidates = [
  join(root, "app-cover/icon_B_family_1024_v2.png"),
  join(root, "native-assets/source-icon.png"),
];

const source = candidates.find((path) => existsSync(path));
if (!source) {
  console.error("Missing the 1024 app icon. Expected one of:");
  for (const path of candidates) console.error("  " + path);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const iconPath = join(outDir, "source-icon.png");
if (source !== iconPath) copyFileSync(source, iconPath);

const icon = sharp(iconPath).resize(1024, 1024, { fit: "cover" }).png();
await icon.toFile(join(outDir, "icon-only.png"));
await sharp(iconPath)
  .resize(1024, 1024, { fit: "cover" })
  .png()
  .toFile(join(outDir, "icon-foreground.png"));
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: page } })
  .png()
  .toFile(join(outDir, "icon-background.png"));

async function splash(name) {
  const canvas = sharp({
    create: { width: 2732, height: 2732, channels: 4, background: page },
  });
  const mark = await sharp(iconPath)
    .resize(1680, 1680, { fit: "contain", background: page })
    .png()
    .toBuffer();
  await canvas
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(join(outDir, name));
}

await splash("splash.png");
await splash("splash-dark.png");
console.log("Wrote native-assets from", source);
