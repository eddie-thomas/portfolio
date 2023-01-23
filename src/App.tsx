import { createTheme, CssBaseline, Theme, ThemeProvider } from "@mui/material";
import AppBar from "./components/AppBar";

const defaultTheme = createTheme();

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
  },
});

export default function App() {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <div className="app">
        <AppBar />
        <Body />
      </div>
    </ThemeProvider>
  );
}

function Body() {
  return (
    <>
      {/* Order these appropriately */}
      <div id="abilities">test a</div>
      <div id="bio" />
      <div id="education" />
      <div id="projects" />
      <div id="references" />
      <div id="resume" />
    </>
  );
}
