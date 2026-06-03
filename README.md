# Clario — Générateur de rapports PDF

## Structure
```
clario-app/
  backend/   → Node.js/Express + Claude API + wkhtmltopdf
  frontend/  → React (formulaire de saisie)
```

## Lancer en local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Renseigner ANTHROPIC_API_KEY dans .env
npm run dev
# Tourne sur http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm start
# Tourne sur http://localhost:3000
```

## Déploiement

### Backend → Render.com (gratuit)
1. Créer un compte sur render.com
2. New > Web Service > connecter le repo GitHub
3. Root directory : `backend`
4. Build command : `npm install`
5. Start command : `node server.js`
6. Ajouter variable d'environnement : `ANTHROPIC_API_KEY`
7. ⚠️ Installer wkhtmltopdf sur Render : ajouter en build command :
   `apt-get install -y wkhtmltopdf && npm install`

### Frontend → Vercel (gratuit)
1. Créer un compte sur vercel.com
2. New Project > connecter le repo GitHub
3. Root directory : `frontend`
4. Ajouter variable d'environnement :
   `REACT_APP_API_URL=https://votre-backend.onrender.com`
5. Dans App.js, remplacer `/generate` par `${process.env.REACT_APP_API_URL}/generate`

## Flow complet
1. L'utilisateur remplit le formulaire React
2. Le frontend envoie les données au backend `/generate`
3. Le backend appelle Claude API avec le prompt Clario
4. Claude retourne un JSON structuré avec scores + analyse
5. Le backend génère le HTML + convertit en PDF via wkhtmltopdf
6. Le PDF est renvoyé au frontend qui déclenche le téléchargement
