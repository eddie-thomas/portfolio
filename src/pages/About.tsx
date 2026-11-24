/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Fragment } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import { GithubIcon, LinkedinIcon } from "../components/BrandIcons";
import ExperienceTimeline, { positionAnchor } from "../components/ExperienceTimeline";
import ExternalLink from "../components/ExternalLink";
import { useContact } from "../components/layout/Layout";
import { ALL_TECH, EXPERIENCE, LINKS, PROFILE, PROJECTS, SKILL_GROUPS } from "../content";
import { MONO } from "../theme";

/** Skill groups, plus anything used in a project that isn't grouped yet */
function skillGroups() {
  const all = ALL_TECH.concat(PROFILE.extraSkills.filter((s) => !ALL_TECH.includes(s)));
  const grouped = SKILL_GROUPS.map((group) => ({
    name: group.name,
    skills: group.skills.filter((skill) => all.includes(skill)),
  })).filter((group) => group.skills.length > 0);
  const ungrouped = all.filter(
    (skill) => !SKILL_GROUPS.some((group) => group.skills.includes(skill))
  );
  if (ungrouped.length) grouped.push({ name: "Other", skills: ungrouped });
  return grouped;
}

export default function About() {
  const openContact = useContact();

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
      <Grid container spacing={{ xs: 5, md: 8 }}>
        <Grid item xs={12} md={7}>
          <Typography variant="overline" component="p" color="primary" sx={{ mb: 2 }}>
            :eddie :worksAt{" "}
            <ExternalLink href={LINKS.semanticArts} icon={false} color="inherit" sx={{ display: "inline" }}>
              :SemanticArts
            </ExternalLink>
          </Typography>
          <Typography variant="h1" sx={{ mb: 4 }}>
            About
          </Typography>
          <Stack gap={2.5} sx={{ mb: 5 }}>
            <Typography sx={{ fontSize: "1.15rem" }}>{PROFILE.intro}</Typography>
            {PROFILE.about.map((paragraph) => (
              <Typography key={paragraph.slice(0, 24)} color="text.secondary">
                {paragraph}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ mb: 6 }}>
            <Button variant="contained" href={LINKS.resume} target="_blank" rel="noopener noreferrer" startIcon={<FileText size={16} />} endIcon={<ArrowUpRight size={14} />}>
              Résumé
            </Button>
            <Button variant="outlined" href={LINKS.github} target="_blank" rel="noopener noreferrer" startIcon={<GithubIcon size={16} />}>
              GitHub
            </Button>
            <Button variant="outlined" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" startIcon={<LinkedinIcon size={16} />}>
              LinkedIn
            </Button>
          </Stack>

          <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
            Experience
          </Typography>
          <Stack gap={2} sx={{ mb: 6 }}>
            {EXPERIENCE.map((experience) => (
              <ExperienceTimeline key={experience.id} experience={experience} />
            ))}
          </Stack>

          <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
            Skills
          </Typography>
          <Stack gap={2.5} sx={{ mb: 6 }}>
            {skillGroups().map((group) => (
              <Box key={group.name}>
                <Typography variant="overline" component="p" color="text.secondary" sx={{ mb: 1 }}>
                  {group.name}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {group.skills.map((skill) =>
                    ALL_TECH.includes(skill) ? (
                      <Chip
                        key={skill}
                        label={skill}
                        clickable
                        component={RouterLink}
                        to={`/?tech=${encodeURIComponent(skill)}#projects`}
                      />
                    ) : (
                      <Chip key={skill} label={skill} />
                    )
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>
            References
          </Typography>
          <Typography color="text.secondary">
            References are available on request.{" "}
            <Link component="button" onClick={openContact} sx={{ verticalAlign: "baseline", fontSize: "inherit" }}>
              Send me a message
            </Link>{" "}
            and I'll put you in touch.
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
            <ProfileFacts />
            <Paper variant="outlined" sx={{ p: 2.5, mt: 2 }}>
              <Typography variant="overline" component="p" color="text.secondary" sx={{ mb: 1 }}>
                # elsewhere
              </Typography>
              <Stack gap={1} sx={{ fontFamily: MONO, fontSize: "0.85rem" }}>
                <ExternalLink href={LINKS.github}>github.com/eddie-thomas</ExternalLink>
                <ExternalLink href={LINKS.linkedin}>linkedin.com/in/edward-kyle-thomas</ExternalLink>
                <ExternalLink href={LINKS.stackoverflow}>stackoverflow</ExternalLink>
                <Link component="button" onClick={openContact} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontFamily: MONO, fontSize: "0.85rem", alignSelf: "flex-start" }}>
                  <Mail size={14} /> send a message
                </Link>
              </Stack>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

/** Turtle-style description of me, mirroring the project facts panels */
function ProfileFacts() {
  const currentRoles = EXPERIENCE.flatMap((experience) => experience.positions).filter(
    (position) => !position.end
  );
  const rows: Array<[string, JSX.Element]> = [
    ["a", <Box component="span" sx={{ color: "primary.main" }}>:SoftwareEngineer</Box>],
    [":name", <Box component="span" sx={{ color: "success.main" }}>"{PROFILE.fullName}"</Box>],
    [
      ":worksAt",
      <ExternalLink href={LINKS.semanticArts} icon={false} sx={{ display: "inline", fontFamily: MONO }}>
        :SemanticArts
      </ExternalLink>,
    ],
    [
      ":holds",
      <>
        {currentRoles.map((position, index) => (
          <Fragment key={position.id}>
            <Link component={RouterLink} to={{ hash: positionAnchor(position) }} sx={{ fontFamily: MONO }}>
              :{position.id}
            </Link>
            {index < currentRoles.length - 1 && ", "}
          </Fragment>
        ))}
      </>,
    ],
    [":basedIn", <Box component="span" sx={{ color: "success.main" }}>"{PROFILE.location}"</Box>],
    [":studied", <Box component="span" sx={{ color: "success.main" }}>"{PROFILE.education}"</Box>],
    [
      ":built",
      <>
        {PROJECTS.map((project, index) => (
          <Fragment key={project.slug}>
            <Link component={RouterLink} to={`/projects/${project.slug}`} sx={{ fontFamily: MONO }}>
              :{project.slug}
            </Link>
            {index < PROJECTS.length - 1 && ", "}
          </Fragment>
        ))}
      </>,
    ],
  ];

  return (
    <Paper variant="outlined" sx={{ p: 2.5, fontFamily: MONO, fontSize: "0.8rem", lineHeight: 1.9 }}>
      <Typography variant="overline" component="p" color="text.secondary" sx={{ mb: 1 }}>
        # me.ttl
      </Typography>
      <Box sx={{ color: "primary.main", fontWeight: 600 }}>:eddie</Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 1.5, pl: 2 }}>
        {rows.map(([predicate, object], index) => (
          <Fragment key={predicate}>
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
