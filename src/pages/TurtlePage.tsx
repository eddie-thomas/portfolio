/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Container, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Download } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";

import CopyButton from "../components/CopyButton";
import TurtleCode, { LEGEND } from "../components/TurtleCode";
import { allFiles, routeFor, toTurtle, type TurtleFile } from "../rdf";
import { MONO } from "../theme";
import NotFound from "./NotFound";

/**
 * A generated .ttl document, highlighted, with copy and download.
 *
 * @param props.getFile - Builds the file; receives the `:slug` route param when there is one
 */
export default function TurtlePage({ getFile }: { getFile: (slug?: string) => TurtleFile | undefined }) {
  const { slug } = useParams();
  const file = useMemo(() => getFile(slug), [getFile, slug]);
  const source = useMemo(() => (file ? toTurtle(file.triples, file.path.slice(1)) : ""), [file]);
  const download = useBlobUrl(source, "text/turtle");

  if (!file) return <NotFound />;

  const subjects = new Set(file.triples.map(([subject]) => subject)).size;
  const files = allFiles();

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <Typography variant="overline" component="p" color="primary" sx={{ mb: 1.5 }}>
        text/turtle
      </Typography>
      <Typography variant="h2" component="h1" sx={{ mb: 1, fontFamily: MONO, wordBreak: "break-all" }}>
        {file.path.slice(1)}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {file.triples.length} triples about {subjects} {subjects === 1 ? "subject" : "subjects"}, generated
        from the same content as the rest of the site.
      </Typography>

      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mb: 3 }}>
        {files.map((other) => (
          <Chip
            key={other.path}
            label={other.path.slice(1)}
            clickable
            component={RouterLink}
            to={other.path}
            color={other.path === file.path ? "primary" : "default"}
          />
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider", flexWrap: "wrap" }}
        >
          <Stack
            direction="row"
            gap={1.75}
            flexWrap="wrap"
            sx={{ flexGrow: 1, fontFamily: MONO, fontSize: "0.72rem" }}
            aria-label="Colour key"
          >
            {LEGEND.map((entry) => (
              <Box key={entry.label} component="span" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                <Box component="span" sx={entry.sx}>
                  {entry.sample}
                </Box>{" "}
                {entry.label}
              </Box>
            ))}
          </Stack>
          <Stack direction="row" gap={0.5}>
            <CopyButton content={source} name={file.name} />
            <Tooltip title={`Download ${file.name}`}>
              <IconButton size="small" component="a" href={download} download={file.name} aria-label={`Download ${file.name}`}>
                <Download size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <TurtleCode source={source} resolve={routeFor} />
      </Paper>
    </Container>
  );
}

/** Object URL for some text, revoked when it changes or the page unmounts */
function useBlobUrl(content: string, type: string) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(new Blob([content], { type }));
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [content, type]);
  return url;
}
