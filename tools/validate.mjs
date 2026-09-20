// Checks every theme in this repo against the format in FORMAT.md. No packages: `node tools/validate.mjs`.
//
// Annular itself is forgiving: a key it does not know is ignored and takes its default, so a typo never
// breaks the app, it just quietly does nothing. Here a typo is an error, so a shared theme does what it says.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_VERSION = 4;

const color = (v) => typeof v === "string" && /^#?(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v.trim());
const number = (min = -Infinity, max = Infinity) => (v) => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const integer = (min, max) => (v) => Number.isInteger(v) && v >= min && v <= max;
const bool = (v) => typeof v === "boolean";
const text = (max) => (v) => typeof v === "string" && v.length <= max;
const oneOf = (...words) => Object.assign((v) => words.includes(v), { words });
const material = oneOf("solid", "translucent", "none");

const font = {
  family: text(80), fallbacks: (v) => Array.isArray(v) && v.length <= 8 && v.every(text(80)),
  weight: integer(100, 900), tracking: number(-0.5, 1), italic: bool,
};

// Section -> key -> check. The ranges are the ones the app clamps to (Theme.swift), so a value in range is a value kept.
const FORMAT = {
  palette: { background: color, border: color, track: color, normal: color, warning: color, critical: color, label: color, muted: color, accent: color },
  typography: { display: font, label: font, caption: font },
  panel: {
    material, cornerRadius: number(0, 200), borderWidth: number(0, 20), shadow: bool, padding: number(0, 100),
    accent: oneOf("none", "edgeStripe", "statusBar"), accentWidth: number(0, 40),
  },
  ring: {
    diameterRatio: number(0.2, 2), strokeRatio: number(0.005, 0.5), trackStrokeRatio: number(0.005, 0.5),
    cap: oneOf("round", "butt"), segments: integer(0, 360), segmentGapRatio: number(0, 0.9), glow: bool, tick: bool,
    numberPlacement: oneOf("inside", "below", "none"), numberColor: oneOf("label", "state"), percentSign: bool,
    numberScale: number(0.1, 0.6),
  },
  labels: { style: oneOf("short", "word"), placement: oneOf("below", "inside", "none"), uppercase: bool, suffix: text(4), scale: number(0.08, 0.4) },
  states: { staleOpacity: number(0.1, 1), placeholder: text(8) },
  expanded: {
    width: number(240, 900), barHeight: number(1, 32), barCornerRadius: number(0, 32), rowSpacing: number(0, 80),
    uppercase: bool, headerGlyph: text(4), showHeader: bool, showForecast: bool, showFooter: bool, dividers: bool,
    sparkline: oneOf("line", "area", "none"), percentScale: number(0.2, 1), labelScale: number(0.1, 0.4),
    captionScale: number(0.1, 0.4), material, background: color,
  },
  menuBar: { style: oneOf("percent", "ring", "both"), percentSign: bool },
  keepAwake: { visible: bool, shape: oneOf("square", "rounded", "circle"), size: number(6, 24) },
};
const TOP = {
  schemaVersion: integer(1, SCHEMA_VERSION), id: (v) => typeof v === "string" && /^[a-z0-9][a-z0-9.-]{2,80}$/.test(v),
  name: (v) => text(40)(v) && v.trim().length > 0, author: text(60), layout: oneOf("vertical", "horizontal", "composite"),
};

function checkSection(rules, value, path, errors) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return errors.push(`${path} must be an object`);
  for (const [key, inner] of Object.entries(value)) {
    const rule = rules[key];
    if (rule === undefined) errors.push(`${path}.${key} is not a key of the format (a typo?)`);
    else if (typeof rule === "object") checkSection(rule, inner, `${path}.${key}`, errors);
    else if (!rule(inner)) errors.push(`${path}.${key} is ${JSON.stringify(inner)}${rule.words ? `, expected one of: ${rule.words.join(", ")}` : ", which is out of range or the wrong kind"}`);
  }
}

export function problems(theme, { community }) {
  const errors = [];
  if (theme === null || typeof theme !== "object" || Array.isArray(theme)) return ["the file must hold one JSON object"];
  for (const key of ["schemaVersion", "id", "name", "author"]) if (!(key in theme)) errors.push(`${key} is missing`);
  for (const [key, value] of Object.entries(theme)) {
    if (key in TOP) {
      if (!TOP[key](value)) errors.push(`${key} is ${JSON.stringify(value)}${TOP[key].words ? `, expected one of: ${TOP[key].words.join(", ")}` : ", which is not allowed"}`);
    } else if (key in FORMAT) checkSection(FORMAT[key], value, key, errors);
    else errors.push(`${key} is not a key of the format (a typo?)`);
  }
  const ownId = typeof theme.id === "string" && theme.id.startsWith("app.annular.");
  if (community && ownId) errors.push("ids that start with app.annular. belong to the built-in themes");
  if (!community && !ownId) errors.push("a built-in theme's id starts with app.annular.");
  if (community && typeof theme.author === "string" && theme.author.trim() === "") errors.push("author is empty: say who made it");
  return errors;
}

function run() {
  let failed = 0, count = 0;
  const ids = new Map();
  for (const [folder, community] of [["themes/built-in", false], ["themes/community", true]]) {
    for (const file of readdirSync(join(root, folder)).sort()) {
      if (!file.endsWith(".annulartheme")) continue;
      count += 1;
      const where = `${folder}/${file}`;
      const errors = [];
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.annulartheme$/.test(file)) errors.push("the file name must be lower case words joined by hyphens");
      let theme = null;
      try {
        theme = JSON.parse(readFileSync(join(root, where), "utf8"));
        errors.push(...problems(theme, { community }));
      } catch (error) {
        errors.push(`not valid JSON: ${error.message}`);
      }
      if (theme && typeof theme.id === "string") {
        if (ids.has(theme.id)) errors.push(`the id is already used by ${ids.get(theme.id)}`);
        ids.set(theme.id, where);
      }
      const picture = join(community ? "img/community" : "img", file.replace(/\.annulartheme$/, ".png"));
      if (!existsSync(join(root, picture))) errors.push(`its picture is missing: ${picture}`);
      if (errors.length > 0) failed += 1;
      console.log(`${errors.length === 0 ? "ok  " : "FAIL"} ${where}`);
      for (const error of errors) console.log(`       ${error}`);
    }
  }
  console.log(`${count} themes checked, ${failed} with problems.`);
  process.exit(failed === 0 && count > 0 ? 0 : 1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
