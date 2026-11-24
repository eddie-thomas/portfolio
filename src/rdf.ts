/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

/**
 * The site's content as RDF triples, serialized to Turtle.
 *
 * The `.ttl` panels around the site are labels for these graphs; the
 * `/<name>.ttl` routes render the full documents built here.
 */

import {
  EXPERIENCE,
  LINKS,
  PROFILE,
  PROJECTS,
  STATUS_LABEL,
  getProject,
  type Project,
} from "./content";
import { formatDate } from "./utils";

/** Namespace for everything described on this site */
export const BASE = "https://eddie-thomas.github.io/portfolio/";
export const NS = `${BASE}id/`;

const PREFIXES: Record<string, string> = {
  "": NS,
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const RDF_TYPE = `${PREFIXES.rdf}type`;
const XSD_DATE = `${PREFIXES.xsd}date`;
const LABEL = `${PREFIXES.rdfs}label`;

export type Term =
  | { kind: "iri"; value: string }
  | { kind: "literal"; value: string; datatype?: string };

/** [subject, predicate, object] */
export type Triple = [string, string, Term];

/** Local name → IRI in the site namespace (spaces become hyphens, as in the panels) */
const iri = (local: string) => NS + local.replace(/\s+/g, "-");
const node = (value: string): Term => ({ kind: "iri", value });
const local = (name: string) => node(iri(name));
/** Collapses the indentation that template strings in content.ts carry */
const text = (value: string): Term => ({ kind: "literal", value: value.replace(/\s+/g, " ").trim() });
const date = (value: Date): Term => ({ kind: "literal", value: formatDate(value), datatype: XSD_DATE });

/** Collects triples, skipping objects that are undefined */
class Graph {
  triples: Array<Triple> = [];

  add(subject: string, predicate: string, ...objects: Array<Term | undefined>) {
    objects.forEach((object) => object && this.triples.push([subject, predicate, object]));
    return this;
  }
}

// --- Graphs -----------------------------------------------------------------

function meGraph() {
  const g = new Graph();
  const me = iri("eddie");
  const current = EXPERIENCE.flatMap((e) => e.positions).filter((p) => !p.end);

  g.add(me, RDF_TYPE, local("SoftwareEngineer"))
    .add(me, iri("name"), text(PROFILE.fullName))
    .add(me, iri("worksAt"), local(EXPERIENCE[0]?.id ?? "SemanticArts"))
    .add(me, iri("holds"), ...current.map((p) => local(p.id)))
    .add(me, iri("basedIn"), text(PROFILE.location))
    .add(me, iri("studied"), text(PROFILE.education))
    .add(me, iri("built"), ...PROJECTS.map((p) => local(p.slug)))
    .add(me, iri("github"), node(LINKS.github))
    .add(me, iri("linkedin"), node(LINKS.linkedin))
    .add(me, iri("stackoverflow"), node(LINKS.stackoverflow));
  return g.triples;
}

function experienceGraph() {
  const g = new Graph();
  const me = iri("eddie");

  EXPERIENCE.forEach((experience) => {
    const org = iri(experience.id);
    g.add(org, RDF_TYPE, local("Organization"))
      .add(org, LABEL, text(experience.company))
      .add(org, iri("homepage"), node(experience.url))
      .add(org, iri("hasPosition"), ...experience.positions.map((p) => local(p.id)));

    experience.positions.forEach((position, index) => {
      const subject = iri(position.id);
      const next = experience.positions[index + 1];
      g.add(subject, RDF_TYPE, local("Position"))
        .add(subject, iri("title"), text(position.title))
        .add(subject, iri("scope"), position.scope ? text(position.scope) : undefined)
        .add(subject, iri("heldBy"), node(me))
        .add(subject, iri("employment"), text(experience.employment))
        .add(subject, iri("start"), date(position.start))
        .add(subject, iri("end"), position.end ? date(position.end) : undefined)
        .add(subject, iri("summary"), position.summary ? text(position.summary) : undefined)
        .add(subject, iri(position.link ?? "precededBy"), next ? local(next.id) : undefined);
    });
  });
  return g.triples;
}

function projectGraph(project: Project) {
  const g = new Graph();
  const subject = iri(project.slug);

  g.add(subject, RDF_TYPE, local("Project"))
    .add(subject, LABEL, text(project.name))
    .add(subject, iri("tagline"), text(project.tagline))
    .add(subject, iri("status"), local(STATUS_LABEL[project.status]))
    .add(subject, iri("role"), text(project.role))
    .add(subject, iri("builtFor"), project.builtFor ? text(project.builtFor) : undefined)
    .add(subject, iri("uses"), ...project.stack.map(local))
    .add(subject, iri("updated"), date(project.updated))
    .add(subject, iri("live"), project.links.live ? node(project.links.live) : undefined)
    .add(subject, iri("repo"), project.links.repo ? node(project.links.repo) : undefined)
    .add(subject, iri("previousVersion"), project.links.archive ? node(project.links.archive) : undefined)
    .add(subject, iri("repoNote"), project.repoNote ? text(project.repoNote) : undefined);
  return g.triples;
}

// --- Files ------------------------------------------------------------------

export interface TurtleFile {
  /** File name shown in the header, e.g. "experience.ttl" */
  name: string;
  /** Route to this file, relative to the router basename */
  path: string;
  triples: Array<Triple>;
}

export const meFile = (): TurtleFile => ({ name: "me.ttl", path: "/me.ttl", triples: meGraph() });

export const experienceFile = (): TurtleFile => ({
  name: "experience.ttl",
  path: "/experience.ttl",
  triples: experienceGraph(),
});

export const factsFile = (slug?: string): TurtleFile | undefined => {
  const project = getProject(slug);
  return (
    project && {
      name: "facts.ttl",
      path: `/projects/${project.slug}/facts.ttl`,
      triples: projectGraph(project),
    }
  );
};

/** Every file the site serves, for the file switcher */
export const allFiles = (): Array<TurtleFile> => [
  meFile(),
  experienceFile(),
  ...PROJECTS.map((p) => factsFile(p.slug)!),
];

// --- Serializer -------------------------------------------------------------

/** A local name that is safe to write as `prefix:local` without escapes */
const SAFE_LOCAL = /^[A-Za-z_][A-Za-z0-9_-]*$/;

function writeIri(value: string) {
  if (value === RDF_TYPE) return "a";
  for (const [prefix, ns] of Object.entries(PREFIXES)) {
    if (value.startsWith(ns) && SAFE_LOCAL.test(value.slice(ns.length))) {
      return `${prefix}:${value.slice(ns.length)}`;
    }
  }
  return `<${value}>`;
}

const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

function writeTerm(term: Term) {
  if (term.kind === "iri") return writeIri(term.value);
  return `"${escape(term.value)}"${term.datatype ? `^^${writeIri(term.datatype)}` : ""}`;
}

/**
 * Serialize triples to Turtle: subjects in first-seen order, predicates
 * joined with `;` and repeated objects with `,`.
 */
export function toTurtle(triples: Array<Triple>, title?: string) {
  const subjects = new Map<string, Map<string, Array<Term>>>();
  triples.forEach(([s, p, o]) => {
    if (!subjects.has(s)) subjects.set(s, new Map());
    const predicates = subjects.get(s)!;
    if (!predicates.has(p)) predicates.set(p, []);
    predicates.get(p)!.push(o);
  });

  const lines: Array<string> = [];
  if (title) lines.push(`# ${title}`, "");
  Object.entries(PREFIXES).forEach(([prefix, ns]) => lines.push(`@prefix ${prefix}: <${ns}> .`));

  subjects.forEach((predicates, subject) => {
    lines.push("", writeIri(subject));
    const entries = Array.from(predicates.entries());
    entries.forEach(([predicate, objects], index) => {
      const end = index === entries.length - 1 ? " ." : " ;";
      const pred = writeIri(predicate);
      const rendered = objects.map(writeTerm);
      // One object per line when there are several, so long lists stay readable
      const joined =
        rendered.length > 2
          ? rendered.join(`,\n${" ".repeat(4 + pred.length + 1)}`)
          : rendered.join(", ");
      lines.push(`    ${pred} ${joined}${end}`);
    });
  });

  return lines.join("\n") + "\n";
}

/**
 * Where an IRI in the site namespace lives on the site, if anywhere.
 * Lets the viewer turn `:fives` into a link to the Fives project page.
 */
export function routeFor(value: string): string | undefined {
  if (!value.startsWith(NS)) return undefined;
  const name = value.slice(NS.length);
  if (name === "eddie") return "/about";
  if (PROJECTS.some((p) => p.slug === name)) return `/projects/${name}`;
  for (const experience of EXPERIENCE) {
    if (experience.id === name) return "/experience.ttl";
    const position = experience.positions.find((p) => p.id === name);
    if (position) return `/about#position-${position.id}`;
  }
  const tech = PROJECTS.flatMap((p) => p.stack).find((t) => t.replace(/\s+/g, "-") === name);
  if (tech) return `/?tech=${encodeURIComponent(tech)}#projects`;
  return undefined;
}
