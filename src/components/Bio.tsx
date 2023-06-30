/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type ReactNode } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { BIO } from "../content";
import { openLink, toPascalCase } from "../utils";
import CopyButton from "./CopyButton";

/**
 * Biography component
 *
 * Notes:
 * - This component is kind of messy, but I wanted more general code, so I can edit the content
 * how I want and not have to worry about how it's rendered all that much
 *
 * @returns JSX.Element
 */
export default function Bio() {
  return (
    <Box>
      <Typography id="bio" variant="h3" textAlign="center" sx={{ pl: 1 }}>
        Biography
      </Typography>
      {Object.keys(BIO).map((title) => {
        const content:
          | string
          | Array<string>
          | { [key: string]: string }
          | Date = BIO[title];

        return mapComponentsToContent({
          content,
          title: toPascalCase(title),
        });
      })}
      <Divider sx={{ m: 3 }} />
    </Box>
  );
}

/**
 * Mapping a component to data
 *
 * @param props -
 * @param props.content - The content being display, can be any number of things (arrays, objects, strings, etc.)
 * @param props.title - Title of the section (e.g. "phone number")
 * @returns JSX.Element
 */
function mapComponentsToContent({
  content,
  title,
}: {
  content: string | Array<string> | { [key: string]: string } | Date;
  title?: string;
}) {
  return (
    <div className="bio__content" key={JSON.stringify(content)}>
      {title && (
        <Typography sx={{ display: "flex" }} component={"h5"} variant="h5">
          {title}
          {typeof content === "string" && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
              <CopyButton
                content={content}
                name={`Edward's ${title.toLowerCase()}`}
              />
            </>
          )}
        </Typography>
      )}
      {typeof content === "string" ? (
        <>
          {content.startsWith("https://") ? (
            linkifyString(content)
          ) : (
            <Typography component="p">{content || "---"}</Typography>
          )}
        </>
      ) : content instanceof Array ? (
        <Typography component="div">
          {content.map((value: string) => {
            return (
              <div key={value}>
                {(value.startsWith("https://")
                  ? linkifyString(value)
                  : value) || "---"}
                <br />
              </div>
            );
          })}
        </Typography>
      ) : content instanceof Date ? (
        <Typography component="p">{content.toLocaleString()}</Typography>
      ) : (
        <>
          {Object.keys(content || {}).map((title) => {
            const nestedContent:
              | string
              | Array<string>
              | { [key: string]: string }
              | Date = content[title];

            return (
              <Box key={JSON.stringify(content) + title}>
                <Typography variant="h6">{title}</Typography>
                {mapComponentsToContent({ content: nestedContent })}
              </Box>
            );
          })}
        </>
      )}
    </div>
  );
}

/**
 * Turn the link, a string, into an Element
 *
 * @param content - The link that, must be known, to open a separate tab as a string
 * @param linkText - String that will be injected in place of the link
 * @returns JSX.Element
 */
export function linkifyString(content: string, linkText?: ReactNode) {
  // Type the content as expected
  const typedContent = content;
  return (
    <a href="/portfolio" onClick={() => openLink(typedContent)}>
      <Box>{linkText ?? content}</Box>
    </a>
  );
}
