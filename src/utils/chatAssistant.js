const SYSTEM_PROMPT =
  "Tu es l'expert de TimeTravel Agency. Tu connais Paris 1889, le Crétacé et Florence 1504. Réponds de manière chaleureuse et professionnelle, avec une touche luxe."
const MAX_HISTORY_MESSAGES = 12

const localKnowledge = {
  'paris 1889':
    'Paris 1889 est parfait pour une escapade élégante : inauguration de la Tour Eiffel, ambiance Belle Époque et soirées culturelles exclusives.',
  cretace:
    'Le Crétacé convient aux voyageurs en quête de sensations fortes. Nous proposons des capsules de protection et des guides spécialisés en paléo-sécurité.',
  'florence 1504':
    "Florence 1504 est idéale pour les amateurs d'art et d'histoire, avec accès privilégié aux ateliers de la Renaissance.",
}

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getRecentHistory(history) {
  return history.slice(-MAX_HISTORY_MESSAGES)
}

async function safeJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractReplyFromChoice(data) {
  const content = data?.choices?.[0]?.message?.content
  if (typeof content === 'string') return content.trim()
  if (Array.isArray(content)) {
    return content
      .map((item) => item?.text || '')
      .join(' ')
      .trim()
  }
  return ''
}

async function postWithRetry(url, options, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response

      // Retry on transient errors and quota burst.
      if ((response.status === 429 || response.status >= 500) && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
        continue
      }
      return response
    } catch {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
        continue
      }
      return null
    }
  }

  return null
}

function getLocalReply(message) {
  const lower = normalizeText(message)

  if (lower.includes('prix') || lower.includes('tarif') || lower.includes('budget')) {
    return 'Nos expériences débutent à 4 900 crédits temporels. Le tarif inclut transport chronologique, assurance paradoxale et concierge premium.'
  }

  if (lower.includes('reservation') || lower.includes('reserver') || lower.includes('booking')) {
    return "Très bon choix. Pour réserver, indiquez-moi la destination, le nombre de voyageurs et votre fenêtre temporelle préférée. Je vous propose ensuite une formule premium adaptée."
  }

  if (lower.includes('conseil') || lower.includes('recommande') || lower.includes('choisir')) {
    return "Si vous aimez l'élégance et la culture, Paris 1889 est idéal. Pour l'aventure pure, le Crétacé est imbattable. Si vous préférez l'art et le patrimoine, Florence 1504 est la meilleure option."
  }

  if (lower.includes('securite') || lower.includes('danger') || lower.includes('risque')) {
    return "Nos circuits sont encadrés par un protocole de sécurité temporelle strict : balise de rappel chronologique, guide certifié et assurance paradoxale incluse."
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
  const mistralKey = import.meta.env.VITE_MISTRAL_API_KEY
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (externalApiUrl) return 'proxy'
  if (mistralKey) return 'mistral'
  if (openRouterKey) return 'openrouter-free'
  if (apiKey) return 'direct'
  return 'local'
}

export function getAssistantModeLabel() {
  const mode = getAssistantMode()
  if (mode === 'proxy') return 'Mode API sécurisé'
  if (mode === 'mistral') return 'Mode IA Mistral Small'
  if (mode === 'openrouter-free') return 'Mode IA gratuit (OpenRouter)'
  if (mode === 'direct') return 'Mode API direct'
  return 'Mode local (sans API)'
}

export async function getAssistantReply(history) {
  const externalApiUrl = import.meta.env.VITE_CHAT_API_URL
  const mistralKey = import.meta.env.VITE_MISTRAL_API_KEY
  const mistralModel = import.meta.env.VITE_MISTRAL_MODEL || 'mistral-small-latest'
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const openRouterModel =
    import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free'
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  const userMessage = history[history.length - 1]?.content ?? ''
  const recentHistory = getRecentHistory(history)
  const openRouterModels = [
    openRouterModel,
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
  ]
  let hasExternalMode = false

  if (externalApiUrl) {
    hasExternalMode = true
    const response = await postWithRetry(
      externalApiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          history: recentHistory,
        }),
      },
      1,
    )

    if (response?.ok) {
      const data = await safeJson(response)
      const reply = data?.reply?.trim?.()
      if (reply) return reply
    }
  }

  if (mistralKey) {
    hasExternalMode = true
    const response = await postWithRetry(
      'https://api.mistral.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mistralKey}`,
        },
        body: JSON.stringify({
          model: mistralModel,
          temperature: 0.7,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...recentHistory],
        }),
      },
      1,
    )

    if (response?.ok) {
      const data = await safeJson(response)
      const reply = extractReplyFromChoice(data)
      if (reply) return reply
    }
  }

  if (openRouterKey) {
    hasExternalMode = true
    for (const model of openRouterModels) {
      const response = await postWithRetry(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openRouterKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'TimeTravel Agency',
          },
          body: JSON.stringify({
            model,
            temperature: 0.7,
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...recentHistory],
          }),
        },
        1,
      )

      if (response?.ok) {
        const data = await safeJson(response)
        const reply = extractReplyFromChoice(data)
        if (reply) return reply
      }
    }
  }

  if (apiKey) {
    hasExternalMode = true
    const response = await postWithRetry(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...recentHistory],
        }),
      },
      1,
    )

    if (response?.ok) {
      const data = await safeJson(response)
      const reply = extractReplyFromChoice(data)
      if (reply) return reply
    }
  }

  if (hasExternalMode) {
    return "Je rencontre un souci temporaire avec le service IA (quota, indisponibilité ou clé). Réessayez dans quelques secondes ou vérifiez la configuration API."
  }

  return getLocalReply(userMessage)
}
