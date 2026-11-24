/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import EmailDialog from "../EmailDialog";
import Footer from "./Footer";
import NavBar from "./NavBar";

const ContactContext = createContext<() => void>(() => undefined);

/** Opens the contact (email) dialog from anywhere in the app */
export const useContact = () => useContext(ContactContext);

/**
 * Scroll to the top on page change, or to `#hash` when the URL has one
 */
function ScrollManager() {
  const { pathname, hash, search } = useLocation();

  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash, search]);

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [pathname, hash, search]);

  return null;
}

export default function Layout() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <ContactContext.Provider value={() => setContactOpen(true)}>
      <ScrollManager />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
      {contactOpen && <EmailDialog onClose={() => setContactOpen(false)} />}
    </ContactContext.Provider>
  );
}
