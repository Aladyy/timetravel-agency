import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock3, Send, Sparkles, Ticket } from 'lucide-react'
import { destinations } from './data/destinations'
import { getAssistantModeLabel, getAssistantReply } from './utils/chatAssistant'

const quizQuestions = [
  {
    id: 'vibe',
    question: 'Quelle ambiance vous attire le plus ?',
    options: [
      { label: 'Soirées élégantes et culture', destinationId: 'paris-1889' },
      { label: 'Nature sauvage et adrénaline', destinationId: 'cretace' },
      { label: 'Art et patrimoine', destinationId: 'florence-1504' },
    ],
  },
  {
    id: 'pace',
    question: 'Quel rythme de voyage préférez-vous ?',
    options: [
      { label: 'Détente chic', destinationId: 'paris-1889' },
      { label: 'Exploration intense', destinationId: 'cretace' },
      { label: 'Immersion intellectuelle', destinationId: 'florence-1504' },
    ],
  },
  {
    id: 'group',
    question: 'Vous voyagez avec ?',
    options: [
      { label: 'Mon partenaire', destinationId: 'paris-1889' },
      { label: 'Mes amis aventuriers', destinationId: 'cretace' },
      { label: 'Ma famille curieuse', destinationId: 'florence-1504' },
    ],
  },
  {
    id: 'memory',
    question: 'Quel souvenir voulez-vous ramener ?',
    options: [
      { label: 'Une soirée inoubliable', destinationId: 'paris-1889' },
      { label: 'Un récit épique', destinationId: 'cretace' },
      { label: 'Un carnet de croquis', destinationId: 'florence-1504' },
    ],
  },
]

const MotionParagraph = motion.p
const MotionHeading = motion.h1
const MotionDiv = motion.div
const MotionArticle = motion.article
const backgroundVideoId = 'XGPQLV2uz7k'
const backgroundVideoUrl = `https://www.youtube.com/embed/${backgroundVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${backgroundVideoId}&modestbranding=1&rel=0&playsinline=1`
const riskStyles = {
  Faible: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
  Moyen: 'border-amber-300/45 bg-amber-300/10 text-amber-200',
  Élevé: 'border-rose-300/45 bg-rose-300/10 text-rose-200',
}

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Bienvenue chez TimeTravel Agency. Je suis votre assistant de luxe passionné d'histoire. Quelle époque souhaitez-vous explorer ?",
    },
  ])
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const assistantModeLabel = getAssistantModeLabel()

  const totalQuestions = quizQuestions.length
  const answeredCount = Object.keys(quizAnswers).length
  const isQuizComplete = answeredCount === totalQuestions
  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progressPercent = (answeredCount / totalQuestions) * 100

  const recommendation = useMemo(() => {
    const picks = Object.values(quizAnswers)
    if (picks.length !== totalQuestions) return null

    const scoreMap = picks.reduce((acc, destinationId) => {
      acc[destinationId] = (acc[destinationId] || 0) + 1
      return acc
    }, {})

    const bestId = Object.entries(scoreMap).sort((a, b) => b[1] - a[1])[0]?.[0]
    return destinations.find((destination) => destination.id === bestId) || null
  }, [quizAnswers, totalQuestions])

  const bookingLink = '#reservation'

  async function handleSendMessage() {
    const text = inputValue.trim()
    if (!text || isSending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInputValue('')
    setIsSending(true)

    const assistantReply = await getAssistantReply(nextMessages)
    setMessages((current) => [...current, { role: 'assistant', content: assistantReply }])
    setIsSending(false)
  }

  function handleSelectAnswer(optionDestinationId) {
    if (!currentQuestion) return

    setQuizAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionDestinationId,
    }))

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((index) => index + 1)
    }
  }

  function handleBackQuestion() {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1))
  }

  function handleRestartQuiz() {
    setQuizAnswers({})
    setCurrentQuestionIndex(0)
  }

  return (
    <div className="min-h-screen bg-onyx text-ivory">
      <header className="sticky top-0 z-30 border-b border-gold/20 bg-onyx/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold text-gold">
            <Clock3 className="h-5 w-5" />
            TimeTravel Agency
          </a>
          <div className="hidden items-center gap-6 text-sm text-ivory/85 md:flex">
            <a href="#destinations" className="transition hover:text-gold">
              Destinations
            </a>
            <a href="#quiz" className="transition hover:text-gold">
              Quiz
            </a>
            <a href="#reservation" className="transition hover:text-gold">
              Réservation
            </a>
          </div>
          <a
            href={bookingLink}
            className="rounded-full border border-gold/50 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-onyx"
          >
            Réserver
          </a>
        </nav>
      </header>

      <main className="pb-24">
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <iframe
              src={backgroundVideoUrl}
              title="Fond vidéo vortex"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-125 opacity-65 blur-[1px]"
            />
            <div className="absolute inset-0 bg-onyx/76 backdrop-brightness-50 backdrop-saturate-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.24),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(120,113,255,0.22),transparent_30%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-onyx/55 via-onyx/35 to-onyx/65" />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-7 px-5 py-20 lg:py-28">
            <MotionParagraph
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-fit rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm text-gold"
            >
              Voyage temporel premium
            </MotionParagraph>
            <MotionHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl"
            >
              Explorez les époques mythiques avec un service de conciergerie d'exception.
            </MotionHeading>
            <MotionParagraph
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-lg text-ivory/80"
            >
              De Paris 1889 aux jungles du Crétacé, TimeTravel Agency vous propose des
              itinéraires immersifs, sécurisés et personnalisés.
            </MotionParagraph>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl rounded-2xl border border-gold/35 bg-black/25 p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
                <p className="text-sm font-medium text-gold">Assistant IA disponible en direct</p>
              </div>
              <p className="text-sm text-ivory/85">
                Posez vos questions sur les époques, le budget et la sécurité. L'assistant
                recommande la meilleure destination selon votre profil voyageur.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="rounded-full border border-gold/60 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-onyx"
                >
                  Ouvrir le chatbot IA
                </button>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-ivory/75">
                  Ex: "Quel voyage pour un budget de 5000 ?"
                </span>
              </div>
            </MotionDiv>
          </div>
        </section>

        <section id="destinations" className="mx-auto w-full max-w-6xl px-5 py-14">
          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-end justify-between"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-gold/80">Collection 2026</p>
              <h2 className="mt-2 text-3xl font-semibold">Nos destinations signatures</h2>
            </div>
          </MotionDiv>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {destinations.map((destination, index) => (
              <MotionArticle
                key={destination.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-midnight/80 shadow-xl shadow-black/25"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <span
                    className={`absolute right-3 top-3 z-10 shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${riskStyles[destination.riskLevel] ?? 'border-gold/35 bg-gold/10 text-gold'}`}
                  >
                    Risque : {destination.riskLevel}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-onyx/70 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col space-y-4 p-5">
                  <div className="text-sm text-ivory/75">
                    <span className="line-clamp-2 leading-5">{destination.era}</span>
                  </div>
                  <h3 className="text-2xl font-semibold">{destination.title}</h3>
                  <p className="text-sm leading-6 text-ivory/70">{destination.description}</p>
                  <p className="mt-auto rounded-xl border border-gold/20 bg-gold/5 px-3 py-2 text-sm text-gold/95">
                    {destination.atmosphere}
                  </p>
                </div>
              </MotionArticle>
            ))}
          </div>
        </section>

        <section id="quiz" className="mx-auto w-full max-w-6xl px-5 py-14">
          <MotionDiv
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gold/30 bg-gradient-to-br from-midnight/90 to-onyx p-6 md:p-8"
          >
            <div className="mb-8 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-gold" />
              <h2 className="text-2xl font-semibold">Mini-quiz de recommandation</h2>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-xs text-ivory/70">
                <span>
                  {isQuizComplete
                    ? `${totalQuestions}/${totalQuestions} questions`
                    : `Question ${currentQuestionIndex + 1}/${totalQuestions}`}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {!isQuizComplete ? (
              <MotionDiv
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 rounded-2xl bg-white/5 p-5"
              >
                <p className="text-base font-medium text-ivory/95">{currentQuestion.question}</p>

                <div className="flex flex-col gap-2">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleSelectAnswer(option.destinationId)}
                      className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                        quizAnswers[currentQuestion.id] === option.destinationId
                          ? 'border-gold/70 bg-gold/10 text-gold'
                          : 'border-white/15 text-ivory/80 hover:border-gold/35 hover:text-ivory'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleBackQuestion}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs text-ivory/80 transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={currentQuestionIndex === 0}
                  >
                    Question précédente
                  </button>
                </div>
              </MotionDiv>
            ) : null}

            <div
              id="reservation"
              className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-ivory/90"
            >
              {recommendation ? (
                <p>
                  Recommandation IA : <strong>{recommendation.title}</strong>. C'est votre meilleure
                  correspondance selon vos réponses. Cliquez sur Réserver pour simuler votre
                  expédition premium.
                </p>
              ) : (
                <p>
                  Répondez étape par étape au quiz pour obtenir une recommandation personnalisée.
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-4 py-2 font-medium text-gold transition hover:bg-gold hover:text-onyx disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!recommendation}
                >
                  <Ticket className="h-4 w-4" />
                  Simuler ma réservation
                </button>
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs text-ivory/85 transition hover:border-gold/40 hover:text-gold"
                >
                  Recommencer le quiz
                </button>
              </div>
            </div>
          </MotionDiv>
        </section>
      </main>

      <div className="fixed bottom-4 right-4 z-50 md:bottom-5 md:right-5">
        <AnimatePresence initial={false}>
          {chatOpen ? (
            <MotionDiv
              key="chat-box"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="mb-3 flex h-[460px] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-3xl border border-gold/35 bg-[#12131dcc] shadow-2xl shadow-black/45 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-medium text-gold">Assistant TimeTravel</p>
                  <p className="text-xs text-ivory/70">
                    Luxe, histoire et recommandations - {assistantModeLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="mt-0.5 shrink-0 whitespace-nowrap text-sm text-ivory/70 transition hover:text-gold"
                >
                  Fermer
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      message.role === 'assistant'
                        ? 'bg-gold/15 text-ivory'
                        : 'ml-auto bg-white/10 text-ivory'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isSending && <p className="text-xs text-ivory/60">Assistant en train d'écrire...</p>}
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        void handleSendMessage()
                      }
                    }}
                    placeholder="Posez votre question..."
                    className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-ivory placeholder:text-ivory/50 focus:border-gold/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    className="rounded-full bg-gold p-2 text-onyx transition hover:brightness-110 disabled:opacity-40"
                    disabled={!inputValue.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </MotionDiv>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col items-end gap-2">
          {!chatOpen ? (
            <div className="rounded-full border border-gold/30 bg-onyx/80 px-3 py-1 text-[11px] text-gold backdrop-blur-sm">
              IA en ligne - Posez vos questions
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setChatOpen((open) => !open)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-gold text-onyx shadow-lg shadow-black/30 transition hover:scale-105"
            aria-label="Ouvrir le chatbot"
          >
            {!chatOpen ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-onyx" />
            ) : null}
            <span className="absolute inset-0 rounded-full bg-gold/50 opacity-0 blur-md transition group-hover:opacity-100" />
            <Sparkles className="relative h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
