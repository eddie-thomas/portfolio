/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { type ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowLeft, ArrowUpRight, Check, Globe, MoveRight } from "lucide-react";
import { Link as RouterLink, useParams } from "react-router-dom";

import { GithubIcon } from "../components/BrandIcons";
import FactsPanel from "../components/FactsPanel";
import MediaGallery from "../components/MediaGallery";
import StatusBadge from "../components/StatusBadge";
import { getConnectedProjects, getProject } from "../content";
import { MONO } from "../theme";
import { formatMonth } from "../utils";
import NotFound from "./NotFound";

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <NotFound />;

  const connected = getConnectedProjects(project);

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      <Link
        component={RouterLink}
        to="/#projects"
        color="text.secondary"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, mb: 4, fontSize: "0.9rem" }}
      >
        <ArrowLeft size={16} /> All projects
      </Link>

      {/* Header */}
      <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 2 }}>
        <StatusBadge status={project.status} />
        <Typography component="span" sx={{ fontFamily: MONO, fontSize: "0.75rem" }} color="text.secondary">
          Updated {formatMonth(project.updated)}
        </Typography>
      </Stack>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {project.name}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, maxWidth: 720, mb: 3 }}>
        {project.tagline}
      </Typography>
      <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 5 }}>
        {project.links.live && (
          <Button variant="contained" href={project.links.live} target="_blank" rel="noopener noreferrer" startIcon={<Globe size={16} />} endIcon={<ArrowUpRight size={14} />}>
            Visit site
          </Button>
        )}
        {project.links.repo && (
          <Button variant="outlined" href={project.links.repo} target="_blank" rel="noopener noreferrer" startIcon={<GithubIcon size={16} />} endIcon={<ArrowUpRight size={14} />}>
            Source code
          </Button>
        )}
      </Stack>

      {project.cover && (
        <Box
          component="img"
          src={project.cover}
          alt={`${project.name} cover`}
          sx={{ width: "100%", borderRadius: 3, border: 1, borderColor: "divider", mb: 6, display: "block" }}
        />
      )}

      <Grid container spacing={{ xs: 5, md: 8 }}>
        {/* Write-up */}
        <Grid item xs={12} md={8}>
          <Typography sx={{ fontSize: "1.15rem", mb: 5 }}>{project.summary}</Typography>

          {project.sections.map((section) => (
            <Block key={section.heading} title={section.heading}>
              <Typography color="text.secondary">{section.body}</Typography>
            </Block>
          ))}

          <Block title="Gallery">
            <MediaGallery media={project.media} />
          </Block>

          {project.highlights && project.highlights.length > 0 && (
            <Block title="Highlights">
              <BulletList items={project.highlights} icon={<Check size={16} />} />
            </Block>
          )}

          {project.next && project.next.length > 0 && (
            <Block title="Next up">
              <BulletList items={project.next} icon={<MoveRight size={16} />} />
            </Block>
          )}
        </Grid>

        {/* Facts */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
            <FactsPanel project={project} />
          </Box>
        </Grid>
      </Grid>

      {connected.length > 0 && (
        <Box component="section" sx={{ mt: 8 }}>
          <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
            Connected projects
          </Typography>
          <Grid container spacing={2}>
            {connected.map(({ project: other, shared }) => (
              <Grid item xs={12} sm={6} md={4} key={other.slug}>
                <Card sx={{ height: "100%", "&:hover": { borderColor: "primary.main" } }}>
                  <CardActionArea component={RouterLink} to={`/projects/${other.slug}`} sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="h5" component="h3" sx={{ mb: 0.5 }}>
                        {other.name}
                      </Typography>
                      <Typography sx={{ fontFamily: MONO, fontSize: "0.75rem" }} color="text.secondary">
                        via {shared.map((tech) => `:${tech.replace(/\s+/g, "-")}`).join(", ")}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function BulletList({ items, icon }: { items: Array<string>; icon: ReactNode }) {
  return (
    <Stack component="ul" gap={1.25} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {items.map((item) => (
        <Stack component="li" direction="row" gap={1.5} key={item}>
          <Box sx={{ color: "primary.main", display: "flex", pt: "5px" }}>{icon}</Box>
          <Typography color="text.secondary">{item}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
