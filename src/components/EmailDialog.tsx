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
  LinearProgress,
  Slide,
  SlideProps,
  styled,
  TextField,
  Typography,
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
  const [name, setName] = useState<string>();
  const [sending, setSending] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const maxLengths = {
    name: 50,
    message: 150,
  };

  /**
   * Handler for field changes
   *
   * @param value - Changed value for field
   * @param setter - The setter method to change the value
   */
  const handleChange = (
    value: string,
    setter: (value: React.SetStateAction<string | undefined>) => void
  ) => {
    setter(value);
  };

  /**
   * Handler for sending emails
   *
   * @async
   * @returns void
   */
  const handleSendEmail = async () => {
    if (!(from && message && name)) {
      enqueueSnackbar("Fill in all fields!");
      return;
    }

    setSending(true);
    try {
      const status = await sendMail({ email: from, message, name });

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
    } finally {
      setSending(false);
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
            // value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange(event.target.value, setName)
            }
            required
            variant="filled"
            label="Enter your name"
            fullWidth
            inputProps={{ maxLength: maxLengths.name }}
            helperText={`${
              maxLengths.name - (name?.length || 0)
            } characters left`}
          />
          <TextField
            // value={from}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleChange(event.target.value, setFrom)
            }
            required
            variant="filled"
            label="Enter your email to receive responses"
            fullWidth
          />
          <TextField
            // value={message}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange(event.target.value, setMessage)
            }
            required
            variant="filled"
            label="Enter your message to Edward Thomas"
            multiline
            rows={8}
            fullWidth
            inputProps={{ maxLength: maxLengths.message }}
            helperText={`${
              maxLengths.message - (message?.length || 0)
            } characters left`}
          />
        </StyledBox>
        <Divider sx={{ m: 3 }} />
        <StyledBox>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            fullWidth
            disabled={sending}
          >
            {sending ? (
              <StyledBox width="100%">
                <Typography textTransform="capitalize">
                  Sending email...
                </Typography>
                <LinearProgress />
              </StyledBox>
            ) : (
              <Typography textTransform="capitalize">Send Email</Typography>
            )}
          </Button>
        </StyledBox>
      </DialogContent>
    </Dialog>
  );
}
