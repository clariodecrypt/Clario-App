# Clario — Générateur de rapports PDF

## Structure
```
clario-v2/
  backend/          → Node.js + Express + Claude API
    server.js
    prompt.js
    htmlGenerator.js
    package.json
    .env.example
  frontend/         → React
    src/
      App.js
      index.js
    public/
      index.html
    package.json
  netlify.toml      → Config Netlify (frontend)
  render.yaml       → Config Render (backend)
```

## Déploiement

### Backend → Render.com
- Root Directory : `backend`
- Build Command : `npm install`
- Start Command : `node server.js`
- Env var : `ANTHROPIC_API_KEY`

### Frontend → Netlify
- Base directory : `frontend`
- Build command : `npm run build`
- Publish directory : `build`
- Env var : `REACT_APP_API_URL` = URL de ton backend Render
