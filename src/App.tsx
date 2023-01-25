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
import { SnackbarProvider } from "notistack";

const defaultTheme = createTheme();
const font = "'Courier New', Courier, monospace";

/**
 * Theme object, aside from styled components, and a bit of inline work,
 * everything to do with theming will be done here.
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

/**
 * Top-level app component
 *
 * @returns JSX.Element
 */
export default function App() {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <div className="App">
          <AppBar />
          <Toolbar sx={{ display: { xs: "none", sm: "block" } }} />
          <Body />
          <Toolbar sx={{ display: { xs: "block", sm: "unset" }, my: 3 }} />
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

/**
 * Body of the portfolio
 *
 * @returns JSX.Element
 */
function Body() {
  return (
    <>
      {/* Order these appropriately */}
      <Bio />
      <Projects />
      <References />
      <Resume />
    </>
  );
}
