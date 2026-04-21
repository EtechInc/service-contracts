# Service Contracts Dashboard - Local Setup

## Requirements
- Node.js (LTS version) — download from https://nodejs.org

## Setup (one time)

```bash
# 1. Create a new Vite React project
npm create vite@latest service-contracts -- --template react
cd service-contracts

# 2. Install dependencies
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
