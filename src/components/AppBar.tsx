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
} from "@mui/material";

// Icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EducationIcon from "@mui/icons-material/School";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import MoreIcon from "@mui/icons-material/MoreVert";
import ReferencesIcon from "@mui/icons-material/PeopleAlt";
import SearchIcon from "@mui/icons-material/Search";

// Utility code
import { openResume } from "../utils";

const MenuCollapse = styled(Collapse, {
  shouldForwardProp: (prop) => prop !== "placement",
})<{ placement: "top" | "bottom" }>(({ theme, placement }) => ({
  backgroundColor: "grey",
  color: "#fff",
  "& .MuiSvgIcon-root": { color: "#fff" },
  "& .MuiDivider-root": { backgroundColor: "#fff", margin: theme.spacing(1) },
  width: "100%",
  position: "fixed",

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
  zIndex: 1,
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
 * @returns JSX.element
 */
export default function AppBar() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleExpandChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const handleMessageSend = () => {
    console.log("Send message!");
  };

  return (
    <>
      <MenuCollapse placement="bottom" in={expanded}>
        <Box>
          <MenuList />
        </Box>
        <Toolbar />
      </MenuCollapse>
      <MuiAppBar>
        <Toolbar>
          <IconButton color="inherit" onClick={handleExpandChange}>
            <MenuIcon />
          </IconButton>
          <StyledFab expanded={expanded} onClick={handleMessageSend}>
            <MessageIcon />
          </StyledFab>
          <Box />
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
      <MenuCollapse placement="top" in={expanded}>
        <Toolbar />
        <Box>
          <MenuList />
        </Box>
      </MenuCollapse>
    </>
  );
}

/**
 * Menu for desktop/mobile viewing
 *
 * @returns JSX.Element
 */
function MenuList() {
  return (
    <List>
      <ListItem className="padding" />
      <Divider />

      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Skills" />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Bio" />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <ReferencesIcon />
          </ListItemIcon>
          <ListItemText primary="References" />
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton onClick={openResume}>
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

      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <EducationIcon />
          </ListItemIcon>
          <ListItemText primary="Education" />
        </ListItemButton>
      </ListItem>

      <Divider />
      <ListItem className="padding" />
    </List>
  );
}
