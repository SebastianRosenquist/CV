// CV / portfolio content.
//
// This file holds only the text and data that appears on the site — job
// history, bio copy, contact details, project cards, etc. It is meant to be
// edited often (new roles, updated bullet points, refreshed contact info)
// without touching the rendering engine in script.js.
export const profile = {
  status: [
    "AI Systems Consultant at Thursday Consulting",
    "Based in Copenhagen, Denmark",
    "Open to relevant opportunities with technical depth and societal value",
  ],
  industries: [
    {
      label: "AI / LLM systems",
      value: "RAG agents, local LLMs, automation workflows, research tools, and human-in-the-loop decision support.",
    },
    {
      label: "B2B platforms / Internal tooling",
      value: "Full-stack staffing systems, operational workflows, reporting tools, resource allocation, and platform engineering.",
    },
    {
      label: "Energy / Quantitative analytics",
      value: "Market analytics, predictive ML and NLP models, scraper pipelines, signal extraction, and data-driven trading support.",
    },
    {
      label: "Digital platforms / Operations",
      value: "CMS modernization, website migration, global platform support, and consolidation of legacy digital systems.",
    },
    {
      label: "Education / Technical enablement",
      value: "Teaching, technical mentoring, MVP development, Git workflows, product enablement, and practical software delivery.",
    },
  ],
  work: [
  "Design systems and workflows that reduce friction and make adoption easier.",
  "Build ML, NLP, and LLM tools that turn messy information into usable outputs.",
  "Teach technical concepts in a practical way that helps others build, ship, and work more effectively.",
  "Own technical delivery from problem framing through implementation and rollout."
  ],
  profile: {
    avatarSrc: "media/Profile.jpg",
    avatarAlt: "Portrait of Sebastian A. Rosenquist",
    heading: "Profile",
    role: "AI Systems & Software Engineer",
    tagline: "Designing and building AI-powered systems, internal platforms, and data products for real operational use",
    facts: [
      { label: "name", value: "Sebastian A. Rosenquist" },
      { label: "role", value: "AI Systems Consultant" },
      { label: "based", value: "Copenhagen, Denmark" },
      { label: "now", value: "Thursday Consulting" },
      { label: "focus", value: "AI Engineering / Full-Stack Dev. / Automation / Analytics" },
    ],
    paragraphs: [
      "I work across the full product surface: business framing, workflow design, data handling, automation logic, and the implementation detail that determines whether a system actually gets adopted.",
      "Recent work spans LLM and RAG-powered agents, internal tooling, platform engineering, predictive analytics, data pipelines, and consultant support systems where usable outputs matter more than novelty.",
      "Before Thursday Consulting, I built trader-facing analytics and financial ML models at Centrica Energy Trading, supported global digital operations at WS Audiology, and taught students at Copenhagen Business School how to move from MVP ideas into actual technical deliverable products.",
      "I’m most effective in small, delivery-focused teams where ownership is shared, the objective is concrete, and there is enough room to go deep on the technology behind the solution. I do my best work when I can stay close to the implementation, solve real technical problems, and help move a product from idea to something people actually use.",
    ],
  },
  stack: [
    { label: "technologies", value: "Python / TypeScript / React / SQL / Git & GitHub / Docker / Azure & AWS" },
    { label: "AI stack", value: "Open-source local LLMs / Hugging Face / RAG / vector databases / agent harnesses / AI-assisted development" },
  ],
  contact: [
    { label: "email", value: "seb_rosenquist@hotmail.com", href: "mailto:seb_rosenquist@hotmail.com" },
    { label: "location", value: "Copenhagen, Denmark" },
    {
      label: "linkedin",
      value: "LinkedIn profile",
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
      eyebrow: "AI Operations . 2025 - Present",
      title: "Thursday Consulting",
      meta: "Featured work",
      lines: [
        "Context — consultant research and operational workflows needed more reliable support systems.",
        "Contribution — designed LLM/RAG and script-powered agents, including a workflow that automates a formerly manual process with critical checks and reports for user oversight. Also developed a full-stack scalable staffing platform for data-driven request flow and resource allocation.",
        "Impact — replaced a full day's manual workload with an automated, reviewable workflow and made key operational decisions centralized and easier to act on.",
      ],
      tags: ["LLM Agents", "Full-stack development", "Automation", "Platform Engineering", "Azure"],
    },
    {
      eyebrow: "Energy Trading Analyst and ML Developer . 2022 - 2025",
      title: "Centrica Energy Trading",
      meta: "Featured work",
      lines: [
        "Context — traders needed dependable, cutting-edge, data-driven analytics and broader live market-signal coverage.",
        "Contribution — developed market analytics tools, built NLP-based predictive models, and owned scraper and data-cleaning pipelines.",
        "Impact — pioneered local-LLM use at Centrica to extract market signals from unstructured data feeds and explore a new edge for market prediction.",
      ],
      tags: ["ML Models", "NLP", "Local LLMs", "Quantitative Analytics", "Data Pipelines", "AWS"],
    },
    {
      eyebrow: "Teaching Assistant - Innovation and New Technologies . 2022 - 2025",
      title: "Copenhagen Business School",
      meta: "Featured work",
      lines: [
        "Context — students needed support learning general best-practice coding principles and turning new-technology concepts into working MVPs.",
        "Contribution — taught 300+ students React Native, Git workflows, and technical MVP discipline. Mentored both product development and technical implementation for 11 products that went from MVP to market, 3 of which are active companies today.",
        "Impact — helped students turn early product concepts into workable technical solutions with stronger DevOps habits.",
      ],
      tags: ["Teaching", "React Native", "MVP Delivery", "Product Enablement"],
    },
    {
      eyebrow: "Digital Operations . 2021 - 2023",
      title: "WSAudiology",
      meta: "Featured work",
      lines: [
        "Context — following WSAudiology's formation, live brand websites across multiple CMS platforms needed centralization for stronger oversight and streamlined development.",
        "Contribution — provided global CMS support and maintenance, and migrated and developed websites across WSAudiology's existing brand portfolio from legacy systems onto a modern shared platform.",
        "Impact — centralized the online brand portfolio on a platform that remains in use today, improving global oversight and enabling more consistent development.",
      ],
      tags: ["CMS", "Website Migration", "Digital Operations", "Platform Modernization"],
    },
  ],
  research: [
    {
      eyebrow: "Applied AI Research",
      title: "RAG for Quantitative Risk Management",
      meta: "GitHub",
      lines: [
        "Question — can retrieval-augmented generation improve an LLM's answers to EU AI Act questions published after its training cutoff?",
        "Approach — compared Llama 3.1 responses with and without RAG to examine accuracy, error rates, and hallucination tendencies.",
        "Focus — open-source LLMs, Hugging Face, retrieval, and regulatory information.",
      ],
      tags: ["Llama 3.1", "RAG", "Hugging Face", "EU AI Act"],
      href: "https://github.com/SebastianRosenquist/QRM_LLM_Scraper",
    },
    {
      eyebrow: "Energy Systems Modeling",
      title: "Faroe Islands Interconnector Model",
      meta: "GitHub",
      lines: [
        "Study — modeled seasonal electricity dispatch across the Faroe Islands, Denmark, and the UK, including alternative interconnector capacities.",
        "Approach — built a Julia/JuMP optimization model for demand, generation, renewable feed-in, and cross-border power flows.",
        "Output — visualized dispatch, energy exchange, curtailment, and electricity prices for each modeled node.",
      ],
      tags: ["Julia", "JuMP", "Optimization", "Energy Systems"],
      href: "https://github.com/SebastianRosenquist/Energy_Systems_Faroe_Interconnector_Model",
    },
    {
      eyebrow: "NLP / Social Data Analysis",
      title: "Emotion Prediction in the Ukraine–Russia Conflict",
      meta: "GitHub",
      lines: [
        "Question — how do emotions expressed in Ukraine–Russia conflict subreddit posts relate to post engagement?",
        "Approach — trained a PRADO emotion classifier on GoEmotions data, then predicted emotions in collected Reddit post titles.",
        "Analysis — prepared the predictions for exploratory comparison with post scores and upvotes.",
      ],
      tags: ["TensorFlow", "GoEmotions", "PRADO", "NLP"],
      href: "https://github.com/SebastianRosenquist/Emotion_prediction_of_UkraineRussian_Conflict",
    },
    {
      eyebrow: "Product / Hobby Project",
      title: "ToolMan",
      meta: "GitHub",
      lines: [
        "Product — an early-stage mobile app for communities to rent and share tools.",
        "Implementation — built with React Native, Expo, and Firebase Realtime Database.",
        "Experience — includes mobile flows for sign-up, profiles, maps, search, tool groups, and tool details.",
      ],
      tags: ["React Native", "Expo", "Firebase", "Mobile App"],
      href: "https://github.com/SebastianRosenquist/toolMan",
    },
  ],
  experience: [
    { label: "2025 - Present", value: "Thursday Consulting — AI Systems Consultant" },
    { label: "2023 - 2025", value: "Centrica Energy Trading — Data Analyst & ML Developer" },
    { label: "2022 - 2025", value: "Copenhagen Business School — Teaching Assistant, Innovation & New Technology" },
    { label: "2022 - 2023", value: "Fujitsu — IT Project Leadership Student Assistant" },
    { label: "2021 - 2023", value: "WS Audiology — Digital Operations Student Assistant" },
    { label: "2019 - 2022", value: "CBS Exchange Crew — International Programme Coordination" },
    { label: "2018 - Present", value: "Brandbjerg Højskole — Outdoor Life & Climbing Instructor" },
  ],
  quickActions: [
    { label: "view selected work", command: "work" },
    { label: "research", command: "research" },
    { label: "profile", command: "profile" },
    { label: "contact", command: "contact" },
  ],
  hero: {
    prefix: "profile / 2026",
    system: "AI Systems & Software Engineer",
    headline: "Sebastian A. Rosenquist",
    subline: "",
    summary: [
      "I design and build AI systems, internal platforms, and data products - from problem framing through to implementation.",
      "Currently at Thursday Consulting, working hands-on with LLM agents, full-stack systems, data infrastructure, and operational tooling."
    ],
    rows: [
      { label: "current", value: "AI Systems Consultant at Thursday Consulting" },
      { label: "based", value: "Copenhagen, Denmark" },
      { label: "availability", value: "Open to technically ambitious teams where I can build, learn, and take ownership of delivery." },
    ],
  },
};
