const themeToggle = document.getElementById("themeToggle");
const muteToggle = document.getElementById("muteToggle");
const utcReadout = document.getElementById("utcReadout");
const commandForm = document.getElementById("commandForm");
const commandInput = document.getElementById("commandInput");
const terminalLog = document.getElementById("terminalLog");
const commandSuggestion = document.getElementById("commandSuggestion");
const chips = document.querySelectorAll("[data-command]");

const promptLabel = "sebastian@portfolio ~ $";
const suggestions = [
  "help",
  "status",
  "industries",
  "work",
  "about",
  "shots",
  "contact",
  "time",
];

const commandHistory = [];
let historyIndex = -1;
let suggestionIndex = 0;
let audioContext;

const themeState = {
  current: localStorage.getItem("terminal-theme") || "dark",
};

const muteState = {
  current: localStorage.getItem("terminal-muted") ?? "true",
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
    "Internationally raised former elite swimmer turned developer.",
    "Strongly motivated by ML, NLP, and the space where business and technology reinforce each other.",
    "Experienced in translating complex technical problems into practical solutions through consulting, analytics, and teaching.",
    "Looking for future-proof work where technology can create lasting value and broader impact.",
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
  shots: [
    {
      title: "Thursday Consulting",
      meta: "2025 - present",
      lines: [
        "Designed and deployed LLM and RAG-powered agents for research and consultant support.",
        "Automated internal reporting and workflow operations with scripting and data tools.",
        "Building a full-stack staffing platform for request flow and resource allocation.",
      ],
    },
    {
      title: "Centrica Energy Trading",
      meta: "2023 - 2025",
      lines: [
        "Maintained trader-facing analytics tools on an internal market platform.",
        "Built predictive financial ML models using NLP across diverse market signals.",
        "Owned scrapers and cleaning pipelines for robust high-quality data collection.",
      ],
    },
    {
      title: "WS Audiology + CBS",
      meta: "2021 - 2025",
      lines: [
        "Supported and modernized a global CMS and digital portfolio environment.",
        "Taught 300+ students React Native, Git workflows, and technical MVP discipline.",
        "Helped bridge product thinking, project leadership, and technical execution.",
      ],
    },
  ],
};

function createLineElement(text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (className) {
    paragraph.className = className;
  }
  return paragraph;
}

function renderSuggestion(text, prefix = "try:") {
  commandSuggestion.textContent = "";
  commandSuggestion.append(document.createTextNode(`${prefix} `));

  const value = document.createElement("span");
  value.id = "suggestionText";
  value.textContent = text;
  commandSuggestion.appendChild(value);
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
      lines.appendChild(createLineElement(line, block.className || ""));
    });
    wrapper.appendChild(lines);
  }

  if (block.kind === "list") {
    const list = document.createElement("div");
    list.className = "output-list";
    block.items.forEach((item) => {
      list.appendChild(createLineElement(item));
    });
    wrapper.appendChild(list);
  }

  if (block.kind === "grid") {
    const grid = document.createElement("div");
    grid.className = "output-grid";
    block.items.forEach((item) => {
      const cell = document.createElement("p");
      const label = document.createElement("span");
      label.className = "output-label";
      label.textContent = item.label;
      cell.appendChild(label);
      cell.appendChild(document.createTextNode(item.value));
      grid.appendChild(cell);
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
      card.className = "terminal-card";

      const heading = document.createElement("h3");
      heading.textContent = item.title;
      card.appendChild(heading);

      const meta = document.createElement("p");
      meta.className = "output-title";
      meta.textContent = item.meta;
      card.appendChild(meta);

      item.lines.forEach((line) => {
        card.appendChild(createLineElement(line));
      });

      cardGrid.appendChild(card);
    });
    wrapper.appendChild(cardGrid);
  }

  return wrapper;
}

function appendLogEntry(commandText, blocks = []) {
  const entry = document.createElement("div");
  entry.className = "log-entry";

  const commandLine = document.createElement("div");
  commandLine.className = "log-entry log-entry--command";

  const prompt = document.createElement("span");
  prompt.className = "log-prompt";
  prompt.textContent = `${promptLabel} `;

  const command = document.createElement("span");
  command.textContent = commandText;

  commandLine.append(prompt, command);
  entry.appendChild(commandLine);

  blocks.forEach((block) => {
    entry.appendChild(renderBlock(block));
  });

  terminalLog.appendChild(entry);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function scrollSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function formatUtcTime(date = new Date()) {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour12: false,
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeState.current = theme;
  localStorage.setItem("terminal-theme", theme);

  const lightMode = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(lightMode));
  themeToggle.querySelector(".toolbar-button__text").textContent = lightMode ? "dark" : "light";
}

function setMuted(muted) {
  muteState.current = String(muted);
  localStorage.setItem("terminal-muted", muteState.current);
  muteToggle.setAttribute("aria-pressed", String(!muted));
  muteToggle.querySelector(".toolbar-button__text").textContent = muted ? "unmute" : "mute";
}

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function playTone(type = "type") {
  if (muteState.current === "true") {
    return;
  }

  if (!window.AudioContext) {
    return;
  }

  ensureAudioContext();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "square";
  oscillator.frequency.value = type === "confirm" ? 330 : 180;
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(type === "confirm" ? 0.02 : 0.01, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function clearTerminal() {
  terminalLog.textContent = "";
}

const commands = {
  help: {
    aliases: ["?", "menu"],
    description: "List available commands and shortcuts.",
    run() {
      return [
        {
          kind: "grid",
          title: "available_commands",
          items: Object.entries(commands).map(([name, config]) => ({
            label: name,
            value: config.description,
          })),
        },
      ];
    },
  },
  status: {
    aliases: [],
    description: "Show current role, location, and availability.",
    run(context = {}) {
      if (!context.skipScroll) {
        scrollSection("status-section");
      }
      return [{ kind: "list", title: "status", items: profile.status }];
    },
  },
  industries: {
    aliases: ["focus", "sectors"],
    description: "Show the operating domains I work in.",
    run(context = {}) {
      if (!context.skipScroll) {
        scrollSection("industries-section");
      }
      return [{ kind: "grid", title: "industries", items: profile.industries }];
    },
  },
  work: {
    aliases: ["whatido"],
    description: "Show the core roles I actually perform.",
    run(context = {}) {
      if (!context.skipScroll) {
        scrollSection("work-section");
      }
      return [{ kind: "list", title: "what_i_actually_do", items: profile.work }];
    },
  },
  about: {
    aliases: ["intro"],
    description: "Print the short profile summary.",
    run() {
      return [{ kind: "text", title: "about", lines: profile.about }];
    },
  },
  bio: {
    aliases: ["fullbio"],
    description: "Print a longer biography and background.",
    run() {
      return [
        {
          kind: "text",
          title: "bio",
          lines: [
            "Sebastian A. Rosenquist combines a business administration and information systems background with hands-on ML and automation delivery.",
            "Recent work spans RAG agents, LLM research assistants, staffing software, trader analytics tools, data pipelines, and consultant workflow automation.",
            "Past roles include student project leadership at Fujitsu, digital operations at WS Audiology, and teaching assistant work at Copenhagen Business School where he coached students in React Native, Git, and MVP execution.",
            "He is particularly effective where product, data, and engineering need a single operator who can move from framing to build to rollout.",
          ],
        },
      ];
    },
  },
  contact: {
    aliases: ["email", "reach"],
    description: "Show direct contact details and public profiles.",
    run() {
      return [{ kind: "links", title: "contact", items: profile.contact }];
    },
  },
  shots: {
    aliases: ["projects", "worksamples"],
    description: "Show terminal cards for selected work and case-study snapshots.",
    run() {
      return [{ kind: "cards", title: "selected_work", items: profile.shots }];
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
    description: "Clear the terminal output history.",
    run() {
      clearTerminal();
      return null;
    },
  },
  theme: {
    aliases: ["mode"],
    description: "Toggle between dark and light terminal themes.",
    run() {
      const nextTheme = themeState.current === "dark" ? "light" : "dark";
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
      const shouldMute = muteState.current !== "true";
      setMuted(shouldMute);
      return [
        {
          kind: "text",
          title: "sound",
          lines: [shouldMute ? "terminal audio muted" : "terminal audio enabled"],
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

function cycleSuggestions() {
  suggestionIndex = (suggestionIndex + 1) % suggestions.length;
  const suggestion = suggestions[suggestionIndex];
  renderSuggestion(suggestion);
  commandInput.placeholder = `try "${suggestion}"`;
}

function updateUtcReadout() {
  utcReadout.textContent = `UTC ${formatUtcTime()}`;
}

function handleAutocomplete() {
  const current = commandInput.value.trim().toLowerCase();
  const commandNames = Object.keys(commands);
  const matches = commandNames.filter((name) => name.startsWith(current));

  if (!current) {
    commandInput.value = suggestions[suggestionIndex];
    return;
  }

  if (matches.length === 1) {
    commandInput.value = matches[0];
    return;
  }

  if (matches.length > 1) {
    commandInput.value = matches[0];
    renderSuggestion(matches.join(" | "), "matches:");
  }
}

function seedTerminal() {
  ["status", "industries", "work", "help"].forEach((commandName, index) => {
    window.setTimeout(() => {
      executeCommand(commandName, { skipHistory: true, skipScroll: true });
    }, 180 * index);
  });
}

themeToggle.addEventListener("click", () => {
  executeCommand("theme", { skipHistory: true });
});

muteToggle.addEventListener("click", () => {
  executeCommand("mute", { skipHistory: true });
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const command = chip.dataset.command;
    if (!command) {
      return;
    }

    commandInput.value = "";
    executeCommand(command);
    commandInput.focus();
  });
});

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  executeCommand(commandInput.value);
  commandInput.value = "";
});

commandInput.addEventListener("keydown", (event) => {
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
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (!commandHistory.length) {
      return;
    }

    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    commandInput.value = commandHistory[historyIndex] || "";
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    handleAutocomplete();
    return;
  }

  if (event.key === "Escape") {
    commandInput.value = "";
    commandInput.blur();
    renderSuggestion(suggestions[suggestionIndex]);
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    clearTerminal();
    return;
  }

  const activeTag = document.activeElement?.tagName;
  const typingInInput = activeTag === "INPUT" || activeTag === "TEXTAREA";
  if (typingInInput) {
    return;
  }

  const key = event.key.toLowerCase();
  if (key === "g") {
    event.preventDefault();
    executeCommand("shots", { skipHistory: true });
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

setTheme(themeState.current);
setMuted(muteState.current === "true");
updateUtcReadout();
window.setInterval(updateUtcReadout, 1000);
window.setInterval(cycleSuggestions, 2600);
seedTerminal();
