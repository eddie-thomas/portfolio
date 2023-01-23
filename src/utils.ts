/**
 * Smoothly scroll element into view
 *
 * @param identifier - CSS selector string, but must be prefixed with `.` or `#` for a singular selection
 */
function scrollElementIntoView(identifier: string): void {
  if (["#", "."].includes(identifier[0]))
    throw Error(
      `Cannot select an element using "${identifier}" as a CSS selector string.`
    );

  document.querySelector(identifier)?.scrollIntoView({
    behavior: "smooth",
  });
}

export { scrollElementIntoView };
