/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { useState } from "react";
import {
  AppBar as MuiAppBar,
  Box,
  Collapse,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import MoreIcon from "@mui/icons-material/MoreVert";
import ReferencesIcon from "@mui/icons-material/PeopleAlt";

// Utility code
import { openLink, scrollElementIntoView } from "../utils";

// Email dialog component
import EmailDialog from "./EmailDialog";

// Styled components
const MenuCollapse = styled(Collapse, {
  shouldForwardProp: (prop) => prop !== "placement",
})<{ placement: "top" | "bottom" }>(({ theme, placement }) => ({
  backgroundColor: "grey",
  color: "#fff",
  "& .MuiSvgIcon-root": { color: "#fff" },
  "& .MuiDivider-root": { backgroundColor: "#fff", margin: theme.spacing(1) },
  width: "100%",
  position: "fixed",
  zIndex: 2,
  maxHeight: "100vh",
  overflowY: "auto",
  ...(placement === "bottom" && {
    bottom: 0,
    top: "auto",
    [theme.breakpoints.down("sm")]: {
      display: "unset",
      "& .padding": { display: "none" },
      "& .MuiDivider-root:first-of-type": { display: "none" },
    },
    display: "none",
  }),
  ...(placement === "top" && {
    top: 0,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    display: "unset",
  }),
}));

const StyledFab = styled(Fab, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  position: "absolute",
  zIndex: 3,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
  opacity: expanded ? 0 : 1,
  pointerEvents: expanded ? "none" : "unset",
  transition: "1s",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

/**
 * App bar for desktop/mobile viewing
 *
 * @returns JSX.Element
 */
export default function AppBar() {
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Handler for opening/closing the email dialog
   *
   * @param open - Boolean stating whether the dialog is open
   */
  const handleEmailDialogOpen = (open: boolean) => {
    setEmailDialogOpen(open);
  };

  /**
   * Handler for expanding/collapsing the menu
   */
  const handleExpandChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  /**
   * Handler for opening dialog to message Eddie
   *
   * @todo Write up a message dialog for this
   */
  const handleNotImplemented = () => {
    const id = enqueueSnackbar(<Typography>Not implemented yet.</Typography>, {
      onClick: () => closeSnackbar(id),
    });
  };

  return (
    <>
      <div className="Dialogs">
        {emailDialogOpen && (
          <EmailDialog onClose={() => handleEmailDialogOpen(false)} />
        )}
      </div>
      <MenuCollapse placement="bottom" in={expanded}>
        <Box>
          <MenuList onCloseMenu={handleExpandChange} />
        </Box>
        <Toolbar />
      </MenuCollapse>
      <MuiAppBar>
        <Toolbar>
          <Typography
            sx={{ display: { xs: "none", sm: "flex" } }}
            className="portfolio__title"
          >
            Edward's Portfolio
          </Typography>
          <IconButton color="inherit" onClick={handleExpandChange}>
            <MenuIcon />
          </IconButton>
          <StyledFab
            expanded={expanded}
            onClick={() => handleEmailDialogOpen(true)}
          >
            <MessageIcon />
          </StyledFab>
          <Box />
          <IconButton
            sx={{ display: { xs: "none", sm: "inherit" } }}
            color="inherit"
            onClick={() => handleEmailDialogOpen(true)}
          >
            <MessageIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleNotImplemented}>
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
      <MenuCollapse placement="top" in={expanded}>
        <Toolbar />
        <Box>
          <MenuList onCloseMenu={handleExpandChange} />
        </Box>
      </MenuCollapse>
    </>
  );
}

/**
 * Menu for desktop/mobile viewing
 *
 * @param props -
 * @param props.onCloseMenu - Closes the menu
 * @returns JSX.Element
 */
function MenuList({ onCloseMenu }: { onCloseMenu: () => void }) {
  /**
   * Handler for when a menu button is clicked
   *
   * @param id - The `id` of the element
   */
  const handleClick = (id: string) => {
    scrollElementIntoView(id);
    onCloseMenu();
  };

  return (
    <List>
      <ListItem className="padding" />
      <Divider />
      <ListItem>
        <ListItemButton onClick={() => handleClick("#bio")}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Bio" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton onClick={() => handleClick("#projects")}>
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton onClick={() => handleClick("#references")}>
          <ListItemIcon>
            <ReferencesIcon />
          </ListItemIcon>
          <ListItemText primary="References" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() =>
            openLink(
              "https://www.linkedin.com/in/edward-kyle-thomas/?trk=public-profile-join-page"
            )
          }
        >
          <ListItemIcon>
            <LinkedInIcon />
          </ListItemIcon>
          <Tooltip
            placement="bottom-start"
            title="Opens in new tab of your browser."
          >
            <ListItemText primary="LinkedIn" />
          </Tooltip>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() =>
            openLink(
              "https://docs.google.com/document/d/1LDzMgp_i8amZWFCHoO_rnBQTyUY35tb2xmDQFOgtaZ8/edit"
            )
          }
        >
          <ListItemIcon>
            <FileOpenIcon />
          </ListItemIcon>
          <Tooltip
            placement="bottom-start"
            title="Opens in new tab of your browser."
          >
            <ListItemText primary="Resume/CV" />
          </Tooltip>
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem className="padding" />
    </List>
  );
}
