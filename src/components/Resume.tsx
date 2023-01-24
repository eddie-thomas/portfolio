import { Button, styled, Typography } from "@mui/material";
import { openResume } from "../utils";

const ResumeButton = styled(Button)(() => ({
  textTransform: "capitalize",
}));

export default function Resume() {
  return (
    <ResumeButton color="inherit" onClick={openResume}>
      <Typography>Resume/CV</Typography>
    </ResumeButton>
  );
}
