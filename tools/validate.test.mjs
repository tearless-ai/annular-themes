// `node --test "tools/*.test.mjs"`
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { problems } from "./validate.mjs";

const builtIn = () => JSON.parse(readFileSync(new URL("../themes/built-in/annular.annulartheme", import.meta.url), "utf8"));
const community = (changes = {}) => ({ ...builtIn(), id: "com.example.night-shift", name: "Night Shift", author: "Someone", ...changes });

test("a built-in theme and a community theme made from it pass", () => {
  assert.deepEqual(problems(builtIn(), { community: false }), []);
  assert.deepEqual(problems(community(), { community: true }), []);
});

test("the shortest theme passes: every section is optional", () => {
  assert.deepEqual(problems({ schemaVersion: 4, id: "com.example.tiny", name: "Tiny", author: "Someone" }, { community: true }), []);
});

test("a typo is an error, at the top and inside a section", () => {
  assert.match(problems(community({ pallete: {} }), { community: true })[0], /pallete is not a key/);
  assert.match(problems(community({ ring: { glo: true } }), { community: true })[0], /ring\.glo is not a key/);
  assert.match(problems(community({ typography: { display: { wieght: 700 } } }), { community: true })[0], /typography\.display\.wieght/);
});

test("a wrong word names the words that are allowed", () => {
  const [problem] = problems(community({ layout: "diagonal" }), { community: true });
  assert.match(problem, /layout is "diagonal", expected one of: vertical, horizontal, composite/);
});

test("colors, ranges, and kinds are checked", () => {
  assert.equal(problems(community({ palette: { normal: "teal" } }), { community: true }).length, 1);
  assert.equal(problems(community({ palette: { normal: "#4fc3b8" } }), { community: true }).length, 0);
  assert.equal(problems(community({ ring: { numberScale: 3 } }), { community: true }).length, 1);
  assert.equal(problems(community({ ring: { glow: "yes" } }), { community: true }).length, 1);
  assert.equal(problems(community({ typography: { label: { weight: 950 } } }), { community: true }).length, 1);
});

test("a community theme may not take a built-in id, and says who made it", () => {
  assert.match(problems(community({ id: "app.annular.mine" }), { community: true })[0], /belong to the built-in themes/);
  assert.match(problems(community({ author: " " }), { community: true })[0], /author is empty/);
  assert.match(problems(community({ id: undefined }), { community: true }).join("\n"), /id is missing|id is undefined/);
});

test("a file that is not one object is refused", () => {
  assert.deepEqual(problems([], { community: true }), ["the file must hold one JSON object"]);
  assert.deepEqual(problems(null, { community: true }), ["the file must hold one JSON object"]);
});
