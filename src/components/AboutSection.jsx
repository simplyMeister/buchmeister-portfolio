import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const techStack = {
  LANGUAGES: ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'Java'],
  FRONTEND: ['React', 'Next.js', 'React Native'],
  BACKEND: [ 'Express', 'SupaBase', 'MongoDB', 'MySQL','FireBase'],
  TOOLS: ['Docker', 'Git', 'Github', 'VsCode',],
}

export default function AboutSection({ setBenModalOpen, isMobile }) {

  return (
    <>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: isMobile ? '60px 24px' : '80px 48px', position: 'relative' }}
      >
        {/* Stats badges */}
        <div style={{ display: 'flex', gap: 12, marginBottom: isMobile ? 32 : 40, flexWrap: 'wrap' }}>
          <Badge>Experience<span style={{ color: '#6b7280', marginLeft: 6 }}>1+ Years</span></Badge>
          <Badge>Projects<span style={{ color: '#6b7280', marginLeft: 6 }}>5+ Shipped</span></Badge>
          {!isMobile && (
            <button
              onClick={() => setBenModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 999,
                border: '1px solid #d1d5db',
                background: '#f9f7f2',
                fontSize: 13,
                color: '#1a1a1a',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e5e7eb' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f9f7f2' }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 14 }}>⌘K</span>
              {' '}Ask Benedict
            </button>
          )}
        </div>

        {/* Two-column layout (stacks on mobile) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '40px' : '40px 80px', 
          alignItems: 'start' 
        }}>
          {/* Bio text */}
          <div>
            <p className="prose-text" style={{ marginBottom: 24 }}>
             I'm a driven frontend developer and budding UI/UX designer, actively building my skills through hands-on projects and continuous learning. Though early in my journey—with under two years of experience—I focus on creating responsive, user-centered interfaces and improving with each project.
            </p>
            <p className="prose-text">
              My approach combines technical expertise with creative problem-solving. I believe that great design is not just about aesthetics, but about creating intuitive, accessible, and enjoyable user experiences that solve real problems.
            </p>

            {/* Scroll indicator (only on desktop maybe? actually let's keep it but adjust) */}
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, opacity: 0.5 }}>
              <div style={{ width: 20, height: 32, border: '2px solid #9ca3af', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
                <div style={{ width: 3, height: 7, background: '#9ca3af', borderRadius: 2, animation: 'scrollDot 1.5s ease infinite' }} />
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #9ca3af', marginLeft: 7 }} />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-serif" style={{ fontSize: 28, fontWeight: 400, color: '#1a1a1a', marginBottom: 24 }}>Tech Stack</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '20px' : '20px 40px' }}>
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
                    {items.map(item => (
                      <span key={item} style={{ fontSize: 13, color: '#374151' }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </>
  )
}

function Badge({ children }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '5px 14px',
      borderRadius: 999,
      border: '1px solid #d1d5db',
      background: '#f9f7f2',
      fontSize: 13,
      color: '#1a1a1a',
      fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </div>
  )
}
