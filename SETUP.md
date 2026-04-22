# Service Contracts Dashboard - Local Setup

## Requirements
- Node.js (LTS version) — download from https://nodejs.org
- A GitHub Personal Access Token with `read:packages` scope (see below)

## GitHub Packages Token (one time per developer)

This app uses `@etechinc/sso-client`, a private package hosted on GitHub Packages. Every developer needs their own token to install dependencies.

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with the `read:packages` scope
3. Add it to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```bash
   export GITHUB_PACKAGES_TOKEN=ghp_xxxxxxxxxxxx
   ```
4. Reload your shell: `source ~/.zshrc`

This token only needs to be set up once per machine.

## Setup (one time)

```bash
# 1. Create a new Vite React project
npm create vite@latest service-contracts -- --template react
cd service-contracts

# 2. Install dependencies (requires GITHUB_PACKAGES_TOKEN in your environment — see above)
npm install

# 3. Replace files:
#    - Copy App.jsx  →  src/App.jsx       (replace existing)
#    - Copy index.html  →  index.html     (replace existing)

# 4. Delete the default CSS files (not needed)
#    - src/App.css
#    - src/index.css

# 5. Edit src/main.jsx — remove the index.css import line:
#    Delete:  import './index.css'
```

## Run

```bash
npm run dev
```

Opens at: **http://localhost:5173**

## Notes
- Data is saved in your browser's localStorage (persists between sessions)
- To clear all saved data: open browser DevTools → Application → Local Storage → clear entries
- To run on a different port: `npm run dev -- --port 3000`
