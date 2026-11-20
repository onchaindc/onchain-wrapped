// Copies the fonts from their @fontsource packages into public/fonts after `npm install`,
// so the repository itself holds no binary font files.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const files = [
  ["archivo-black", "archivo-black-latin-400-normal.woff"],
  ["source-serif-4", "source-serif-4-latin-400-normal.woff"],
  ["source-serif-4", "source-serif-4-latin-700-normal.woff"],
];
const out = resolve("public/fonts");
mkdirSync(out, { recursive: true });
for (const [pkg, file] of files) {
  const from = resolve("node_modules/@fontsource", pkg, "files", file);
  if (!existsSync(from)) {
    console.error(`copy-fonts: missing ${from}. Run npm install first.`);
    process.exit(1);
  }
  copyFileSync(from, resolve(out, file));
}
console.log(`copy-fonts: ${files.length} font files ready in public/fonts`);
