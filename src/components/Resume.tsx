import { Button, Divider, styled, Typography } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { openLink } from "../utils";

const ResumeButton = styled(Button)(() => ({
  textTransform: "capitalize",
  width: "100%",
  display: "flex",
  justifyContent: "left",
}));

/**
 * Resume button that opens resume in a separate tab
 *
 * @returns JSX.Element
 */
export default function Resume() {
  return (
    <ResumeButton
      color="inherit"
      onClick={() =>
        openLink(
          "https://docs.google.com/document/d/1LDzMgp_i8amZWFCHoO_rnBQTyUY35tb2xmDQFOgtaZ8/edit"
        )
      }
    >
      <Typography variant="h4">Resume/CV</Typography>
      <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
      <FileOpenIcon />
    </ResumeButton>
  );
}
