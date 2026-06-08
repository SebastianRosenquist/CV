const bootScreen = document.getElementById("bootScreen");
const bootLog = document.getElementById("bootLog");
const terminalShell = document.getElementById("terminalShell");
const themeToggle = document.getElementById("themeToggle");
const muteToggle = document.getElementById("muteToggle");
const utcReadout = document.getElementById("utcReadout");
const commandForm = document.getElementById("commandForm");
const commandInput = document.getElementById("commandInput");
const commandGhost = document.getElementById("commandGhost");
const terminalLog = document.getElementById("terminalLog");
const commandSuggestion = document.getElementById("commandSuggestion");

const promptLabel = "sebastian@portfolio ~ $";
const commandHistory = [];
const suggestions = ["help", "status", "industries", "work", "about", "roles", "contact", "time"];
const bootLines = [
  "[01] WAHBA-OS v4.7 (phosphor build)",
  "[02] booting /dev/interface...",
  "[03] mounting portfolio -> [ok]",
  "[04] loading motion profile -> [ok]",
  "[05] resolving /self/manifest -> [ok]",
  "[06] shell ready.",
];

let audioContext;
let historyIndex = -1;
let suggestionIndex = 0;

const appState = {
  phase: "booting",
  theme: localStorage.getItem("terminal-theme") || "dark",
  muted: (localStorage.getItem("terminal-muted") ?? "true") === "true",
};

const profile = {
  status: [
    "Associate | Tech Management Consultant at Thursday Consulting",
    "Based in Vanlose, Copenhagen",
    "Open to new challenges where technical rigor meets societal value",
  ],
  industries: [
    {
      label: "AI / LLM tools",
      value: "RAG agents, copilots, automation assistants, and knowledge-heavy interfaces.",
    },
    {
      label: "SaaS / B2B systems",
      value: "Internal tooling, staffing workflows, reporting systems, and operational products.",
    },
    {
      label: "Energy / FinTech analytics",
      value: "Market tooling, predictive models, scraping pipelines, and data-intensive decisions.",
    },
    {
      label: "Education / enablement",
      value: "Teaching, technical onboarding, MVP coaching, and developer best practices.",
    },
  ],
  work: [
    "Design systems for workflows that reduce drag and create adoption.",
    "Build ML, NLP, and LLM tools that turn messy information into usable outputs.",
    "Ship automation for reporting, research, and data collection pipelines.",
    "Own delivery across business framing, technical execution, and stakeholder translation.",
  ],
  about: [
    "welcome. this is Sebastian Rosenquist terminal.",
    "Internationally raised former elite swimmer turned developer.",
    "I build AI, LLM/RAG, automation, analytics, and tech-enabled systems that connect business framing with technical execution.",
    "Current focus: agent workflows, internal tooling, staffing platforms, predictive models, and practical full-stack delivery.",
  ],
  bio: [
    "Sebastian A. Rosenquist combines a business administration and information systems background with hands-on ML and automation delivery.",
    "Recent work spans RAG agents, LLM research assistants, staffing software, trader analytics tools, data pipelines, and consultant workflow automation.",
    "Past roles include student project leadership at Fujitsu, digital operations at WS Audiology, and teaching assistant work at Copenhagen Business School where he coached students in React Native, Git, and MVP execution.",
    "He is particularly effective where product, data, and engineering need a single operator who can move from framing to build to rollout.",
  ],
  contact: [
    { label: "phone", value: "+45 61 65 96 62", href: "tel:+4561659662" },
    { label: "email", value: "seb_rosenquist@hotmail.com", href: "mailto:seb_rosenquist@hotmail.com" },
    { label: "address", value: "A. F. Beyers Vej 8 2tv., 2720 Vanlose" },
    {
      label: "linkedin",
      value: "linkedin.com/in/sebastian-rosenquist-ai-guru",
      href: "https://www.linkedin.com/in/sebastian-rosenquist-ai-guru/",
    },
    {
      label: "github",
      value: "github.com/SebastianRosenquist",
      href: "https://github.com/SebastianRosenquist",
    },
  ],
  projects: [
    {
      eyebrow: "Tech Management Consulting . AI Operations",
      title: "Thursday Consulting",
      meta: "2025",
      lines: [
        "Designed and deployed LLM and RAG-powered agents for research and consultant support.",
        "Automated internal reporting and workflow operations with scripting and data tools.",
        "Building a full-stack staffing platform for request flow and resource allocation.",
      ],
      tags: ["LLM Agents", "RAG", "Automation", "Staffing Platform"],
    },
    {
      eyebrow: "Data Analytics . Energy Trading",
      title: "Centrica Energy Trading",
      meta: "2023-25",
      lines: [
        "Maintained trader-facing analytics tools on an internal market platform.",
        "Built predictive financial ML models using NLP across diverse market signals.",
        "Owned scrapers and cleaning pipelines for robust high-quality data collection.",
      ],
      tags: ["ML Models", "NLP", "Market Tooling", "Data Pipelines"],
    },
    {
      eyebrow: "Digital Operations . Teaching & Product",
      title: "WS Audiology + CBS",
      meta: "2021-25",
      lines: [
        "Supported and modernized a global CMS and digital portfolio environment.",
        "Taught 300+ students React Native, Git workflows, and technical MVP discipline.",
        "Helped bridge product thinking, project leadership, and technical execution.",
      ],
      tags: ["CMS", "Teaching", "React Native", "Product Enablement"],
    },
  ],
  quickActions: [
    { label: "read full bio", command: "bio" },
    { label: "work", command: "work" },
    { label: "roles", command: "roles" },
    { label: "blog articles", command: "blog" },
    { label: "email me", command: "contact" },
    { label: "help index", command: "help" },
  ],
};

function sleep(ms) {
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
  wrapper.className = "output-block";

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
    grid.className = "output-grid";
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
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function clearTerminal() {
  terminalLog.textContent = "";
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
            { label: "about", value: "who i am, what i'm doing now" },
            { label: "work", value: "selected work cards and project snapshots (G)" },
            { label: "roles", value: "what i actually do across product, AI, and delivery" },
            { label: "articles", value: "field notes, writing, and long-form thinking" },
            { label: "bio", value: "extended background and operator profile" },
            { label: "contact", value: "email, social, and intro links" },
            { label: "theme", value: "toggle phosphor light / dark (L)" },
            { label: "mute", value: "toggle audio on / off (M)" },
            { label: "time", value: "show current UTC clock" },
            { label: "clear", value: "clears the screen (ctrl/cmd+k)" },
            { label: "help", value: "this screen" },
          ],
        },
      ];
    },
  },
  about: {
    aliases: ["intro"],
    description: "Print the short profile summary.",
    run() {
      return [
        { kind: "text", title: "about", lines: profile.about },
        { kind: "actions", items: profile.quickActions },
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
  roles: {
    aliases: ["whatido"],
    description: "Show the core roles I actually perform.",
    run() {
      return [{ kind: "list", title: "roles", items: profile.work }];
    },
  },
  bio: {
    aliases: ["fullbio"],
    description: "Print a longer biography and background.",
    run() {
      return [{ kind: "text", title: "bio", lines: profile.bio }];
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
    description: "Clear the terminal session output.",
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

function seedTerminal() {
  ["about", "status", "industries", "work", "help"].forEach((commandName, index) => {
    window.setTimeout(() => {
      executeCommand(commandName, { skipHistory: true });
    }, index * 160);
  });
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
  for (const line of bootLines) {
    renderBootLine(line);
    await sleep(line.includes("[ok]") ? 280 : 360);
  }

  await sleep(320);
  bootScreen.classList.add("is-complete");
  await sleep(260);
  bootScreen.classList.add("is-hidden");
  terminalShell.classList.remove("is-hidden");
  appState.phase = "ready";
  commandInput.disabled = false;
  seedTerminal();
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
