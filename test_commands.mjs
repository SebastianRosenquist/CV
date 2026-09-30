import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { profile } from "./src/content.js";

const source = readFileSync(new URL("./src/script.js", import.meta.url), "utf8");
const resolve = source.slice(source.indexOf("function resolveCommand"), source.indexOf("const commands = {"));
const commandSource = source
  .slice(source.indexOf("const commands = {"), source.indexOf("function executeCommand"))
  .replace("const commands =", "commands =");
const context = {
  profile,
  appState: { theme: "dark", muted: false },
  clearCount: 0,
  clearTerminal: () => { context.clearCount += 1; },
  setTheme: (theme) => { context.appState.theme = theme; },
  setMuted: (muted) => { context.appState.muted = muted; },
  formatUtcTime: () => "00:00:00",
};

vm.runInNewContext(`var commands; ${resolve}${commandSource}`, context);

for (const [name, command] of Object.entries(context.commands)) {
  assert.equal(context.resolveCommand(name).name, name, `${name} resolves directly`);
  for (const alias of command.aliases) {
    assert.equal(context.resolveCommand(alias).name, name, `${alias} resolves to ${name}`);
  }
  command.run();
}

const helpLabels = context.commands.help.run()[1].items.map(({ label }) => label);
assert.deepEqual([...helpLabels].sort(), Object.keys(context.commands).sort(), "help lists every command");
assert.equal(context.resolveCommand("unknown").command, null, "unknown commands are rejected");
assert.equal(context.clearCount, 1, "clear uses the shared terminal reset");

console.log("command checks passed");
