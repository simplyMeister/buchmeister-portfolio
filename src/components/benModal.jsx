import { useState, useEffect, useCallback } from 'react'

const ANSWERS = {
  'who is benedict': `Onyeachonam Buchi is a Frontend Developer based in Nigeria. He builds systems that change how people live, act, think, and move. He is currently a Fullstack Engineer at Rceet Technologies, focused on creating premium digital experiences.`,
  'what are his skills': `Buchi is highly skilled in Frontend development, including React, Vite, Framer Motion, and Tailwind CSS. He also has Fullstack capabilities and specializes in creating smooth, high-performance user interfaces.`,
  'show me his projects': `Buchi has worked on several projects including: Portfolio Page (Vite/React/Framer), Protocol Bot (administrative Telegram bot), Eco-tech (sustainability platform), PingSite-Sheraton (IP tracking & monitoring), Rceet Technologies (educational tech), and the Titanic survival prediction model.`,
  'how can i contact him': `You can reach Buchi via email at bonyeachonam.2200323@stu.cu.edu.ng. He is always open to discussing new projects and creative collaborations.`,
  'what is his experience': `Buchi is currently a Fullstack Engineer at Rceet Technologies. His previous experience includes roles at Sheraton Hotels and 21st Century Evolutions Systems.`,
  'show me his github': `Buchi's GitHub is at github.com/simplyMeister — explore his repositories to see his code work.`,
  'show me his linkedin': `Connect with Buchi on LinkedIn at linkedin.com/in/benedict-onyeachonam.`,
  'where is he based': `Buchi is based in Nigeria, working on global digital solutions.`,
  'can i play tic tac toe': `Yes! Head over to the bottom right corner of the page — there's a little grid icon next to the social links. Click it and the game pops up. Good luck 😏`,
  'can i win the tic tac toe': `You can try, but i highly doubt you can.`,
}

const SUGGESTIONS = Object.keys(ANSWERS)

export default function BenModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [typing, setTyping] = useState(false)

  const filtered = query
    ? SUGGESTIONS.filter(s => s.includes(query.toLowerCase()))
    : SUGGESTIONS

  const handleSelect = useCallback((suggestion) => {
    const ans = ANSWERS[suggestion]
    if (!ans) return
    setTyping(true)
    setAnswer(null)
    setTimeout(() => {
      setAnswer(ans)
      setTyping(false)
    }, 400)
    setQuery(suggestion)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setActiveIndex(i => Math.max(i - 1, 0))
      if (e.key === 'Enter' && filtered[activeIndex]) handleSelect(filtered[activeIndex])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered, activeIndex, handleSelect, onClose])

  return (
    <div className="ben-overlay" onClick={onClose}>
      <div className="ben-modal" onClick={e => e.stopPropagation()}>
        {/* Input bar */}
        <div className="ben-input-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <input
            autoFocus
            placeholder="Ask Benedict something..."
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); setAnswer(null) }}
          />
          <span style={{ fontSize: 11, color: '#9ca3af', border: '1px solid #d1d5db', borderRadius: 4, padding: '2px 6px' }}>
            esc to close
          </span>
        </div>

        {/* Intro text */}
        {!answer && !typing && (
          <div className="ben-intro">
            I am Benedict, Buchi's digital assistant. At your service.
            <div className="ben-attribution">— Benedict</div>
          </div>
        )}

        {/* Typing */}
        {typing && (
          <div className="ben-answer" style={{ color: '#9ca3af' }}>
            I'm listening...
          </div>
        )}

        {/* Answer */}
        {answer && (
          <div className="ben-answer">{answer}</div>
        )}

        {/* Suggestions */}
        <div className="ben-suggestions">
          {filtered.map((s, i) => (
            <div
              key={s}
              className={`ben-suggestion-item ${i === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span>{s}</span>
              {i === activeIndex && <span className="enter-hint">↵</span>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="ben-footer">
          <span>↑↓ navigate</span>
          <span>I'm listening...</span>
        </div>
      </div>
    </div>
  )
}
