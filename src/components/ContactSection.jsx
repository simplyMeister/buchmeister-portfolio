import { useState } from 'react'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import TicTacToeIcon from './TicTacToe'

export default function ContactSection({ setBenModalOpen, isMobile }) {

  return (
    <>
      {/* Contact */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: isMobile ? '60px 24px' : '80px 48px 40px' }}
      >
        <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 7vw, 96px)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.05, marginBottom: 16 }}>
          Let's work together.
        </h2>
        <a
          href="mailto:bonyeachonam.2200323@stu.cu.edu.ng"
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
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            © 2026 Onyeachonam Buchi
          </span>
          <button
            onClick={() => setBenModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 12,
              color: '#9ca3af',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              fontFamily: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            Ask Benedict
          </button>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="mailto:bonyeachonam.2200323@stu.cu.edu.ng" className="social-link" style={{ color: '#9ca3af' }}>
            <Mail size={18} />
          </a>
          <a href="https://github.com/simplyMeister" target="_blank" rel="noreferrer" className="social-link" style={{ color: '#9ca3af' }}>
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/benedict-onyeachonam/?trk=opento_sprofile_topcard" target="_blank" rel="noreferrer" className="social-link" style={{ color: '#9ca3af' }}>
            <Linkedin size={18} />
          </a>
          <a href="https://x.com/BenCruze_" target="_blank" rel="noreferrer" className="social-link" style={{ color: '#9ca3af' }}>
            <Twitter size={18} />
          </a>
          <TicTacToeIcon />
        </div>
      </footer>
    </>
  )
}
