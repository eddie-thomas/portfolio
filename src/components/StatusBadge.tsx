/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Box, useTheme } from "@mui/material";
import { CircleCheck, CircleDot, CirclePause } from "lucide-react";

import { type Status, STATUS_LABEL } from "../content";
import { MONO, statusColor } from "../theme";

const ICONS = {
  "in-progress": CircleDot,
  shipped: CircleCheck,
  shelved: CirclePause,
};

export default function StatusBadge({ status }: { status: Status }) {
  const theme = useTheme();
  const Icon = ICONS[status];

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        fontFamily: MONO,
        fontSize: "0.75rem",
        color: statusColor(theme, status),
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={14} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </Box>
  );
}
