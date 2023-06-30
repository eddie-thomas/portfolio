/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Box, Divider, styled, Typography } from "@mui/material";

import CopyButton from "./CopyButton";

import { REFERENCES } from "../content";
import { toPascalCase } from "../utils";

// Styled components
const StyledEmail = styled("div")(() => ({
  maxWidth: "70vw",
  borderRight: "1px solid rgba(0,0,0,.25)",
  overflow: "hidden",
  paddingRight: "24px",
  marginRight: "24px",
}));

const StyledEmailContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  margin: theme.spacing(2),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
  [theme.breakpoints.up("sm")]: {
    justifyContent: "left",
  },
}));

/**
 * References component
 *
 * @returns JSX.Element
 */
export default function References() {
  return (
    <div>
      <Typography
        id="references"
        variant="h3"
        textAlign="center"
        sx={{ pl: 1 }}
      >
        References
      </Typography>
      <br />
      {Object.entries(REFERENCES).map(([key, value]) => {
        const name: string = toPascalCase(key);
        return (
          <Box key={JSON.stringify(value)} sx={{ mx: 3 }}>
            <Typography variant="h5">{name}</Typography>
            <StyledEmailContainer>
              <StyledEmail>
                <Typography>{value.email}</Typography>
              </StyledEmail>
              <CopyButton
                content={value.email}
                name={`${name}${name.endsWith("s") ? "'" : "'s"} email`}
              />
            </StyledEmailContainer>

            <Typography>{value.phone_number}</Typography>
            <Typography>{value.description}</Typography>
            <Divider sx={{ m: 3 }} />
          </Box>
        );
      })}
    </div>
  );
}
