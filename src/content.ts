/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

/**
 * All site content lives here so it can be edited without touching components.
 *
 * Adding media to a project:
 * 1. Drop files into `public/media/<slug>/` (keep self-hosted videos short, < 10 MB).
 * 2. Reference them with `asset("<slug>/file.png")` in `cover` or `media`.
 * 3. For longer videos, upload to YouTube and use `{ type: "youtube", src: "<video id>" }`.
 */

export type Status = "in-progress" | "shipped" | "shelved";

export const STATUS_LABEL: Record<Status, string> = {
  "in-progress": "In progress",
  shipped: "Shipped",
  shelved: "Shelved",
};

export interface Media {
  type: "image" | "video" | "youtube";
  /** Image/video URL (use `asset()`), or a YouTube video id */
  src: string;
  caption?: string;
}

export interface Section {
  heading: string;
  body: string;
}

export interface Project {
  /** URL segment: /projects/<slug> */
  slug: string;
  name: string;
  /** One line, shown on cards */
  tagline: string;
  /** Two or three sentences, shown at the top of the project page */
  summary: string;
  status: Status;
  role: string;
  builtFor?: string;
  /** Technologies — these become nodes in the graph, so keep names consistent across projects */
  stack: Array<string>;
  updated: Date;
  links: { repo?: string; live?: string; archive?: string };
  /** Shown on the private-repo projects instead of a repo link */
  repoNote?: string;
  cover?: string;
  media: Array<Media>;
  sections: Array<Section>;
  highlights?: Array<string>;
  next?: Array<string>;
}

/** Resolve a file in `public/media/` to a URL that works under the `/portfolio` base path */
export const asset = (path: string) =>
  `${process.env.PUBLIC_URL}/media/${path}`;

export const PROJECTS: Array<Project> = [
  {
    slug: "musiqstand",
    name: "Musiqstand",
    tagline: "The business side of teaching music lessons, on autopilot.",
    summary: `Musiqstand runs the business side of an independent music studio:
    scheduling, reminders and payment requests. It's my most complete project so
    far. My wife runs her studio on it every week, and I'm still building it.`,
    status: "in-progress",
    role: "Solo founder and developer",
    builtFor: "Independent music teachers",
    stack: [
      "React",
      "TypeScript",
      "React Router",
      "Cloudflare",
      "Supabase",
      "Stripe",
      "Twilio",
      "Claude API",
    ],
    updated: new Date("2026-11-03"),
    links: { live: "https://www.musiqstand.com/" },
    repoNote: "Private repository (commercial product).",
    cover: asset("musiqstand/mobile.jpg"),
    media: [
      { type: "image", src: asset("musiqstand/hero.jpg"), caption: "Landing page" },
      {
        type: "image",
        src: asset("musiqstand/compare.jpg"),
        caption: "Why a focused tool beats a 47-feature studio system",
      },
      { type: "image", src: asset("musiqstand/features.jpg"), caption: "Features, led by AI lesson planning" },
      {
        type: "image",
        src: asset("musiqstand/pricing.jpg"),
        caption: "A free plan for up to three students, and the paid Studio plan",
      },
      {
        type: "image",
        src: asset("musiqstand/signup.jpg"),
        caption: "Sign-up starts with the plan picker",
      },
      { type: "image", src: asset("musiqstand/mobile.jpg"), caption: "Landing page and sign-up on a phone" },
    ],
    sections: [
      {
        heading: "Problem",
        body: `My wife teaches music lessons, mostly to kids. Her studio ran on texts,
        emails and Venmo, and she nearly lost three students to emails that got
        missed. StrumSesh got students in the door. Musiqstand handles everything
        that comes after they book.`,
      },
      {
        heading: "How it works",
        body: `A teacher sets up rate packages and their Venmo, Zelle or PayPal
        details. Then they either add a student or share a public booking link. That
        one enrollment fills in every lesson in the billing period and schedules
        reminders and payment requests over email and text. Messages go out under the
        teacher's name, so parents hear from their teacher, not from an app. A daily
        job creates the next billing cycle so lessons never quietly stop. Teachers
        also get an AI lesson-planning chat and an earnings view with CSV export and
        payment receipts.`,
      },
      {
        heading: "Under the hood",
        body: `It's a server-rendered React Router v7 app on Cloudflare Workers, with
        Postgres on Supabase. All database access happens on the server, and every
        query is scoped to the signed-in teacher. Lessons are stored in the
        teacher's IANA time zone and converted one at a time, so daylight saving
        never moves a lesson. Stripe Billing handles subscriptions, Twilio sends
        texts (the A2P 10DLC registration is approved), Resend sends email and Claude
        powers the lesson planner. Plan limits are enforced on the server, including
        on the public booking form.`,
      },
      {
        heading: "Where it's at",
        body: `It's live at musiqstand.com with a free plan for up to three students
        and a paid Studio plan with no limit. Teachers are paid directly, and
        Musiqstand never takes a commission. Since April 2026 it has grown to over
        400 commits and 39 test suites. Right now I'm focused on getting it to
        teachers beyond our own household.`,
      },
    ],
    highlights: [
      "Used every week to run a real music studio",
      "One enrollment generates the lessons, reminders and payment requests",
      "Email and SMS sent in the teacher's name, with an audit trail for text consent",
      "Time-zone-aware scheduling that holds up across daylight saving changes",
      "Public booking links with Turnstile bot checks and server-side plan limits",
      "Subscriptions with a 30-day trial through Stripe Billing",
    ],
    next: [
      "Usage limits for AI lesson planning on each plan",
      "A production environment separate from staging",
      "Card payments through Stripe Connect",
      "Onboarding the first teachers outside my family",
    ],
  },
  {
    slug: "lifting",
    name: "Lifting",
    tagline: "A workout tracker for my phone, with no back end.",
    summary: `A mobile-first workout tracker I use for my own training. Each day's
    plan comes from one JSON file, and a countdown timer, a calendar and a weight log
    keep me on track. There's no server: everything is saved in the browser.`,
    status: "shipped",
    role: "Solo developer",
    stack: ["React", "TypeScript", "MUI", "Vite", "GitHub Pages"],
    updated: new Date("2026-11-06"),
    links: {
      repo: "https://github.com/eddie-thomas/lifting",
      live: "https://eddie-thomas.github.io/lifting/",
    },
    cover: asset("lifting/cover.jpg"),
    media: [
      {
        type: "image",
        src: asset("lifting/workout-day.jpg"),
        caption: "A day's plan, the countdown timer and the active exercise's steps",
      },
      {
        type: "image",
        src: asset("lifting/weight.jpg"),
        caption: "Training calendar, weight trend toward a goal and the daily weigh-in",
      },
    ],
    sections: [
      {
        heading: "Problem",
        body: `I wanted my training plan, a workout timer and my weigh-ins in one place
        on my phone, without signing up for another fitness app.`,
      },
      {
        heading: "Build",
        body: `A Vite, React and TypeScript app styled with MUI. The plan lives in a
        commented JSONC file, so adding a week of workouts is a text edit. The timer
        keeps the screen awake and ends with an alarm and haptic feedback. Daily
        weigh-ins are smoothed into a trend line and charted against an optional
        goal. All state lives in localStorage, so it survives reloads with no server.`,
      },
      {
        heading: "Deploying",
        body: `Every push to main runs a GitHub Actions workflow that builds the app
        and publishes it to GitHub Pages.`,
      },
    ],
    highlights: [
      "Workout plan defined in a single JSONC file",
      "Countdown timer with a screen wake lock, alarm and haptics",
      "Weight trend (exponential moving average) charted against a goal",
      "No back end: state persists in localStorage",
    ],
  },
  {
    slug: "team-lead-github-metrics",
    name: "Team Lead GitHub Metrics",
    tagline: "Sprint metrics and an AI-written summary from a GitHub Projects board.",
    summary: `A command-line tool I use as a team lead to report on each iteration. It
    pulls the iteration's issues and pull requests from a GitHub Projects board,
    measures review times, merge times and issue velocity, and can write a summary
    of the sprint with a local LLM.`,
    status: "shipped",
    role: "Solo developer",
    stack: ["Python", "Bash", "GitHub API", "Ollama"],
    updated: new Date("2026-05-11"),
    links: { repo: "https://github.com/eddie-thomas/team-lead-github-metrics" },
    media: [],
    sections: [
      {
        heading: "Problem",
        body: `Every iteration I needed the same numbers: how quickly pull requests
        were reviewed and merged, and which issues were stuck. Collecting them by hand
        from GitHub took time I'd rather spend with the team.`,
      },
      {
        heading: "Build",
        body: `A Bash script queries the GitHub GraphQL API, using a fine-grained,
        read-only token, for every issue and pull request in an iteration on a
        Projects v2 board, and saves the results as JSON. Python then computes the
        metrics and prints a color-coded report: time to first review against a
        24-hour target, time to merge, a per-reviewer breakdown and issue status
        transitions, with anything active longer than 14 days flagged.`,
      },
      {
        heading: "Summary",
        body: `With --summary, each issue goes to qwen2.5:7b running locally in Ollama,
        and the results become an executive summary saved as Markdown and as a styled
        HTML page ready to share. The model runs on my machine, so issue data never
        leaves it.`,
      },
    ],
    highlights: [
      "Review-time compliance against a 24-hour target",
      "Per-reviewer and issue-velocity breakdowns",
      "Executive summaries from a local LLM, exported as Markdown and HTML",
    ],
  },
  {
    slug: "strumsesh",
    name: "StrumSesh",
    tagline: "A landing page that turns visitors into guitar students.",
    summary: `My wife started teaching guitar lessons online, so I built StrumSesh to
    turn visitors into booked students. It's done, and it's still how new students
    find her and book their first lesson.`,
    status: "shipped",
    role: "Solo developer",
    builtFor: "My wife",
    stack: ["React", "TypeScript", "MUI", "Vite", "Supabase", "Cloudflare"],
    updated: new Date("2025-09-23"),
    links: { live: "https://strumsesh.com/" },
    cover: asset("strumsesh/cover.jpg"),
    media: [
      { type: "image", src: asset("strumsesh/hero.jpg"), caption: "Landing page" },
      {
        type: "image",
        src: asset("strumsesh/signup.jpg"),
        caption: "Booking form, with lesson times in the visitor's time zone",
      },
      {
        type: "image",
        src: asset("strumsesh/mobile.jpg"),
        caption: "The same pages on a phone",
      },
    ],
    sections: [
      {
        heading: "Problem",
        body: `A new teaching business needs one clear place to send people, and a
        simple way for them to book a first lesson.`,
      },
      {
        heading: "Build",
        body: `A single-page React and TypeScript site, built with Vite and MUI and
        hosted on Cloudflare Pages. One call to action opens a sign-up form where
        parents pick a lesson time, shown in their own time zone, and the request is
        saved to Supabase. Every visit is logged too, and a private analytics page
        charts visits against sign-ups, so it's clear how many visitors actually
        convert.`,
      },
      {
        heading: "Result",
        body: `My wife uses it to bring in new students. The work I'd planned next,
        like scheduling, onboarding and payments, became its own product: Musiqstand.`,
      },
    ],
    highlights: [
      "Landing page live at strumsesh.com",
      "Sign-up form that saves lesson requests to Supabase",
      "Lesson times shown in each visitor's local time zone",
      "Private analytics page charting visits against sign-ups",
      "Still how new students find my wife's lessons",
    ],
  },
  {
    slug: "fives",
    name: "Fives",
    tagline: "A competitive, two-player word-guessing game for mobile.",
    summary: `"Fives" is a road-trip game my wife played growing up. Each player picks
    a secret five-letter word, and you take turns guessing. After every guess you're
    told how many letters matched. I turned it into a real-time React Native app.`,
    status: "shelved",
    role: "Solo developer",
    stack: ["React Native", "Firebase", "Google Cloud"],
    updated: new Date("2024-04-23"),
    links: {},
    repoNote: "Private repository (contains environment secrets).",
    media: [],
    sections: [
      {
        heading: "Idea",
        body: `It's like Wordle, but head-to-head. Instead of guessing a word of the
        day, you're racing to crack your opponent's word before they crack yours.`,
      },
      {
        heading: "Build",
        body: `A React Native client with Firebase and Google Cloud Platform handling
        the back end, game state and database.`,
      },
      {
        heading: "Where it landed",
        body: `It's playable end to end. My wife and I play it with one of us on a
        laptop and the other on my phone. It isn't on the App Store, and I've shelved
        it for now.`,
      },
    ],
    highlights: [
      "Real-time two-player games backed by Firebase",
      "Playable across devices",
    ],
    next: ["Polish and publish to the App Store (maybe someday)"],
  },
  {
    slug: "docusign-alt",
    name: "Docusign-ALT",
    tagline: "Signed PDF waivers for a jet ski rental, without the e-signature bill.",
    summary: `A friend from college runs a jet ski rental business in Florida and was
    paying for Docusign just to collect liability waivers. I built a web form that
    fills in and signs the waiver PDF directly, which cut out the subscription.`,
    status: "shipped",
    role: "Freelance developer",
    builtFor: "Jet ski rental business, Florida",
    stack: ["React", "TypeScript", "MUI", "pdf-lib", "Google Cloud", "GitHub Pages"],
    updated: new Date("2023-10-09"),
    links: { repo: "https://github.com/eddie-thomas/docusign-alt" },
    media: [],
    sections: [
      {
        heading: "Problem",
        body: `Every customer has to sign a waiver before they get on the water. A
        general-purpose e-signature service did the job, but it cost money every month
        for what is really one form.`,
      },
      {
        heading: "Build",
        body: `A mobile-friendly React front end walks the customer through the
        waiver. It writes their answers and signature into the PDF in the browser with
        pdf-lib, then sends the bytes to a small back end on Google App Engine.`,
      },
      {
        heading: "Result",
        body: `The client's usage stays within Google's free tier. The form fields are
        defined in JSON, so when the client added a new page that needed a signature,
        the change took under three minutes.`,
      },
    ],
    highlights: [
      "Form fields defined as JSON, so the waiver can change without code changes",
      "Back end on Google App Engine, running within the free tier",
      "Filled PDF is sent to the back end as raw bytes (Uint8Array)",
    ],
  },
  {
    slug: "financial-react",
    name: "Financial React",
    tagline: "A personal finance tracker that parses bank PDF statements.",
    summary: `A personal finance planner that reads Wells Fargo PDF statements
    (credit, debit and savings) and turns them into data I can actually use. It has
    tracked my statements from 2016 to 2024.`,
    status: "shipped",
    role: "Solo developer",
    stack: ["React", "TypeScript", "MUI", "Python", "Flask", "Bash"],
    updated: new Date("2023-01-22"),
    links: {
      repo: "https://github.com/eddie-thomas/FinancialReact",
      archive: "https://github.com/thom8047/FinancialReacts_v1.0.0",
    },
    media: [],
    sections: [
      {
        heading: "Problem",
        body: `Banks give you PDFs, not data. I wanted years of statements in one place
        that I could search and analyze.`,
      },
      {
        heading: "Build",
        body: `A Python and Flask back end parses each statement type into structured
        transactions, and a React and TypeScript front end displays them. Statements
        are uploaded by hand, which works fine for me.`,
      },
      {
        heading: "Second attempt",
        body: `I first tried this right out of college and it didn't work out: the
        approach didn't scale as statements piled up. This version is the rewrite, and
        it has been tested against every statement from 2016 to 2024.`,
      },
    ],
    highlights: [
      "Parses credit, debit and savings statements",
      "Tested and verified against statements from 2016 to 2024",
    ],
  },
  {
    slug: "rpi-security",
    name: "RPi-Security",
    tagline: "A DIY motion-triggered night-vision camera on a Raspberry Pi.",
    summary: `A home-made security system: a Raspberry Pi, an HC-SR501 motion sensor
    and a night-vision camera, all in a Lego enclosure I built. Motion triggers
    recording, and I can check in remotely from my phone.`,
    status: "shipped",
    role: "Solo builder",
    stack: ["Python", "asyncio", "Raspberry Pi", "Linux", "Bash"],
    updated: new Date("2023-02-03"),
    links: { repo: "https://github.com/eddie-thomas/rpi-security" },
    media: [],
    sections: [
      {
        heading: "Hardware",
        body: `An HC-SR501 PIR motion sensor and a night-vision camera, wired to the Pi
        with meter-long leads I made myself. Everything sits in a Lego case with a
        movable mount, and the wires are wrapped to keep them tidy.`,
      },
      {
        heading: "Software",
        body: `Asynchronous Python on Debian Bullseye (32-bit) watches the sensor
        through the GPIO pins and controls the camera. Footage is stored on the Pi,
        and I access it remotely from an SSH client on my iPhone.`,
      },
    ],
    highlights: [
      "Async Python reading GPIO sensors",
      "Night-vision camera",
      "Lego-built enclosure and mount",
    ],
    next: [
      "Switch to Raspberry Pi OS Lite (no desktop needed)",
      "Add a firewall",
      "Mount it outside",
      "Store footage on an external USB drive and delete old files on a schedule",
      "Maybe: upload footage to Google Drive",
    ],
  },
];

export const LINKS = {
  github: "https://github.com/eddie-thomas",
  linkedin: "https://www.linkedin.com/in/edward-kyle-thomas/",
  stackoverflow: "https://stackoverflow.com/users/14258470/lua-python-java",
  semanticArts: "https://www.semanticarts.com/",
  resume:
    "https://docs.google.com/document/d/1LDzMgp_i8amZWFCHoO_rnBQTyUY35tb2xmDQFOgtaZ8/edit",
};

export const PROFILE = {
  name: "Eddie Thomas",
  fullName: "Edward Kyle Thomas Jr",
  email: "edward.k.thomas.jr@gmail.com",
  company: "Semantic Arts",
  location: "Loveland, CO",
  education: "B.S. Applied Mathematics, University of Northern Colorado",
  headline: "I build data-centric platforms and modern web apps.",
  intro: `I'm a software engineer with 5+ years of experience in data-centric system
  design, full-stack development and workflow automation. I replace fragile legacy
  tools and spreadsheets with software that stays reliable and adapts as a business
  changes.`,
  about: [
    `I earned a B.S. in Applied Mathematics with a minor in Computer Science from the
    University of Northern Colorado in May 2021, where I also competed in NCAA
    Division I track and field. Along the way I built a Xamarin mobile app as an
    intern at BrightenTheBrain and validated phone-line and network-tower data as
    an implementation specialist at Intrado.`,
    `Outside of work I'm a parent in Loveland, Colorado, and I take on small freelance
    builds and personal projects, usually for the people around me: a booking page for
    my wife's guitar lessons, a waiver system that replaced a paid e-signature
    service, and a motion-triggered camera made from a Raspberry Pi and Legos.`,
  ],
  /** Skills from the résumé that aren't captured by any project's stack */
  extraSkills: [
    "Full-stack architecture",
    "Semantic modeling",
    "Data management systems",
    "JavaScript",
    "C#",
    "Lua",
    "R",
    ".NET",
    "Git/GitHub",
    "Visual Studio",
    "macOS",
    "Windows",
  ] as Array<string>,
};

/** How a position relates to the one listed after it (the older one); drawn on the edge between them */
export type PositionLink = "concurrentWith" | "promotedFrom";

export interface Position {
  /** Local name used as the node's IRI, e.g. :StaffSemanticEngineer */
  id: string;
  title: string;
  /** Team or initiative the role is scoped to */
  scope?: string;
  start: Date;
  /** Omit for a current position */
  end?: Date;
  summary?: string;
  /** Relation to the next position in the list */
  link?: PositionLink;
}

export interface Experience {
  company: string;
  /** Local name used as the company's IRI */
  id: string;
  url: string;
  employment: string;
  /** Newest first. Positions may overlap: a title can be held alongside another */
  positions: Array<Position>;
}

export const EXPERIENCE: Array<Experience> = [
  {
    company: "Semantic Arts",
    id: "SemanticArts",
    url: LINKS.semanticArts,
    employment: "Full-time",
    positions: [
      {
        id: "ProjectLead",
        title: "Project Lead",
        scope: "Spark",
        start: new Date("2026-01-01"),
        summary: `Lead Spark, Semantic Arts' internal operations platform, while
        continuing as a Staff Semantic Engineer.`,
        link: "concurrentWith",
      },
      {
        id: "StaffSemanticEngineer",
        title: "Staff Semantic Engineer",
        start: new Date("2023-10-19"),
        link: "promotedFrom",
      },
      {
        id: "EntrySemanticEngineer",
        title: "Entry Semantic Engineer",
        start: new Date("2021-08-01"),
        end: new Date("2023-10-19"),
      },
    ],
  },
];

/** Grouping used on the About page; anything not listed falls under "Other" */
export const SKILL_GROUPS: Array<{ name: string; skills: Array<string> }> = [
  {
    name: "Expertise",
    skills: ["Full-stack architecture", "Semantic modeling", "Data management systems"],
  },
  {
    name: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "C#", "Lua", "R", "Bash"],
  },
  { name: "Front end", skills: ["React", "React Router", "React Native", "MUI", "Vite"] },
  {
    name: "Back end & data",
    skills: ["Supabase", "Flask", "asyncio", "Firebase", "pdf-lib", ".NET"],
  },
  {
    name: "Cloud & tools",
    skills: [
      "Cloudflare",
      "Google Cloud",
      "Stripe",
      "Twilio",
      "GitHub Pages",
      "GitHub API",
      "Git/GitHub",
      "Visual Studio",
    ],
  },
  { name: "AI", skills: ["LLMs", "Claude API", "Ollama"] },
  { name: "Hardware & platforms", skills: ["Raspberry Pi", "Linux", "macOS", "Windows"] },
];

/**
 * Broader nodes in the graph: a technology → the category it belongs to.
 * The category becomes its own node, one hop out from each technology, so
 * filtering by it matches every project that uses one of them.
 */
export const TECH_BROADER: Record<string, string> = {
  "Claude API": "LLMs",
  Ollama: "LLMs",
};

/** Every technology used across all projects, in first-seen order, followed by their broader nodes */
export const ALL_TECH: Array<string> = (() => {
  const all: Array<string> = [];
  PROJECTS.forEach((project) =>
    project.stack.forEach((tech) => {
      if (!all.includes(tech)) all.push(tech);
    })
  );
  all.slice().forEach((tech) => {
    const broader = TECH_BROADER[tech];
    if (broader && !all.includes(broader)) all.push(broader);
  });
  return all;
})();

/** A project's stack followed by the broader nodes it reaches */
export const techsOf = (project: Project) =>
  project.stack.concat(
    ALL_TECH.filter((tech) => !project.stack.includes(tech) && projectUses(project, tech))
  );

/** Whether a project uses a technology, directly or through one in its stack that's narrower */
export const projectUses = (project: Project, tech: string) =>
  project.stack.some((name) => name === tech || TECH_BROADER[name] === tech);

export const getProject = (slug?: string) =>
  PROJECTS.find((project) => project.slug === slug);

/** Projects sharing at least one technology with the given project */
export const getConnectedProjects = (project: Project) =>
  PROJECTS.filter((other) => other.slug !== project.slug)
    .map((other) => ({
      project: other,
      shared: techsOf(project).filter((tech) => projectUses(other, tech)),
    }))
    .filter(({ shared }) => shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length);
