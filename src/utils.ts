/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

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
 * Send an email through Web3Forms (https://web3forms.com).
 *
 * The access key only routes mail to the inbox it was issued for, so it is
 * safe to ship in client code. It is read from REACT_APP_WEB3FORMS_KEY at build time.
 *
 * @param props -
 * @param props.email - Email of the user sending an email (used as Reply-To)
 * @param props.message - The message to send in the email
 * @param props.name - Name of the person sending the email
 * @returns The status of the response
 */
async function sendMail({
  email,
  message,
  name,
}: {
  email: string;
  message: string;
  name: string;
}): Promise<number> {
  const accessKey = process.env.REACT_APP_WEB3FORMS_KEY;
  if (!accessKey) {
    throw new Error("REACT_APP_WEB3FORMS_KEY is not set");
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Portfolio-sent email from ${name}`,
      from_name: name,
      name,
      email,
      message,
      botcheck: "",
    }),
  });

  return response.status;
}

/**
 * Format a date as an ISO day, e.g. "2023-10-09" (UTC, so it never shifts a day)
 *
 * @param date - Date to format
 * @returns string
 */
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Format a date as month + year, e.g. "Oct 2023"
 *
 * @param date - Date to format
 * @returns string
 */
function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export { copyTextToClipboard, formatDate, formatMonth, sendMail };
