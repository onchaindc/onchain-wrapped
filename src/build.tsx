import { writeFileSync, mkdirSync } from "node:fs";
import { renderToHtml, renderToJson } from "@unlayer/react-elements";
import { Wrapped, type Mode } from "./template";
import { sample } from "./data";

mkdirSync("out", { recursive: true });
const modes: Mode[] = ["email", "web", "document"];
for (const mode of modes) {
  const html = renderToHtml(<Wrapped d={sample} mode={mode} />);
  writeFileSync(`out/${mode}.html`, html);
  console.log(`out/${mode}.html  ${(html.length / 1024).toFixed(1)} KB`);
}
// Design JSON loads straight into the Unlayer visual editor.
writeFileSync("out/design.json", JSON.stringify(renderToJson(<Wrapped d={sample} mode="web" />), null, 2));
console.log("out/design.json");
