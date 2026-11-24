/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { alpha, createTheme, type PaletteMode, type Theme } from "@mui/material";

import { type Status } from "./content";

export const SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const TOKENS = {
  light: {
    bg: "#F7F7F4",
    paper: "#FFFFFF",
    ink: "#16181D",
    muted: "#5B6270",
    line: "#E3E3DE",
    accent: "#4F46E5",
    amber: "#B45309",
    green: "#15803D",
  },
  dark: {
    bg: "#0E1014",
    paper: "#15181E",
    ink: "#E7E9EE",
    muted: "#9AA1AE",
    line: "#262A33",
    accent: "#8B8CF8",
    amber: "#F59E0B",
    green: "#4ADE80",
  },
};

/** Colour for a project status, used by badges and graph nodes */
export const statusColor = (theme: Theme, status: Status) =>
  status === "in-progress"
    ? theme.palette.warning.main
    : status === "shipped"
    ? theme.palette.success.main
    : theme.palette.text.secondary;

export function buildTheme(mode: PaletteMode): Theme {
  const t = TOKENS[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.accent,
        contrastText: mode === "dark" ? TOKENS.dark.bg : "#FFFFFF",
      },
      warning: { main: t.amber },
      success: { main: t.green },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.ink, secondary: t.muted },
      divider: t.line,
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: SANS,
      h1: {
        fontWeight: 700,
        fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
        letterSpacing: "-0.03em",
        lineHeight: 1.1,
      },
      h2: {
        fontWeight: 700,
        fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
        letterSpacing: "-0.02em",
        lineHeight: 1.15,
      },
      h3: { fontWeight: 600, fontSize: "1.5rem", letterSpacing: "-0.01em" },
      h4: { fontWeight: 600, fontSize: "1.25rem" },
      h5: { fontWeight: 600, fontSize: "1.1rem" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      body1: { lineHeight: 1.7 },
      overline: {
        fontFamily: MONO,
        fontSize: "0.75rem",
        letterSpacing: "0.08em",
        textTransform: "none",
      },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: "antialiased" },
          "::selection": { backgroundColor: alpha(t.accent, 0.25) },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "transparent" },
        styleOverrides: {
          root: {
            backdropFilter: "saturate(180%) blur(12px)",
            backgroundColor: alpha(t.bg, 0.8),
            borderBottom: `1px solid ${t.line}`,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${t.line}`,
            transition: "transform .2s ease, border-color .2s ease, opacity .2s ease",
          },
        },
      },
      MuiChip: {
        defaultProps: { size: "small", variant: "outlined" },
        styleOverrides: {
          root: { fontFamily: MONO, fontSize: "0.75rem", borderColor: t.line },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiLink: {
        defaultProps: { underline: "hover" },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { backgroundImage: "none", border: `1px solid ${t.line}` },
        },
      },
      MuiDrawer: {
        styleOverrides: { paper: { backgroundImage: "none" } },
      },
    },
  });
}
