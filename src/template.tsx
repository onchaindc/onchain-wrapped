import type { ReactNode } from "react";
import {
  Email, Page, Document, Row, Column, ColumnLayouts,
  Heading, Paragraph, Button, Table, Divider, PageBreak,
} from "@unlayer/react-elements";
import { WalletYear, pickPersona } from "./data";

export type Mode = "email" | "web" | "document";

const C = {
  ink: "#1E1147",
  flamingo: "#FF5C8A",
  mint: "#9BF0C8",
  sun: "#FFD43B",
  paper: "#FFF6E5",
};

const display = { label: "Arial Black", value: "'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif" };
const body = { label: "Georgia", value: "Georgia, 'Times New Roman', serif" };

type Tone = { bg: string; fg: string };
const tones: Record<string, Tone> = {
  ink: { bg: C.ink, fg: C.paper },
  flamingo: { bg: C.flamingo, fg: C.ink },
  mint: { bg: C.mint, fg: C.ink },
  sun: { bg: C.sun, fg: C.ink },
  paper: { bg: C.paper, fg: C.ink },
};

// One full width color block. Every stat in the Wrapped story is one of these.
function Block({ tone, mode, children }: { tone: keyof typeof tones; mode: Mode; children: ReactNode }) {
  const pad = mode === "document" ? "90px 36px" : "56px 28px";
  return (
    <Row layout={ColumnLayouts.OneColumn} backgroundColor={tones[tone].bg} padding={pad}>
      <Column>{children}</Column>
    </Row>
  );
}

function Big({ tone, children, size = 84 }: { tone: keyof typeof tones; children: ReactNode; size?: number }) {
  return (
    <Heading headingType="h1" fontSize={`${size}px`} lineHeight={1} fontWeight={900} fontFamily={display} color={tones[tone].fg}>
      {children}
    </Heading>
  );
}

function Say({ tone, html, size = 18 }: { tone: keyof typeof tones; html: string; size?: number }) {
  return <Paragraph html={html} fontSize={`${size}px`} lineHeight={1.5} fontFamily={body} color={tones[tone].fg} />;
}

const n = (x: number) => x.toLocaleString("en-US");

export function WrappedContent({ d, mode }: { d: WalletYear; mode: Mode }) {
  const persona = pickPersona(d);
  const perDay = (d.txCount / 365).toFixed(2);
  const survived = d.aped - d.rugged;
  const survival = Math.round((survived / d.aped) * 100);
  const top = d.chains[0];
  const full = mode !== "email";

  return (
    <>
      <Block tone="ink" mode={mode}>
        <Say tone="ink" html={`${d.handle} &middot; ${d.address}`} size={15} />
        <Big tone="ink" size={64}>{`Your ${d.year}, onchain.`}</Big>
        <Say tone="ink" html="Every swap, bridge and 3 AM decision, counted. Scroll to see what you did." />
      </Block>

      <Block tone="flamingo" mode={mode}>
        <Big tone="flamingo" size={110}>{n(d.txCount)}</Big>
        <Say tone="flamingo" size={22} html={`transactions signed. That is <b>${perDay}</b> a day. Your wallet did not take a single holiday.`} />
      </Block>

      {full && (
        <Block tone="mint" mode={mode}>
          <Big tone="mint" size={56}>{`${top.name} was home.`}</Big>
          <Say tone="mint" html={`${Math.round((top.txs / d.txCount) * 100)}% of your activity lived there. You still visited ${d.chains.length - 1} other chains, mostly for airdrops.`} />
          <Table
            headers={["Chain", "Txs", "Share"]}
            data={d.chains.map((c) => [c.name, n(c.txs), `${Math.round((c.txs / d.txCount) * 100)}%`])}
          />
        </Block>
      )}

      <Block tone="sun" mode={mode}>
        <Big tone="sun" size={96}>{`${d.aped} apes.`}</Big>
        <Say tone="sun" size={22} html={`<b>${d.rugged}</b> rugged. <b>${survived}</b> survived. That is a <b>${survival}%</b> survival rate, which is better than most of the people reading this.`} />
      </Block>

      {full && (
        <Block tone="ink" mode={mode}>
          <Big tone="ink" size={72}>{d.nightOwlHour}</Big>
          <Say tone="ink" size={20} html="was your most common signing time. Nothing good has ever been approved at that hour, and yet." />
        </Block>
      )}

      {full && (
        <Block tone="flamingo" mode={mode}>
          <Big tone="flamingo" size={80}>{`$${n(d.feesUsd)}`}</Big>
          <Say tone="flamingo" size={20} html={`in fees. Your longest hold lasted <b>${d.longestHoldDays} days</b>, which means the fees were the only thing moving.`} />
        </Block>
      )}

      <Block tone="paper" mode={mode}>
        <Say tone="paper" size={16} html="Your onchain personality" />
        <Big tone="paper" size={52}>{persona.name}</Big>
        <Say tone="paper" size={20} html={persona.blurb} />
        {mode === "email" && (
          <Button href={d.shareUrl} backgroundColor={C.ink} color={C.paper} fontFamily={display} fontSize="16px" padding="16px 28px" borderRadius="999px">
            See your full Wrapped
          </Button>
        )}
      </Block>

      {mode === "document" && (
        <>
          <Row layout={ColumnLayouts.OneColumn} backgroundColor="#FFFFFF" padding="40px 36px">
            <Column>
              <PageBreak />
              <Heading headingType="h2" fontSize="34px" fontFamily={display} color={C.ink}>The receipts</Heading>
              <Paragraph fontFamily={body} fontSize="16px" color={C.ink} lineHeight={1.5}>
                Five moments worth framing. Sample data for a fictional wallet.
              </Paragraph>
              <Table headers={["Date", "Moment", "Amount"]} data={d.moments.map((m) => [m.date, m.moment, m.amount])} />
              <Divider borderTopColor={C.ink} />
              <Paragraph fontFamily={body} fontSize="12px" color="#555555">
                Onchain Wrapped is a novelty summary, not financial or tax advice.
              </Paragraph>
            </Column>
          </Row>
        </>
      )}

      {mode === "web" && (
        <Block tone="ink" mode={mode}>
          <Say tone="ink" html="Share yours with #OnchainWrapped" />
          <Button href={d.shareUrl} backgroundColor={C.sun} color={C.ink} fontFamily={display} fontSize="16px" padding="16px 28px" borderRadius="999px">
            Copy my Wrapped link
          </Button>
        </Block>
      )}
    </>
  );
}

export function Wrapped({ d, mode }: { d: WalletYear; mode: Mode }) {
  const common = { backgroundColor: C.ink, contentWidth: "640px", fontFamily: body, textColor: C.ink };
  if (mode === "email")
    return (
      <Email {...common} previewText={`${d.txCount} transactions. ${d.aped} apes. Your ${d.year} onchain Wrapped is ready.`}>
        <WrappedContent d={d} mode={mode} />
      </Email>
    );
  if (mode === "web")
    return (
      <Page {...common}>
        <WrappedContent d={d} mode={mode} />
      </Page>
    );
  return (
    <Document {...common} documentSize="Letter" documentOrientation="portrait">
      <WrappedContent d={d} mode={mode} />
    </Document>
  );
}
