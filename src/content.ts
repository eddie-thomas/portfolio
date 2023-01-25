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
export const PROJECTS: Array<ContentType> = [
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
export const BIO: {
  [key: string]: string | Array<string> | { [key: string]: string } | Date;
} = {
  name: "Edward Kyle Thomas Jr",
  current_company: "Semantic Arts Inc.",
  email: "k.edwardthom@gmail.com",
  phone: "970-791-1490",
  self_description: [
    `I’m a motivated individual with in-depth knowledge of languages and development tools, seeking a position in a result-oriented 
    company where I can use my skills to the advantage of the company while having the scope to develop my own skills. `,
  ],
  github_accounts: [
    "https://github.com/eddie-thomas",
    "https://github.com/thom8047",
    "https://github.com/RamosThomas",
  ],
  stackoverflow: "https://stackoverflow.com/users/14258470/lua-python-java",
  last_updated: new Date("2023-01-25T05:36:55.205Z"),
};

export const REFERENCES: {
  [name: string]: {
    email: string;
    phone: string;
    description: string;
  };
} = {
  dave_mccomb: {
    email: "mccomb@semanticarts.com",
    phone: "",
    description: `David McComb is the owner of the company I work at, Semantic Arts. To me he is a self-motivated, competent, and driven individual 
    that I hope to be like when I am in the later parts of my career. His forward thinking on data management in the large corporate world is solving
    real problems that can be found in most businesses. He is the well respected CTO of the company.`,
  },
  danny_hurlburt: {
    email: "danny.hurlburt@semanticarts.com",
    phone: "",
    description: `Danny Hurlburt is a developer I look up to and respect. He guided me into my career by being a mentor with strong self-practices in team development, code 
    production, and development processes. He has set an example, to me, of what a professional software engineer looks like.`,
  },
  vicente_ramos: {
    email: "vicenteramos318@gmail.com",
    phone: "",
    description: `Vicente Ramos was a college friend that I did the Xamarin Forms internship with. We have stayed good friends since college, and although we have never worked 
    together, he has been a voice of encouragement to practice as I work full days developing and try to carve out time for personal projects. He has sat in on my development processes 
    and, I hope, has learned. He is currently attending the University of Denver to get his masters in Computer Science.`,
  },
};
