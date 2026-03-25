import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

const ROWS = 6
const COLS = 7
const PLAYER = 1
const AI = 2

function checkWin(board, player) {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) 
        return { win: true, line: [[r,c], [r,c+1], [r,c+2], [r,c+3]] }
    }
  }
  // Vertical
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) 
        return { win: true, line: [[r,c], [r+1,c], [r+2,c], [r+3,c]] }
    }
  }
  // Diagonal /
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) 
        return { win: true, line: [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]] }
    }
  }
  // Diagonal \
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) 
        return { win: true, line: [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]] }
    }
  }
  return null
}

// Deep Minimax for "500,000% Difficulty"
function evaluateWindow(window, player) {
    let score = 0
    const opp = player === PLAYER ? AI : PLAYER
    const count = window.filter(x => x === player).length
    const empty = window.filter(x => x === 0).length
    const oppCount = window.filter(x => x === opp).length

    if (count === 4) score += 100
    else if (count === 3 && empty === 1) score += 5
    else if (count === 2 && empty === 2) score += 2

    if (oppCount === 3 && empty === 1) score -= 4

    return score
}

function scorePosition(board, player) {
    let score = 0
    // Center preference
    const centerArray = board.map(r => r[Math.floor(COLS/2)])
    const centerCount = centerArray.filter(x => x === player).length
    score += centerCount * 3

    // Horizontal
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window = board[r].slice(c, c+4)
            score += evaluateWindow(window, player)
        }
    }
    // Vertical
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 3; r++) {
            const window = [board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]]
            score += evaluateWindow(window, player)
        }
    }
    // Diagonal
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            const window1 = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]
            const window2 = [board[r+3][c], board[r+2][c+1], board[r+1][c+2], board[r][c+3]]
            score += evaluateWindow(window1, player)
            score += evaluateWindow(window2, player)
        }
    }
    return score
}

function minimax(board, depth, alpha, beta, isMaximizing) {
    const isTerminal = checkWin(board, PLAYER) || checkWin(board, AI) || board[0].every(x => x !== 0)
    if (depth === 0 || isTerminal) {
        if (isTerminal) {
            if (checkWin(board, AI)) return 1000000
            if (checkWin(board, PLAYER)) return -1000000
            return 0
        }
        return scorePosition(board, AI)
    }

    const validCols = []
    for (let c = 0; c < COLS; c++) if (board[0][c] === 0) validCols.push(c)

    if (isMaximizing) {
        let value = -Infinity
        for (const col of validCols) {
            const nextBoard = board.map(r => [...r])
            for (let r = ROWS - 1; r >= 0; r--) {
                if (nextBoard[r][col] === 0) { nextBoard[r][col] = AI; break; }
            }
            value = Math.max(value, minimax(nextBoard, depth - 1, alpha, beta, false))
            alpha = Math.max(alpha, value)
            if (alpha >= beta) break
        }
        return value
    } else {
        let value = Infinity
        for (const col of validCols) {
            const nextBoard = board.map(r => [...r])
            for (let r = ROWS - 1; r >= 0; r--) {
                if (nextBoard[r][col] === 0) { nextBoard[r][col] = PLAYER; break; }
            }
            value = Math.min(value, minimax(nextBoard, depth - 1, alpha, beta, true))
            beta = Math.min(beta, value)
            if (alpha >= beta) break
        }
        return value
    }
}

function GridIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="4" cy="4" r="2" />
        <circle cx="9" cy="4" r="2" />
        <circle cx="14" cy="4" r="2" />
        <circle cx="4" cy="9" r="2" />
        <circle cx="9" cy="9" r="2" />
        <circle cx="14" cy="9" r="2" />
        <circle cx="4" cy="14" r="2" />
        <circle cx="9" cy="14" r="2" />
        <circle cx="14" cy="14" r="2" />
      </svg>
    )
}

function Connect4Game({ color }) {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)))
  const [turn, setTurn] = useState(PLAYER)
  const [winData, setWinData] = useState(null) // { winner, line }
  const [isAiThinking, setIsAiThinking] = useState(false)

  const dropDisc = useCallback((currentBoard, col, player) => {
    const newBoard = currentBoard.map(row => [...row])
    let rowToPlace = -1
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === 0) {
        rowToPlace = r
        break
      }
    }
    if (rowToPlace === -1) return null
    newBoard[rowToPlace][col] = player
    return { board: newBoard, row: rowToPlace }
  }, [])

  const handleColClick = (col) => {
    if (turn !== PLAYER || winData || isAiThinking) return
    const result = dropDisc(board, col, PLAYER)
    if (!result) return

    setBoard(result.board)
    const win = checkWin(result.board, PLAYER)
    if (win) {
      setWinData({ winner: PLAYER, line: win.line })
    } else if (result.board[0].every(x => x !== 0)) {
      setWinData({ winner: 'draw', line: [] })
    } else {
      setTurn(AI)
    }
  }

  // AI Turn (Minimax)
  useEffect(() => {
    if (turn === AI && !winData) {
      setIsAiThinking(true)
      const timer = setTimeout(() => {
        let bestScore = -Infinity
        let targetCol = -1
        
        const validCols = []
        for (let c = 0; c < COLS; c++) if (board[0][c] === 0) validCols.push(c)

        for (const col of validCols) {
            const nextBoard = board.map(r => [...r])
            for (let r = ROWS - 1; r >= 0; r--) {
                if (nextBoard[r][col] === 0) { nextBoard[r][col] = AI; break; }
            }
            const score = minimax(nextBoard, 4, -Infinity, Infinity, false)
            if (score > bestScore) {
                bestScore = score
                targetCol = col
            }
        }

        if (targetCol !== -1) {
            const res = dropDisc(board, targetCol, AI)
            setBoard(res.board)
            const win = checkWin(res.board, AI)
            if (win) setWinData({ winner: AI, line: win.line })
            else if (res.board[0].every(x => x !== 0)) setWinData({ winner: 'draw', line: [] })
            else setTurn(PLAYER)
        }
        setIsAiThinking(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [turn, winData, board, dropDisc])

  const reset = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)))
    setTurn(PLAYER)
    setWinData(null)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 12, color: 'var(--muted)' }}>
        <span>
            {winData 
                ? (winData.winner === PLAYER ? 'You won?!' : winData.winner === 'draw' ? 'Draw' : 'I win, You loose') 
                : (turn === PLAYER ? 'Your turn' : 'Benedict is thinking...')}
        </span>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color }}>
           <RotateCcw size={14} />
        </button>
      </div>

      <div style={{ 
        position: 'relative',
        display: 'grid', 
        gridTemplateColumns: `repeat(${COLS}, 1fr)`, 
        background: '#3b82f6', 
        padding: 5, 
        borderRadius: 8,
        gap: 5,
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {/* Winning Line Overlay */}
        {winData && winData.line.length > 0 && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
             <motion.line
               x1={(winData.line[0][1] * (24 + 5)) + 5 + 12}
               y1={(winData.line[0][0] * (24 + 5)) + 5 + 12}
               x2={(winData.line[3][1] * (24 + 5)) + 5 + 12}
               y2={(winData.line[3][0] * (24 + 5)) + 5 + 12}
               stroke="white"
               strokeWidth="3"
               strokeLinecap="round"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 0.5 }}
             />
          </svg>
        )}

        {Array.from({ length: COLS }).map((_, c) => (
          <div key={c} onClick={() => handleColClick(c)} style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer' }}>
            {Array.from({ length: ROWS }).map((_, r) => (
              <div 
                key={r} 
                style={{ 
                  width: 24, 
                  height: 24, 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                <AnimatePresence>
                  {board[r][c] !== 0 && (
                    <motion.div
                      initial={{ y: -180 }}
                      animate={{ y: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      style={{
                        position: 'absolute',
                        inset: 2,
                        borderRadius: '50%',
                        background: board[r][c] === PLAYER ? '#ef4444' : '#f59e0b',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                        opacity: winData && !winData.line.some(([wr, wc]) => wr === r && wc === c) ? 0.4 : 1
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Connect4Icon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Connect 4"
        style={{
          background: 'none', border: 'none', padding: 0,
          color: color || '#9ca3af', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.8s ease',
        }}
      >
        <GridIcon size={18} />
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
                position: 'fixed', bottom: 64, right: 136,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Connect 4</span>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
              </div>
              <Connect4Game color={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
