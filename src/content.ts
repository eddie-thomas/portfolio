enum Status {
  Unstarted,
  Started,
  Finished,
  Complete,
}

interface ContentType {
  description: string;
  status?: Status;
  last_updated: Date;
  name: string;
  notes?: Array<string>;
  project: string;
  todos?: Array<string>;
}

/**
 * Content object for ease of change
 *
 * Notes:
 * - Initially wanted JSON, but that became tedious to keep up with and hard to edit with all the line breaks
 */
export const CONTENT: Array<ContentType> = [
  {
    name: "FinancialReact",
    project: "https://github.com/eddie-thomas/FinancialReact",
    description: `A financial planner for parsing Wells Fargo PDF statements.
    The backend can read credit, debit, and savings statements. Currently has
    been tested with statements ranging from 2016 to 2022.`,
    notes: [
      "I attempted this project when I first got out of college, and it was a failure. Not the best code and the method I chose did not scale well with time. See the project here: https://github.com/thom8047/FinancialReacts_v1.0.0",
    ],
    status: Status.Complete,
    last_updated: new Date("01/22/2023"),
  },
  {
    name: "rpi-security (DIY Security System)",
    project: "https://github.com/eddie-thomas/rpi-security",
    description: `Home-made security system built onto 32-bit OS of Debian Bullseye.
    Built using a RaspberryPi, and an HC-SR501 motion sensor for detecting motion
    activity. This project was super fun because I got to work on asynchronous behavior
    in python and work some hardware skills! I made my own meter-length wires to connect
    to the motion sensor.`,
    status: Status.Finished,
    notes: [
      "Very simple project.",
      "Built the camera/motion sensor case in legos!",
      "Used nice wire wrapping to conceal the camera wire and the sensor's wires.",
      "Video footage currently lives on my Pi.",
      "Night-vision camera is used!",
      "Terminus (on iOS) is used for external access to the Pi.",
    ],
    todos: [
      "Replace desktop OS with lite OS, no need for a desktop.",
      "Add firewall.",
      "Mount on wall outside.",
      "Move video storage to an external USB, and add a schedule script to delete old video files periodically.",
      "Tentative: Create YouTube video for submission to Google to ask for use of the Google Drive API to post video footage to my Google drive.",
    ],
    last_updated: new Date("01/22/2023"),
  },
  {
    name: "Practice Projects",
    project: "https://github.com/eddie-thomas/Practice-Projects",
    description: `Projects to grow my skill-set and challenge myself, thoughtfully and programmatically.`,
    status: Status.Started,
    notes: [
      "This project will likely never have an end, I hope to build it up to be a fairly large repo.",
    ],
    last_updated: new Date("01/22/2023"),
  },
];

/**
 * Object representing myself, meant to be un-typed on purpose
 */
export const EDDIE = {
  current_company: "Semantic Arts Inc.",
  email: "k.edwardthom@gmail.com",
  github_accounts: ["eddie-thomas", "thom8047", "RamosThomas"],
  last_updated: new Date("01/22/2023"),
  name: "Edward Kyle Thomas Jr",
  phone: { home: undefined, mobile: "970-791-1490" },
  stackoverflow_account:
    "https://stackoverflow.com/users/14258470/lua-python-java",
};
