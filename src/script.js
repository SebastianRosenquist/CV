import { profile } from "./content.js";

const bootScreen = document.getElementById("bootScreen");
const bootLog = document.getElementById("bootLog");
const terminalShell = document.getElementById("terminalShell");
const themeToggle = document.getElementById("themeToggle");
const muteToggle = document.getElementById("muteToggle");
const utcReadout = document.getElementById("utcReadout");
const commandForm = document.getElementById("commandForm");
const commandInput = document.getElementById("commandInput");
const commandGhost = document.getElementById("commandGhost");
const terminalPinned = document.getElementById("terminalPinned");
const terminalLog = document.getElementById("terminalLog");
const commandSuggestion = document.getElementById("commandSuggestion");

const promptLabel = "sebastian@portfolio ~ $";
const commandHistory = [];
const suggestions = ["work", "profile", "experience", "contact", "help", "theme"];
const bootLines = [
  "[01] SAR-OS v4.7 (phosphor build)",
  "[02] booting /dev/interface...",
  "[03] mounting portfolio -> [ok]",
  "[04] loading motion profile -> [ok]",
  "[05] resolving /self/manifest -> [ok]",
  "[06] shell ready.",
];

let audioContext;
let historyIndex = -1;
let suggestionIndex = 0;
let skipBootRequested = false;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const appState = {
  phase: "booting",
  theme: localStorage.getItem("terminal-theme") || "dark",
  muted: (localStorage.getItem("terminal-muted") ?? "true") === "true",
};

function sleep(ms) {
  if (skipBootRequested) {
    return Promise.resolve();
  }

  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function renderSuggestion(text, prefix = "try:") {
  commandSuggestion.textContent = "";
  commandSuggestion.append(document.createTextNode(`${prefix} `));
  const value = document.createElement("span");
  value.id = "suggestionText";
  value.textContent = text;
  commandSuggestion.appendChild(value);
}

function getAutocompleteMatch(value) {
  const current = value.trim().toLowerCase();
  const commandNames = Object.keys(commands);

  if (!current) {
    return "";
  }

  return commandNames.find((name) => name.startsWith(current)) || "";
}

function updateCommandGhost() {
  const value = commandInput.value;
  const match = getAutocompleteMatch(value);

  if (!match) {
    commandGhost.textContent = "";
    return;
  }

  const typed = document.createElement("span");
  typed.className = "command-ghost__typed";
  typed.textContent = value;

  const hint = document.createElement("span");
  hint.className = "command-ghost__hint";
  hint.textContent = value ? match.slice(value.length) : match;

  commandGhost.textContent = "";
  commandGhost.append(typed, hint);
}

function formatUtcTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour12: false,
  });
}

function updateUtcReadout() {
  utcReadout.textContent = `UTC ${formatUtcTime()}`;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  appState.theme = theme;
  localStorage.setItem("terminal-theme", theme);
  const lightMode = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(lightMode));
  themeToggle.querySelector(".toolbar-button__text").textContent = lightMode ? "dark" : "light";
}

function setMuted(muted) {
  appState.muted = muted;
  localStorage.setItem("terminal-muted", String(muted));
  muteToggle.setAttribute("aria-pressed", String(!muted));
  muteToggle.querySelector(".toolbar-button__text").textContent = muted ? "unmute" : "mute";
}

function ensureAudioContext() {
  if (!window.AudioContext) {
    return null;
  }

  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playTone(type = "type") {
  if (appState.muted) {
    return;
  }

  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const now = context.currentTime;

  oscillator.type = "square";
  oscillator.frequency.value = type === "confirm" ? 320 : 180;
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(type === "confirm" ? 0.018 : 0.01, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function createParagraph(text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (className) {
    paragraph.className = className;
  }
  return paragraph;
}

function renderActionRow(actions) {
  const wrapper = document.createElement("div");
  wrapper.className = "output-block";

  const title = document.createElement("div");
  title.className = "action-block__title";
  title.textContent = "quick access";
  wrapper.appendChild(title);

  const row = document.createElement("div");
  row.className = "action-row";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "terminal-action";
    button.textContent = action.label;
    button.dataset.command = action.command;
    row.appendChild(button);
  });

  wrapper.appendChild(row);
  return wrapper;
}

function renderBlocksInto(container, blocks) {
  blocks.forEach((block) => {
    container.appendChild(renderBlock(block));
  });
}

function createLinkItem(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "output-link-item";

  const label = document.createElement("strong");
  label.textContent = `${item.label}:`;
  wrapper.appendChild(label);

  if (item.href) {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.value;
    if (item.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    wrapper.appendChild(link);
  } else {
    wrapper.appendChild(document.createTextNode(item.value));
  }

  return wrapper;
}

function renderBlock(block) {
  if (block.kind === "actions") {
    return renderActionRow(block.items);
  }

  const wrapper = document.createElement("div");
  wrapper.className = `output-block${block.sectionClass ? ` ${block.sectionClass}` : ""}`;

  if (block.title) {
    const title = document.createElement("div");
    title.className = "output-title";
    title.textContent = block.title;
    wrapper.appendChild(title);
  }

  if (block.kind === "text") {
    const lines = document.createElement("div");
    lines.className = "output-lines";
    block.lines.forEach((line) => {
      lines.appendChild(createParagraph(line, block.className || ""));
    });
    wrapper.appendChild(lines);
  }

  if (block.kind === "list") {
    const list = document.createElement("div");
    list.className = "output-list";
    block.items.forEach((item) => {
      list.appendChild(createParagraph(item));
    });
    wrapper.appendChild(list);
  }

  if (block.kind === "grid") {
    const grid = document.createElement("div");
    grid.className = `output-grid${block.className ? ` ${block.className}` : ""}`;
    block.items.forEach((item) => {
      const article = document.createElement("article");
      const label = document.createElement("span");
      label.className = "output-label";
      label.textContent = item.label;
      article.appendChild(label);
      article.appendChild(createParagraph(item.value));
      grid.appendChild(article);
    });
    wrapper.appendChild(grid);
  }

  if (block.kind === "links") {
    const links = document.createElement("div");
    links.className = "output-links";
    block.items.forEach((item) => {
      links.appendChild(createLinkItem(item));
    });
    wrapper.appendChild(links);
  }

  if (block.kind === "cards") {
    const cardGrid = document.createElement("div");
    cardGrid.className = "card-grid";

    block.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "terminal-card terminal-card--project";

      const top = document.createElement("div");
      top.className = "terminal-card__top";

      const eyebrow = document.createElement("div");
      eyebrow.className = "terminal-card__eyebrow";
      eyebrow.textContent = item.eyebrow;
      top.appendChild(eyebrow);

      const meta = document.createElement("div");
      meta.className = "terminal-card__meta";
      meta.textContent = item.meta;
      top.appendChild(meta);

      card.appendChild(top);

      const heading = document.createElement("h3");
      heading.textContent = item.title;
      card.appendChild(heading);

      item.lines.forEach((line) => {
        card.appendChild(createParagraph(line));
      });

      if (item.tags?.length) {
        const tags = document.createElement("div");
        tags.className = "terminal-card__tags";

        item.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "terminal-card__tag";
          chip.textContent = tag;
          tags.appendChild(chip);
        });

        card.appendChild(tags);
      }

      if (item.href) {
        const link = document.createElement("a");
        link.className = "terminal-card__link";
        link.href = item.href;
        link.textContent = "View repository ->";
        link.target = "_blank";
        link.rel = "noreferrer";
        card.appendChild(link);
      }

      cardGrid.appendChild(card);
    });

    wrapper.appendChild(cardGrid);
  }

  if (block.kind === "command-list") {
    const commandList = document.createElement("div");
    commandList.className = "command-list";

    block.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "command-list__row";

      const name = document.createElement("div");
      name.className = "command-list__name";
      name.textContent = item.label;

      const description = document.createElement("div");
      description.className = "command-list__description";
      description.textContent = item.value;

      row.append(name, description);
      commandList.appendChild(row);
    });

    wrapper.appendChild(commandList);
  }

  if (block.kind === "list-table") {
    const listTable = document.createElement("div");
    listTable.className = "list-table";

    block.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "list-table__row";

      const label = document.createElement("div");
      label.className = "list-table__label";
      label.textContent = item.label;

      const value = document.createElement("div");
      value.className = "list-table__value";
      value.textContent = item.value;

      row.append(label, value);
      listTable.appendChild(row);
    });

    wrapper.appendChild(listTable);
  }

  if (block.kind === "profile") {
    const profileCard = document.createElement("article");
    profileCard.className = "profile-card";

    const header = document.createElement("div");
    header.className = "profile-card__header";
    header.textContent = block.heading;
    profileCard.appendChild(header);

    const data = document.createElement("div");
    data.className = "profile-card__data";

    const avatar = document.createElement("img");
    avatar.className = "profile-card__avatar";
    avatar.src = block.avatarSrc;
    avatar.alt = block.avatarAlt;

    const details = document.createElement("div");
    details.className = "profile-card__details";

    const role = document.createElement("div");
    role.className = "profile-card__role";
    role.textContent = block.role;

    const tagline = createParagraph(block.tagline, "profile-card__tagline");

    const facts = document.createElement("div");
    facts.className = "profile-card__facts";
    block.facts.forEach((item) => {
      const row = document.createElement("div");
      row.className = "profile-card__fact-row";
      row.append(createParagraph(item.label, "profile-card__fact-label"), createParagraph(item.value, "profile-card__fact-value"));
      facts.appendChild(row);
    });

    details.append(role, tagline, facts);
    data.append(avatar, details);
    profileCard.appendChild(data);

    const body = document.createElement("div");
    body.className = "profile-card__body";
    block.paragraphs.forEach((paragraph) => body.appendChild(createParagraph(paragraph)));
    profileCard.appendChild(body);
    wrapper.appendChild(profileCard);
  }

  return wrapper;
}

function appendLogEntry(commandText, blocks = [], type = "command") {
  const entry = document.createElement("div");
  entry.className = "log-entry";

  if (commandText) {
    const commandLine = document.createElement("div");
    commandLine.className = `log-entry--${type}`;

    const prompt = document.createElement("span");
    prompt.className = "log-prompt";
    prompt.textContent = type === "command" ? `${promptLabel} ` : "";

    if (type === "command") {
      commandLine.append(prompt, document.createTextNode(commandText));
    } else {
      commandLine.textContent = commandText;
    }

    entry.appendChild(commandLine);
  }

  blocks.forEach((block) => {
    entry.appendChild(renderBlock(block));
  });

  terminalLog.appendChild(entry);

  if (blocks.length) {
    entry.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }
}

function clearTerminal() {
  terminalLog.textContent = "";
}

function renderPinnedOverview() {
  terminalPinned.textContent = "";

  const hero = document.createElement("section");
  hero.className = "terminal-hero";

  const prefix = document.createElement("div");
  prefix.className = "terminal-hero__prefix";
  prefix.textContent = profile.hero.prefix;
  hero.appendChild(prefix);

  const headline = document.createElement("div");
  headline.className = "terminal-hero__headline";
  headline.textContent = profile.hero.headline;
  hero.appendChild(headline);

  if (profile.hero.system) {
    const system = document.createElement("div");
    system.className = "terminal-hero__system";
    system.textContent = profile.hero.system;
    hero.appendChild(system);
  }

  if (profile.hero.subline) {
    const subline = document.createElement("div");
    subline.className = "terminal-hero__subline";
    subline.textContent = profile.hero.subline;
    hero.appendChild(subline);
  }

  const summary = document.createElement("div");
  summary.className = "terminal-hero__summary";
  profile.hero.summary.forEach((line) => {
    summary.appendChild(createParagraph(line));
  });
  hero.appendChild(summary);

  terminalPinned.appendChild(hero);

  renderBlocksInto(terminalPinned, [
    { kind: "list-table", title: "at a glance", items: profile.hero.rows },
    { kind: "actions", items: profile.quickActions },
  ]);
}

function resolveCommand(input) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return { name: "", command: null };
  }

  if (commands[normalized]) {
    return { name: normalized, command: commands[normalized] };
  }

  const aliasMatch = Object.entries(commands).find(([, config]) =>
    config.aliases.includes(normalized)
  );

  if (aliasMatch) {
    return { name: aliasMatch[0], command: aliasMatch[1] };
  }

  return { name: normalized, command: null };
}

const commands = {
  help: {
    aliases: ["?", "menu"],
    description: "List available commands and shortcuts.",
    run() {
      return [
        {
          kind: "text",
          lines: ["commands are the interface. tab completes. up/down cycles history."],
          className: "system-message",
        },
        {
          kind: "command-list",
          items: [
            { label: "work", value: "four selected work stories (G)" },
            { label: "profile", value: "background, focus, and capabilities" },
            { label: "experience", value: "complete career chronology" },
            { label: "research", value: "research and hobby projects with source links" },
            { label: "status", value: "current role, location, and availability" },
            { label: "industries", value: "operating domains and focus areas" },
            { label: "contact", value: "direct contact and public profiles" },
            { label: "blog", value: "writing archive status" },
            { label: "theme", value: "toggle phosphor light / dark (L)" },
            { label: "mute", value: "toggle audio on / off (M)" },
            { label: "time", value: "show current UTC clock" },
            { label: "clear", value: "clears session output, keeps overview (ctrl/cmd+k)" },
            { label: "help", value: "this screen" },
          ],
        },
      ];
    },
  },
  profile: {
    aliases: ["about", "bio", "fullbio", "intro"],
    description: "Show background, focus, and capabilities.",
    run() {
      return [
        { kind: "profile", ...profile.profile },
        { kind: "grid", title: "practice / stack", items: profile.stack, className: "stack-grid", sectionClass: "stack-section" },
        { kind: "list", title: "capabilities", items: profile.work },
        { kind: "grid", title: "areas of work", items: profile.industries },
      ];
    },
  },
  status: {
    aliases: [],
    description: "Show current role, location, and availability.",
    run() {
      return [{ kind: "list", title: "status", items: profile.status }];
    },
  },
  industries: {
    aliases: ["focus", "sectors"],
    description: "Show the operating domains I work in.",
    run() {
      return [{ kind: "grid", title: "industries", items: profile.industries }];
    },
  },
  work: {
    aliases: ["projects", "shots", "worksamples"],
    description: "Show selected work cards and project snapshots.",
    run() {
      return [{ kind: "cards", title: "work", items: profile.projects }];
    },
  },
  research: {
    aliases: ["academic", "experiments", "github"],
    description: "Show research, school, and hobby projects with source repositories.",
    run() {
      return [{ kind: "cards", title: "research", items: profile.research }];
    },
  },
  experience: {
    aliases: ["career", "history"],
    description: "Show the complete career chronology.",
    run() {
      return [{ kind: "list-table", title: "experience", items: profile.experience }];
    },
  },
  contact: {
    aliases: ["email", "reach"],
    description: "Show direct contact details and public profiles.",
    run() {
      return [{ kind: "links", title: "contact", items: profile.contact }];
    },
  },
  blog: {
    aliases: ["articles", "writing"],
    description: "Show the current writing archive status.",
    run() {
      return [
        {
          kind: "text",
          title: "blog",
          lines: [
            "Writing archive not published in this repo yet.",
            "Ask directly for articles, notes, or long-form thinking samples and I can route them from source material.",
          ],
          className: "system-message",
        },
      ];
    },
  },
  clear: {
    aliases: ["cls"],
    description: "Clear session output while keeping the overview visible.",
    run() {
      clearTerminal();
      return null;
    },
  },
  theme: {
    aliases: ["mode"],
    description: "Toggle between dark and light terminal themes.",
    run() {
      const nextTheme = appState.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      return [
        {
          kind: "text",
          title: "theme",
          lines: [`theme set to ${nextTheme}`],
          className: "success-message",
        },
      ];
    },
  },
  mute: {
    aliases: ["sound"],
    description: "Toggle terminal keypress sounds.",
    run() {
      const nextMuted = !appState.muted;
      setMuted(nextMuted);
      return [
        {
          kind: "text",
          title: "sound",
          lines: [nextMuted ? "terminal audio muted" : "terminal audio enabled"],
          className: "success-message",
        },
      ];
    },
  },
  time: {
    aliases: ["utc", "clock"],
    description: "Show the current UTC clock value.",
    run() {
      return [
        {
          kind: "text",
          title: "time",
          lines: [`UTC ${formatUtcTime()}`],
          className: "system-message",
        },
      ];
    },
  },
};

function executeCommand(rawInput, options = {}) {
  const input = rawInput.trim();
  if (!input) {
    return;
  }

  const { name, command } = resolveCommand(input);

  if (!options.skipHistory) {
    commandHistory.push(input);
    historyIndex = commandHistory.length;
  }

  if (!command) {
    appendLogEntry(input, [
      {
        kind: "text",
        title: "error",
        lines: [`command not found: ${name}`, 'type "help" to inspect the command set'],
        className: "error-message",
      },
    ]);
    playTone("confirm");
    return;
  }

  if (name === "clear") {
    command.run();
    playTone("confirm");
    return;
  }

  const blocks = command.run(options) || [];
  appendLogEntry(input, blocks);
  playTone("confirm");
}

function handleAutocomplete() {
  const current = commandInput.value.trim().toLowerCase();
  const commandNames = Object.keys(commands);
  const matches = commandNames.filter((name) => name.startsWith(current));

  if (!current) {
    return;
  }

  if (matches.length === 1) {
    commandInput.value = matches[0];
    renderSuggestion(matches[0]);
    updateCommandGhost();
    return;
  }

  if (matches.length > 1) {
    commandInput.value = matches[0];
    renderSuggestion(matches.join(" | "), "matches:");
    updateCommandGhost();
  }
}

function cycleSuggestions() {
  if (appState.phase !== "ready") {
    return;
  }

  suggestionIndex = (suggestionIndex + 1) % suggestions.length;
  const suggestion = suggestions[suggestionIndex];
  renderSuggestion(suggestion);
  updateCommandGhost();
}

function renderBootLine(text) {
  const line = document.createElement("div");
  line.className = "boot-line";

  const match = text.match(/^(\[\d+\])\s(.*?)(\s->\s\[[^\]]+\])?$/);

  if (!match) {
    line.textContent = text;
    bootLog.appendChild(line);
    return;
  }

  const [, index, body, status] = match;

  const indexSpan = document.createElement("span");
  indexSpan.className = "boot-line__index";
  indexSpan.textContent = index;
  line.appendChild(indexSpan);

  line.appendChild(document.createTextNode(body));

  if (status) {
    const statusSpan = document.createElement("span");
    statusSpan.className = "boot-line__status boot-line__status--ok";
    statusSpan.textContent = status;
    line.appendChild(statusSpan);
  }

  bootLog.appendChild(line);
}

async function runBootSequence() {
  if (prefersReducedMotion) {
    skipBootRequested = true;
  }

  for (const line of bootLines) {
    renderBootLine(line);
    await sleep(line.includes("[ok]") ? 280 : 360);
  }

  await sleep(320);
  bootScreen.classList.add("is-complete");
  await sleep(260);
  bootScreen.classList.add("is-hidden");
  terminalShell.classList.remove("is-hidden");
  renderPinnedOverview();
  appState.phase = "ready";
  commandInput.disabled = false;
  await sleep(140);
  updateCommandGhost();
  commandInput.focus();
}

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (appState.phase !== "ready") {
    return;
  }

  executeCommand(commandInput.value);
  commandInput.value = "";
  updateCommandGhost();
});

commandInput.addEventListener("input", () => {
  updateCommandGhost();

  const value = commandInput.value.trim().toLowerCase();
  const match = getAutocompleteMatch(value);
  if (!value) {
    renderSuggestion(suggestions[suggestionIndex]);
    return;
  }

  if (match && match !== value) {
    renderSuggestion(match, "tab:");
  } else if (match) {
    renderSuggestion(match, "ready:");
  } else {
    renderSuggestion("no match", "tab:");
  }
});

commandInput.addEventListener("keydown", (event) => {
  if (appState.phase !== "ready") {
    return;
  }

  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
    playTone("type");
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (!commandHistory.length) {
      return;
    }

    historyIndex = Math.max(0, historyIndex - 1);
    commandInput.value = commandHistory[historyIndex] || "";
    updateCommandGhost();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!commandHistory.length) {
      return;
    }

    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    commandInput.value = commandHistory[historyIndex] || "";
    updateCommandGhost();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    handleAutocomplete();
    return;
  }

  if (event.key === "Escape") {
    commandInput.value = "";
    updateCommandGhost();
    renderSuggestion(suggestions[suggestionIndex]);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.closest("[data-command]");
  if (!action || appState.phase !== "ready") {
    return;
  }

  const { command } = action.dataset;
  if (!command) {
    return;
  }

  commandInput.value = "";
  executeCommand(command);
  updateCommandGhost();
  commandInput.focus();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    clearTerminal();
    return;
  }

  const key = event.key.toLowerCase();
  const typingInInput = document.activeElement === commandInput;
  if (typingInInput || appState.phase !== "ready") {
    return;
  }

  if (key === "g") {
    event.preventDefault();
    executeCommand("work", { skipHistory: true });
  }

  if (key === "l") {
    event.preventDefault();
    executeCommand("theme", { skipHistory: true });
  }

  if (key === "m") {
    event.preventDefault();
    executeCommand("mute", { skipHistory: true });
  }
});

function requestBootSkip() {
  if (appState.phase === "booting") {
    skipBootRequested = true;
  }
}

bootScreen.addEventListener("click", requestBootSkip);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === "Escape") {
    requestBootSkip();
  }
});

themeToggle.addEventListener("click", () => {
  if (appState.phase !== "ready") {
    return;
  }

  executeCommand("theme", { skipHistory: true });
});

muteToggle.addEventListener("click", () => {
  if (appState.phase !== "ready") {
    return;
  }

  executeCommand("mute", { skipHistory: true });
});

setTheme(appState.theme);
setMuted(appState.muted);
renderSuggestion(suggestions[suggestionIndex]);
updateUtcReadout();
updateCommandGhost();
window.setInterval(updateUtcReadout, 1000);
window.setInterval(cycleSuggestions, 2600);
runBootSequence();
