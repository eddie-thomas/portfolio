/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { Fragment, useMemo, type ReactNode } from "react";
import { Box, Link, alpha, type SxProps, type Theme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { MONO } from "../theme";

/**
 * Syntax highlighting for any Turtle document.
 *
 * Colour comes only from the grammar: what kind of token it is, and whether
 * a term sits in subject, predicate or object position. Nothing is keyed to a
 * particular vocabulary, so any .ttl file reads the same way.
 */

type Kind =
  | "ws"
  | "comment"
  | "directive"
  | "string"
  | "iri"
  | "langtag"
  | "datatype"
  | "bnode"
  | "pname"
  | "keyword"
  | "number"
  | "punct"
  | "other";

/** Position of a term within its triple */
export type Role = "subject" | "predicate" | "object" | "directive";

interface Token {
  kind: Kind;
  text: string;
  role?: Role;
  /** Absolute IRI this term names, when it can be worked out */
  iri?: string;
}

/** Tried in order at each position; the first match wins */
const RULES: Array<[Kind, RegExp]> = [
  ["ws", /\s+/y],
  ["comment", /#[^\n]*/y],
  ["string", /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y],
  ["iri", /<[^<>"{}|^`\\\s]*>/y],
  ["directive", /@(?:prefix|base)\b|(?:PREFIX|BASE|prefix|base)(?![\w:-])/y],
  ["langtag", /@[a-zA-Z]+(?:-[a-zA-Z0-9]+)*/y],
  ["datatype", /\^\^/y],
  ["bnode", /_:[\w-]+(?:\.[\w-]+)*/y],
  ["pname", /(?:[A-Za-z][\w-]*(?:\.[\w-]+)*)?:(?:(?:[\w:%-]|\\.)+(?:\.(?:[\w:%-]|\\.)+)*)?/y],
  ["keyword", /(?:a|true|false)(?![\w:-])/y],
  ["number", /[+-]?(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)/y],
  ["punct", /[;,.[\]()]/y],
  ["other", /[\s\S]/y],
];

const TERMS = new Set<Kind>(["iri", "pname", "bnode", "keyword", "string", "number"]);

/** Split Turtle into tokens and tag each term with its role in the triple */
export function tokenize(source: string): Array<Token> {
  const tokens: Array<Token> = [];
  const prefixes: Record<string, string> = {};
  let base = "";

  // Directive arguments: how many terms remain, and what they are for
  let directive: "prefix" | "base" | undefined;
  let directiveArgs: Array<string> = [];

  let expect: Role = "subject";
  /** Role each open [ or ( occupies, to restore once it closes */
  const stack: Array<Role> = [];

  let at = 0;
  while (at < source.length) {
    let token: Token | undefined;
    for (const [kind, rule] of RULES) {
      rule.lastIndex = at;
      const match = rule.exec(source);
      if (match && match[0].length) {
        token = { kind, text: match[0] };
        break;
      }
    }
    if (!token) break;
    at += token.text.length;
    tokens.push(token);

    const { kind, text } = token;
    if (kind === "pname") {
      const colon = text.indexOf(":");
      const ns = prefixes[text.slice(0, colon)];
      if (ns !== undefined) token.iri = ns + text.slice(colon + 1).replace(/\\(.)/g, "$1");
    } else if (kind === "iri") {
      const value = text.slice(1, -1);
      token.iri = /^[a-z][\w+.-]*:/i.test(value) ? value : base + value;
    }

    if (kind === "directive") {
      directive = /base/i.test(text) ? "base" : "prefix";
      directiveArgs = [];
      continue;
    }

    if (directive && (kind === "pname" || kind === "iri")) {
      token.role = "directive";
      directiveArgs.push(kind === "pname" ? text.slice(0, -1) : token.iri!);
      if (directive === "base") {
        base = directiveArgs[0];
        directive = undefined;
      } else if (directiveArgs.length === 2) {
        prefixes[directiveArgs[0]] = directiveArgs[1];
        directive = undefined;
      }
      continue;
    }

    if (TERMS.has(kind)) {
      token.role = expect;
      if (expect === "subject") expect = "predicate";
      else if (expect === "predicate") expect = "object";
      continue;
    }

    if (kind !== "punct") continue;
    if (text === ";") expect = "predicate";
    else if (text === ",") expect = "object";
    else if (text === "[") {
      stack.push(expect);
      expect = "predicate";
    } else if (text === "(") {
      stack.push(expect);
      expect = "object";
    } else if (text === "]" || text === ")") {
      expect = stack.pop() === "subject" ? "predicate" : "object";
    } else if (text === ".") {
      stack.length = 0;
      expect = "subject";
    }
  }
  return tokens;
}

/** The colour key: one entry per thing the eye should tell apart */
export const LEGEND: Array<{ label: string; sx: SxProps<Theme>; sample: string }> = [
  { label: "subject", sample: ":subject", sx: { color: "primary.main", fontWeight: 700 } },
  { label: "predicate", sample: ":predicate", sx: { color: "text.secondary" } },
  { label: "resource", sample: "<iri>", sx: { color: "primary.main" } },
  { label: "literal", sample: '"text"', sx: { color: "success.main" } },
  { label: "keyword", sample: "a", sx: { color: "warning.main" } },
  { label: "comment", sample: "# note", sx: { color: "text.disabled", fontStyle: "italic" } },
];

const [SUBJECT, PREDICATE, RESOURCE, LITERAL, KEYWORD, COMMENT] = LEGEND.map((entry) => entry.sx);

function styleFor(token: Token): SxProps<Theme> | undefined {
  switch (token.kind) {
    case "comment":
      return COMMENT;
    case "directive":
    case "keyword":
    case "number":
      return KEYWORD;
    case "string":
      return LITERAL;
    case "langtag":
    case "datatype":
    case "punct":
      return { color: "text.secondary" };
    case "iri":
    case "pname":
    case "bnode":
      if (token.role === "subject") return SUBJECT;
      if (token.role === "predicate") return PREDICATE;
      return RESOURCE;
    default:
      return undefined;
  }
}

export interface TurtleCodeProps {
  source: string;
  /** Map an IRI to a route inside the app; anything else that's http(s) links out */
  resolve?: (iri: string) => string | undefined;
}

/** A highlighted, line-numbered Turtle document. Each line has an `L<n>` anchor. */
export default function TurtleCode({ source, resolve }: TurtleCodeProps) {
  const lines = useMemo(() => {
    const rows: Array<Array<ReactNode>> = [[]];
    tokenize(source).forEach((token, index) => {
      // Long strings and whitespace can span lines; split them across rows
      token.text.split("\n").forEach((part, partIndex) => {
        if (partIndex > 0) rows.push([]);
        if (part) rows[rows.length - 1].push(renderToken(token, part, `${index}-${partIndex}`, resolve));
      });
    });
    if (rows.length > 1 && rows[rows.length - 1].length === 0) rows.pop();
    return rows;
  }, [source, resolve]);

  const gutter = String(lines.length).length;

  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        py: 2,
        overflowX: "auto",
        fontFamily: MONO,
        fontSize: { xs: "0.75rem", sm: "0.82rem" },
        lineHeight: 1.75,
        "& a": { fontFamily: MONO, color: "inherit", textDecorationColor: "currentColor" },
      }}
    >
      <Box component="code" sx={{ display: "block", minWidth: "fit-content", fontFamily: "inherit" }}>
        {lines.map((parts, index) => {
          const n = index + 1;
          return (
            <Box
              key={n}
              id={`L${n}`}
              sx={(theme) => ({
                display: "flex",
                pr: 3,
                scrollMarginTop: 120,
                "&:target": { bgcolor: alpha(theme.palette.primary.main, 0.12) },
              })}
            >
              <Box
                component="a"
                href={`#L${n}`}
                aria-hidden="true"
                tabIndex={-1}
                sx={{
                  flexShrink: 0,
                  width: `${gutter + 4}ch`,
                  pr: 2,
                  textAlign: "right",
                  userSelect: "none",
                  color: "text.disabled",
                  textDecoration: "none",
                  "&:hover": { color: "text.secondary" },
                }}
              >
                {n}
              </Box>
              <Box component="span" sx={{ whiteSpace: "pre" }}>
                {parts.length ? parts : " "}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function renderToken(
  token: Token,
  text: string,
  key: string,
  resolve?: (iri: string) => string | undefined
) {
  const sx = styleFor(token);
  if (!sx) return <Fragment key={key}>{text}</Fragment>;

  const route = token.iri && resolve?.(token.iri);
  if (route) {
    return (
      <Link key={key} component={RouterLink} to={route} title={token.iri} sx={sx}>
        {text}
      </Link>
    );
  }
  // Spelled-out IRIs that point somewhere real link out; prefixed names stay text
  if (token.kind === "iri" && token.role !== "directive" && /^https?:\/\//.test(token.iri ?? "")) {
    return (
      <Link key={key} href={token.iri} target="_blank" rel="noopener noreferrer" sx={sx}>
        {text}
      </Link>
    );
  }
  return (
    <Box key={key} component="span" title={token.iri} sx={sx}>
      {text}
    </Box>
  );
}
