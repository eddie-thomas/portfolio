/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Box, Chip, Link, Paper, Stack, Typography, alpha } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { type Experience, type Position, type PositionLink } from "../content";
import { MONO } from "../theme";
import { formatMonth } from "../utils";
import ExternalLink from "./ExternalLink";

const NODE = 12;
const RAIL = 16;

/** Inclusive month count, the way LinkedIn counts (Aug–Oct is 3 months) */
const monthsBetween = (start: Date, end: Date) =>
  (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
  end.getUTCMonth() -
  start.getUTCMonth() +
  1;

/** e.g. "2 yrs 3 mos" */
function formatDuration(months: number) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

/** Anchor id for a position, so other panels can link to it */
export const positionAnchor = (position: Position) => `position-${position.id}`;

/**
 * A company with its positions, drawn as a small knowledge graph:
 * each role is a node, and the edge to the next role names how they relate.
 * Roles held at the same time get a parallel rail.
 */
export default function ExperienceTimeline({ experience }: { experience: Experience }) {
  const now = new Date();
  const { positions } = experience;
  const start = new Date(Math.min(...positions.map((p) => p.start.getTime())));
  const ongoing = positions.some((p) => !p.end);
  const end = ongoing
    ? now
    : new Date(Math.max(...positions.map((p) => p.end!.getTime())));

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Typography variant="overline" component="p" color="text.secondary" sx={{ mb: 1.5, fontFamily: MONO }}>
        # <Link component={RouterLink} to={"/experience.ttl"} color="inherit" title="View the full Turtle file">experience.ttl</Link>
      </Typography>

      <Stack direction="row" gap={1.75} alignItems="center" sx={{ mb: 2.5 }}>
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontFamily: MONO,
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1.5px solid ${theme.palette.primary.main}`,
          })}
        >
          :{initials(experience.company)}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <ExternalLink
            href={experience.url}
            color="text.primary"
            underline="hover"
            sx={{ fontWeight: 600, fontSize: "1.1rem" }}
          >
            {experience.company}
          </ExternalLink>
          <Typography variant="body2" color="text.secondary">
            {experience.employment} · {formatDuration(monthsBetween(start, end))}
          </Typography>
        </Box>
      </Stack>

      <Swimlanes positions={positions} start={start} end={end} />

      <Box component="ol" sx={{ listStyle: "none", m: 0, mt: 3, p: 0 }}>
        {positions.map((position, index) => (
          <PositionNode
            key={position.id}
            position={position}
            now={now}
            next={positions[index + 1]}
          />
        ))}
      </Box>
    </Paper>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

/** One role: a node on the rail, then the labelled edge down to the next role */
function PositionNode({
  position,
  next,
  now,
}: {
  position: Position;
  next?: Position;
  now: Date;
}) {
  const current = !position.end;
  const months = monthsBetween(position.start, position.end ?? now);

  return (
    <Box
      component="li"
      id={positionAnchor(position)}
      sx={{ display: "grid", gridTemplateColumns: `${RAIL}px 1fr`, columnGap: 2, scrollMarginTop: 96 }}
    >
      {/* Rail beside the content: node, then the edge running down */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: 4,
            left: (RAIL - NODE) / 2,
            width: NODE,
            height: NODE,
            borderRadius: "50%",
            border: `2px solid ${current ? theme.palette.primary.main : theme.palette.text.secondary}`,
            bgcolor: current ? "primary.main" : "background.paper",
            boxShadow: current ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}` : "none",
          })}
        />
        {next && <Edge link={position.link} top={4 + NODE + 4} />}
      </Box>

      <Box sx={{ pb: next ? 0 : 0.5, minWidth: 0 }}>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Box component="span" sx={{ fontFamily: MONO, fontSize: "0.75rem", color: current ? "primary.main" : "text.secondary" }}>
            :{position.id}
          </Box>
          {current && (
            <Chip
              label="current"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 18, fontSize: "0.65rem", fontFamily: MONO, "& .MuiChip-label": { px: 0.75 } }}
            />
          )}
        </Stack>
        <Typography variant="h6" component="h3" sx={{ mt: 0.25 }}>
          {position.title}
          {position.scope && (
            <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
              {" "}· {position.scope}
            </Box>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatMonth(position.start)} – {position.end ? formatMonth(position.end) : "Present"} ·{" "}
          {formatDuration(months)}
        </Typography>
        {position.summary && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {position.summary}
          </Typography>
        )}
      </Box>

      {/* Edge label row: the rail keeps running, the predicate sits beside it */}
      {next && (
        <>
          <Box sx={{ position: "relative" }}>
            <Edge link={position.link} top={0} />
          </Box>
          <Box sx={{ py: 1.5, fontFamily: MONO, fontSize: "0.72rem", color: "text.secondary" }}>
            <Box component="span" aria-hidden="true">↓ </Box>
            <Box component="span" sx={{ color: position.link === "concurrentWith" ? "primary.main" : "text.secondary" }}>
              :{position.link ?? "precededBy"}
            </Box>{" "}
            :{next.id}
          </Box>
        </>
      )}
    </Box>
  );
}

/**
 * Vertical edge between two role nodes.
 * Concurrent roles get a double rail (held in parallel); a promotion is a single rail.
 */
function Edge({ link, top }: { link?: PositionLink; top: number }) {
  const line = {
    position: "absolute",
    top,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  } as const;

  if (link === "concurrentWith") {
    return (
      <>
        <Box sx={{ ...line, left: RAIL / 2 - 4, bgcolor: "primary.main" }} />
        <Box sx={{ ...line, left: RAIL / 2 + 2, bgcolor: "primary.main" }} />
      </>
    );
  }
  return (
    <Box sx={(theme) => ({ ...line, left: RAIL / 2 - 1, bgcolor: alpha(theme.palette.text.secondary, 0.4) })} />
  );
}

/** Gantt-style strip: one lane per role, so overlapping titles read at a glance */
function Swimlanes({
  positions,
  start,
  end,
}: {
  positions: Array<Position>;
  start: Date;
  end: Date;
}) {
  const span = end.getTime() - start.getTime();
  const pct = (date: Date) => ((date.getTime() - start.getTime()) / span) * 100;

  const years: Array<number> = [];
  for (let year = start.getUTCFullYear() + 1; year <= end.getUTCFullYear(); year++) years.push(year);

  const label = positions
    .map((p) => `${p.title}: ${formatMonth(p.start)} to ${p.end ? formatMonth(p.end) : "present"}`)
    .join("; ");

  return (
    <Box
      role="img"
      aria-label={`Timeline of roles. ${label}`}
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        columnGap: 1.5,
        rowGap: 0.75,
        alignItems: "center",
        fontFamily: MONO,
        fontSize: "0.68rem",
      }}
    >
      {positions.map((position) => {
        const current = !position.end;
        const left = pct(position.start);
        const right = pct(position.end ?? end);
        return (
          <Box key={position.id} sx={{ display: "contents" }}>
            <Box sx={{ color: current ? "primary.main" : "text.secondary", whiteSpace: "nowrap" }}>
              :{position.id}
            </Box>
            <Box sx={{ position: "relative", height: 10 }}>
              {/* Faint track so empty space still reads as time */}
              <Box sx={{ position: "absolute", inset: "4px 0", bgcolor: "divider", borderRadius: 1 }} />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${left}%`,
                  width: `${Math.max(right - left, 1.5)}%`,
                  borderRadius: current ? "5px 0 0 5px" : "5px",
                  bgcolor: current ? "primary.main" : alpha(theme.palette.text.secondary, 0.55),
                  // Ongoing roles fade out at "now" instead of ending hard
                  ...(current && {
                    maskImage: "linear-gradient(to right, #000 85%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, #000 85%, transparent)",
                  }),
                })}
              />
            </Box>
          </Box>
        );
      })}

      {/* Year axis */}
      <Box />
      <Box sx={{ position: "relative", height: 16, mt: 0.25, color: "text.secondary" }}>
        {years.map((year) => {
          const at = pct(new Date(Date.UTC(year, 0, 1)));
          return (
            <Box
              key={year}
              sx={{
                position: "absolute",
                left: `${at}%`,
                transform: "translateX(-50%)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "50%",
                  top: -3,
                  height: 3,
                  borderLeft: 1,
                  borderColor: "divider",
                },
              }}
            >
              {at > 92 ? "" : `'${String(year).slice(2)}`}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
