/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Button, Container, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { MONO } from "../theme";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <Container maxWidth="sm" sx={{ pt: { xs: 10, md: 16 }, textAlign: "center" }}>
      <Typography variant="overline" component="p" color="primary" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
        Nothing at this node.
      </Typography>
      <Typography color="text.secondary" sx={{ fontFamily: MONO, fontSize: "0.85rem", mb: 4, wordBreak: "break-all" }}>
        ASK {"{"} &lt;{pathname}&gt; ?p ?o {"}"} → false
      </Typography>
      <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowLeft size={16} />}>
        Back to projects
      </Button>
    </Container>
  );
}
