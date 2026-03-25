import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Minimax AI ────────────────────────────────────────────────────────────────

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],  
]

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a, b, c] }
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] }
  return null
}

function minimax(board, isMaximizing, alpha, beta) {
  const result = checkWinner(board)
  if (result) {
    if (result.winner === 'O') return 10
    if (result.winner === 'X') return -10
    return 0
  }
  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O'; best = Math.max(best, minimax(board, false, alpha, beta)); board[i] = null
        alpha = Math.max(alpha, best); if (beta <= alpha) break
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X'; best = Math.min(best, minimax(board, true, alpha, beta)); board[i] = null
        beta = Math.min(beta, best); if (beta <= alpha) break
      }
    }
    return best
  }
}

function getBestMove(board) {
  let bestScore = -Infinity, bestMove = -1
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      const score = minimax(board, false, -Infinity, Infinity)
      board[i] = null
      if (score > bestScore) { bestScore = score; bestMove = i }
    }
  }
  return bestMove
}

function isLossMilestone(n) { return n > 0 && n % 5 === 0 }

const EMPTY = Array(9).fill(null)

// ─── Mini grid icon (for the footer button) ────────────────────────────────────
function GridIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="6"  y1="0"  x2="6"  y2="18" />
      <line x1="12" y1="0"  x2="12" y2="18" />
      <line x1="0"  y1="6"  x2="18" y2="6"  />
      <line x1="0"  y1="12" x2="18" y2="12" />
    </svg>
  )
}

// ─── The game itself (used inside the modal) ──────────────────────────────────
function TicTacToeGame() {
  const [board, setBoard]               = useState(EMPTY)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameResult, setGameResult]     = useState(null)
  const [prizeVisible, setPrizeVisible] = useState(false)
  const [totalLosses, setTotalLosses]   = useState(0)
  const [toast, setToast]               = useState(null)
  // random = true: player goes first; false: AI goes first (reset randomly each game)
  const [playerFirst, setPlayerFirst]   = useState(() => Math.random() < 0.5)

  // When AI goes first, trigger its first move
  useEffect(() => {
    if (playerFirst) return
    const t = setTimeout(() => {
      const move = getBestMove([...EMPTY])
      const next = [...EMPTY]
      next[move] = 'O'
      setBoard(next)
      setIsPlayerTurn(true)
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerFirst])

  // AI response to player move
  useEffect(() => {
    if (isPlayerTurn || gameResult) return
    const t = setTimeout(() => {
      const move = getBestMove([...board])
      if (move === -1) return
      const next = [...board]
      next[move] = 'O'
      setBoard(next)
      const result = checkWinner(next)
      if (result) {
        setGameResult(result)
        if (result.winner === 'O') {
          const n = totalLosses + 1
          setTotalLosses(n)
          if (isLossMilestone(n))
            setToast(`You've lost ${n} time${n !== 1 ? 's' : ''} now — are you sure you want to continue?`)
        }
      } else setIsPlayerTurn(true)
    }, 400)
    return () => clearTimeout(t)
  }, [isPlayerTurn, board, gameResult, totalLosses])

  // Dismiss toast on any pointer event
  useEffect(() => {
    if (!toast) return
    const dismiss = () => setToast(null)
    window.addEventListener('pointerdown', dismiss)
    return () => window.removeEventListener('pointerdown', dismiss)
  }, [toast])

  const handleClick = useCallback((idx) => {
    if (!isPlayerTurn || board[idx] || gameResult) return
    const next = [...board]
    next[idx] = 'X'
    setBoard(next)
    const result = checkWinner(next)
    if (result) {
      setGameResult(result)
      if (result.winner === 'X') setPrizeVisible(true)
    } else setIsPlayerTurn(false)
  }, [isPlayerTurn, board, gameResult])

  const reset = () => {
    const pf = Math.random() < 0.5
    setPlayerFirst(pf)
    setBoard(EMPTY)
    setIsPlayerTurn(pf)
    setGameResult(null)
    setPrizeVisible(false)
  }

  const isWinCell = (idx) => gameResult?.line?.includes(idx)

  const statusText = () => {
    if (!gameResult) return isPlayerTurn ? 'Your move (X)' : 'Thinking...'
    if (gameResult.winner === 'draw') return "Draw!"
    if (gameResult.winner === 'X') return '🎉 You won!'
    return 'I win. Try again?'
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              zIndex: 200, background: '#1a1a1a', color: '#f9f7f2',
              borderRadius: 12, padding: '12px 20px', fontSize: 13,
              fontFamily: '"Satoshi","Inter",sans-serif', lineHeight: 1.6,
              maxWidth: 300, textAlign: 'center',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)', cursor: 'pointer',
            }}
          >
            {toast}
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>tap anywhere to dismiss</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontFamily: '"Lora","Georgia",serif', fontStyle: 'italic', fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>
          beat me and win a prize
        </p>
        <p style={{ fontSize: 12, color: '#9ca3af', fontFamily: '"Satoshi","Inter",sans-serif' }}>
          {!gameResult
            ? (playerFirst ? 'You go first.' : 'I go first.')
            : ''}
        </p>
      </div>

      {/* Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16 }}>
        {board.map((cell, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleClick(idx)}
            whileHover={!cell && isPlayerTurn && !gameResult ? { scale: 1.05 } : {}}
            whileTap={!cell && isPlayerTurn && !gameResult ? { scale: 0.95 } : {}}
            style={{
              aspectRatio: '1 / 1',
              background: isWinCell(idx) ? '#1a1a1a' : '#f9f7f2',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              cursor: !cell && isPlayerTurn && !gameResult ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontFamily: '"Lora","Georgia",serif', fontWeight: 400,
              color: isWinCell(idx) ? '#f9f7f2' : cell === 'X' ? '#1a1a1a' : '#6b7280',
              outline: 'none',
              transition: 'background 0.15s',
            }}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  key={cell + idx}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Status */}
      <motion.p
        key={statusText()}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ fontSize: 13, fontFamily: '"Lora","Georgia",serif', color: '#1a1a1a', marginBottom: 12, lineHeight: 1.4 }}
      >
        {statusText()}
      </motion.p>

      {/* Prize */}
      <AnimatePresence>
        {prizeVisible && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 12, color: '#15803d', fontFamily: '"Satoshi","Inter",sans-serif', lineHeight: 1.5, marginBottom: 12 }}
          >
            🏆 Screenshot &amp; email <strong>bonyeachonam.2200323@stu.cu.edu.ng</strong> for your prize!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Loss counter + reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {totalLosses > 0
          ? <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: '"Satoshi","Inter",sans-serif' }}>Losses: {totalLosses}</span>
          : <span />}
        {gameResult && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={reset}
            style={{ fontSize: 12, padding: '6px 16px', borderRadius: 999, border: '1px solid #1a1a1a', background: 'transparent', color: '#1a1a1a', cursor: 'pointer', fontFamily: '"Satoshi","Inter",sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#f9f7f2' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1a1a' }}
          >
            Again
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ─── Public export: footer icon + popup modal ──────────────────────────────────
export default function TicTacToeIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* The tiny icon button that lives in the footer */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Play tic-tac-toe"
        style={{
          background: 'none', border: 'none', padding: 0,
          color: color || '#9ca3af', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.8s ease',
        }}
      >
        <GridIcon size={18} />
      </button>

      {/* Popup panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}
            />
            {/* Panel — anchors to bottom-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                position: 'fixed', bottom: 64, right: 24,
                zIndex: 50,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                width: 240,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 0' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: '"Satoshi","Inter",sans-serif' }}>
                  A Quick Game?
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              <TicTacToeGame />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
