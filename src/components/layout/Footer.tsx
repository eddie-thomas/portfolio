/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Box, Container, Stack, Typography } from "@mui/material";

import { LINKS, PROFILE } from "../../content";
import { MONO } from "../../theme";
import ExternalLink from "../ExternalLink";

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", mt: 10 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{ py: 4 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: MONO, fontSize: "0.8rem" }}>
            © 2018–{new Date().getFullYear()} {PROFILE.fullName} · MIT
          </Typography>
          <Stack direction="row" flexWrap="wrap" columnGap={3} rowGap={1} sx={{ fontFamily: MONO, fontSize: "0.8rem" }}>
            <ExternalLink href={LINKS.github} color="text.secondary">github</ExternalLink>
            <ExternalLink href={LINKS.linkedin} color="text.secondary">linkedin</ExternalLink>
            <ExternalLink href={LINKS.stackoverflow} color="text.secondary">stackoverflow</ExternalLink>
            <ExternalLink href={LINKS.resume} color="text.secondary">résumé</ExternalLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
