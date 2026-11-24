/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type ReactNode } from "react";
import { Link, type LinkProps } from "@mui/material";
import { ArrowUpRight } from "lucide-react";

/**
 * A real anchor that opens in a new tab
 *
 * @param props.href - Destination URL
 * @param props.icon - Show a trailing ↗ icon (default true)
 */
export default function ExternalLink({
  href,
  children,
  icon = true,
  sx,
  ...rest
}: LinkProps & { href: string; children: ReactNode; icon?: boolean }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, ...sx }}
      {...rest}
    >
      {children}
      {icon && <ArrowUpRight size={14} aria-hidden="true" />}
    </Link>
  );
}
