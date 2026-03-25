import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Award } from 'lucide-react'

// Piece Constants
const EMPTY = null
const W_PAWN = 'wP'; const W_ROOK = 'wR'; const W_KNIGHT = 'wN'; const W_BISHOP = 'wB'; const W_QUEEN = 'wQ'; const W_KING = 'wK'
const B_PAWN = 'bP'; const B_ROOK = 'bR'; const B_KNIGHT = 'bN'; const B_BISHOP = 'bB'; const B_QUEEN = 'bQ'; const B_KING = 'bK'

const WHITE = 'w'; const BLACK = 'b'

// Piece values for evaluation
const PIECE_VALUES = {
  [W_PAWN]: 10, [W_KNIGHT]: 30, [W_BISHOP]: 30, [W_ROOK]: 50, [W_QUEEN]: 90, [W_KING]: 900,
  [B_PAWN]: -10, [B_KNIGHT]: -30, [B_BISHOP]: -30, [B_ROOK]: -50, [B_QUEEN]: -90, [B_KING]: -900,
}

// Piece-Square Tables (Simplified)
const PAWN_PST = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
]

const KNIGHT_PST = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
]

// ... many more tables could go here but let's stick to the basics for code size ...

const INITIAL_BOARD = [
  [B_ROOK, B_KNIGHT, B_BISHOP, B_QUEEN, B_KING, B_BISHOP, B_KNIGHT, B_ROOK],
  [B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN],
  [W_ROOK, W_KNIGHT, W_BISHOP, W_QUEEN, W_KING, W_BISHOP, W_KNIGHT, W_ROOK]
]

// Piece Graphics (SVG Paths)
const PIECE_ICONS = {
  [W_PAWN]: "M12 5a3 3 0 100 6 3 3 0 000-6zM5 20h14a1 1 0 000-2H5a1 1 0 000 2zm7-7a5 5 0 00-5 5h10a5 5 0 00-5-5z",
  [W_ROOK]: "M5 20h14v-2H5v2zM17 17V7h-2v3h-2V7h-2v3H9V7H7v10h10zM5 6V4h4v2H5zm5 0V4h4v2h-4zm5 0V4h4v2h-4z",
  [W_KNIGHT]: "M19 10c0-5.52-4.48-10-10-10C6.24 0 4 2.24 4 5c0 1.38.56 2.63 1.46 3.54L4 13h10v-2H6.93l.89-2.22c1.37.89 3.01 1.22 4.68.83 2.51-.59 4.5-2.58 5.09-5.09.39-1.67.06-3.31-.83-4.68L19 10z",
  [W_BISHOP]: "M12 2C8.69 2 6 4.69 6 8c0 2.21 1.25 4.12 3.09 5.09L7 20h10l-2.09-6.91C16.75 12.12 18 10.21 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.25-.56 2.37-1.46 3.14L12 13l-2.54-1.86C8.56 10.37 8 9.25 8 8c0-2.21 1.79-4 4-4z",
  [W_QUEEN]: "M18 17L15 4l-3 7-3-7-3 13h12zM5 20h14v-2H5v2zM12 2a1 1 0 100 2 1 1 0 000-2zM4 3a1 1 0 100 2 1 1 0 000-2zM20 3a1 1 0 100 2 1 1 0 000-2z",
  [W_KING]: "M12 2v3m-2-3h4m-2 5l3-3 3 10H6l3-10 3 3zM5 20h14v-2H5v2z"
}

const getIcon = (type, color) => {
    const baseType = type.substring(1)
    const iconKey = `w${baseType}`
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill={type.startsWith('w') ? color : '#ef4444'}>
            <path d={PIECE_ICONS[iconKey]} />
        </svg>
    )
}

function ChessGame({ color }) {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [turn, setTurn] = useState(WHITE)
  const [selected, setSelected] = useState(null)
  const [lastMove, setLastMove] = useState(null)
  const [winner, setWinner] = useState(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [lockedColor, setLockedColor] = useState(color)

  useEffect(() => {
    // Only lock color once at start
    if (board === INITIAL_BOARD) setLockedColor(color)
  }, [color])

  const isMyPiece = (p, side) => p && p.startsWith(side)
  
  const getValidMoves = useCallback((currentBoard, r, c) => {
    const piece = currentBoard[r][c]
    if (!piece) return []
    const side = piece[0]
    const type = piece[1]
    const moves = []

    const addMove = (nr, nc) => {
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc]
            if (!target) {
                moves.push({ r: nr, c: nc })
                return true // empty square
            } else if (target[0] !== side) {
                moves.push({ r: nr, c: nc })
                return false // captured and blocked
            }
        }
        return false // out or blocked by own
    }

    if (type === 'P') {
        const dir = side === WHITE ? -1 : 1
        const startRow = side === WHITE ? 6 : 1
        // Forward
        if (currentBoard[r + dir] && !currentBoard[r + dir][c]) {
            moves.push({ r: r+dir, c })
            if (r === startRow && !currentBoard[r + 2*dir][c]) {
                moves.push({ r: r + 2*dir, c })
            }
        }
        // Capture
        for (let dc of [-1, 1]) {
            const nr = r + dir, nc = c + dc
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const target = currentBoard[nr][nc]
                if (target && target[0] !== side) moves.push({ r: nr, c: nc })
            }
        }
    } else if (type === 'N') {
        const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
        offsets.forEach(([dr, dc]) => addMove(r + dr, c + dc))
    } else if (type === 'B' || type === 'R' || type === 'Q') {
        const dirs = type === 'R' ? [[0,1],[0,-1],[1,0],[-1,0]] : 
                     type === 'B' ? [[1,1],[1,-1],[-1,1],[-1,-1]] : 
                     [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]
        dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc
            while (addMove(nr, nc)) {
                nr += dr; nc += dc
                if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break
            }
        })
    } else if (type === 'K') {
        const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]
        dirs.forEach(([dr, dc]) => addMove(r + dr, c + dc))
    }

    return moves
  }, [])

  const evaluateBoard = (b) => {
    let score = 0
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c]
        if (p) {
            score += PIECE_VALUES[p]
            // Add PST bonus
            if (p === W_PAWN) score += PAWN_PST[r][c]
            else if (p === B_PAWN) score -= PAWN_PST[7-r][c]
            else if (p === W_KNIGHT) score += KNIGHT_PST[r][c]
            else if (p === B_KNIGHT) score -= KNIGHT_PST[7-r][c]
        }
      }
    }
    return score
  }

  const applyMove = (b, from, to) => {
    const next = b.map(row => [...row])
    let piece = next[from.r][from.c]
    // Promotion
    if (piece === W_PAWN && to.r === 0) piece = W_QUEEN
    if (piece === B_PAWN && to.r === 7) piece = B_QUEEN
    
    next[to.r][to.c] = piece
    next[from.r][from.c] = EMPTY
    return next
  }

  const minimax = (b, depth, alpha, beta, isMax) => {
    if (depth === 0) return evaluateBoard(b)
    
    const side = isMax ? WHITE : BLACK
    const moves = []
    for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
            if (isMyPiece(b[r][c], side)) {
                getValidMoves(b, r, c).forEach(m => moves.push({ from: {r,c}, to: m }))
            }
        }
    }

    if (moves.length === 0) return isMax ? -10000 : 10000

    if (isMax) {
        let maxEval = -Infinity
        for (let m of moves) {
            const ev = minimax(applyMove(b, m.from, m.to), depth - 1, alpha, beta, false)
            maxEval = Math.max(maxEval, ev)
            alpha = Math.max(alpha, ev)
            if (beta <= alpha) break
        }
        return maxEval
    } else {
        let minEval = Infinity
        for (let m of moves) {
            const ev = minimax(applyMove(b, m.from, m.to), depth - 1, alpha, beta, true)
            minEval = Math.min(minEval, ev)
            beta = Math.min(beta, ev)
            if (beta <= alpha) break
        }
        return minEval
    }
  }

  const handleCellClick = (r, c) => {
    if (turn !== WHITE || winner || isAiThinking) return
    const piece = board[r][c]

    if (selected) {
        if (selected.r === r && selected.c === c) {
            setSelected(null)
            return
        }
        const moves = getValidMoves(board, selected.r, selected.c)
        const move = moves.find(m => m.r === r && m.c === c)
        if (move) {
            const nextBoard = applyMove(board, selected, move)
            setBoard(nextBoard)
            setLastMove({ from: selected, to: move })
            setSelected(null)
            setTurn(BLACK)
            return
        }
    }

    if (isMyPiece(piece, WHITE)) {
        setSelected({ r, c })
    }
  }

  useEffect(() => {
    if (turn === BLACK && !winner) {
        setIsAiThinking(true)
        setTimeout(() => {
            const moves = []
            for (let r=0; r<8; r++) {
                for (let c=0; c<8; c++) {
                    if (isMyPiece(board[r][c], BLACK)) {
                        getValidMoves(board, r, c).forEach(m => moves.push({ from: {r,c}, to: m }))
                    }
                }
            }

            if (moves.length === 0) {
                setWinner(WHITE)
                setIsAiThinking(false)
                return
            }

            let bestMove = moves[0]
            let bestScore = Infinity
            for (let m of moves) {
                const score = minimax(applyMove(board, m.from, m.to), 2, -Infinity, Infinity, true)
                if (score < bestScore) {
                    bestScore = score
                    bestMove = m
                }
            }

            const nextBoard = applyMove(board, bestMove.from, bestMove.to)
            setBoard(nextBoard)
            setLastMove({ from: bestMove.from, to: bestMove.to })
            
            // Check if player has moves
            const playerMoves = []
            for (let r=0; r<8; r++) {
                for (let c=0; c<8; c++) {
                    if (isMyPiece(nextBoard[r][c], WHITE)) {
                        getValidMoves(nextBoard, r, c).forEach(m => playerMoves.push(m))
                    }
                }
            }
            if (playerMoves.length === 0) setWinner(BLACK)
            else setTurn(WHITE)
            
            setIsAiThinking(false)
        }, 600)
    }
  }, [turn, winner, board, getValidMoves])

  const reset = () => {
    setBoard(INITIAL_BOARD)
    setTurn(WHITE)
    setSelected(null)
    setLastMove(null)
    setWinner(null)
    setLockedColor(color)
  }

  const getMaterial = (side) => {
    let m = 0
    const vals = { 'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0 }
    board.forEach(row => row.forEach(cell => {
      if (cell && cell[0] === side) m += vals[cell[1]]
    }))
    return m
  }
  const wMat = getMaterial(WHITE)
  const bMat = getMaterial(BLACK)

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{winner ? (winner === WHITE ? 'Winner: You!' : 'Winner: AI') : (turn === WHITE ? 'Your Turn' : 'Benedict is thinking...')}</span>
          <div style={{ display: 'flex', gap: 8, opacity: 0.8 }}>
            <span style={{ color: lockedColor }}>You: {wMat}</span>
            <span style={{ color: '#ef4444' }}>AI: {bMat}</span>
          </div>
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: lockedColor }}>
           <RotateCcw size={14} />
        </button>
      </div>

      <div style={{ 
        position: 'relative',
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)', 
        background: '#1a1a1a', 
        padding: 4, 
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        <AnimatePresence>
            {winner && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center', padding: 20
                    }}
                >
                    <Award size={32} color={winner === BLACK ? '#ef4444' : lockedColor} style={{ marginBottom: 12 }} />
                    <h3 style={{ color: winner === BLACK ? '#ef4444' : lockedColor, fontSize: 18, fontWeight: 800, marginBottom: 12, fontFamily: 'serif' }}>
                        {winner === BLACK ? 'I win again,\nyou loose' : 'You won?!'}
                    </h3>
                    <button onClick={reset} style={{ padding: '8px 16px', background: 'white', color: '#1a1a1a', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Play Again
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {board.map((row, r) => row.map((cell, c) => {
          const isDark = (r + c) % 2 !== 0
          const isSelected = selected?.r === r && selected?.c === c
          const isValidTarget = selected && getValidMoves(board, selected.r, selected.c).some(m => m.r === r && m.c === c)
          const isLastMove = lastMove && ( (lastMove.from.r === r && lastMove.from.c === c) || (lastMove.to.r === r && lastMove.to.c === c) )
          
          return (
            <div 
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 28, height: 28,
                background: isDark ? '#2a2a2a' : '#f9f7f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: (turn === WHITE || winner) ? 'pointer' : 'default',
                position: 'relative',
              }}
            >
              {isLastMove && <div style={{ position: 'absolute', inset: 0, background: lockedColor, opacity: 0.15 }} />}
              {isSelected && <div style={{ position: 'absolute', inset: 0, border: `1px solid ${lockedColor}`, zIndex: 1 }} />}
              {isValidTarget && <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: lockedColor, opacity: 0.4 }} />}
              
              <AnimatePresence>
                {cell && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {getIcon(cell, lockedColor)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }))}
      </div>
    </div>
  )
}

const ChessIconInner = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 17L15 4l-3 7-3-7-3 13h12zM5 20h14v-2H5v2zM12 2a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
)

export default function ChessIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Chess"
        style={{
          background: 'none', border: 'none', padding: 0,
          color: color || '#9ca3af', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.8s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ChessIconInner size={18} />
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
                position: 'fixed', bottom: 64, right: 260,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Impossible Chess</span>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
              </div>
              <ChessGame color={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
