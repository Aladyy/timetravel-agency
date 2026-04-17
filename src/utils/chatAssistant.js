const SYSTEM_PROMPT =
  "Tu es l'expert de TimeTravel Agency. Tu connais Paris 1889, le Crétacé et Florence 1504. Réponds de manière chaleureuse et professionnelle, avec une touche luxe."

const localKnowledge = {
  'paris 1889':
    'Paris 1889 est parfait pour une escapade élégante : inauguration de la Tour Eiffel, ambiance Belle Époque et soirées culturelles exclusives.',
  cretace:
    'Le Crétacé convient aux voyageurs en quête de sensations fortes. Nous proposons des capsules de protection et des guides spécialisés en paléo-sécurité.',
  'florence 1504':
    "Florence 1504 est idéale pour les amateurs d'art et d'histoire, avec accès privilégié aux ateliers de la Renaissance.",
}

function getLocalReply(message) {
  const lower = message.toLowerCase()

  if (lower.includes('prix') || lower.includes('tarif') || lower.includes('budget')) {
    return 'Nos expériences débutent à 4 900 crédits temporels. Le tarif inclut transport chronologique, assurance paradoxale et concierge premium.'
  }

  if (lower.includes('paris')) return localKnowledge['paris 1889']
  if (lower.includes('cretace') || lower.includes('dino')) return localKnowledge.cretace
  if (lower.includes('florence') || lower.includes('renaissance'))
    return localKnowledge['florence 1504']

  if (lower.includes('bonjour') || lower.includes('salut')) {
    return 'Bienvenue chez TimeTravel Agency. Je peux vous guider vers Paris 1889, le Crétacé ou Florence 1504 selon votre style de voyage.'
  }

  return 'Je vous recommande de me parler de vos envies (aventure, art, romantisme, budget) pour vous proposer la destination temporelle idéale.'
}

function getAssistantMode() {
  const externalApiUrl = import.meta.env.VITE_CHAT_API_URL
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (externalApiUrl) return 'proxy'
  if (apiKey) return 'direct'
  return 'local'
}

export function getAssistantModeLabel() {
  const mode = getAssistantMode()
  if (mode === 'proxy') return 'Mode API sécurisé'
  if (mode === 'direct') return 'Mode API direct'
  return 'Mode local (sans API)'
}

export async function getAssistantReply(history) {
  const externalApiUrl = import.meta.env.VITE_CHAT_API_URL
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const userMessage = history[history.length - 1]?.content ?? ''

  if (externalApiUrl) {
    try {
      const response = await fetch(externalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          history,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data?.reply?.trim?.()
        if (reply) return reply
      }
    } catch {
      // En cas d'echec du backend externe, on retombe en mode local.
    }
  }

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const reply = data?.choices?.[0]?.message?.content?.trim()
        if (reply) return reply
      }
    } catch {
      // En cas d'echec reseau API, on retombe en mode local.
    }
  }

  return getLocalReply(userMessage)
}
