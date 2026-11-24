/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type FormEvent, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Send, X } from "lucide-react";
import { useSnackbar } from "notistack";

import { PROFILE } from "../content";
import { MONO } from "../theme";
import { sendMail } from "../utils";
import CopyButton from "./CopyButton";

const MAX = { name: 50, message: 500 };

/**
 * Dialog that sends a message to Eddie through the mail endpoint
 *
 * @param props.onClose - Handler for closing the dialog
 */
export default function EmailDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!(name && from && message)) {
      enqueueSnackbar("Please fill in all fields.", { variant: "warning" });
      return;
    }

    setSending(true);
    try {
      const status = await sendMail({ email: from, message, name });
      if (status === 200) {
        enqueueSnackbar("Message sent. Thanks!", { variant: "success" });
        onClose();
      } else {
        enqueueSnackbar("Message failed to send.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Message failed to send: ${error}`, { variant: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          backgroundColor: "rgba(14, 16, 20, 0.35)",
        },
      }}
    >
      {sending && <LinearProgress />}
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
        Get in touch
        <IconButton onClick={onClose} aria-label="Close">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ mb: 2 }}>
          <Typography color="text.secondary" variant="body2">
            Send a message below, or email{" "}
            <Box component="span" sx={{ fontFamily: MONO, color: "text.primary" }}>
              {PROFILE.email}
            </Box>
          </Typography>
          <CopyButton content={PROFILE.email} name="email address" />
        </Stack>
        <Stack component="form" onSubmit={handleSubmit} gap={2} noValidate>
          <TextField
            label="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
            inputProps={{ maxLength: MAX.name }}
          />
          <TextField
            label="Your email"
            type="email"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            required
            fullWidth
            helperText="So I can reply."
          />
          <TextField
            label="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            multiline
            minRows={5}
            fullWidth
            inputProps={{ maxLength: MAX.message }}
            helperText={`${MAX.message - message.length} characters left`}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={sending}
            endIcon={<Send size={16} />}
          >
            {sending ? "Sending…" : "Send message"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
