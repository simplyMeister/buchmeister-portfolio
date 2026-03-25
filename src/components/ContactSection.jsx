import { useState } from 'react'
import { Github, Linkedin, Mail, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TicTacToeIcon from './TicTacToe'
import MinesweeperIcon from './Minesweeper'
import Connect4Icon from './Connect4'
import CheckersIcon from './Checkers'
import ChessIcon from './Chess'
import DotsAndBoxesIcon from './DotsAndBoxes'
import WhackAMoleIcon from './WhackAMole'

const XIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.39H4.294l13.313 18.26z" />
  </svg>
)

export default function ContactSection({ setBenModalOpen, isMobile, phaseIndex, PHASES }) {
  const [lastSubmit, setLastSubmit] = useState(0)
  const [showRateLimit, setShowRateLimit] = useState(false)

  const handleContactClick = (e) => {
    const now = Date.now()
    if (now - lastSubmit < 60000) { // 1 minute rate limit
      e.preventDefault()
      setShowRateLimit(true)
      setTimeout(() => setShowRateLimit(false), 3000)
      return
    }
    setLastSubmit(now)
  }

  return (
    <>
      {/* Rate Limit Toast */}
      <AnimatePresence>
        {showRateLimit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10000,
              background: '#ef4444',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 30,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)'
            }}
          >
            <AlertTriangle size={16} />
            <span>Slow down! Benedict is busy. (Rate limited)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: isMobile ? '60px 24px' : '100px 48px 40px', willChange: 'transform, opacity' }}
      >
        <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 7vw, 96px)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.05, marginBottom: 16 }}>
          Let's work{' '}
          <motion.span
            animate={{ 
              backgroundColor: PHASES[phaseIndex].hex,
              color: '#ffffff'
            }}
            transition={{ duration: 0.8 }}
            style={{ 
              display: 'inline-block', 
              padding: '4px 20px 14px', // Increased padding to prevent 'g' clipping
              borderRadius: '16px',
              margin: '0 4px',
              lineHeight: 1
            }}
          >
            together.
          </motion.span>
        </h2>
        <a
          href="mailto:bonyeachonam.2200323@stu.cu.edu.ng"
          onClick={handleContactClick}
          style={{
            fontSize: 'clamp(14px, 2vw, 22px)',
            color: '#374151',
            textUnderlineOffset: 4,
            transition: 'color 0.2s',
            wordBreak: 'break-all'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
          onMouseLeave={e => e.currentTarget.style.color = '#374151'}
        >
          bonyeachonam.2200323@stu.cu.edu.ng
        </a>
      </motion.section>

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '32px 24px' : '20px 48px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 24 : 0,
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 8 : 16 }}>
          <motion.span 
            animate={{ color: PHASES[phaseIndex].hex }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 12 }}
          >
            © 2026 Onyeachonam Buchi
          </motion.span>
          <motion.button
            onClick={() => setBenModalOpen(true)}
            animate={{ color: PHASES[phaseIndex].hex }}
            transition={{ duration: 0.8 }}
            whileHover={{ color: '#1a1a1a' }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 12,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              fontFamily: 'inherit',
            }}
          >
            Ask Benedict
          </motion.button>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { id: 'mail', icon: Mail, url: 'mailto:bonyeachonam.2200323@stu.cu.edu.ng' },
            { id: 'github', icon: Github, url: 'https://github.com/simplyMeister' },
            { id: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/in/benedict-onyeachonam/?trk=opento_sprofile_topcard' },
            { id: 'x', icon: XIcon, url: 'https://x.com/BenCruze_' }
          ].map((social) => (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              animate={{ color: PHASES[phaseIndex].hex }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <social.icon size={18} />
            </motion.a>
          ))}
          <WhackAMoleIcon color={PHASES[phaseIndex].hex} />
          <DotsAndBoxesIcon color={PHASES[phaseIndex].hex} />
          <ChessIcon color={PHASES[phaseIndex].hex} />
          <CheckersIcon color={PHASES[phaseIndex].hex} />
          <Connect4Icon color={PHASES[phaseIndex].hex} />
          <MinesweeperIcon color={PHASES[phaseIndex].hex} />
          <TicTacToeIcon color={PHASES[phaseIndex].hex} />
        </div>
      </footer>
    </>
  )
}
