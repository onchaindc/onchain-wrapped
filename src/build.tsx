// npm run build: renders all four outputs from the one sample object into out/.
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { WrappedCard, WrappedDocument, WrappedEmail, WrappedPage } from "./template";
import { fontFiles } from "./theme";
import { sample } from "./data";

const out = resolve("out");
await mkdir(resolve(out, "fonts"), { recursive: true });
for (const f of fontFiles) await copyFile(resolve("public/fonts", f.file), resolve(out, "fonts", f.file));

// PDF and image rendering read only the font files they are given.
const fonts = await Promise.all(
  fontFiles.map(async (f) => ({ family: f.family, weight: f.weight, style: f.style, src: new Uint8Array(await readFile(resolve("public/fonts", f.file))) })),
);

const show = (name: string, size: number, diagnostics: { severity: string; code: string }[]) => {
  const worth = diagnostics.filter((x) => x.severity !== "info").map((x) => x.code);
  console.log(`out/${name}  ${(size / 1024).toFixed(1)} KB${worth.length ? `  (${worth.join(", ")})` : ""}`);
};

const email = await render(<WrappedEmail d={sample} />);
await writeFile(resolve(out, "email.html"), email.html);
await writeFile(resolve(out, "email.txt"), email.text);
show("email.html", email.html.length, email.diagnostics);

// "." makes font URLs relative, so the page works when opened straight from disk.
const page = await render(<WrappedPage d={sample} origin="." />);
await writeFile(resolve(out, "web.html"), page.html);
await writeFile(resolve(out, "index.html"), page.html);
show("web.html", page.html.length, page.diagnostics);

const pdf = await renderPdf(<WrappedDocument d={sample} origin="." />, { fonts });
await writeFile(resolve(out, "wrapped.pdf"), pdf.pdf);
show("wrapped.pdf", pdf.pdf.length, pdf.diagnostics);

const card: any = await renderImage(<WrappedCard d={sample} origin="." />, { fonts, format: "png" } as never);
const png: Uint8Array = card.png ?? card.image ?? card.data ?? card;
await writeFile(resolve(out, "share-card.png"), png);
show("share-card.png", png.length, card.diagnostics ?? []);
