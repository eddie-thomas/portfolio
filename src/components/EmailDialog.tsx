/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  SlideProps,
  styled,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import { type ChangeEvent, forwardRef, useState } from "react";
import { sendMail } from "../utils";

interface Props {
  onClose: () => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  m: theme.spacing(3),
  "& .MuiTextField-root": {
    marginTop: theme.spacing(3),
  },
}));

const Transition = forwardRef(function Transition(props: SlideProps, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

/**
 * Email dialog to send an email
 *
 * @param props -
 * @param props.onClose - Handler for closing dialog
 * @returns
 */
export default function EmailDialog({ onClose }: Props) {
  const [from, setFrom] = useState<string>();
  const [message, setMessage] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handler for message field changes
   *
   * @param event - Change event
   */
  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMessage(value);
  };

  /**
   * Handler for name field changes
   *
   * @param event - Change event
   */
  const handleNameChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFrom(value);
  };

  /**
   * Handler for sending emails
   *
   * @async
   * @returns void
   */
  const handleSendEmail = async () => {
    if (!(message && from)) {
      enqueueSnackbar("Fill in all fields!");
      return;
    }

    try {
      const status = await sendMail({ message: message, sender: from });

      enqueueSnackbar(
        `Email ${status === 200 ? "successfully  sent" : "failed to send"}!`,
        {
          variant: status === 200 ? "success" : "error",
        }
      );
    } catch (error) {
      enqueueSnackbar(`Email failed to send: ${error}`, {
        variant: "error",
      });
    }
  };

  return (
    <Dialog open onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between" }}
        textAlign="center"
      >
        Send an Email to Edward Thomas
        <IconButton size="large" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <StyledBox>
          <TextField
            // value={from}
            onChange={handleNameChange}
            variant="filled"
            label="Enter your name or email"
            fullWidth
          />
          <TextField
            // value={message}
            onChange={handleMessageChange}
            variant="filled"
            label="Enter your message to Edward Thomas"
            multiline
            rows={8}
            fullWidth
          />
        </StyledBox>
        <Divider sx={{ m: 3 }} />
        <StyledBox>
          <Button onClick={handleSendEmail} variant="contained" fullWidth>
            Send Email
          </Button>
        </StyledBox>
      </DialogContent>
    </Dialog>
  );
}
