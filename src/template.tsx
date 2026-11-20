import type { ReactNode } from "react";
import {
  Button, Canvas, Column, Document, Email, Heading, Page, Section, Span, Table, TableCell, TableRow, Text, token,
} from "@hyper-elements/react";
import { WalletYear, pickPersona } from "./data";
import { fontFaces, theme } from "./theme";

export type Kind = "email" | "page" | "doc";
const n = (x: number) => x.toLocaleString("en-US");
const ink = token("colors.primary");
const paper = token("colors.paper");
type Bg = "primary" | "flamingo" | "mint" | "sun" | "paper";
const bg = (b: Bg) => token(`colors.${b}` as "colors.primary");
const fgOn = (b: Bg) => (b === "primary" ? paper : ink);

// One color block of the story. A Section in an email or page, a full-bleed page in the PDF.
function Slide({ tone, kind, children }: { tone: Bg; kind: Kind; children: ReactNode }) {
  if (kind === "doc")
    return (
      <Document.Page style={{ backgroundColor: bg(tone) }}>
        <Column style={{ padding: [130, 0, 0, 0], gap: 18 }}>{children}</Column>
      </Document.Page>
    );
  return <Section style={{ backgroundColor: bg(tone), padding: [58, 28], gap: 14 }}>{children}</Section>;
}

// Phone styles only exist for an Email or a Page, so a PDF page gets none.
const phone = (kind: Kind, size: number) => (kind === "doc" ? {} : { mobile: { fontSize: size } });
// Email clients can't load web fonts. If Arial Black is missing, a bold weight keeps the fallback heavy.
const heavy = (kind: Kind) => (kind === "email" ? { fontWeight: 800 as const } : {});
const Stat = ({ tone, size, kind, children }: { tone: Bg; size: number; kind: Kind; children: ReactNode }) => (
  <Text style={{ apply: ["display"], fontSize: size, color: fgOn(tone), ...heavy(kind), ...phone(kind, Math.round(size * 0.68)) }}>{children}</Text>
);
const Say = ({ tone, size = 20, children }: { tone: Bg; size?: number; children: ReactNode }) => (
  <Text style={{ fontSize: size, lineHeight: 1.5, color: fgOn(tone) }}>{children}</Text>
);
const B = ({ children }: { children: ReactNode }) => <Span style={{ fontWeight: 700 }}>{children}</Span>;

function Sections({ d, kind }: { d: WalletYear; kind: Kind }) {
  const persona = pickPersona(d);
  const perDay = (d.txCount / 365).toFixed(2);
  const survived = d.aped - d.rugged;
  const survival = Math.round((survived / d.aped) * 100);
  const top = d.chains[0];
  const full = kind !== "email";
  const doc = kind === "doc";

  return (
    <>
      <Slide tone="primary" kind={kind}>
        <Say tone="primary" size={15}>{d.handle} · {d.address}</Say>
        <Heading level={1} style={{ fontSize: 64, color: paper, ...heavy(kind), ...phone(kind, 44) }}>Your {d.year}, onchain.</Heading>
        <Say tone="primary">Every swap, bridge and 3 AM decision, counted.{doc ? "" : " Scroll to see what you did."}</Say>
      </Slide>

      <Slide tone="flamingo" kind={kind}>
        <Stat kind={kind} tone="flamingo" size={118}>{n(d.txCount)}</Stat>
        <Say tone="flamingo" size={24}>
          transactions signed. That is <B>{perDay}</B> a day. Your wallet did not take a single holiday.
        </Say>
      </Slide>

      {full && (
        <Slide tone="mint" kind={kind}>
          <Stat kind={kind} tone="mint" size={56}>{top.name} was home.</Stat>
          <Say tone="mint">
            {Math.round((top.txs / d.txCount) * 100)}% of your activity lived there. You still visited {d.chains.length - 1} other chains, mostly for airdrops.
          </Say>
          <Table style={{ width: "100%", cellPadding: [10, 12, 10, 0], rowBorder: { width: 1, style: "solid", color: ink }, borderCollapse: "collapse" }}>
            <TableRow header>
              <TableCell>Chain</TableCell>
              <TableCell>Txs</TableCell>
              <TableCell>Share</TableCell>
            </TableRow>
            {d.chains.map((c) => (
              <TableRow key={c.name}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{n(c.txs)}</TableCell>
                <TableCell>{Math.round((c.txs / d.txCount) * 100)}%</TableCell>
              </TableRow>
            ))}
          </Table>
        </Slide>
      )}

      <Slide tone="sun" kind={kind}>
        <Stat kind={kind} tone="sun" size={100}>{d.aped} apes.</Stat>
        <Say tone="sun" size={24}>
          <B>{d.rugged}</B> rugged. <B>{survived}</B> survived. That is a <B>{survival}%</B> survival rate, better than most of the people reading this.
        </Say>
      </Slide>

      {full && (
        <Slide tone="primary" kind={kind}>
          <Stat kind={kind} tone="primary" size={76}>{d.nightOwlHour}</Stat>
          <Say tone="primary">was your most common signing time. Nothing good has ever been approved at that hour, and yet.</Say>
          {doc ? (
            <>
              <Stat kind={kind} tone="primary" size={76}>${n(d.feesUsd)}</Stat>
              <Say tone="primary">in fees. Your longest hold lasted <B>{d.longestHoldDays} days</B>, so the fees were the only thing moving.</Say>
            </>
          ) : null}
        </Slide>
      )}

      {full && !doc && (
        <Slide tone="flamingo" kind={kind}>
          <Stat kind={kind} tone="flamingo" size={84}>${n(d.feesUsd)}</Stat>
          <Say tone="flamingo">in fees. Your longest hold lasted <B>{d.longestHoldDays} days</B>, so the fees were the only thing moving.</Say>
        </Slide>
      )}

      <Slide tone="paper" kind={kind}>
        <Text style={{ apply: ["kicker"], color: ink }}>Your onchain personality</Text>
        <Heading level={2} style={{ fontSize: 54, ...heavy(kind), ...phone(kind, 38) }}>{persona.name}</Heading>
        <Say tone="paper">{persona.blurb}</Say>
        {kind === "email" ? <Button href={d.shareUrl}>See your full Wrapped</Button> : null}
        {doc ? (
          <>
            <Text style={{ apply: ["kicker"], color: ink, padding: [28, 0, 0, 0] }}>The receipts</Text>
            <Table style={{ width: "100%", cellPadding: [9, 10, 9, 0], rowBorder: { width: 1, style: "solid", color: ink }, borderCollapse: "collapse" }}>
              <TableRow header>
                <TableCell style={{ width: 80 }}>Date</TableCell>
                <TableCell>Moment</TableCell>
                <TableCell style={{ width: 100 }}>Amount</TableCell>
              </TableRow>
              {d.moments.map((m) => (
                <TableRow key={m.date}>
                  <TableCell>{m.date}</TableCell>
                  <TableCell>{m.moment}</TableCell>
                  <TableCell>{m.amount}</TableCell>
                </TableRow>
              ))}
            </Table>
            <Text style={{ fontSize: 12, color: token("colors.foreground") }}>Onchain Wrapped is a novelty summary, not financial or tax advice. Sample data for a fictional wallet.</Text>
          </>
        ) : null}
      </Slide>

      {kind === "page" ? (
        <Slide tone="primary" kind={kind}>
          <Say tone="primary">Share yours with #OnchainWrapped</Say>
          <Button href={d.shareUrl} style={{ backgroundColor: token("colors.sun"), color: ink }}>Copy my Wrapped link</Button>
        </Slide>
      ) : null}
    </>
  );
}

// ---------- the four roots, one data object ----------
export function WrappedEmail({ d }: { d: WalletYear }) {
  return (
    <Email theme={theme} width={600} title={`Your ${d.year} onchain Wrapped`} previewText={`${d.txCount} transactions. ${d.aped} apes. Your ${d.year} Wrapped is ready.`} lang="en" style={{ gap: 0 }}>
      <Sections d={d} kind="email" />
    </Email>
  );
}

export function WrappedPage({ d, origin }: { d: WalletYear; origin: string }) {
  return (
    <Page theme={theme} width={680} title={`${d.handle} · Onchain Wrapped ${d.year}`} description={`${d.txCount} transactions, ${d.aped} apes. A year onchain.`} lang="en" fonts={fontFaces(origin)} style={{ gap: 0 }}>
      <Sections d={d} kind="page" />
    </Page>
  );
}

export function WrappedDocument({ d, origin }: { d: WalletYear; origin: string }) {
  return (
    <Document theme={theme} size="Letter" margin={{ top: 56, right: 64, bottom: 56, left: 64 }} title={`Onchain Wrapped ${d.year} · ${d.handle}`} lang="en" fonts={fontFaces(origin)} style={{ fontSize: 18 }}>
      <Sections d={d} kind="doc" />
    </Document>
  );
}

export function WrappedCard({ d, origin }: { d: WalletYear; origin: string }) {
  const persona = pickPersona(d);
  const survived = d.aped - d.rugged;
  const top = d.chains[0];
  const Block = ({ tone, height, children }: { tone: Bg; height: number; children: ReactNode }) => (
    <Column style={{ height, backgroundColor: bg(tone), padding: [44, 72], gap: 10 }}>{children}</Column>
  );
  return (
    <Canvas theme={theme} width={1080} height={1350} title={`Onchain Wrapped ${d.year}`} lang="en" fonts={fontFaces(origin)} style={{ backgroundColor: ink }}>
      <Block tone="primary" height={225}>
        <Text style={{ fontSize: 30, color: paper }}>{d.handle} · {d.address}</Text>
        <Heading level={1} style={{ fontSize: 84, color: paper }}>Your {d.year}, onchain.</Heading>
      </Block>
      <Block tone="flamingo" height={473}>
        <Text style={{ apply: ["display"], fontSize: 230, color: ink }}>{n(d.txCount)}</Text>
        <Text style={{ fontSize: 38, color: ink }}>transactions signed. {top.name} was home.</Text>
      </Block>
      <Block tone="sun" height={360}>
        <Text style={{ apply: ["display"], fontSize: 150, color: ink }}>{d.aped} apes.</Text>
        <Text style={{ fontSize: 38, color: ink }}>{d.rugged} rugged, {survived} survived. ${n(d.feesUsd)} in fees.</Text>
      </Block>
      <Block tone="paper" height={292}>
        <Text style={{ fontSize: 28, color: ink }}>My onchain personality</Text>
        <Heading level={2} fit={{ sizes: [76, 68, 60, 52], maxLines: 2 }} style={{ color: ink }}>{persona.name}</Heading>
      </Block>
    </Canvas>
  );
}
