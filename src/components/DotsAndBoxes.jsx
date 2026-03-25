import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

const SIZE = 6 // 6x6 boxes, 7x7 dots
const PLAYER = 'P'
const AI = 'A'

function DotsAndBoxesGame({ color }) {
  const [hEdges, setHEdges] = useState(Array(SIZE + 1).fill(null).map(() => Array(SIZE).fill(null)))
  const [vEdges, setVEdges] = useState(Array(SIZE).fill(null).map(() => Array(SIZE + 1).fill(null)))
  const [boxes, setBoxes] = useState(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)))
  const [turn, setTurn] = useState(PLAYER)
  const [winner, setWinner] = useState(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [lockedColor, setLockedColor] = useState(color)

  const pScore = boxes.flat().filter(s => s === PLAYER).length
  const aScore = boxes.flat().filter(s => s === AI).length

  useEffect(() => {
    if (hEdges.every(r => r.every(e => e === null))) {
        setLockedColor(color)
    }
  }, [color])

  const checkBoxes = (h, v, b, r, c, side) => {
    let newBox = false
    const newB = b.map(row => [...row])
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (!newB[i][j] && h[i][j] && h[i+1][j] && v[i][j] && v[i][j+1]) {
          newB[i][j] = side
          newBox = true
        }
      }
    }
    return { newB, newBox }
  }

  const handleEdgeClick = (type, r, c) => {
    if (turn !== PLAYER || winner || isAiThinking) return
    if (type === 'h' && hEdges[r][c]) return
    if (type === 'v' && vEdges[r][c]) return

    const nextH = hEdges.map(row => [...row])
    const nextV = vEdges.map(row => [...row])
    if (type === 'h') nextH[r][c] = PLAYER
    else nextV[r][c] = PLAYER

    const { newB, newBox } = checkBoxes(nextH, nextV, boxes, r, c, PLAYER)
    
    setHEdges(nextH)
    setVEdges(nextV)
    setBoxes(newB)

    if (!newBox) {
      setTurn(AI)
    } else {
      if (newB.flat().every(box => box !== null)) {
        const pS = newB.flat().filter(s => s === PLAYER).length
        const aS = newB.flat().filter(s => s === AI).length
        if (pS === aS) setWinner('DRAW')
        else setWinner(pS > aS ? PLAYER : AI)
      }
    }
  }

  useEffect(() => {
    if (turn === AI && !winner) {
      setIsAiThinking(true)
      const timer = setTimeout(() => {
        const nextH = hEdges.map(row => [...row])
        const nextV = vEdges.map(row => [...row])
        const nextB = boxes.map(row => [...row])

        const tryMove = () => {
            // 1. Can we close a box?
            for (let i=0; i<SIZE; i++) {
                for (let j=0; j<SIZE; j++) {
                    let count = 0
                    let missing = null
                    if (nextH[i][j]) count++; else missing = {type:'h', r:i, c:j};
                    if (nextH[i+1][j]) count++; else missing = {type:'h', r:i+1, c:j};
                    if (nextV[i][j]) count++; else missing = {type:'v', r:i, c:j};
                    if (nextV[i][j+1]) count++; else missing = {type:'v', r:i, c:j+1};
                    
                    if (count === 3) {
                        if (missing.type === 'h') nextH[missing.r][missing.c] = AI
                        else nextV[missing.r][missing.c] = AI
                        return true
                    }
                }
            }

            // 2. Avoid creating a "box in 3" for player
            const safeMoves = []
            const neutralMoves = []
            
            const evaluateMove = (t, r, c) => {
                const h = nextH.map(row => [...row])
                const v = nextV.map(row => [...row])
                if (t === 'h') h[r][c] = AI; else v[r][c] = AI
                
                let risky = false
                for (let i=0; i<SIZE; i++) {
                    for (let j=0; j<SIZE; j++) {
                        let count = 0
                        if (h[i][j]) count++
                        if (h[i+1][j]) count++
                        if (v[i][j]) count++
                        if (v[i][j+1]) count++
                        if (count === 3) risky = true
                    }
                }
                return !risky
            }

            for (let i=0; i<=SIZE; i++){
                for (let j=0; j<SIZE; j++) {
                    if (!nextH[i][j]) {
                        if (evaluateMove('h', i, j)) safeMoves.push({type:'h', r:i, c:j})
                        else neutralMoves.push({type:'h', r:i, c:j})
                    }
                    if (i < SIZE && !nextV[j][i]) { 
                         if (evaluateMove('v', j, i)) safeMoves.push({type:'v', r:j, c:i})
                         else neutralMoves.push({type:'v', r:j, c:i})
                    }
                }
            }

            const candidates = safeMoves.length > 0 ? safeMoves : neutralMoves
            if (candidates.length > 0) {
                const move = candidates[Math.floor(Math.random() * candidates.length)]
                if (move.type === 'h') nextH[move.r][move.c] = AI
                else nextV[move.r][move.c] = AI
                return true
            }
            return false
        }

        let currentB = nextB
        let aiClosedAny = false
        
        const performAiMoves = () => {
            const closed = tryMove()
            if (!closed) return false
            const res = checkBoxes(nextH, nextV, currentB, 0, 0, AI)
            if (res.newBox) {
                currentB = res.newB
                aiClosedAny = true
                if (currentB.flat().every(box => box !== null)) return false
                return true // Continue if box closed
            }
            return false
        }

        while (performAiMoves());

        setHEdges(nextH)
        setVEdges(nextV)
        setBoxes(currentB)
        
        if (currentB.flat().every(box => box !== null)) {
            const pS = currentB.flat().filter(s => s === PLAYER).length
            const aS = currentB.flat().filter(s => s === AI).length
            if (pS === aS) setWinner('DRAW')
            else setWinner(pS > aS ? PLAYER : AI)
        } else if (!aiClosedAny) {
            setTurn(PLAYER)
        } else {
            // If AI closed a box but still has moves, it actually keeps turn in while loop logically, 
            // but we need to ensure the turn shifts back if no more moves can be made for AI.
            // The while loop above handles the greedy part.
            setTurn(PLAYER) 
        }
        setIsAiThinking(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [turn, winner, hEdges, vEdges, boxes])

  const reset = () => {
    setHEdges(Array(SIZE + 1).fill(null).map(() => Array(SIZE).fill(null)))
    setVEdges(Array(SIZE).fill(null).map(() => Array(SIZE + 1).fill(null)))
    setBoxes(Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)))
    setTurn(PLAYER)
    setWinner(null)
    setLockedColor(color)
  }

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{winner ? (winner === 'DRAW' ? "It's a Draw!" : `Winner: ${winner === PLAYER ? 'You!' : 'AI'}`) : (turn === PLAYER ? 'Your Turn' : 'Benedict is thinking...')}</span>
          <div style={{ display: 'flex', gap: 8, opacity: 0.8 }}>
            <span style={{ color: lockedColor }}>You: {pScore}</span>
            <span style={{ color: '#ef4444' }}>AI: {aScore}</span>
          </div>
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: lockedColor }}>
          <RotateCcw size={14} />
        </button>
      </div>

      <div style={{ 
        position: 'relative',
        background: '#1a1a1a', 
        padding: 16, 
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'inline-block'
      }}>
        <AnimatePresence>
            {winner && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center', padding: 20, borderRadius: 8
                    }}
                >
                    <h3 style={{ color: winner === AI ? '#ef4444' : (winner === 'DRAW' ? '#9ca3af' : lockedColor), fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
                        {winner === AI ? 'I win again,\nyou loose' : (winner === 'DRAW' ? "It's a Draw!" : 'You won?!')}
                    </h3>
                    <div style={{ fontSize: 12, color: '#fff', marginBottom: 16, opacity: 0.8 }}>
                        Final Score: {pScore} - {aScore}
                    </div>
                    <button onClick={reset} style={{ padding: '8px 16px', background: 'white', color: '#1a1a1a', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Play Again
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        <div style={{ position: 'relative' }}>
          {boxes.map((row, r) => row.map((box, c) => (
            <motion.div
              key={`box-${r}-${c}`}
              initial={{ scale: 0 }}
              animate={{ scale: box ? 1 : 0 }}
              style={{
                position: 'absolute',
                top: r * 32 + 4,
                left: c * 32 + 4,
                width: 24,
                height: 24,
                background: box === PLAYER ? lockedColor : '#ef4444',
                opacity: 0.2,
                borderRadius: 2
              }}
            />
          )))}

          {hEdges.map((row, r) => row.map((edge, c) => (
            <div
              key={`h-${r}-${c}`}
              onClick={() => handleEdgeClick('h', r, c)}
              style={{
                position: 'absolute',
                top: r * 32 - 2,
                left: c * 32 + 4,
                width: 24,
                height: 4,
                background: edge ? (edge === PLAYER ? lockedColor : '#ef4444') : '#333',
                cursor: !edge ? 'pointer' : 'default',
                borderRadius: 2,
                transition: 'background 0.3s'
              }}
            />
          )))}

          {vEdges.map((row, r) => row.map((edge, c) => (
            <div
              key={`v-${r}-${c}`}
              onClick={() => handleEdgeClick('v', r, c)}
              style={{
                position: 'absolute',
                top: r * 32 + 4,
                left: c * 32 - 2,
                width: 4,
                height: 24,
                background: edge ? (edge === PLAYER ? lockedColor : '#ef4444') : '#333',
                cursor: !edge ? 'pointer' : 'default',
                borderRadius: 2,
                transition: 'background 0.3s'
              }}
            />
          )))}

          {Array(SIZE + 1).fill(0).map((_, r) => Array(SIZE + 1).fill(0).map((_, c) => (
            <div
              key={`dot-${r}-${c}`}
              style={{
                position: 'absolute',
                top: r * 32 - 2,
                left: c * 32 - 2,
                width: 4,
                height: 4,
                background: '#666',
                borderRadius: '50%'
              }}
            />
          )))}
          
          <div style={{ width: SIZE * 32, height: SIZE * 32 }} />
        </div>
      </div>
    </div>
  )
}

export default function DotsAndBoxesIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Dots and Boxes"
        style={{
          background: 'none', border: 'none', padding: 0,
          color: color || '#9ca3af', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.8s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="4" cy="4" r="1" fill="currentColor" />
            <circle cx="12" cy="4" r="1" fill="currentColor" />
            <circle cx="20" cy="4" r="1" fill="currentColor" />
            <circle cx="4" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="20" cy="12" r="1" fill="currentColor" />
            <circle cx="4" cy="20" r="1" fill="currentColor" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
            <circle cx="20" cy="20" r="1" fill="currentColor" />
            <path d="M4 4h8M12 4v8M4 12h8" strokeWidth="2" opacity="0.6" />
        </svg>
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
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              style={{
                position: 'fixed', bottom: 64, right: 328,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Impossible Dots and Boxes</span>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
              </div>
              <DotsAndBoxesGame color={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
