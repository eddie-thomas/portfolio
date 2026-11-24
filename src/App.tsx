/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { useMemo } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import SnackbarProvider from "./components/SnackbarProvider";
import About from "./pages/About";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Project from "./pages/Project";
import { buildTheme } from "./theme";

/**
 * Top-level app component
 *
 * Routing notes:
 * - The site is served from `/portfolio` on GitHub Pages, so the router uses
 *   `PUBLIC_URL` (derived from `homepage` in package.json) as its basename.
 * - `postbuild` copies index.html to 404.html so deep links survive a refresh.
 */
export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () => buildTheme(prefersDark ? "dark" : "light"),
    [prefersDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter
          basename={process.env.PUBLIC_URL || "/"}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects/:slug" element={<Project />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
