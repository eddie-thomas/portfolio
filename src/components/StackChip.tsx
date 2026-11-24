/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Chip } from "@mui/material";

import { useFocus, useHighlight } from "./HighlightContext";

/**
 * Technology chip
 *
 * - `interactive`: hovering highlights related nodes/cards; clicking toggles the filter
 * - otherwise it is a static label (e.g. inside a card that is itself a link)
 */
export default function StackChip({
  tech,
  interactive = false,
}: {
  tech: string;
  interactive?: boolean;
}) {
  const { selectedTech, setHoverTech, setSelectedTech } = useHighlight();
  const { hasFocus, isTechActive } = useFocus();

  const selected = selectedTech === tech;
  const dimmed = hasFocus && !isTechActive(tech);

  if (!interactive)
    return (
      <Chip
        label={tech}
        sx={{ opacity: dimmed ? 0.45 : 1, transition: "opacity .2s" }}
      />
    );

  return (
    <Chip
      label={tech}
      clickable
      color={selected ? "primary" : "default"}
      variant={selected ? "filled" : "outlined"}
      aria-pressed={selected}
      onClick={() => setSelectedTech(selected ? null : tech)}
      onMouseEnter={() => setHoverTech(tech)}
      onMouseLeave={() => setHoverTech(null)}
      onFocus={() => setHoverTech(tech)}
      onBlur={() => setHoverTech(null)}
      sx={{ opacity: dimmed && !selected ? 0.45 : 1, transition: "opacity .2s" }}
    />
  );
}
