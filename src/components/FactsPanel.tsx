/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Fragment, type ReactNode } from "react";
import { Box, Link, Paper, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { type Project, STATUS_LABEL } from "../content";
import { MONO, statusColor } from "../theme";
import { formatDate } from "../utils";

const id = (value: string) => value.replace(/\s+/g, "-");
const shortUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Project metadata written as a Turtle-style RDF description, a nod to
 * semantic data work. Objects are links where it makes sense.
 */
export default function FactsPanel({ project }: { project: Project }) {
  const theme = useTheme();

  const iri = (href: string) => (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      &lt;{shortUrl(href)}&gt;
    </Link>
  );
  const literal = (value: string) => (
    <Box component="span" sx={{ color: "success.main" }}>
      "{value}"
    </Box>
  );

  const rows: Array<[string, ReactNode]> = [
    ["a", <Box component="span" sx={{ color: "primary.main" }}>:Project</Box>],
    [
      ":status",
      <Box component="span" sx={{ color: statusColor(theme, project.status) }}>
        :{id(STATUS_LABEL[project.status])}
      </Box>,
    ],
    [":role", literal(project.role)],
  ];
  if (project.builtFor) rows.push([":builtFor", literal(project.builtFor)]);
  rows.push([
    ":uses",
    <>
      {project.stack.map((tech, index) => (
        <Fragment key={tech}>
          <Link
            component={RouterLink}
            to={`/?tech=${encodeURIComponent(tech)}#projects`}
            title={`All projects using ${tech}`}
            sx={{ whiteSpace: "nowrap" }}
          >
            :{id(tech)}
          </Link>
          {index < project.stack.length - 1 && ", "}
        </Fragment>
      ))}
    </>,
  ]);
  rows.push([
    ":updated",
    <>
      {literal(formatDate(project.updated))}
      <Box component="span" sx={{ color: "text.secondary" }}>^^xsd:date</Box>
    </>,
  ]);
  if (project.links.live) rows.push([":live", iri(project.links.live)]);
  if (project.links.repo) rows.push([":repo", iri(project.links.repo)]);
  if (project.links.archive) rows.push([":previousVersion", iri(project.links.archive)]);
  if (project.repoNote) rows.push([":repo", literal(project.repoNote)]);

  return (
    <Paper
      variant="outlined"
      component="aside"
      aria-label="Project facts"
      sx={{ p: 2.5, fontFamily: MONO, fontSize: "0.8rem", lineHeight: 1.9 }}
    >
      <Typography variant="overline" component="p" color="text.secondary" sx={{ mb: 1 }}>
        # <Link component={RouterLink} to={`/projects/${project.slug}/facts.ttl`} color="inherit" title="View the full Turtle file">facts.ttl</Link>
      </Typography>
      <Box sx={{ color: "primary.main", fontWeight: 600 }}>:{project.slug}</Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          columnGap: 1.5,
          pl: 2,
          "& a": { fontFamily: MONO },
          wordBreak: "break-word",
        }}
      >
        {rows.map(([predicate, object], index) => (
          <Fragment key={`${predicate}-${index}`}>
            <Box sx={{ color: "text.secondary" }}>{predicate}</Box>
            <Box>
              {object}
              <Box component="span" sx={{ color: "text.secondary" }}>
                {index === rows.length - 1 ? " ." : " ;"}
              </Box>
            </Box>
          </Fragment>
        ))}
      </Box>
    </Paper>
  );
}
