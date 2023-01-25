import { Box, Divider, Typography } from "@mui/material";

import { BIO } from "../content";
import { type KnownLinks, openLink } from "../utils";
import CopyButton from "./CopyButton";

export default function Bio() {
  return (
    <Box>
      <Typography id="bio" variant="h4" sx={{ pl: 1 }}>
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
          title: title
            .split("_")
            .map((word: string) => `${word[0].toUpperCase()}${word.slice(1)}`)
            .join(" "),
        });
      })}
    </Box>
  );
}

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
        <Typography sx={{ display: "flex" }} component={"div"} variant="h5">
          {title}
          {typeof content === "string" && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
              <CopyButton content={content} />
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

function linkifyString(content: string) {
  // Type the content as expected
  const typedContent = content as KnownLinks;
  return (
    <a href="#/" onClick={() => openLink(typedContent)}>
      <Box sx={{ overflowX: "auto" }}>{content}</Box>
    </a>
  );
}
