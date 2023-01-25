import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

// Icons
import DoneIcon from "@mui/icons-material/Done";
import GitHubIcon from "@mui/icons-material/GitHub";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import PendingIcon from "@mui/icons-material/Pending";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VerifiedIcon from "@mui/icons-material/Verified";

// Utility code
import { PROJECTS, Status } from "../content";
import { toPascalCase } from "../utils";
import { linkifyString } from "./Bio";

// Styled components
const StyledGitHubLink = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&:hover": {
    "& .MuiTypography-root": {
      opacity: 1,
    },
  },
  "& .MuiTypography-root": {
    opacity: 0,
    transition: "1s",
  },
  "& .MuiSvgIcon-root": {
    margin: theme.spacing(2),
  },
}));

const StyledTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& > .MuiTypography-overline": {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

/**
 * Projects component
 *
 * @returns JSX.Element
 */
export default function Projects() {
  return (
    <div>
      <Typography id="projects" variant="h3" textAlign="center" sx={{ pl: 1 }}>
        Projects
      </Typography>
      <br />
      {PROJECTS.map((project) => {
        const name: string = toPascalCase(project.name);
        return (
          <Box
            key={JSON.stringify(project)}
            sx={{
              mx: 3,
              "& > a": { color: "inherit", textDecoration: "none" },
            }}
          >
            <StyledTitle>
              <Typography variant="h5">{name}</Typography>
              <Box flexGrow={1} />
              <Typography variant="overline">status:&nbsp;</Typography>
              <ProjectStatus status={project.status} />
            </StyledTitle>
            {linkifyString(
              project.project,
              <StyledGitHubLink>
                <GitHubIcon />
                <Typography>Link to project</Typography>
              </StyledGitHubLink>
            )}

            <br />
            <Typography>{project.description}</Typography>
            <br />
            {project.notes && (
              <Accordion>
                <AccordionSummary>
                  <Typography>Project Notes:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {project.notes?.map((note) => {
                      return (
                        <ListItem key={note}>
                          <ListItemIcon>
                            <HorizontalRuleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              note.startsWith("https://")
                                ? linkifyString(
                                    note.split("\n")[0],
                                    note.split("\n")[1]
                                  )
                                : note
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
            <Divider sx={{ m: 3 }} />
          </Box>
        );
      })}
    </div>
  );
}

/**
 * Styled icon representing the status of the project
 *
 * @param props -
 * @param props.status - Status of the project @see {Status}
 * @returns
 */
function ProjectStatus({ status }: { status: Status }) {
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Icon to render
   */
  const Icon: JSX.Element =
    status === Status.Unstarted ? (
      <RemoveCircleOutlineIcon color="error" />
    ) : status === Status.Started ? (
      <PendingIcon color="info" />
    ) : status === Status.Finished ? (
      <DoneIcon color="warning" />
    ) : status === Status.Complete ? (
      <VerifiedIcon color="success" />
    ) : (
      <></>
    );

  /**
   * The description of the icon
   */
  const description: string =
    status === Status.Unstarted
      ? "Not started"
      : status === Status.Started
      ? "Still a work in progress..."
      : status === Status.Finished
      ? "Finished, with the caveat of incomplete docs/clean up"
      : "Completed!";

  /**
   * Handler for click event
   * - Mainly for mobile use, so a user can get some description as a notification about what the icon means
   */
  const handleClick = () => {
    enqueueSnackbar(<Typography>{description}</Typography>);
  };

  return (
    <Tooltip title={description}>
      <IconButton onClick={handleClick}>{Icon}</IconButton>
    </Tooltip>
  );
}
