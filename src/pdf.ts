import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("out/document.html", "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
writeFileSync("out/onchain-wrapped.pdf", pdf);
console.log(`out/onchain-wrapped.pdf  ${(pdf.length / 1024).toFixed(1)} KB`);
await browser.close();
