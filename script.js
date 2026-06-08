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
const suggestions = ["help", "status", "industries", "work", "about", "roles", "contact", "time"];
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
    "Welcome. This is Sebastian Rosenquist terminal.",
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
  dossier: {
    avatarSrc: "Profile.jpg",
    avatarAlt: "Portrait of Sebastian A. Rosenquist",
    shell: "SAR_TERMINAL / DOSSIER",
    signal: "signal ok",
    operatorLabel: "operator",
    operatorCode: "SAR-D6-37",
    accessLabel: "access",
    accessValue: "*_*_*",
    tagline: "AI, SaaS, and FinTech systems. Full-surface operator across product, data, and delivery.",
    facts: [
      { label: "name", value: "Sebastian A. Rosenquist" },
      { label: "role", value: "Tech Analyst & ML Developer" },
      { label: "based", value: "Vanlose, Copenhagen" },
      { label: "now", value: "Thursday Consulting" },
      { label: "clearance", value: "LLM / RAG / Automation / Analytics" },
      { label: "sec_code", value: "SAR-25805-W-2973" },
    ],
    paragraphs: [
      "I work across the full product surface: business framing, workflow design, data handling, automation logic, and the implementation detail that determines whether a system actually gets adopted.",
      "Recent work spans LLM and RAG-powered agents, internal tooling, staffing workflows, predictive analytics, scraper pipelines, and consultant support systems where usable outputs matter more than novelty.",
      "Before Thursday Consulting, I built trader-facing analytics and financial ML models at Centrica Energy Trading, supported global digital operations at WS Audiology, and taught students at Copenhagen Business School how to move from MVP ideas into actual technical delivery.",
      "Most useful when a team needs one operator who can move between stakeholders, product logic, and implementation without letting the business intent get lost in translation.",
    ],
    industries: [
      { label: "AI / LLM tools", value: "copilots, agents, operator interfaces" },
      { label: "SaaS / B2B", value: "dashboards, workflows, internal systems" },
      { label: "FinTech / Energy", value: "analytics, forecasting, compliance-facing tools" },
      { label: "Education / Enablement", value: "technical onboarding, teaching, MVP delivery" },
    ],
    services: [
      "Ship pragmatic v1 systems in weeks, not quarters",
      "Design AI-first workflows that match how teams actually operate :)",
      "Build AI and automation layers that reduce manual drag",
      "Translate complex technical decisions into usable product behavior",
      "Close the gap between business framing, data logic, and production delivery",
    ],
    stack: [
      { label: "design", value: "product . systems . workflows . service logic" },
      { label: "engineering", value: "Python . TypeScript . RAG . automation tooling" },
      { label: "analytics", value: "ML models . NLP . scraping . forecasting pipelines" },
      { label: "delivery", value: "solo-to-v1 . operator enablement . adoption-minded execution" },
    ],
    deployments: [
      { label: "Thursday Consulting", value: "Associate . Tech management consulting . Copenhagen", meta: "2025->" },
      { label: "Centrica Energy Trading", value: "Data analyst and ML developer . market tooling", meta: "2023-25" },
      { label: "WS Audiology", value: "Digital operations student assistant . global CMS", meta: "2021-23" },
      { label: "Copenhagen Business School", value: "Teaching assistant . innovation and new technology", meta: "2022-25" },
    ],
  },
  contact: [
    { label: "phone", value: "Send me your number or add me on LinkedIn and I will contact you :)" },
    { label: "email", value: "seb_rosenquist@hotmail.com", href: "mailto:seb_rosenquist@hotmail.com" },
    { label: "address", value: "In the 2720 Vanlose neighborhood" },
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
      meta: "2025 - Present",
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
      eyebrow: "Digital Operations . Global Web Systems",
      title: "WS Audiology",
      meta: "2021-23",
      lines: [
        "Supported and modernized a global CMS and digital portfolio environment.",
        "Migrated and developed WSA's online brand portfolio into a modern platform that remains in use.",
        "Delivered global support, development, and maintenance across a complex content operation.",
      ],
      tags: ["CMS", "Web Ops", "Migration", "Global Support"],
    },
    {
      eyebrow: "Teaching . Innovation & New Technology",
      title: "Copenhagen Business School",
      meta: "2022-25",
      lines: [
        "Taught 300+ students React Native, Git workflows, and technical MVP discipline.",
        "Helped students refine project concepts and translate ideas into workable technical solutions.",
        "Bridged product thinking, execution, and best-practice engineering habits in coursework.",
      ],
      tags: ["Teaching", "React Native", "MVP Delivery", "Product Enablement"],
    },
    {
      eyebrow: "Project Leadership . Enterprise IT",
      title: "Fujitsu",
      meta: "2022-23",
      lines: [
        "Supported multiple IT project leaders to improve coordination and on-time delivery.",
        "Worked close to project execution, stakeholder alignment, and structured delivery support.",
        "Strengthened the operating layer between planning, tracking, and practical execution.",
      ],
      tags: ["Project Leadership", "Enterprise IT", "Coordination", "Delivery"],
    },
    {
      eyebrow: "Leadership . Outdoor Operations",
      title: "Brandbjerg Hojskole",
      meta: "2018 - Present",
      lines: [
        "Served as student, volunteer, and instructor in outdoor life and climbing programs.",
        "Coordinated volunteer work weekends and events for groups ranging from 90 to 350 participants.",
        "Built practical leadership through safety, logistics, facilitation, and instruction.",
      ],
      tags: ["Leadership", "Instruction", "Operations", "Facilitation"],
    },
    {
      eyebrow: "International Programs . Community Operations",
      title: "CBS Exchange Crew",
      meta: "2019-22",
      lines: [
        "Facilitated and coordinated the official CBS exchange program for 800+ international students per year.",
        "Handled logistics and support at scale in a fast-moving service environment.",
        "Built operational confidence in communication, coordination, and experience delivery.",
      ],
      tags: ["Operations", "Logistics", "Coordination", "International Programs"],
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
  hero: {
    prefix: "this_is",
    system: "SAR-OS v1.7 . build.phosphor . 2026",
    headline: "Sebastian A. Rosenquist",
    subline: "AI, SaaS, and FinTech systems",
    summary: [
      "Design engineer building LLM/RAG, automation, analytics, and product systems for teams that need usable tools, not demos.",
      "I ship the full surface: workflows, business framing, implementation, and the delivery detail that keeps systems adopted.",
    ],
    rows: [
      { label: "status", value: "Currently building AI-native operations and workflows at Thursday Consulting" },
      { label: "based", value: "Vanlose, Copenhagen . Working globally" },
      { label: "availability", value: "Open to new challenges with technical depth and societal value" },
    ],
  },
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

  if (block.kind === "dossier") {
    const dossier = document.createElement("article");
    dossier.className = "dossier-card";

    const header = document.createElement("div");
    header.className = "dossier-card__header";

    const shell = document.createElement("div");
    shell.className = "dossier-card__shell";
    shell.textContent = block.shell;

    const signal = document.createElement("div");
    signal.className = "dossier-card__signal";
    signal.textContent = block.signal;

    header.append(shell, signal);
    dossier.appendChild(header);

    const hero = document.createElement("div");
    hero.className = "dossier-card__hero";

    const operatorPanel = document.createElement("div");
    operatorPanel.className = "dossier-card__operator";

    const operatorLabel = document.createElement("div");
    operatorLabel.className = "dossier-card__label";
    operatorLabel.textContent = block.operatorLabel;

    const operatorCode = document.createElement("div");
    operatorCode.className = "dossier-card__code";
    operatorCode.textContent = block.operatorCode;

    const tagline = document.createElement("p");
    tagline.className = "dossier-card__tagline";
    tagline.textContent = block.tagline;

    operatorPanel.append(operatorLabel, operatorCode, tagline);

    const accessPanel = document.createElement("div");
    accessPanel.className = "dossier-card__access";

    const accessLabel = document.createElement("div");
    accessLabel.className = "dossier-card__label";
    accessLabel.textContent = block.accessLabel;

    const accessValue = document.createElement("div");
    accessValue.className = "dossier-card__access-code";
    accessValue.textContent = block.accessValue;

    accessPanel.append(accessLabel, accessValue);
    hero.append(operatorPanel, accessPanel);
    dossier.appendChild(hero);

    const data = document.createElement("div");
    data.className = "dossier-card__data";

    const avatar = document.createElement("div");
    avatar.className = "dossier-card__avatar";

    const avatarImage = document.createElement("img");
    avatarImage.className = "dossier-card__avatar-image";
    avatarImage.src = block.avatarSrc;
    avatarImage.alt = block.avatarAlt;
    avatar.appendChild(avatarImage);

    const facts = document.createElement("div");
    facts.className = "dossier-card__facts";

    block.facts.forEach((item) => {
      const row = document.createElement("div");
      row.className = "dossier-card__fact-row";

      const label = document.createElement("div");
      label.className = "dossier-card__fact-label";
      label.textContent = item.label;

      const value = document.createElement("div");
      value.className = "dossier-card__fact-value";
      value.textContent = item.value;

      row.append(label, value);
      facts.appendChild(row);
    });

    const sideMarks = document.createElement("div");
    sideMarks.className = "dossier-card__marks";
    sideMarks.setAttribute("aria-hidden", "true");

    for (let index = 0; index < 3; index += 1) {
      const mark = document.createElement("div");
      mark.className = "dossier-card__mark";
      sideMarks.appendChild(mark);
    }

    data.append(avatar, facts, sideMarks);
    dossier.appendChild(data);

    const body = document.createElement("div");
    body.className = "dossier-card__body";

    const bodyTitle = document.createElement("div");
    bodyTitle.className = "dossier-card__body-title";
    bodyTitle.textContent = "dossier / full bio";
    body.appendChild(bodyTitle);

    block.paragraphs.forEach((paragraph) => {
      body.appendChild(createParagraph(paragraph));
    });

    dossier.appendChild(body);

    const sections = document.createElement("div");
    sections.className = "dossier-card__sections";

    const industriesSection = document.createElement("section");
    industriesSection.className = "dossier-section";
    industriesSection.appendChild(createDossierSectionTitle("industries / cleared for"));

    const industriesGrid = document.createElement("div");
    industriesGrid.className = "dossier-section__industries";
    block.industries.forEach((item) => {
      const cell = document.createElement("article");
      cell.className = "dossier-industry";

      const label = document.createElement("div");
      label.className = "dossier-industry__label";
      label.textContent = item.label;

      const value = document.createElement("p");
      value.className = "dossier-industry__value";
      value.textContent = item.value;

      cell.append(label, value);
      industriesGrid.appendChild(cell);
    });
    industriesSection.appendChild(industriesGrid);

    const servicesSection = document.createElement("section");
    servicesSection.className = "dossier-section";
    servicesSection.appendChild(createDossierSectionTitle("what i do / services"));

    const servicesList = document.createElement("div");
    servicesList.className = "dossier-section__services";
    block.services.forEach((item) => {
      const line = document.createElement("div");
      line.className = "dossier-service";
      line.textContent = item;
      servicesList.appendChild(line);
    });
    servicesSection.appendChild(servicesList);

    const stackSection = document.createElement("section");
    stackSection.className = "dossier-section";
    stackSection.appendChild(createDossierSectionTitle("practice / stack"));

    const stackList = document.createElement("div");
    stackList.className = "dossier-section__stack";
    block.stack.forEach((item) => {
      const row = document.createElement("div");
      row.className = "dossier-stack__row";

      const label = document.createElement("div");
      label.className = "dossier-stack__label";
      label.textContent = item.label;

      const value = document.createElement("div");
      value.className = "dossier-stack__value";
      value.textContent = item.value;

      row.append(label, value);
      stackList.appendChild(row);
    });
    stackSection.appendChild(stackList);

    const deploymentsSection = document.createElement("section");
    deploymentsSection.className = "dossier-section";
    deploymentsSection.appendChild(createDossierSectionTitle("prior deployments"));

    const deploymentsList = document.createElement("div");
    deploymentsList.className = "dossier-section__deployments";
    block.deployments.forEach((item) => {
      const row = document.createElement("div");
      row.className = "dossier-deployment";

      const main = document.createElement("div");
      main.className = "dossier-deployment__main";
      main.textContent = `${item.label} . ${item.value}`;

      const meta = document.createElement("div");
      meta.className = "dossier-deployment__meta";
      meta.textContent = item.meta;

      row.append(main, meta);
      deploymentsList.appendChild(row);
    });
    deploymentsSection.appendChild(deploymentsList);

    sections.append(industriesSection, servicesSection, stackSection, deploymentsSection);
    dossier.appendChild(sections);
    wrapper.appendChild(dossier);
  }

  return wrapper;
}

function createDossierSectionTitle(text) {
  const title = document.createElement("div");
  title.className = "dossier-section__title";
  title.textContent = text;
  return title;
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

  const system = document.createElement("div");
  system.className = "terminal-hero__system";
  system.textContent = profile.hero.system;
  hero.appendChild(system);

  const subline = document.createElement("div");
  subline.className = "terminal-hero__subline";
  subline.textContent = profile.hero.subline;
  hero.appendChild(subline);

  const summary = document.createElement("div");
  summary.className = "terminal-hero__summary";
  profile.hero.summary.forEach((line) => {
    summary.appendChild(createParagraph(line));
  });
  hero.appendChild(summary);

  terminalPinned.appendChild(hero);

  renderBlocksInto(terminalPinned, [
    { kind: "list-table", title: "status", items: profile.hero.rows },
    { kind: "grid", title: "industries i work with", items: profile.industries },
    { kind: "list", title: "what i actually do", items: profile.work },
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
            { label: "about", value: "who i am, what i'm doing now" },
            { label: "work", value: "selected work cards and project snapshots (G)" },
            { label: "roles", value: "what i actually do across product, AI, and delivery" },
            { label: "articles", value: "field notes, writing, and long-form thinking" },
            { label: "bio", value: "extended background and operator profile" },
            { label: "contact", value: "email, social, and intro links" },
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
      return [
        {
          kind: "text",
          lines: ["issuing dossier..."],
          className: "system-message",
        },
        {
          kind: "dossier",
          ...profile.dossier,
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

function seedTerminal() {
  ["help"].forEach((commandName, index) => {
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
  renderPinnedOverview();
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
