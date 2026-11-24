/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { type Project } from "../content";
import { MONO } from "../theme";
import { formatMonth } from "../utils";
import { useFocus, useHighlight } from "./HighlightContext";
import StackChip from "./StackChip";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }: { project: Project }) {
  const { setHoverProject } = useHighlight();
  const { hasFocus, isProjectActive } = useFocus();
  const active = isProjectActive(project.slug);

  return (
    <Card
      onMouseEnter={() => setHoverProject(project.slug)}
      onMouseLeave={() => setHoverProject(null)}
      sx={{
        height: "100%",
        opacity: hasFocus && !active ? 0.4 : 1,
        borderColor: hasFocus && active ? "primary.main" : undefined,
        "&:hover": { transform: "translateY(-2px)", borderColor: "primary.main" },
        "&:hover .card-arrow": { transform: "translateX(3px)", color: "primary.main" },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/projects/${project.slug}`}
        onFocus={() => setHoverProject(project.slug)}
        onBlur={() => setHoverProject(null)}
        sx={{ height: "100%", alignItems: "stretch", display: "flex" }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 3, width: "100%" }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <StatusBadge status={project.status} />
            <Typography
              component="span"
              sx={{ fontFamily: MONO, fontSize: "0.75rem", color: "text.secondary" }}
            >
              {formatMonth(project.updated)}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="h4" component="h3" sx={{ mb: 0.5 }}>
              {project.name}
            </Typography>
            <Typography color="text.secondary">{project.tagline}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" gap={2}>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {project.stack.map((tech) => (
                <StackChip key={tech} tech={tech} />
              ))}
            </Stack>
            <Box
              className="card-arrow"
              sx={{ color: "text.secondary", transition: "transform .2s, color .2s", display: "flex" }}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
