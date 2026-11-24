/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type ReactNode } from "react";
import { Box, GlobalStyles, IconButton, useTheme } from "@mui/material";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  type SnackbarKey,
  SnackbarProvider as NotistackProvider,
  useSnackbar,
} from "notistack";

import { MONO } from "../theme";

/** Variant icon, coloured by status (the snack's border uses the same colour) */
function SnackIcon({ children, color }: { children: ReactNode; color: string }) {
  return (
    <Box component="span" sx={{ display: "flex", color, mr: 1.5, flexShrink: 0 }}>
      {children}
    </Box>
  );
}

function CloseAction({ id }: { id: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      aria-label="Dismiss"
      onClick={() => closeSnackbar(id)}
      sx={{ color: "text.secondary", p: 1.25 }}
    >
      <X size={20} />
    </IconButton>
  );
}

/**
 * notistack v2, restyled to match the site: paper surface, a border and
 * lucide icon both coloured by status, and a dismiss button.
 */
export default function SnackbarProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const { palette } = theme;

  const accents = {
    Default: palette.text.secondary,
    Success: palette.success.main,
    Error: palette.error.main,
    Warning: palette.warning.main,
    Info: palette.primary.main,
  };

  // Three classes beat notistack's own two-class selectors regardless of order
  const item = ".SnackbarItem-wrappedRoot .SnackbarItem-contentRoot.SnackbarItem-contentRoot";

  return (
    <>
      <GlobalStyles
        styles={{
          [item]: {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            border: `1px solid ${accents.Default}`,
            borderRadius: theme.shape.borderRadius,
            boxShadow:
              palette.mode === "light"
                ? "0 10px 30px -12px rgba(22, 24, 29, 0.25)"
                : "0 10px 30px -12px rgba(0, 0, 0, 0.7)",
            fontFamily: theme.typography.fontFamily,
            fontSize: "0.875rem",
            padding: "4px 8px 4px 14px",
            minWidth: 0,
            maxWidth: 420,
            // Icon | text | ×, always on one row (notistack defaults to wrap)
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
          },
          ...Object.fromEntries(
            (["Success", "Error", "Warning", "Info"] as const).map((variant) => [
              `${item}.SnackbarItem-variant${variant}`,
              {
                backgroundColor: palette.background.paper,
                color: palette.text.primary,
                borderColor: accents[variant],
              },
            ])
          ),
          // Icon + text: takes the remaining space and lets long text wrap
          ".SnackbarItem-wrappedRoot .SnackbarItem-message": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: "1 1 auto",
            minWidth: 0,
            padding: "10px 0",
            lineHeight: 1.5,
            overflowWrap: "anywhere",
          },
          // × button: fixed size, stays on the right, vertically centred
          ".SnackbarItem-wrappedRoot .SnackbarItem-action": {
            display: "flex",
            alignItems: "center",
            flex: "0 0 auto",
            alignSelf: "center",
            paddingLeft: 12,
            marginLeft: "auto",
            marginRight: 0,
          },
          // Monospace for anything wrapped in <code> inside a message
          ".SnackbarItem-message code": { fontFamily: MONO, fontSize: "0.8rem" },
        }}
      />
      <NotistackProvider
        maxSnack={3}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={(id) => <CloseAction id={id} />}
        iconVariant={{
          default: (
            <SnackIcon color={accents.Default}>
              <Info size={18} />
            </SnackIcon>
          ),
          success: (
            <SnackIcon color={accents.Success}>
              <CircleCheck size={18} />
            </SnackIcon>
          ),
          error: (
            <SnackIcon color={accents.Error}>
              <CircleX size={18} />
            </SnackIcon>
          ),
          warning: (
            <SnackIcon color={accents.Warning}>
              <TriangleAlert size={18} />
            </SnackIcon>
          ),
          info: (
            <SnackIcon color={accents.Info}>
              <CircleAlert size={18} />
            </SnackIcon>
          ),
        }}
      >
        {children}
      </NotistackProvider>
    </>
  );
}
