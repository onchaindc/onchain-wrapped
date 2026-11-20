// One data object drives every output (email, web, PDF).
// All values below are SAMPLE data for a fictional wallet. No API keys needed.
export type WalletYear = {
  year: number;
  handle: string;
  address: string;
  txCount: number;
  chains: { name: string; txs: number }[];
  aped: number;
  rugged: number;
  feesUsd: number;
  nightOwlHour: string;
  longestHoldDays: number;
  favoriteToken: string;
  moments: { date: string; moment: string; amount: string }[];
  shareUrl: string;
};

export const sample: WalletYear = {
  year: 2026,
  handle: "degen.sample",
  address: "0x7a3F...c91E",
  txCount: 412,
  chains: [
    { name: "Base", txs: 171 },
    { name: "Solana", txs: 118 },
    { name: "Arbitrum", txs: 64 },
    { name: "Ethereum", txs: 41 },
    { name: "Mantle", txs: 18 },
  ],
  aped: 23,
  rugged: 9,
  feesUsd: 1940,
  nightOwlHour: "2:14 AM",
  longestHoldDays: 318,
  favoriteToken: "USDC",
  moments: [
    { date: "Feb 11", moment: "Aped into a dog coin at 3 AM", amount: "+$2,310" },
    { date: "Mar 02", moment: "Same coin, now a memory", amount: "-$1,980" },
    { date: "May 19", moment: "Bridged to a new chain for an airdrop", amount: "-$46 fees" },
    { date: "Aug 07", moment: "Airdrop arrived", amount: "+$12" },
    { date: "Oct 30", moment: "Finally sold the thing you forgot about", amount: "+$4,120" },
  ],
  shareUrl: "https://example.com/wrapped/degen.sample",
};

export type Persona = { name: string; blurb: string };

export function pickPersona(d: WalletYear): Persona {
  const rugRate = d.rugged / d.aped;
  if (rugRate >= 0.5)
    return { name: "The Optimistic Donor", blurb: "You fund the experiments so the rest of us can watch. The ecosystem thanks you." };
  if (d.longestHoldDays >= 300)
    return { name: "The Diamond Handed Sleepwalker", blurb: "You held one position for most of a year. Whether that was a strategy or a lost password is between you and your wallet." };
  if (d.chains.length >= 5)
    return { name: "The Bridge Tourist", blurb: "Five chains, one passport, many stamps. Your gas receipts read like a travel diary." };
  return { name: "The Quiet Accumulator", blurb: "Few moves, steady habits. Suspicious, honestly." };
}
