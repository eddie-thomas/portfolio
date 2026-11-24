/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDown, Mail, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { HighlightProvider, useHighlight } from "../components/HighlightContext";
import { useContact } from "../components/layout/Layout";
import ProjectCard from "../components/ProjectCard";
import StackChip from "../components/StackChip";
import StackGraph from "../components/StackGraph";
import { ALL_TECH, PROFILE, PROJECTS } from "../content";
import { MONO } from "../theme";

const SORTED = [...PROJECTS].sort(
  (a, b) => b.updated.getTime() - a.updated.getTime()
);

export default function Home() {
  const [params] = useSearchParams();
  const tech = params.get("tech");

  return (
    <HighlightProvider
      key={tech ?? ""}
      initialTech={tech && ALL_TECH.includes(tech) ? tech : null}
    >
      <Hero />
      <ProjectsSection />
      <ContactStrip />
    </HighlightProvider>
  );
}

function Hero() {
  const openContact = useContact();

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
        <Grid item xs={12} md={5}>
          <Typography variant="overline" component="p" color="primary" sx={{ mb: 2 }}>
            :eddie a :SoftwareEngineer
          </Typography>
          <Typography variant="h1" sx={{ mb: 3 }}>
            {PROFILE.headline}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.075rem", mb: 4 }}>
            {PROFILE.intro}
          </Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              href="#projects"
              endIcon={<ArrowDown size={16} />}
            >
              See projects
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={openContact}
              startIcon={<Mail size={16} />}
            >
              Get in touch
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: { xs: "none", md: "block" } }}>
          <StackGraph />
        </Grid>
      </Grid>
    </Container>
  );
}

function ProjectsSection() {
  const { selectedTech, setSelectedTech } = useHighlight();
  const visible = selectedTech
    ? SORTED.filter((project) => project.stack.includes(selectedTech))
    : SORTED;

  return (
    <Container maxWidth="lg" component="section" id="projects" sx={{ scrollMarginTop: 80 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "baseline" }}
        gap={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h2">Projects</Typography>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.8rem" }} color="text.secondary">
          {selectedTech
            ? `?project :uses :${selectedTech.replace(/\s+/g, "-")} → ${visible.length}`
            : `${PROJECTS.length} projects · ${ALL_TECH.length} technologies`}
        </Typography>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center" sx={{ mb: 4 }}>
        {ALL_TECH.map((tech) => (
          <StackChip key={tech} tech={tech} interactive />
        ))}
        {selectedTech && (
          <Button
            size="small"
            onClick={() => setSelectedTech(null)}
            startIcon={<X size={14} />}
            sx={{ ml: 0.5 }}
          >
            Clear filter
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        {visible.map((project) => (
          <Grid item xs={12} sm={6} lg={4} key={project.slug}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function ContactStrip() {
  const openContact = useContact();

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h3" component="h2" sx={{ mb: 1 }}>
            Have a project in mind?
          </Typography>
          <Typography color="text.secondary">
            I'm open to freelance builds, collaborations, and conversations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={openContact}
          startIcon={<Mail size={16} />}
          sx={{ flexShrink: 0 }}
        >
          Get in touch
        </Button>
      </Paper>
    </Container>
  );
}
