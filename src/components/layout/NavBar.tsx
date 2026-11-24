/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { FileText, FolderGit2, Mail, Menu, User, X } from "lucide-react";
import { Link as RouterLink, NavLink } from "react-router-dom";

import { LINKS, PROFILE } from "../../content";
import { MONO } from "../../theme";
import { GithubIcon, LinkedinIcon } from "../BrandIcons";
import { useContact } from "./Layout";

const NAV = [
  { label: "Projects", to: "/", icon: FolderGit2 },
  { label: "About", to: "/about", icon: User },
];

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openContact = useContact();

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              color: "text.primary",
              textDecoration: "none",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            <Brandmark />
            {PROFILE.name}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" gap={0.5} sx={{ display: { xs: "none", sm: "flex" } }}>
            {NAV.map(({ label, to }) => (
              <Button
                key={to}
                component={NavLink}
                to={to}
                end
                color="inherit"
                sx={{
                  color: "text.secondary",
                  "&.active": { color: "text.primary" },
                }}
              >
                {label}
              </Button>
            ))}
            <Tooltip title="GitHub">
              <IconButton href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" sx={{ color: "text.secondary" }}>
                <GithubIcon size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" sx={{ color: "text.secondary" }}>
                <LinkedinIcon size={18} />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<Mail size={16} />}
              onClick={openContact}
              sx={{ ml: 1 }}
            >
              Contact
            </Button>
          </Stack>

          <IconButton
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "text.primary" }}
          >
            <Menu size={22} />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }} role="navigation">
          <Stack direction="row" justifyContent="flex-end" sx={{ p: 1 }}>
            <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
              <X size={20} />
            </IconButton>
          </Stack>
          <List onClick={() => setDrawerOpen(false)}>
            {NAV.map(({ label, to, icon: Icon }) => (
              <ListItemButton key={to} component={NavLink} to={to} end>
                <ListItemIcon sx={{ minWidth: 36 }}><Icon size={18} /></ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={openContact}>
              <ListItemIcon sx={{ minWidth: 36 }}><Mail size={18} /></ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
            {[
              { label: "GitHub", href: LINKS.github, icon: <GithubIcon size={18} /> },
              { label: "LinkedIn", href: LINKS.linkedin, icon: <LinkedinIcon size={18} /> },
              { label: "Résumé", href: LINKS.resume, icon: <FileText size={18} /> },
            ].map(({ label, href, icon }) => (
              <ListItemButton key={label} component="a" href={href} target="_blank" rel="noopener noreferrer">
                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontFamily: MONO, fontSize: "0.875rem" }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

/** Three linked nodes, a tiny version of the graph on the home page */
function Brandmark() {
  return (
    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, color: "primary.main" }} aria-hidden="true">
      <g stroke="currentColor" strokeWidth={1.75} fill="none">
        <line x1="6" y1="17" x2="12" y2="6" />
        <line x1="12" y1="6" x2="18" y2="17" />
        <line x1="6" y1="17" x2="18" y2="17" strokeDasharray="2 2.5" />
      </g>
      <circle cx="12" cy="6" r="3.25" fill="currentColor" />
      <circle cx="6" cy="17" r="2.5" fill="currentColor" />
      <circle cx="18" cy="17" r="2.5" fill="currentColor" />
    </Box>
  );
}
