/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

export enum Status {
  Unstarted,
  Started,
  Finished,
  Complete,
}

export interface ContentType {
  description: string;
  status: Status;
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
    name: "Docusign-ALT",
    project: "https://github.com/eddie-thomas/docusign-alt",
    description: `An individual I know from my college days,
    who currently operates a reputable Jet ski rental business
    in the vibrant state of Florida, approached me with a professional
    request. They sought my expertise to develop a web application that
    would empower their valued clients to conveniently complete a streamlined
    online form. The purpose of this form is to automatically generate a
    comprehensive PDF document, specifically designed as a legally binding
    waiver, serving the crucial function of mitigating potential liabilities
    associated with their exhilarating watercraft activities. Despite previously
    utilizing Docusign, this astute entrepreneur was determined to explore a
    cost-effective alternative solution, prompting their decision to reach out to me.`,
    status: Status.Complete,
    notes: [
      `The backend is currently hosted with Google Clouds App Engine services
      which allows a quick spin up of the backend when needed. For the client's
      purposes, the usage falls under Google's free tier.`,
      `The front-end can easily be configured. Last month, the client updated
      the waiver, added a new page to the front and it required a signature. With
      the simple set up, I simply adjusted the JSON data that represents the fields
      and I could do it in under 3 minutes.`,
      `Simple and smooth approach to filling in content of a PDF and the shipping it
      to a backend for other purposes.`,
      `This repo does not have a boilerplate backend supplied, because I don't believe
      a front end that takes user input and injects it into a PDF has any general use-case.
      A developer implementing this will be able to add some AJAX/Axios/JavaScript fetch
      mechanism that can send of the bytes of the PDF (as an array of 8-bit integers).`,
    ],
    last_updated: new Date("06/16/2023"),
  },
  {
    name: "Financial React",
    project: "https://github.com/eddie-thomas/FinancialReact",
    description: `A financial planner for parsing Wells Fargo PDF statements.
    The backend can read credit, debit, and savings statements. Currently has
    been tested with statements ranging from 2016 to 2022.`,
    notes: [
      `I attempted this project when I first got out of college, and it was a failure.
      Not the best code and the method I chose did not scale well with time. See the following note.`,
      "https://github.com/thom8047/FinancialReacts_v1.0.0\nView old project here.",
    ],
    status: Status.Complete,
    last_updated: new Date("01/22/2023"),
  },
  {
    name: "Rpi-Security (DIY Security System)",
    project: "https://github.com/eddie-thomas/rpi-security",
    description: `Home-made security system built onto 32-bit OS of Debian Bullseye.
    Built using a RaspberryPi, and an HC-SR501 motion sensor for detecting motion
    activity. This project was super fun because I got to work on asynchronous behavior
    in python and work some hardware skills! I made my own meter-length wires to connect
    to the motion sensor. Created a Lego-built container that neatly holds the sensor and 
    the camera, and has an attached rig that I can mount and move around.`,
    status: Status.Complete,
    notes: [
      "Very simple project.",
      "Built the camera/motion sensor case in legos!",
      "Used nice wire wrapping to conceal the camera wire and the sensor's wires.",
      "Video footage currently lives on the Pi (hope to move this to external USB connected to the Pi).",
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
    last_updated: new Date("02/03/2023"),
  },
];

/**
 * Object representing myself
 */
export const BIO: {
  [key: string]: string | Array<string> | { [key: string]: string } | Date;
} = {
  name: "Edward Kyle Thomas Jr",
  current_company: "Semantic Arts Inc.",
  email: "k.edwardthom@gmail.com",
  phone_number: "970-791-1490",
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

/**
 * References
 */
export const REFERENCES: {
  [name: string]: {
    email: string;
    phone_number: string;
    description: string;
  };
} = {
  dave_mcComb: {
    email: "mccomb@semanticarts.com",
    phone_number: "",
    description: `David McComb is the owner of the company I work at, Semantic Arts. To me he is a self-motivated, competent, and driven individual 
    that I hope to be like when I am in the later parts of my career. His forward thinking on data management in the large corporate world is solving
    real problems that can be found in most businesses. He is the well respected CTO of the company.`,
  },
  danny_hurlburt: {
    email: "danny.hurlburt@semanticarts.com",
    phone_number: "",
    description: `Danny Hurlburt is a developer I look up to and respect. He guided me into my career by being a mentor with strong self-practices in team development, code 
    production, and development processes. He has set an example, personally, of what a professional software engineer looks like.`,
  },
  vicente_ramos: {
    email: "vicenteramos318@gmail.com",
    phone_number: "",
    description: `Vicente Ramos was a college friend that participated in the BrightenTheBrain internship with me. We have stayed good friends since college, and although we have never worked 
    together (professionally), he has been an encouraging dev. partner as I work full days and still try to carve out time for personal projects. He has sat in on my development processes 
    and, I hope, has learned from my successes and mistakes. He is currently attending the University of Denver to get his masters in Computer Science.`,
  },
};
