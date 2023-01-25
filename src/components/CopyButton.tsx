import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

import { copyTextToClipboard } from "../utils";

/**
 * Copy button, indicating to user that they can copy the contents
 * @param props -
 * @param props.content - The content meant to be injected into the user's clipboard
 * @returns JSX.Element
 */
export default function CopyButton({ content }: { content: string }) {
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Handler for click event that copy's content
   */
  const handleClick = () => {
    handleTooltipOpen();
    copyTextToClipboard(content);
  };

  /**
   * Closes tool-tip
   */
  const handleTooltipClose = () => {
    setOpen(false);
  };

  /**
   * Opens tool-tip
   */
  const handleTooltipOpen = () => {
    setOpen(true);
    setTimeout(handleTooltipClose, 1500);
  };

  return (
    <Tooltip open={open} title="Copied to clipboard!">
      <IconButton size="small" onClick={handleClick}>
        <FileCopyOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
