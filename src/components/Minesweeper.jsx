import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bomb, Flag, RefreshCw } from 'lucide-react'

// --- Game Logic ---
function generateBoard(size, mines, firstClickIdx) {
  const board = Array(size * size).fill(null).map((_, i) => ({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
    index: i
  }))

  let minesPlaced = 0
  while (minesPlaced < mines) {
    const idx = Math.floor(Math.random() * (size * size))
    // Don't place mine on first click or already placed mines
    if (idx !== firstClickIdx && !board[idx].isMine) {
      board[idx].isMine = true
      minesPlaced++
    }
  }

  // Calculate neighbors
  for (let i = 0; i < size * size; i++) {
    if (board[i].isMine) continue
    const row = Math.floor(i / size)
    const col = i % size
    let count = 0
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const nr = row + r
        const nc = col + c
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (board[nr * size + nc].isMine) count++
        }
      }
    }
    board[i].neighborMines = count
  }

  return board
}

function GridIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 2h4v4H2zM8 2h4v4H8zM14 2h2v4h-2zM2 8h4v4H2zM8 8h4v4H8zM14 8h2v4h-2zM2 14h4v4H2zM8 14h4v4H8zM14 14h2v4h-2z" />
    </svg>
  )
}

function MinesweeperGame({ color }) {
  const size = 9
  const minesCount = 10
  const [board, setBoard] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [flags, setFlags] = useState(0)

  const reveal = useCallback((idx, currentBoard) => {
    if (currentBoard[idx].isRevealed || currentBoard[idx].isFlagged) return currentBoard
    
    const newBoard = [...currentBoard]
    newBoard[idx].isRevealed = true

    // Impossible Edge: If it's a mine, you lose
    if (newBoard[idx].isMine) {
      setGameOver(true)
      return newBoard
    }

    // Flood fill for 0 neighbors
    if (newBoard[idx].neighborMines === 0) {
      const row = Math.floor(idx / size)
      const col = idx % size
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const nr = row + r
          const nc = col + c
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            reveal(nr * size + nc, newBoard)
          }
        }
      }
    }
    return newBoard
  }, [])

  const handleCellClick = (idx) => {
    if (gameOver || win) return
    
    if (!board) {
      const initialBoard = generateBoard(size, minesCount, idx)
      setBoard(reveal(idx, initialBoard))
      return
    }

    if (board[idx].isFlagged) return

    // IMPOSSIBLE LOGIC: If player is about to reveal too much
    const revealedCount = board.filter(c => c.isRevealed).length
    const safeTotal = size * size - minesCount
    
    // If they are more than 60% through the safe cells, start rigging
    if (revealedCount > (safeTotal * 0.6) && !board[idx].isMine && Math.random() < 0.4) {
        const rigBoard = [...board]
        rigBoard[idx].isMine = true
        // No need to update numbers, just end it
        setBoard(rigBoard)
        setGameOver(true)
        return
    }

    const nextBoard = reveal(idx, board)
    setBoard(nextBoard)

    // Check Win (Technically impossible due to above, but for completeness)
    const currentSafeCells = nextBoard.filter(c => !c.isMine)
    if (currentSafeCells.every(c => c.isRevealed)) {
      setWin(true)
    }
  }

  const handleRightClick = (e, idx) => {
    e.preventDefault()
    if (gameOver || win || !board || board[idx].isRevealed) return
    const nextBoard = [...board]
    const isNowFlagged = !nextBoard[idx].isFlagged
    nextBoard[idx].isFlagged = isNowFlagged
    setBoard(nextBoard)
    setFlags(f => isNowFlagged ? f + 1 : f - 1)
  }

  const reset = () => {
    setBoard(null)
    setGameOver(false)
    setWin(false)
    setFlags(0)
  }

  const revealedSafe = board ? board.filter(c => c.isRevealed && !c.isMine).length : 0
  const totalSafe = size * size - minesCount

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>Mines: {minesCount - flags}</span>
          <span style={{ opacity: 0.8, color: color }}>Safe: {revealedSafe}/{totalSafe}</span>
        </div>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color }}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${size}, 1fr)`, 
        gap: 2, 
        background: 'rgba(0,0,0,0.05)', 
        padding: 2, 
        borderRadius: 4 
      }}>
        {(board || Array(size * size).fill({})).map((cell, i) => (
          <motion.div
            key={i}
            onClick={() => handleCellClick(i)}
            onContextMenu={(e) => handleRightClick(e, i)}
            style={{
              width: 22,
              height: 22,
              background: cell.isRevealed 
                ? (cell.isMine ? '#ef4444' : '#ffffff') 
                : 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: 2,
              color: cell.isMine ? 'white' : getNumberColor(cell.neighborMines)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cell.isRevealed ? (
              cell.isMine ? <Bomb size={12} /> : (cell.neighborMines > 0 ? cell.neighborMines : '')
            ) : (
              cell.isFlagged ? <Flag size={10} color="#ef4444" /> : ''
            )}
          </motion.div>
        ))}
      </div>

      {gameOver && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 12, textAlign: 'center' }}>oh no, you lost</p>}
      {win && <p style={{ fontSize: 12, color: '#22c55e', marginTop: 12, textAlign: 'center' }}>rigging error! but you won?</p>}
    </div>
  )
}

function getNumberColor(n) {
  const colors = ['', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f59e0b', '#06b6d4', '#1a1a1a', '#6b7280']
  return colors[n] || '#1a1a1a'
}

export default function MinesweeperIcon({ color }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        title="Play Minesweeper"
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
                position: 'fixed', bottom: 64, right: 80,
                zIndex: 51,
                background: '#f9f7f2',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px 0', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Minesweeper</span>
                <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', opacity: 0.5 }}>×</span>
              </div>
              <MinesweeperGame color={color} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
