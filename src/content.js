// CV / portfolio content.
//
// This file holds only the text and data that appears on the site — job
// history, bio copy, contact details, project cards, etc. It is meant to be
// edited often (new roles, updated bullet points, refreshed contact info)
// without touching the rendering engine in script.js.
export const profile = {
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
    avatarSrc: "media/Profile.jpg",
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
        "- Designed and deployed LLM and RAG-powered agents for research and consultant support.",
        "- Automated internal reporting and workflow operations with scripting and data tools.",
        "- Building a full-stack staffing platform for request flow and resource allocation.",
      ],
      tags: ["LLM Agents", "RAG", "Automation", "Staffing Platform"],
    },
    {
      eyebrow: "Data Analytics . Energy Trading",
      title: "Centrica Energy Trading",
      meta: "2023-25",
      lines: [
        "- Maintained trader-facing analytics tools on an internal market platform.",
        "- Built predictive financial ML models using NLP across diverse market signals.",
        "- Owned scrapers and cleaning pipelines for robust high-quality data collection.",
      ],
      tags: ["ML Models", "NLP", "Market Tooling", "Data Pipelines"],
    },
    {
      eyebrow: "Digital Operations . Global Web Systems",
      title: "WS Audiology",
      meta: "2021-23",
      lines: [
        "- Supported and modernized a global CMS and digital portfolio environment.",
        "- Migrated and developed WSA's online brand portfolio into a modern platform that remains in use.",
        "- Delivered global support, development, and maintenance across a complex content operation.",
      ],
      tags: ["CMS", "Web Ops", "Migration", "Global Support"],
    },
    {
      eyebrow: "Teaching . Innovation & New Technology",
      title: "Copenhagen Business School",
      meta: "2022-25",
      lines: [
        "- Taught 300+ students React Native, Git workflows, and technical MVP discipline.",
        "- Helped students refine project concepts and translate ideas into workable technical solutions.",
        "- Bridged product thinking, execution, and best-practice engineering habits in coursework.",
      ],
      tags: ["Teaching", "React Native", "MVP Delivery", "Product Enablement"],
    },
    {
      eyebrow: "Project Leadership . Enterprise IT",
      title: "Fujitsu",
      meta: "2022-23",
      lines: [
        "- Supported multiple IT project leaders to improve coordination and on-time delivery.",
        "- Worked close to project execution, stakeholder alignment, and structured delivery support.",
        "- Strengthened the operating layer between planning, tracking, and practical execution.",
      ],
      tags: ["Project Leadership", "Enterprise IT", "Coordination", "Delivery"],
    },
    {
      eyebrow: "Leadership . Outdoor Operations",
      title: "Brandbjerg Hojskole",
      meta: "2018 - Present",
      lines: [
        "- Served as student, volunteer, and instructor in outdoor life and climbing programs.",
        "- Coordinated volunteer work weekends and events for groups ranging from 90 to 350 participants.",
        "- Built practical leadership through safety, logistics, facilitation, and instruction.",
      ],
      tags: ["Leadership", "Instruction", "Operations", "Facilitation"],
    },
    {
      eyebrow: "International Programs . Community Operations",
      title: "CBS Exchange Crew",
      meta: "2019-22",
      lines: [
        "- Facilitated and coordinated the official CBS exchange program for 800+ international students per year.",
        "- Handled logistics and support at scale in a fast-moving service environment.",
        "- Built operational confidence in communication, coordination, and experience delivery.",
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
