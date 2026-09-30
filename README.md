# Sebastian Rosenquist — Terminal Portfolio

A static, terminal-style CV and portfolio for Sebastian Rosenquist. It covers selected work, experience, technologies, and independent research projects with source links.

Live site: <https://sebastianrosenquist.github.io/CV/>

## Run locally

No installation is required.

```powershell
python -m http.server 4173 --directory src
```

Open <http://127.0.0.1:4173>.

## Terminal commands

`help`, `profile`, `status`, `industries`, `work`, `research`, `experience`, `contact`, `blog`, `theme`, `mute`, `time`, and `clear`.

`research` includes linked work on RAG risk evaluation, energy-system optimization, emotion prediction, and ToolMan.

## Updating content

- `src/content.js` holds profile, work, research, experience, and contact content.
- `src/script.js` renders the terminal and its commands.
- `src/styles.css` contains the visual styling.

## Checks

```powershell
node test_profile.mjs
node test_commands.mjs
node --check src/script.js
```
