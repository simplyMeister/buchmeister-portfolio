import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Zap, Ghost, Bomb } from 'lucide-react'

const GRID_SIZE = 9 // 3x3

function BenedictFace({ size = 30 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
       <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="45" fill="#1a1a1a" />
          <circle cx="35" cy="40" r="5" fill="white" />
          <circle cx="65" cy="40" r="5" fill="white" />
          <path d="M30 70 Q50 85 70 70" stroke="white" strokeWidth="4" fill="none" />
          <circle cx="65" cy="40" r="10" stroke="gold" strokeWidth="2" fill="none" />
       </svg>
    </div>
  )
}

function WhackAMoleGame({ accentColor }) {
  const [holes, setHoles] = useState(Array(GRID_SIZE).fill(null))
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [taunt, setTaunt] = useState("Ready to fail?")
  
  const timerRef = useRef(null)
  const gameLoopRef = useRef(null)

  const taunts = [
    "Too slow, obviously.",
    "Did you even click?",
    "I'm bored waiting for you.",
    "My grandmother whacks faster.",
    "Calculated avoidance.",
    "Was that a sneeze or a click?"
  ]

  const spawn = useCallback(() => {
    if (gameOver || !isActive) return

    setHoles(Array(GRID_SIZE).fill(null))
    
    const idx = Math.floor(Math.random() * GRID_SIZE)
    const typeRoll = Math.random()
    let type = 'benedict'
    
    if (score > 10 && typeRoll < 0.2) type = 'bomb'
    else if (score > 5 && typeRoll < 0.4) type = 'fake'

    const newHoles = Array(GRID_SIZE).fill(null)
    newHoles[idx] = type
    setHoles(newHoles)

    const duration = Math.max(300, 1000 - score * 40)
    const realDuration = (type === 'benedict' && score > 8 && Math.random() < 0.3) 
      ? duration * 0.4 
      : duration

    gameLoopRef.current = setTimeout(() => {
      setHoles(Array(GRID_SIZE).fill(null))
      if (type === 'benedict' && Math.random() < 0.3) {
          setTaunt(taunts[Math.floor(Math.random() * taunts.length)])
      }
      const delay = Math.max(100, 500 - score * 20)
      gameLoopRef.current = setTimeout(spawn, delay)
    }, realDuration)

  }, [gameOver, isActive, score])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameOver(false)
    setIsActive(true)
    setTaunt("Try to keep up.")
    setHoles(Array(GRID_SIZE).fill(null))
  }

  const handleWhack = (idx, type) => {
    if (!isActive || gameOver || !type) return

    if (type === 'benedict') {
      setScore(s => s + 1)
      setTaunt("Luck.")
    } else if (type === 'bomb') {
      setScore(s => Math.max(0, s - 5))
      setTaunt("BOOM. Watch it.")
    } else if (type === 'fake') {
      setScore(s => Math.max(0, s - 2))
      setTaunt("Distracted?")
    }

    clearTimeout(gameLoopRef.current)
    setHoles(Array(GRID_SIZE).fill(null))
    spawn()
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setGameOver(true)
      clearInterval(timerRef.current)
      setHoles(Array(GRID_SIZE).fill(null))
    }
    return () => clearInterval(timerRef.current)
  }, [isActive, timeLeft])

  useEffect(() => {
    if (isActive && !gameOver) {
      spawn()
    }
    return () => clearTimeout(gameLoopRef.current)
  }, [isActive, gameOver])

  const reset = () => {
    setIsActive(false)
    setGameOver(false)
    setScore(0)
    setTimeLeft(30)
    setHoles(Array(GRID_SIZE).fill(null))
    clearTimeout(gameLoopRef.current)
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2, height: 12, overflow: 'hidden' }}>
            <motion.span key={taunt} initial={{ y: 10 }} animate={{ y: 0 }}>{taunt}</motion.span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: accentColor }}>Score: {score}</span>
            <span style={{ opacity: 0.8 }}>Time: {timeLeft}s</span>
          </div>
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor }}>
           <RotateCcw size={14} />
        </button>
      </div>

      <div style={{ 
        position: 'relative',
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        background: '#1a1a1a', 
        padding: 8, 
        borderRadius: 8,
        gap: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        width: 140,
        margin: '0 auto'
      }}>
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 10,
                background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 10, borderRadius: 8
              }}
            >
              <h3 style={{ color: score > 15 ? accentColor : '#ef4444', fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                {score > 15 ? "Fine. Not bad." : "I win again,\nyou loose"}
              </h3>
              <button onClick={startGame} style={{ padding: '4px 8px', background: 'white', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                Retry
              </button>
            </motion.div>
          )}

          {!isActive && !gameOver && (
             <motion.div
               style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', borderRadius: 8 }}
             >
               <button onClick={startGame} style={{ padding: '6px 12px', background: accentColor, color: 'white', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                 Start Game
               </button>
             </motion.div>
          )}
        </AnimatePresence>

        {holes.map((cell, i) => (
          <div 
            key={i}
            style={{
              width: 36, height: 36,
              background: '#2a2a2a',
              borderRadius: '50%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            <AnimatePresence>
              {cell && (
                <motion.div
                  initial={{ y: 40 }} animate={{ y: 5 }} exit={{ y: 40 }}
                  onClick={() => handleWhack(i, cell)}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {cell === 'benedict' && <BenedictFace size={24} />}
                  {cell === 'fake' && <Ghost size={20} color="#9ca3af" />}
                  {cell === 'bomb' && <Bomb size={20} color="#ef4444" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhackAMoleIconInner({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
       <path d="M2,11H7V16H2V11M8,11H13V16H8V11M14,11H19V16H14V11M8,5H13V10H8V5Z" />
    </svg>
  )
}

export default function WhackAMoleIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Whack-A-Benedict"
        style={{
          background: 'none', border: 'none', padding: 0,
          color: color || '#9ca3af', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.8s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
         <WhackAMoleIconInner size={18} />
      </button>

      <AnimatePresence>
        {open && (
           <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{
                position: 'fixed', bottom: 64, right: 320,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                width: 170
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 12, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} fill={color} stroke="none" />
                  <span>Whack Benedict</span>
                </div>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5, fontSize: 16 }}>×</span>
              </div>
              <WhackAMoleGame accentColor={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
