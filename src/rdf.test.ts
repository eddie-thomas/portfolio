/**
 * @copyright Copyright © 2018 - 2026 by Edward K Thomas Jr
 * @license MIT LICENSE https://opensource.org/license/mit/
 */

import { tokenize } from "./components/TurtleCode";
import { allFiles, experienceFile, toTurtle } from "./rdf";

const roles = (source: string) =>
  tokenize(source)
    .filter((t) => t.role)
    .map((t) => `${t.role}:${t.text}`);

test("every generated file tokenizes without unknown tokens", () => {
  allFiles().forEach((file) => {
    const source = toTurtle(file.triples);
    expect(tokenize(source).filter((t) => t.kind === "other")).toEqual([]);
    expect(tokenize(source).map((t) => t.text).join("")).toBe(source);
  });
});

test("experience.ttl compacts IRIs and chains roles", () => {
  const source = toTurtle(experienceFile().triples);
  expect(source).toContain(":StaffSemanticEngineer\n    a :Position ;");
  expect(source).toContain(':start "2021-08-01"^^xsd:date ;');
  expect(source).toContain(":promotedFrom :EntrySemanticEngineer .");
});

test("roles follow the grammar, not the vocabulary", () => {
  const source = `@prefix ex: <http://example.org/> .
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
ex:alice a foaf:Person ;
  foaf:name "Alice"@en , 'Al' ;
  foaf:knows [ foaf:name """Bob
the builder""" ] , _:c ;
  ex:list ( 1 2.5 true ) ;
  ex:born "1990-01-01"^^<http://www.w3.org/2001/XMLSchema#date> .
<http://example.org/bob> foaf:age 42 . # done`;
  expect(roles(source)).toEqual([
    "directive:ex:", "directive:<http://example.org/>",
    "directive:foaf:", "directive:<http://xmlns.com/foaf/0.1/>",
    "subject:ex:alice", "predicate:a", "object:foaf:Person",
    "predicate:foaf:name", 'object:"Alice"', "object:'Al'",
    "predicate:foaf:knows", "predicate:foaf:name", 'object:"""Bob\nthe builder"""', "object:_:c",
    "predicate:ex:list", "object:1", "object:2.5", "object:true",
    "predicate:ex:born", 'object:"1990-01-01"', "object:<http://www.w3.org/2001/XMLSchema#date>",
    "subject:<http://example.org/bob>", "predicate:foaf:age", "object:42",
  ]);
  const alice = tokenize(source).find((t) => t.text === "ex:alice");
  expect(alice?.iri).toBe("http://example.org/alice");
});
