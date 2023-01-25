import { IconButton, Tooltip, Typography } from "@mui/material";
import { type SnackbarKey, useSnackbar } from "notistack";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";

import { copyTextToClipboard } from "../utils";

/**
 * Copy button, indicating to user that they can copy the contents
 *
 * @param props -
 * @param props.content - The content meant to be injected into the user's clipboard
 * @param props.name - Name of what is being copied, for reference
 * @returns JSX.Element
 */
export default function CopyButton({
  content,
  name,
}: {
  content: string;
  name?: string;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Handler for click event that copy's content
   */
  const handleClick = () => {
    const didCopy = copyTextToClipboard(content);
    const id: SnackbarKey | undefined = didCopy
      ? enqueueSnackbar(
          <Typography>Copied{` ${name}` ?? ""} to clipboard!</Typography>,
          {
            variant: "success",
            onClick: () => closeSnackbar(id),
          }
        )
      : undefined;
  };

  return (
    <Tooltip title={<Typography>Copy to clipboard.</Typography>}>
      <IconButton size="small" onClick={handleClick}>
        <FileCopyOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
