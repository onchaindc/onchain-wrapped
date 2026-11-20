import { defineTheme } from "@hyper-elements/react";

// The Wrapped look, defined once. Every Email, Page, Document and Canvas takes this theme.
export const FONT = {
  display: "'Archivo Black', 'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif",
  body: "'Source Serif 4', Georgia, 'Times New Roman', serif",
};

export const theme = defineTheme({
  colors: {
    background: "#FFF6E5",
    foreground: "#1E1147",
    primary: "#1E1147", // ink
    primaryForeground: "#FFF6E5",
    flamingo: "#FF5C8A",
    mint: "#9BF0C8",
    sun: "#FFD43B",
    paper: "#FFF6E5",
  },
  fonts: { body: FONT.body },
  fontSizes: { body: 18 },
  lineHeights: { body: 1.5 },
  elements: {
    Button: {
      backgroundColor: "{colors.primary}",
      color: "{colors.primaryForeground}",
      borderRadius: 999,
      fontFamily: FONT.display,
      fontSize: 16,
      padding: "16px 30px",
    },
    Heading: { fontFamily: FONT.display, fontWeight: 400, color: "{colors.primary}", lineHeight: 1.02 },
  },
  styles: {
    display: { fontFamily: FONT.display, fontWeight: 400, lineHeight: 1 },
    kicker: { fontFamily: FONT.body, fontSize: 15, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" },
  },
});

export type FontFaceDef = { family: string; src: string; format: "woff"; weight: number; style?: "normal" | "italic" };
export const fontFiles = [
  { family: "Archivo Black", file: "archivo-black-latin-400-normal.woff", weight: 400, style: "normal" as const },
  { family: "Source Serif 4", file: "source-serif-4-latin-400-normal.woff", weight: 400, style: "normal" as const },
  { family: "Source Serif 4", file: "source-serif-4-latin-700-normal.woff", weight: 700, style: "normal" as const },
];
/** Font faces for a design. `origin` is where the fonts folder is served ("." for files opened from disk). */
export const fontFaces = (origin: string): FontFaceDef[] =>
  fontFiles.map((f) => ({ family: f.family, src: `${origin}/fonts/${f.file}`, format: "woff" as const, weight: f.weight, style: f.style }));
