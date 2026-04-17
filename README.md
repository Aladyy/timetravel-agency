# TimeTravel Agency - Webapp Interactive

Webapp premium pour découvrir trois époques, discuter avec un assistant IA et obtenir une recommandation personnalisée avant réservation.

URL publique : [https://aladyy.github.io/timetravel-agency/](https://aladyy.github.io/timetravel-agency/)

## Participant au projet YNOV

- Amelie Boisliveau
- Dassine SAHEB
- Elsa AUBREE
- Sandy Martins
- Jules Hautecloche

## Stack technique

- `React 19` + `Vite 8`
- `Tailwind CSS 4`
- `Framer Motion`
- `Lucide React`
- Déploiement `GitHub Pages` via `GitHub Actions`
- IA : `Mistral API` (agent conversations), fallback `OpenRouter`, fallback local

## Fonctionnalités implémentées

- Landing immersive avec hero vidéo (filtrée) et design sombre luxe
- Galerie interactive des 3 destinations Session 1 :
  - Paris 1889
  - Crétacé
  - Florence 1504
- Cards avec hover, badges de risque et responsive mobile
- Chatbot flottant avec continuité conversationnelle (mode agent Mistral)
- Quiz en 4 étapes avec barre de progression et recommandation personnalisée
- CTA de simulation de réservation

## Correspondance avec les critères d'évaluation

### Technique (8/8 visé)
- Webapp fonctionnelle et déployée en public
- Structure claire (`src/data`, `src/utils`, composants dans `App.jsx`)
- Assets Session 1 intégrés dans `public/assets`
- Intégration des outils IA pertinente (modes IA, fallback, robustesse)

### Fonctionnalités IA (6/6 visé)
- Agent conversationnel opérationnel (Mistral `conversations`)
- Personnalisation via quiz (automatisation de recommandation)
- Réponses contextualisées sur les 3 destinations + budget/sécurité

### UX/UI & Créativité (4/4 visé)
- Thème premium cohérent (sombre + accents dorés)
- Navigation intuitive, sections lisibles
- Animations subtiles (hero + scroll + hover)
- Expérience fluide desktop/mobile

### Documentation & Open Source (2/2 visé)
- README complet (stack, setup, déploiement, IA)
- Transparence sur prompts et outils IA
- Crédits et réflexion de processus documentés

## Configuration IA

Copier `.env.example` en `.env` puis choisir un mode.

### Option recommandée : Agent Mistral (publique)

```bash
VITE_MISTRAL_API_KEY=...
VITE_MISTRAL_AGENT_ID=ag_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_MISTRAL_AGENT_VERSION=2
VITE_MISTRAL_MODEL=mistral-small-latest
```

### Option alternative gratuite : OpenRouter

```bash
VITE_OPENROUTER_API_KEY=sk-or-...
VITE_OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### Option backend proxy sécurisé

```bash
VITE_CHAT_API_URL=https://ton-backend-chat.exemple/api/chat
```

Le widget affiche le mode actif (`Mode Agent Mistral`, `Mode IA gratuit`, etc.).

## Installation et lancement

```bash
npm install
npm run dev
```

Build production :

```bash
npm run build
npm run preview
```

## Déploiement GitHub Pages

1. Push sur `main`
2. Workflow `Deploy to GitHub Pages` se lance automatiquement
3. Vérifier les secrets/variables dans `Settings > Secrets and variables > Actions` :
   - `VITE_MISTRAL_API_KEY` (secret)
   - `VITE_MISTRAL_AGENT_ID` (variable)
   - `VITE_MISTRAL_AGENT_VERSION` (variable)
   - `VITE_MISTRAL_MODEL` (variable)

## Prompts IA utilisés (transparence)

1. "Génère une SPA interactive pour TimeTravel Agency avec React et Tailwind CSS..."
2. "Rends le design plus luxueux avec accents dorés, contraste élevé..."
3. "Ajoute un assistant conversationnel chaleureux et professionnel..."
4. "Ajoute un mini-quiz de 4 questions qui recommande une destination."
5. "Fiabilise le chatbot multi-tour avec retry, gestion d'erreurs et fallback."

## Crédits

- Visuels des destinations : Session 1 (groupe projet)
- Vidéo hero vortex : YouTube (lien fourni pendant le développement)
- Librairies : React, Vite, Tailwind, Framer Motion, Lucide
- API IA : Mistral, OpenRouter (fallback)

## Réflexion sur le processus

Le projet a été construit par itérations courtes orientées critères d'évaluation : structure front d'abord, puis UX/UI, puis IA et enfin durcissement production. Le principal défi a été la fiabilité conversationnelle en public (quotas, erreurs API, continuité de session). Pour y répondre, nous avons ajouté un mode agent Mistral avec conservation du `conversation_id`, des retries, et des fallbacks explicites pour éviter une expérience trompeuse. La partie responsive a aussi été ajustée (badges de risque, lisibilité mobile, widget chat). Cette approche a permis de garder une webapp stable, cohérente et démontrable pour la soutenance.
