import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Crown } from 'lucide-react'

const SIZE = 8
const EMPTY = 0
const PLAYER = 1
const AI = 2
const PLAYER_KING = 3
const AI_KING = 4

function isPlayer(p) { return p === PLAYER || p === PLAYER_KING }
function isAI(p) { return p === AI || p === AI_KING }
function isKing(p) { return p === PLAYER_KING || p === AI_KING }

function getValidMoves(board, r, c, mustBeJump = false) {
  const piece = board[r][c]
  if (piece === EMPTY) return []

  const moves = []
  const directions = []

  if (piece === PLAYER || isKing(piece)) directions.push([-1, -1], [-1, 1])
  if (piece === AI || isKing(piece)) directions.push([1, -1], [1, 1])

  for (const [dr, dc] of directions) {
    let nr = r + dr
    let nc = c + dc

    if (isKing(piece)) {
      // Flying King: Slide until blocked
      let hasJumped = false
      while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        const mid = board[nr][nc]
        if (mid === EMPTY) {
          if (!mustBeJump) moves.push({ r: nr, c: nc, type: 'move' })
        } else {
          // Found a piece, check for jump
          if ((isPlayer(piece) ? isAI(mid) : isPlayer(mid))) {
            const jr = nr + dr
            const jc = nc + dc
            // If space after is empty, it's a jump. King can land anywhere after.
            if (jr >= 0 && jr < SIZE && jc >= 0 && jc < SIZE && board[jr][jc] === EMPTY) {
              let sjr = jr, sjc = jc
              while (sjr >= 0 && sjr < SIZE && sjc >= 0 && sjc < SIZE && board[sjr][sjc] === EMPTY) {
                moves.push({ r: sjr, c: sjc, type: 'jump', captured: { r: nr, c: nc } })
                sjr += dr; sjc += dc
              }
            }
          }
          break // Blocked by piece (own or already checked for jump)
        }
        nr += dr; nc += dc
      }
    } else {
      // Regular Piece
      if (!mustBeJump && nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === EMPTY) {
        moves.push({ r: nr, c: nc, type: 'move' })
      }
      const jr = r + dr * 2
      const jc = c + dc * 2
      if (jr >= 0 && jr < SIZE && jc >= 0 && jc < SIZE && board[jr][jc] === EMPTY) {
        const mid = board[nr][nc]
        if (mid !== EMPTY && (isPlayer(piece) ? isAI(mid) : isPlayer(mid))) {
          moves.push({ r: jr, c: jc, type: 'jump', captured: { r: nr, c: nc } })
        }
      }
    }
  }

  return moves
}

function getAllPossibleMoves(board, turn) {
    let allMoves = []
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const piece = board[r][c]
            if ((turn === PLAYER && isPlayer(piece)) || (turn === AI && isAI(piece))) {
                const moves = getValidMoves(board, r, c)
                for (const m of moves) allMoves.push({ from: { r, c }, ...m })
            }
        }
    }
    return allMoves
}

function applyMove(board, move) {
    const newBoard = board.map(row => [...row])
    let piece = newBoard[move.from.r][move.from.c]
    
    // Kinging
    if (piece === PLAYER && move.r === 0) piece = PLAYER_KING
    if (piece === AI && move.r === SIZE - 1) piece = AI_KING

    newBoard[move.r][move.c] = piece
    newBoard[move.from.r][move.from.c] = EMPTY
    if (move.type === 'jump') {
        newBoard[move.captured.r][move.captured.c] = EMPTY
    }
    return newBoard
}

function evaluateBoard(board) {
    let score = 0
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const p = board[r][c]
            if (p === PLAYER) score -= 10
            if (p === PLAYER_KING) score -= 25 // Kings are worth much more now
            if (p === AI) score += 10
            if (p === AI_KING) score += 25
        }
    }
    return score
}

function minimax(board, depth, alpha, beta, isMaximizing) {
    const moves = getAllPossibleMoves(board, isMaximizing ? AI : PLAYER)
    if (depth === 0 || moves.length === 0) {
        return evaluateBoard(board)
    }

    if (isMaximizing) {
        let maxEval = -Infinity
        for (const move of moves) {
            const resBoard = applyMove(board, move)
            // Handle multi-jump for AI
            let nextVal
            const nextJumps = move.type === 'jump' ? getValidMoves(resBoard, move.r, move.c, true).filter(m => m.type === 'jump') : []
            if (nextJumps.length > 0) {
              nextVal = minimax(resBoard, depth, alpha, beta, true) // Continue AI turn at same depth
            } else {
              nextVal = minimax(resBoard, depth - 1, alpha, beta, false)
            }
            maxEval = Math.max(maxEval, nextVal)
            alpha = Math.max(alpha, nextVal)
            if (beta <= alpha) break
        }
        return maxEval
    } else {
        let minEval = Infinity
        for (const move of moves) {
            const resBoard = applyMove(board, move)
            let nextVal
            const nextJumps = move.type === 'jump' ? getValidMoves(resBoard, move.r, move.c, true).filter(m => m.type === 'jump') : []
            if (nextJumps.length > 0) {
              nextVal = minimax(resBoard, depth, alpha, beta, false)
            } else {
              nextVal = minimax(resBoard, depth - 1, alpha, beta, true)
            }
            minEval = Math.min(minEval, nextVal)
            beta = Math.min(beta, nextVal)
            if (beta <= alpha) break
        }
        return minEval
    }
}

function GridIcon({ size = 18 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="8" y="2" width="4" height="4" />
        <rect x="14" y="2" width="2" height="4" />
        <rect x="2" y="8" width="4" height="4" />
        <rect x="8" y="8" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="14" y="8" width="2" height="4" />
        <rect x="2" y="14" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="8" y="14" width="4" height="4" />
        <rect x="14" y="14" width="2" height="4" />
      </svg>
    )
}

function CheckersGame({ color }) {
  const [lockedColor, setLockedColor] = useState(color)
  const [board, setBoard] = useState(() => {
    const b = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY))
    for (let r = 0; r < 3; r++) {
      for (let c = (r % 2 === 0 ? 1 : 0); c < SIZE; c += 2) b[r][c] = AI
    }
    for (let r = 5; r < SIZE; r++) {
      for (let c = (r % 2 === 0 ? 1 : 0); c < SIZE; c += 2) b[r][c] = PLAYER
    }
    return b
  })
  const [turn, setTurn] = useState(PLAYER)
  const [selected, setSelected] = useState(null)
  const [multiJumpPiece, setMultiJumpPiece] = useState(null)
  const [lastMove, setLastMove] = useState(null) // { from: {r, c}, to: {r, c} }
  const [winner, setWinner] = useState(null)
  const [isAiThinking, setIsAiThinking] = useState(false)

  const handleCellClick = (r, c) => {
    if (turn !== PLAYER || winner || isAiThinking) return

    const piece = board[r][c]
    
    // If in middle of multi-jump, must move that piece
    if (multiJumpPiece) {
      if (multiJumpPiece.r === r && multiJumpPiece.c === c) return // already selected
      const moves = getValidMoves(board, multiJumpPiece.r, multiJumpPiece.c, true).filter(m => m.type === 'jump')
      const move = moves.find(m => m.r === r && m.c === c)
      if (move) {
        processMove(multiJumpPiece, move)
      }
      return
    }

    if (isPlayer(piece)) {
      setSelected({ r, c })
      return
    }

    if (selected) {
      const moves = getValidMoves(board, selected.r, selected.c, !!multiJumpPiece)
      const move = moves.find(m => m.r === r && m.c === c)
      if (move) {
        processMove(selected, move)
      } else if (!multiJumpPiece && isPlayer(piece)) {
        setSelected({ r, c })
      }
    }
  }

  const endTurn = () => {
    setSelected(null)
    setMultiJumpPiece(null)
    setTurn(AI)
  }

  const processMove = (from, move) => {
    const nextBoard = applyMove(board, { from, ...move })
    setLastMove({ from, to: { r: move.r, c: move.c } })
    
    // Check for multi-jump
    if (move.type === 'jump') {
      const nextJumps = getValidMoves(nextBoard, move.r, move.c, true).filter(m => m.type === 'jump')
      if (nextJumps.length > 0) {
        setBoard(nextBoard)
        setMultiJumpPiece({ r: move.r, c: move.c })
        setSelected({ r: move.r, c: move.c })
        return
      }
    }

    setBoard(nextBoard)
    setSelected(null)
    setMultiJumpPiece(null)
    setTurn(AI)
  }

  useEffect(() => {
    if (turn === AI && !winner) {
      setIsAiThinking(true)
      const timer = setTimeout(async () => {
        const moves = getAllPossibleMoves(board, AI)
        if (moves.length === 0) {
            setWinner(PLAYER)
            setIsAiThinking(false)
            return
        }

        let bestMove = moves[0]
        let bestScore = -Infinity
        for (const m of moves) {
            const score = minimax(applyMove(board, m), 3, -Infinity, Infinity, false)
            if (score > bestScore) {
                bestScore = score
                bestMove = m
            }
        }

        // Apply first move
        let currentBoard = applyMove(board, bestMove)
        setBoard(currentBoard)
        setLastMove({ from: bestMove.from, to: { r: bestMove.r, c: bestMove.c } })
        
        let lastStep = bestMove
        
        // AI Sequential Multi-jump
        while (lastStep.type === 'jump') {
            const nextJumps = getValidMoves(currentBoard, lastStep.r, lastStep.c, true).filter(m => m.type === 'jump')
            if (nextJumps.length === 0) break
            
            // Wait before next move
            await new Promise(r => setTimeout(r, 600))
            
            let bestJump = nextJumps[0]
            let bestJumpScore = -Infinity
            for (const jm of nextJumps) {
                const s = evaluateBoard(applyMove(currentBoard, { from: { r: lastStep.r, c: lastStep.c }, ...jm }))
                if (s > bestJumpScore) {
                    bestJumpScore = s
                    bestJump = jm
                }
            }
            const nextBoard = applyMove(currentBoard, { from: { r: lastStep.r, c: lastStep.c }, ...bestJump })
            setBoard(nextBoard)
            setLastMove({ from: { r: lastStep.r, c: lastStep.c }, to: { r: bestJump.r, c: bestJump.c } })
            
            currentBoard = nextBoard
            lastStep = bestJump
        }

        if (getAllPossibleMoves(currentBoard, PLAYER).length === 0) {
            setWinner(AI)
        } else {
            setTurn(PLAYER)
        }
        setIsAiThinking(false)
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [turn, winner, board])

  const reset = () => {
    const b = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY))
    for (let r = 0; r < 3; r++) {
      for (let c = (r % 2 === 0 ? 1 : 0); c < SIZE; c += 2) b[r][c] = AI
    }
    for (let r = 5; r < SIZE; r++) {
      for (let c = (r % 2 === 0 ? 1 : 0); c < SIZE; c += 2) b[r][c] = PLAYER
    }
    setBoard(b)
    setTurn(PLAYER)
    setSelected(null)
    setMultiJumpPiece(null)
    setLastMove(null)
    setWinner(null)
    setLockedColor(color)
  }

  const pCount = board.flat().filter(isPlayer).length
  const aiCount = board.flat().filter(isAI).length

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{winner ? (winner === PLAYER ? 'Winner: You!' : 'Winner: AI') : (turn === PLAYER ? 'Your Turn' : 'Benedict is thinking...')}</span>
          <div style={{ display: 'flex', gap: 8, opacity: 0.8 }}>
            <span style={{ color: lockedColor }}>You: {pCount}</span>
            <span style={{ color: '#ef4444' }}>AI: {aiCount}</span>
          </div>
          {multiJumpPiece && !winner && (
            <button 
              onClick={endTurn}
              style={{ padding: '0 6px', background: lockedColor, color: 'white', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10 }}
            >
              End Turn
            </button>
          )}
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: lockedColor }}>
           <RotateCcw size={14} />
        </button>
      </div>

      <div style={{ 
        position: 'relative',
        display: 'grid', 
        gridTemplateColumns: `repeat(${SIZE}, 1fr)`, 
        background: '#1a1a1a', 
        padding: 4, 
        borderRadius: 4,
        gap: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Victory Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 20,
                backdropFilter: 'blur(4px)'
              }}
            >
              <motion.h3
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                style={{ 
                  color: winner === AI ? '#ef4444' : lockedColor, 
                  fontSize: 18, 
                  fontWeight: 800, 
                  marginBottom: 12,
                  fontFamily: 'serif' 
                }}
              >
                {winner === AI ? 'I win again,\nyou loose' : 'You won?!'}
              </motion.h3>
              <button
                onClick={reset}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {board.map((row, r) => row.map((cell, c) => {
          const isDark = (r + c) % 2 !== 0
          const isValidTarget = selected && getValidMoves(board, selected.r, selected.c, !!multiJumpPiece).some(m => m.r === r && m.c === c)
          const isLastMoveFrom = lastMove && lastMove.from.r === r && lastMove.from.c === c
          
          return (
            <div 
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 28,
                height: 28,
                background: isLastMoveFrom ? `${lockedColor}33` : (isDark ? '#2a2a2a' : '#f9f7f2'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: (isDark && (turn === PLAYER || winner)) ? 'pointer' : 'default',
                position: 'relative',
                transition: 'background 0.3s ease'
              }}
            >
              {isValidTarget && <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: lockedColor, opacity: 0.6 }} />}
              {isLastMoveFrom && <div style={{ position: 'absolute', inset: 0, border: `2px solid ${lockedColor}`, opacity: 0.8, borderRadius: 2 }} />}
              
              <AnimatePresence>
                {cell !== EMPTY && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: isPlayer(cell) ? lockedColor : '#ef4444',
                      border: selected?.r === r && selected?.c === c ? '2px solid white' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      opacity: (multiJumpPiece && (multiJumpPiece.r !== r || multiJumpPiece.c !== c)) ? 0.6 : 1
                    }}
                  >
                    {isKing(cell) && <Crown size={12} color="white" />}
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

export default function CheckersIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Checkers"
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
                position: 'fixed', bottom: 64, right: 192,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Impossible Checkers</span>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
              </div>
              <CheckersGame color={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
