# TimeTravel Agency - Webapp Vibe Coding

Application SPA moderne et interactive pour découvrir 3 destinations temporelles, dialoguer avec un assistant IA et simuler une réservation premium.

## Objectif

Offrir une expérience immersive autour de :
- `Paris 1889`
- `Crétacé`
- `Florence 1504`

## Stack Technique

- `Cursor` (vibe coding / génération assistée)
- `React 19`
- `Vite 8`
- `Tailwind CSS 4`
- `Framer Motion`
- `Lucide React`
- API optionnelle: `OpenAI Chat Completions` (fallback local inclus)

## Fonctionnalités

- Hero section sombre et luxueuse avec animation d'entrée
- Navigation sticky (Header)
- Galerie de 3 cartes destinations avec hover effects
- Animations de scroll et transitions avec Framer Motion
- Chatbot flottant:
  - roleplay "Assistant de luxe passionné d'histoire"
  - connaissances des 3 destinations
  - fallback local sans clé API
  - intégration API OpenAI si `VITE_OPENAI_API_KEY` est fournie
- Mini-quiz bonus (4 questions) pour recommander une destination
- Simulation de réservation (CTA)

## Arborescence utile

- `src/App.jsx` -> structure de la SPA, UI et interactions
- `src/data/destinations.js` -> données destinations
- `src/utils/chatAssistant.js` -> logique du chatbot (API + fallback)
- `public/assets/` -> visuels des destinations

## Prompts IA utilisés (transparence)

Exemples de prompts utilisés dans Cursor pour produire cette version :

1. "Génère une SPA interactive pour TimeTravel Agency avec React et Tailwind CSS. Structure : Header, Hero section sombre animée, galerie de 3 cards (Paris 1889, Crétacé, Florence 1504), chatbot flottant."
2. "Rends le design plus luxueux avec accents dorés, contraste élevé, animations subtiles au scroll et au hover."
3. "Ajoute un assistant conversationnel chaleureux et professionnel spécialisé en histoire, avec un mode fallback local."
4. "Ajoute un mini-quiz de 4 questions qui recommande une destination."

## Lancer en local

```bash
npm install
npm run dev
```

## Configuration IA (optionnelle)

1. Copier `.env.example` en `.env`
2. Choisir un mode:

- **Mode recommandé (production / GitHub Pages)** : backend proxy sécurisé
- **Mode gratuit rapide** : OpenRouter avec modèle `:free`
- **Mode rapide (dev local uniquement)** : clé API directe dans Vite

3. Renseigner:

```bash
# Option 1 - Recommandé (frontend statique + backend séparé)
VITE_CHAT_API_URL=https://ton-backend-chat.exemple/api/chat

# Option 2 - Gratuit (OpenRouter + modèle free)
VITE_OPENROUTER_API_KEY=sk-or-...
VITE_OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

# Option 3 - Local/dev uniquement (clé visible dans le bundle)
VITE_OPENAI_API_KEY=sk-...
```

Sans configuration API, le chatbot fonctionne en mode local (réponses contextuelles prédéfinies).

### Obtenir un chatbot IA gratuit

1. Créer un compte sur OpenRouter (plan gratuit)
2. Générer une clé API
3. Utiliser un modèle marqué `:free`
4. Ajouter les variables dans `.env` (local) ou dans les Secrets GitHub

Le widget affiche automatiquement le mode actif:
- `Mode IA gratuit (OpenRouter)`
- `Mode API sécurisé`
- `Mode local (sans API)`

## Build production

```bash
npm run build
npm run preview
```

## Déploiement

### GitHub Pages (frontend)

1. Pousser le projet sur GitHub
2. Activer GitHub Pages via GitHub Actions (build Vite)
3. Publier le dossier `dist`
4. Pour un chatbot IA en production, configurer `VITE_CHAT_API_URL` vers un backend externe

> Important : GitHub Pages est statique. Ne stockez pas de clé API secrète directement dans le frontend.

### Vercel

1. Importer le repo dans Vercel
2. Framework détecté : `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Ajouter `VITE_OPENAI_API_KEY` dans les variables d'environnement (optionnel)

### Netlify

1. New site from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Ajouter `VITE_OPENAI_API_KEY` (optionnel)

## Livrables attendus

- URL publique (Vercel ou Netlify)
- Code source (repo)
- README complet (ce document)
