import assert from "node:assert/strict";
import { profile } from "./src/content.js";

assert.equal(profile.projects.length, 4, "keep four featured work stories");
assert.equal(profile.experience.length, 7, "keep the complete experience chronology");
assert.deepEqual(
  profile.quickActions.map(({ command }) => command),
  ["work", "profile", "contact"],
  "keep selected work as the primary landing action"
);
assert.equal(profile.hero.system, "AI Systems Consultant");

console.log("profile content checks passed");
