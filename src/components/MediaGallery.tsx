/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { useState } from "react";
import {
  Box,
  ButtonBase,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Image as ImageIcon, X } from "lucide-react";

import { type Media } from "../content";

/**
 * Images (click to enlarge), self-hosted video, and YouTube embeds.
 * Renders a placeholder when a project has no media yet.
 */
export default function MediaGallery({ media }: { media: Array<Media> }) {
  const [open, setOpen] = useState<Media | null>(null);

  if (media.length === 0)
    return (
      <Box
        sx={{
          border: 1,
          borderStyle: "dashed",
          borderColor: "divider",
          borderRadius: 2,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          color: "text.secondary",
        }}
      >
        <ImageIcon size={22} aria-hidden="true" />
        <Typography variant="body2">Screenshots and video coming soon.</Typography>
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        }}
      >
        {media.map((item) => (
          <Box
            component="figure"
            key={item.src}
            sx={{
              m: 0,
              gridColumn: item.type === "image" ? undefined : "1 / -1",
            }}
          >
            {item.type === "image" && (
              <ButtonBase
                onClick={() => setOpen(item)}
                aria-label={`Enlarge ${item.caption ?? "image"}`}
                sx={{ width: "100%", borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={item.caption ?? ""}
                  loading="lazy"
                  sx={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }}
                />
              </ButtonBase>
            )}
            {item.type === "video" && (
              <Box
                component="video"
                src={item.src}
                controls
                playsInline
                preload="metadata"
                sx={{ width: "100%", borderRadius: 2, border: 1, borderColor: "divider", display: "block" }}
              />
            )}
            {item.type === "youtube" && (
              <Box
                component="iframe"
                src={`https://www.youtube-nocookie.com/embed/${item.src}`}
                title={item.caption ?? "Project video"}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 2, display: "block" }}
              />
            )}
            {item.caption && (
              <Typography component="figcaption" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.caption}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} maxWidth="lg">
        {open && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setOpen(null)}
              aria-label="Close"
              sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper" }}
            >
              <X size={18} />
            </IconButton>
            <Box component="img" src={open.src} alt={open.caption ?? ""} sx={{ display: "block", maxWidth: "100%", maxHeight: "85vh" }} />
            {open.caption && (
              <Stack sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">{open.caption}</Typography>
              </Stack>
            )}
          </Box>
        )}
      </Dialog>
    </>
  );
}
