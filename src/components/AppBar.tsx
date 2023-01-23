import { useState } from "react";
import {
  AppBar as MuiAppBar,
  Box,
  Collapse,
  Fab,
  IconButton,
  styled,
  Toolbar,
} from "@mui/material";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";

const BottomCollapse = styled(Collapse)(({ theme }) => ({
  backgroundColor: "grey",
  bottom: 0,
  top: "auto",
  width: "100%",
  position: "fixed",
  [theme.breakpoints.down("sm")]: {
    display: "unset",
  },
  display: "none",
}));

const StyledFab = styled(Fab, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  position: "absolute",
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    top: -30,
  },
  top: 30,
  left: 0,
  right: 0,
  margin: "0 auto",
  opacity: expanded ? 0 : 1,
  pointerEvents: expanded ? "none" : "unset",
  transition: "1s",
}));

const TopCollapse = styled(Collapse)(({ theme }) => ({
  backgroundColor: "grey",
  top: 0,
  position: "fixed",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
  display: "unset",
}));

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
      <BottomCollapse collapsedSize="50px" in={expanded}>
        <Box>Bottom</Box>
        <Toolbar />
      </BottomCollapse>
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
      <TopCollapse in={expanded}>
        <Toolbar />
        <Box>Top</Box>
      </TopCollapse>
    </>
  );
}
