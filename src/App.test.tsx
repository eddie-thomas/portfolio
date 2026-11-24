/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { render, screen } from "@testing-library/react";

import App from "./App";
import { PROFILE, PROJECTS } from "./content";

test("renders the home page with links to every project", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { level: 1, name: PROFILE.headline })
  ).toBeInTheDocument();

  PROJECTS.forEach((project) => {
    const heading = screen.getByRole("heading", { name: project.name });
    expect(heading.closest("a")).toHaveAttribute(
      "href",
      `/projects/${project.slug}`
    );
  });
});
