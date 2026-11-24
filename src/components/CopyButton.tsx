/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { IconButton, Tooltip } from "@mui/material";
import { Copy } from "lucide-react";
import { useSnackbar } from "notistack";

import { copyTextToClipboard } from "../utils";

/**
 * Copy button, indicating to user that they can copy the contents
 *
 * @param props.content - The content meant to be injected into the user's clipboard
 * @param props.name - Name of what is being copied, for reference
 */
export default function CopyButton({
  content,
  name,
}: {
  content: string;
  name?: string;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    if (copyTextToClipboard(content))
      enqueueSnackbar(`Copied${name ? ` ${name}` : ""} to clipboard.`, {
        variant: "success",
      });
  };

  return (
    <Tooltip title="Copy to clipboard">
      <IconButton size="small" onClick={handleClick} aria-label={`Copy ${name ?? "text"}`}>
        <Copy size={16} />
      </IconButton>
    </Tooltip>
  );
}
