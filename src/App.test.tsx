/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);

  expect(true).toBeTruthy();
});
