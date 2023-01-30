/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

/**
 * Known links for security purposes
 */
const KNOWN_LINKS = [
  "https://github.com/eddie-thomas",
  "https://github.com/thom8047",
  "https://github.com/RamosThomas",
  "https://stackoverflow.com/users/14258470/lua-python-java",
  "https://docs.google.com/document/d/1LDzMgp_i8amZWFCHoO_rnBQTyUY35tb2xmDQFOgtaZ8/edit",
  "https://www.linkedin.com/in/edward-kyle-thomas-b7050b204/?trk=public-profile-join-page",
  "https://github.com/eddie-thomas/FinancialReact",
  "https://github.com/eddie-thomas/rpi-security",
  "https://github.com/eddie-thomas/Practice-Projects",
  "https://github.com/thom8047/FinancialReacts_v1.0.0",
];

/**
 * Copy a string to clipboard
 *
 * Notes:
 * - Found this via the link below, and I tweaked it to work
 * - Not the prettiest code, but I can clean  up later
 *
 * @see https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
 *
 * @param string The string to be copied to clipboard
 * @return returns a boolean correspondent to the success of the copy operation.
 */
function copyTextToClipboard(string: string): boolean {
  let result;

  /**
   * The older method of copying text to a clip board
   *
   * Notes:
   * - The Clipboard API doesn't work on iOS, so this method will work for now
   *
   * @deprecated
   */
  const oldWayOfCopying = () => {
    let textarea;
    try {
      textarea = document.createElement("textarea");
      textarea.setAttribute("readonly", "true");
      textarea.setAttribute("contenteditable", "true");
      textarea.style.position = "fixed"; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand("copy");
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      textarea && document.body.removeChild<HTMLTextAreaElement>(textarea);
    }
  };

  // Invoke copy function
  oldWayOfCopying();

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const copyHotkey = isMac ? "⌘C" : "CTRL+C";
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}

/**
 * Click handler to open a link in a separate tab
 *
 * @param link - One of the known links @see {KNOWN_LINKS}
 */
function openLink(link: string) {
  if (KNOWN_LINKS.includes(link)) window.open(link, "_blank")?.focus();
  return false;
}

/**
 * Smoothly scroll element into view
 *
 * @param identifier - CSS selector string, but must be prefixed with `.` or `#` for a singular selection
 */
function scrollElementIntoView(identifier: string): void {
  if (!identifier.startsWith("#"))
    throw Error(
      `Cannot select an element using "${identifier}" as a CSS selector string.`
    );

  document.querySelector(identifier)?.scrollIntoView({
    behavior: "smooth",
  });
}

/**
 * To pascal case
 *
 * @param value - String that is meant to be `snake cased` and will be properly formatted into Pascal case with `_` being interpreted as spaces
 * @returns string
 */
function toPascalCase(value: string): string {
  return value
    .split("_")
    .map((word: string) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export { copyTextToClipboard, openLink, scrollElementIntoView, toPascalCase };
