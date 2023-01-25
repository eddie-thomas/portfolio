import {
  createTheme,
  CssBaseline,
  Theme,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import AppBar from "./components/AppBar";
import Bio from "./components/Bio";

import "./App.css";
import Projects from "./components/Projects";
import References from "./components/References";
import Resume from "./components/Resume";

const defaultTheme = createTheme();
const font = "'Courier New', Courier, monospace";

/**
 * Theme object, no styling will be done except for here.
 */
const THEME: Theme = createTheme(defaultTheme, {
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          position: "fixed",
          [defaultTheme.breakpoints.down("sm")]: {
            top: "auto",
            bottom: 0,
          },
          top: 0,
          // Basically a separator to float content right
          "& .MuiBox-root": { flexGrow: 1 },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: font,
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <div className="App">
        <AppBar />
        <Toolbar sx={{ display: { xs: "none", sm: "block" } }} />
        <Body />
        <Toolbar sx={{ display: { xs: "block", sm: "unset" }, my: 3 }} />
      </div>
    </ThemeProvider>
  );
}

function Body() {
  return (
    <>
      {/* Order these appropriately */}
      <div className="section" id="resume">
        <Resume />
      </div>
      <div className="section">
        <Bio />
      </div>
      <div className="section" id="projects">
        <Projects />
      </div>
      <div className="section" id="references">
        <References />
      </div>
    </>
  );
}
