import assert from "node:assert/strict";
import { profile } from "./src/content.js";

assert.equal(profile.projects.length, 4, "keep four featured work stories");
assert.equal(profile.research.length, 4, "keep four linked research projects");
assert(profile.research.every(({ href }) => href.startsWith("https://github.com/")), "link every research project to its source repository");
assert.equal(profile.experience.length, 7, "keep the complete experience chronology");
assert.deepEqual(
  profile.quickActions.map(({ command }) => command),
  ["work", "research", "profile", "contact"],
  "keep selected work as the primary landing action"
);
assert.equal(profile.hero.system, "AI Systems & Software Engineer");

console.log("profile content checks passed");
