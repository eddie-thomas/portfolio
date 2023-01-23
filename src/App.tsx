import { Box, createTheme, Theme, ThemeProvider } from "@mui/material";
import AppBar from "./components/AppBar";

/**
 * Theme object, no styling will be done except for here.
 */
const THEME: Theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={THEME}>
      <div className="app">
        <AppBar />
        <Body />
      </div>
    </ThemeProvider>
  );
}

function Body() {
  return (
    <div>
      {/* Order these appropriately */}
      <div id="abilities" />
      <div id="bio" />
      <div id="education" />
      <div id="projects" />
      <div id="references" />
      <div id="resume" />
    </div>
  );
}
