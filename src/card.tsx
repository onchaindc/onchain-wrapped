// Share card: a 1080x1350 PNG of the wallet's year, rendered from the SAME data as the email, web page and PDF.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { renderToHtml, Page, Row, Column, ColumnLayouts, Heading, Paragraph } from "@unlayer/react-elements";
import { sample, pickPersona } from "./data";

const C = { ink: "#1E1147", flamingo: "#FF5C8A", mint: "#9BF0C8", sun: "#FFD43B", paper: "#FFF6E5" };
const display = { label: "Arial Black", value: "'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif" };
const body = { label: "Georgia", value: "Georgia, 'Times New Roman', serif" };

function Block({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <Row layout={ColumnLayouts.OneColumn} backgroundColor={bg} padding="38px 0px">
      <Column padding="0px 72px">{children}</Column>
    </Row>
  );
}
const Big = ({ color, size, children }: { color: string; size: number; children: React.ReactNode }) => (
  <Heading headingType="h1" fontSize={`${size}px`} lineHeight={1} fontWeight={900} fontFamily={display} color={color}>
    {children}
  </Heading>
);
const Say = ({ color, size, html }: { color: string; size: number; html: string }) => (
  <Paragraph html={html} fontSize={`${size}px`} lineHeight={1.4} fontFamily={body} color={color} />
);

const d = sample;
const persona = pickPersona(d);
const survived = d.aped - d.rugged;
const top = d.chains[0];

const card = (
  <Page backgroundColor={C.ink} contentWidth="1080px" fontFamily={body} textColor={C.ink}>
    <Block bg={C.ink}>
      <Say color={C.paper} size={30} html={`${d.handle} &middot; ${d.address}`} />
      <Big color={C.paper} size={84}>{`Your ${d.year}, onchain.`}</Big>
    </Block>
    <Block bg={C.flamingo}>
      <Big color={C.ink} size={230}>{d.txCount.toLocaleString("en-US")}</Big>
      <Say color={C.ink} size={38} html={`transactions signed. ${top.name} was home.`} />
    </Block>
    <Block bg={C.sun}>
      <Big color={C.ink} size={150}>{`${d.aped} apes.`}</Big>
      <Say color={C.ink} size={38} html={`<b>${d.rugged}</b> rugged, <b>${survived}</b> survived. $${d.feesUsd.toLocaleString("en-US")} in fees.`} />
    </Block>
    <Block bg={C.paper}>
      <Say color={C.ink} size={28} html="My onchain personality" />
      <Big color={C.ink} size={76}>{persona.name}</Big>
    </Block>
  </Page>
);

mkdirSync("out", { recursive: true });
writeFileSync("out/card.html", renderToHtml(card));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(pathToFileURL(resolve("out/card.html")).href);
await page.addStyleTag({ content: "html,body{margin:0}" });
await page.screenshot({ path: "out/share-card.png", clip: { x: 0, y: 0, width: 1080, height: 1350 } });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await browser.close();
console.log(`out/share-card.png (content height ${h}px, card is 1350px)`);
