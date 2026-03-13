import { useState, useEffect } from 'react'
import { BookOpen, Github, Linkedin, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BenModal from './benModal'

const PHASES = [
  {
    verb: 'change',
    bgClass: 'bg-action-green',
    hex: '#22c55e',
    actions: ['live', 'act', 'think', 'move']
  },
  {
    verb: 'inspires',
    bgClass: 'bg-action-pink',
    hex: '#ec4899',
    actions: ['interact', 'socialize', 'feel', 'operate']
  },
  {
    verb: 'postulate',
    bgClass: 'bg-action-gold',
    hex: '#eab308',
    actions: ['plan', 'strategize', 'work', 'win']
  }
]

export default function HeroSection({ setBenModalOpen, isMobile }) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [actionIndex, setActionIndex] = useState(0)
  const [hoveredLink, setHoveredLink] = useState(null)

  useEffect(() => {
    const actionInterval = setInterval(() => {
      setActionIndex(i => {
        if (i === PHASES[phaseIndex].actions.length - 1) {
          // Transition to next phase
          setPhaseIndex(p => (p + 1) % PHASES.length)
          return 0
        }
        return i + 1
      })
    }, 4000)
    return () => clearInterval(actionInterval)
  }, [phaseIndex])

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setBenModalOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setBenModalOpen])

  return (
    <>
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ 
          minHeight: window.innerWidth <= 1024 ? 'auto' : '100dvh', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: window.innerWidth <= 1024 ? '0 24px' : '0 48px',
          paddingBottom: window.innerWidth <= 1024 ? '80px' : '0',
          paddingTop: window.innerWidth <= 1024 ? '20px' : '0',
          overflow: 'hidden'
        }}
      >
        {/* Hero Background Tiles */}
        <div className="hero-tiles">
          {Array.from({ length: 240 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="tile"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Top bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: 28, 
          paddingBottom: 28,
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img 
              src="/Ben.ico" 
              alt="Logo" 
              style={{ width: 24, height: 24, borderRadius: 6 }} 
            />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Onyeachonam Buchi</span>
          </div>
          {!isMobile && (
            <motion.span 
              animate={{ color: PHASES[phaseIndex].hex }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 13, fontWeight:500 }}
            >
              Frontend Developer
            </motion.span>
          )}
        </div>

        {/* Hero headline */}
        <div style={{ 
          flex: window.innerWidth <= 1024 ? 'none' : 1, 
          display: 'flex', 
          alignItems: 'flex-start', 
          paddingTop: window.innerWidth <= 1024 ? 40 : 40, 
          paddingBottom: window.innerWidth <= 1024 ? 48 : 0,
          position: 'relative',
          zIndex: 10
        }}>
          <div className="headline-lighting">
            <div className="headline-aura" />
            <h1
              className="font-serif"
              style={{ 
                fontSize: 'clamp(40px, 9vw, 112px)', 
                lineHeight: 1.15, 
                color: '#1a1a1a', 
                fontWeight: 400, 
                maxWidth: isMobile ? '100%' : '100%',
                position: 'relative'
              }}
            >
              Creating Systems that <br />
              that{' '}
              <span style={{ display: 'inline-block', verticalAlign: 'bottom', height: '1.2em', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phaseIndex}
                    initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                    animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
                    exit={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={PHASES[phaseIndex].bgClass}
                    style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {PHASES[phaseIndex].verb}
                  </motion.span>
                </AnimatePresence>
              </span>{' '}
              how<br />
              people{' '}
              <span style={{ display: 'inline-block', verticalAlign: 'bottom', height: '1.1em', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${phaseIndex}-${actionIndex}`}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block', fontStyle: 'italic' }}
                  >
                    {PHASES[phaseIndex].actions[actionIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 1024 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 1024 ? 'flex-start' : 'flex-end', 
          paddingBottom: window.innerWidth <= 1024 ? 0 : 47,
          gap: window.innerWidth <= 1024 ? 32 : 0,
          marginTop: window.innerWidth <= 1024 ? 0 : 0,
          position: 'relative',
          zIndex: 10
        }}>
          {/* Subtext */}
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            <div>
              Previously at <a href="https://sheratonhotels.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>Sheraton Hotels</a> &amp; <a href="https://www.21st-evolution.com/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>21st Century Evolutions Systems</a>.
            </div>
            <div style={{ marginTop: 4 }}>
              Now Frontend-Dev and IT engineer at <a href="https://rceettech.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>rceet technologies</a>.
            </div>
          </div>
          

          {/* Social links */}
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth <= 1024 ? 'row' : 'column', 
            alignItems: window.innerWidth <= 1024 ? 'center' : 'flex-end', 
            gap: window.innerWidth <= 1024 ? 20 : 10,
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'blog', label: 'Blog', url: 'https://dribbble.com/BenCruze', icon: (props) => <BookOpen {...props} /> },
              { id: 'github', label: 'Github', url: 'https://github.com/simplyMeister', icon: (props) => <Github {...props} /> },
              { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/benedict-onyeachonam/?trk=opento_sprofile_topcard', icon: (props) => <Linkedin {...props} /> }
            ].map((link) => (
              <motion.a 
                key={link.id}
                href={link.url} 
                target="_blank" 
                rel="noreferrer" 
                className="social-link"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                animate={{ color: PHASES[phaseIndex].hex }}
                transition={{ duration: 0.8 }}
                style={{ 
                  position: 'relative', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  minWidth: window.innerWidth > 1024 ? 100 : 'auto',
                  textDecoration: 'none'
                }}
              >
                {link.icon({ size: 14 })}
                <span style={{ transition: 'margin-right 0.2s ease' }}>
                  {window.innerWidth > 1024 && link.label}
                </span>
                <AnimatePresence>
                  {hoveredLink === link.id && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      style={{ position: 'absolute', right: -20, display: 'flex', alignItems: 'center' }}
                    >
                      <ArrowRight size={14} style={{ opacity: 0.5 }} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}
