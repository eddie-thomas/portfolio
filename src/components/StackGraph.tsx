/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type KeyboardEvent, useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { ALL_TECH, PROJECTS } from "../content";
import { MONO } from "../theme";
import { useFocus, useHighlight } from "./HighlightContext";

// Layout constants (SVG user units)
const W = 680;
const H = 470;
const CX = W / 2;
const CY = H / 2;
const R_PROJECT = 100;
const R_TECH = 190;

interface Point {
  x: number;
  y: number;
  angle: number;
}

const polar = (radius: number, angle: number): Point => ({
  x: CX + radius * Math.cos(angle),
  y: CY + radius * Math.sin(angle),
  angle,
});

/** Smallest signed difference between two angles */
const angleDiff = (a: number, b: number) =>
  Math.atan2(Math.sin(a - b), Math.cos(a - b));

/**
 * Deterministic radial layout:
 * projects on an inner ring, technologies on an outer ring ordered by the
 * average angle of the projects that use them (keeps edges short, fewer crossings).
 */
function computeLayout() {
  const start = -Math.PI / 2;
  const projects = new Map<string, Point>();
  PROJECTS.forEach((project, index) => {
    projects.set(
      project.slug,
      polar(R_PROJECT, start + (index * 2 * Math.PI) / PROJECTS.length)
    );
  });

  // Circular mean of connected project angles
  const ideal = ALL_TECH.map((tech) => {
    let sx = 0;
    let sy = 0;
    PROJECTS.forEach((project) => {
      if (!project.stack.includes(tech)) return;
      const point = projects.get(project.slug)!;
      sx += Math.cos(point.angle);
      sy += Math.sin(point.angle);
    });
    return { tech, angle: Math.atan2(sy, sx) };
  }).sort((a, b) => a.angle - b.angle);

  // Evenly spaced slots; pick the rotation that best matches the ideal angles
  const step = (2 * Math.PI) / ideal.length;
  let bestOffset = 0;
  let bestCost = Infinity;
  for (let i = 0; i < 72; i++) {
    const offset = (i * step) / 12;
    const cost = ideal.reduce(
      (sum, { angle }, index) =>
        sum + Math.abs(angleDiff(offset + index * step, angle)),
      0
    );
    if (cost < bestCost) {
      bestCost = cost;
      bestOffset = offset;
    }
  }

  const techs = new Map<string, Point>();
  ideal.forEach(({ tech }, index) => {
    techs.set(tech, polar(R_TECH, bestOffset + index * step));
  });

  return { projects, techs };
}

/** Gentle curve between two points, bowed toward the centre */
const curve = (a: Point, b: Point, pull = 0.25) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const qx = mx + (CX - mx) * pull;
  const qy = my + (CY - my) * pull;
  return `M${a.x},${a.y} Q${qx},${qy} ${b.x},${b.y}`;
};

const toId = (value: string) => value.replace(/\s+/g, "-");

export default function StackGraph() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectedTech, setHoverTech, setHoverProject, setSelectedTech } =
    useHighlight();
  const { hasFocus, isProjectActive, isTechActive, tech, project } =
    useFocus();
  const layout = useMemo(computeLayout, []);

  const { palette } = theme;
  const accent = palette.primary.main;
  const ink = palette.text.primary;
  const muted = palette.text.secondary;
  const line = palette.divider;
  const halo = palette.background.default;

  const fade = (active: boolean) => ({
    opacity: hasFocus && !active ? 0.12 : 1,
    transition: "opacity .25s ease",
  });

  const onKey =
    (action: () => void) => (event: KeyboardEvent<SVGGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    };

  // A tiny "query" caption that reflects the current focus
  const matches = project
    ? project.stack.length
    : tech
    ? PROJECTS.filter((p) => p.stack.includes(tech)).length
    : PROJECTS.length;
  const query = project
    ? `:${project.slug} :uses ?tech`
    : tech
    ? `?project :uses :${toId(tech)}`
    : `?project a :Project`;

  const labelProps = {
    fontFamily: MONO,
    stroke: halo,
    strokeWidth: 4,
    paintOrder: "stroke",
    strokeLinejoin: "round" as const,
  };

  return (
    <Box>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label="Graph of projects and the technologies they use"
        sx={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
        onMouseLeave={() => {
          setHoverProject(null);
          setHoverTech(null);
        }}
      >
        {/* Edges: me → projects */}
        {PROJECTS.map((p) => {
          const point = layout.projects.get(p.slug)!;
          return (
            <line
              key={`me-${p.slug}`}
              x1={CX}
              y1={CY}
              x2={point.x}
              y2={point.y}
              stroke={line}
              strokeWidth={1.5}
              strokeDasharray="3 4"
              style={fade(isProjectActive(p.slug))}
            />
          );
        })}

        {/* Edges: projects → tech */}
        {PROJECTS.map((p) =>
          p.stack.map((name) => {
            const active = isProjectActive(p.slug) && isTechActive(name);
            return (
              <path
                key={`${p.slug}-${name}`}
                d={curve(layout.projects.get(p.slug)!, layout.techs.get(name)!)}
                fill="none"
                stroke={hasFocus && active ? accent : line}
                strokeWidth={hasFocus && active ? 1.75 : 1.25}
                style={fade(active)}
              />
            );
          })
        )}

        {/* Centre node */}
        <g style={fade(!hasFocus)}>
          <circle cx={CX} cy={CY} r={13} fill={ink} />
          <text
            x={CX}
            y={CY + 32}
            textAnchor="middle"
            fontSize={13}
            fill={ink}
            {...labelProps}
          >
            :eddie
          </text>
        </g>

        {/* Tech nodes */}
        {ALL_TECH.map((name) => {
          const point = layout.techs.get(name)!;
          const cos = Math.cos(point.angle);
          const sin = Math.sin(point.angle);
          const anchor = cos > 0.12 ? "start" : cos < -0.12 ? "end" : "middle";
          const selected = selectedTech === name;
          const active = isTechActive(name);
          return (
            <g
              key={name}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`Filter projects by ${name}`}
              style={{ ...fade(active || selected), cursor: "pointer", outline: "none" }}
              onMouseEnter={() => setHoverTech(name)}
              onMouseLeave={() => setHoverTech(null)}
              onFocus={() => setHoverTech(name)}
              onBlur={() => setHoverTech(null)}
              onClick={() => setSelectedTech(selected ? null : name)}
              onKeyDown={onKey(() => setSelectedTech(selected ? null : name))}
            >
              <circle cx={point.x} cy={point.y} r={14} fill="transparent" />
              <circle
                cx={point.x}
                cy={point.y}
                r={selected ? 6.5 : 5.5}
                fill={selected ? accent : palette.background.paper}
                stroke={hasFocus && active ? accent : muted}
                strokeWidth={1.5}
              />
              <text
                x={point.x + cos * 12}
                y={point.y + sin * 12 + (anchor === "middle" ? sin * 8 : 0) + 4}
                textAnchor={anchor}
                fontSize={12.5}
                fill={hasFocus && active ? ink : muted}
                {...labelProps}
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* Project nodes */}
        {PROJECTS.map((p) => {
          const point = layout.projects.get(p.slug)!;
          const active = isProjectActive(p.slug);
          // Lower-half labels go under the node so neighbours don't collide
          const labelY =
            Math.sin(point.angle) > 0.3 ? point.y + 30 : point.y - 17;
          const go = () => navigate(`/projects/${p.slug}`);
          return (
            <g
              key={p.slug}
              role="link"
              tabIndex={0}
              aria-label={`Open ${p.name}`}
              style={{ ...fade(active), cursor: "pointer", outline: "none" }}
              onMouseEnter={() => setHoverProject(p.slug)}
              onMouseLeave={() => setHoverProject(null)}
              onFocus={() => setHoverProject(p.slug)}
              onBlur={() => setHoverProject(null)}
              onClick={go}
              onKeyDown={onKey(go)}
            >
              <circle cx={point.x} cy={point.y} r={18} fill="transparent" />
              <circle
                cx={point.x}
                cy={point.y}
                r={10}
                fill={accent}
                stroke={halo}
                strokeWidth={3}
              />
              <text
                x={point.x}
                y={labelY}
                textAnchor="middle"
                fontSize={13.5}
                fontWeight={600}
                fill={ink}
                {...labelProps}
                fontFamily={theme.typography.fontFamily}
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </Box>
      <Typography
        variant="overline"
        component="p"
        color="text.secondary"
        textAlign="center"
        aria-live="polite"
        sx={{ mt: 1 }}
      >
        {query} <Box component="span" sx={{ color: "primary.main" }}>→ {matches}{" "}
        {matches === 1 ? "result" : "results"}</Box>
      </Typography>
    </Box>
  );
}
