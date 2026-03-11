import { useState, useEffect } from 'react'
import { BookOpen, Github, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'
import BenModal from './benModal'

const WORDS = ['live', 'act', 'think', 'move']

export default function HeroSection({ setBenModalOpen, isMobile }) {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % WORDS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

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
          minHeight: isMobile ? 'auto' : '100dvh', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: isMobile ? '0 24px' : '0 48px' 
        }}
      >
        {/* Top bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: 28, 
          paddingBottom: 28 
        }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Onyeachonam Buchi</span>
          {!isMobile && <span style={{ fontSize: 13, color: '#6b7280' }}>Frontend Developer</span>}
        </div>

        {/* Hero headline */}
        <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', alignItems: 'flex-start', paddingTop: isMobile ? 20 : 40, paddingBottom: isMobile ? 32 : 0 }}>
          <h1
            className="font-serif"
            style={{ 
              fontSize: 'clamp(40px, 9vw, 112px)', 
              lineHeight: 1.05, 
              color: '#1a1a1a', 
              fontWeight: 400, 
              maxWidth: isMobile ? '100%' : '80%' 
            }}
          >
            Creating Systems that <br />
            that change how<br />
            people{' '}
            <span
              style={{

                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                height: '1.1em',
              }}
            >
              <span
                key={wordIndex}
                style={{
                  display: 'inline-block',
                  fontStyle: 'italic',
                  animation: 'wordSlide 2.8s ease-in-out',
                }}
              >
                {WORDS[wordIndex]}.
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom row */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'flex-end', 
          paddingBottom: 47,
          gap: isMobile ? 32 : 0
        }}>
          {/* Subtext */}
          <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
            <div>
              Previously at <a href="https://sheratonhotels.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>Sheraton Hotels</a> &amp; <a href="https://www.21st-evolution.com/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>21st Century Evolutions Systems</a>.
            </div>
            <div style={{ marginTop: 4 }}>
              Now Fullstack and IT engineer at <a href="https://rceettech.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 900 }}>rceet technologies</a>.
            </div>
          </div>
          

          {/* Social links */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            alignItems: isMobile ? 'center' : 'flex-end', 
            gap: isMobile ? 20 : 10,
            flexWrap: 'wrap'
          }}>
            <a href="https://dribbble.com/BenCruze" target="_blank" rel="noreferrer" className="social-link">
              <BookOpen size={14} />
              {!isMobile && 'Blog'}
            </a>
            <a href="https://github.com/simplyMeister" target="_blank" rel="noreferrer" className="social-link">
              <Github size={14} />
              {!isMobile && 'Github'}
            </a>
            <a href="https://www.linkedin.com/in/benedict-onyeachonam/?trk=opento_sprofile_topcard" target="_blank" rel="noreferrer" className="social-link">
              <Linkedin size={14} />
              {!isMobile && 'LinkedIn'}
            </a>
          </div>
        </div>

        <style>{`
          @keyframes wordSlide {
            0%   { transform: translateY(100%); opacity: 0; }
            12%  { transform: translateY(0);    opacity: 1; }
            85%  { transform: translateY(0);    opacity: 1; }
            100% { transform: translateY(-60%); opacity: 0; }
          }
        `}</style>
      </motion.section>
    </>
  )
}
