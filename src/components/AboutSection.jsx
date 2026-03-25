import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

const techStack = {
  LANGUAGES: [
    { name: 'Python', color: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'TypeScript', color: '#3178C6', bg: 'rgba(49, 120, 198, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'C', color: '#A8B9CC', bg: 'rgba(168, 185, 204, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C++', color: '#00599C', bg: 'rgba(0, 89, 156, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'Java', color: '#007396', bg: 'rgba(0, 115, 150, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  ],
  FRONTEND: [
    { name: 'React', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', color: '#000000', bg: 'rgba(0, 0, 0, 0.05)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'React Native', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  ],
  BACKEND: [
    { name: 'Express', color: '#000000', bg: 'rgba(0, 0, 0, 0.05)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'SupaBase', color: '#3ECF8E', bg: 'rgba(62, 207, 142, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { name: 'MongoDB', color: '#47A248', bg: 'rgba(71, 162, 72, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'MySQL', color: '#4479A1', bg: 'rgba(68, 121, 161, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'FireBase', color: '#FFCA28', bg: 'rgba(255, 202, 40, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
  ],
  TOOLS: [
    { name: 'Docker', color: '#2496ED', bg: 'rgba(36, 150, 237, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', color: '#F05032', bg: 'rgba(240, 80, 50, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Github', color: '#181717', bg: 'rgba(24, 23, 23, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'VsCode', color: '#007ACC', bg: 'rgba(0, 122, 204, 0.1)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ],
}

const PHASES = [
  { bgClass: 'bg-action-green', hex: '#22c55e' },
  { bgClass: 'bg-action-pink', hex: '#ec4899' },
  { bgClass: 'bg-action-gold', hex: '#eab308' }
]

export default function AboutSection({ setBenModalOpen, isMobile, onDownload, phaseIndex }) {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: isMobile ? '60px 24px' : '80px 48px', position: 'relative', willChange: 'transform, opacity' }}
      >
        {/* Stats badges */}
        <div style={{ display: 'flex', gap: 12, marginBottom: isMobile ? 32 : 40, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge>Experience<span style={{ color: '#6b7280', marginLeft: 6 }}>1+ Years</span></Badge>
         
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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

            <button
              onClick={onDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
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
              <Download size={14} />
              Download Resume
            </button>
          </div>
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
             I'm a driven frontend developer and budding UI/UX designer, actively building my skills through hands-on projects and continuous learning. Though early in my journey—
             <motion.span 
               animate={{ backgroundColor: PHASES[phaseIndex].hex }}
               transition={{ duration: 0.8 }}
               style={{ 
                 color: '#ffffff', 
                 padding: '2px 8px', 
                 borderRadius: '4px',
                 display: 'inline-block'
               }}
             >
               with under two years of experience
             </motion.span>
             —I focus on creating responsive, user-centered interfaces and improving with each project.
            </p>
            <p className="prose-text">
              My approach combines technical expertise with creative problem-solving. I believe that great design is not just about aesthetics, but about creating intuitive, accessible, and enjoyable user experiences that solve real problems.
            </p>

            {/* Scroll indicator */}
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, opacity: 0.5 }}>
              <div style={{ width: 20, height: 32, border: '2px solid #9ca3af', borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
                <div style={{ width: 3, height: 7, background: '#9ca3af', borderRadius: 2, animation: 'scrollDot 1.5s ease infinite' }} />
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #9ca3af', marginLeft: 7 }} />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <motion.h3 
              className="font-serif" 
              animate={{ backgroundColor: PHASES[phaseIndex].hex }}
              transition={{ duration: 0.8 }}
              style={{ 
                fontSize: 28, 
                fontWeight: 400, 
                marginBottom: 24,
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '8px',
                display: 'inline-block'
              }}
            >
              Tech Stack
            </motion.h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '20px' : '24px' }}>
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', marginBottom: 12, textTransform: 'uppercase' }}>
                    {category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px' }}>
                    {items.map(tech => (
                      <div key={tech.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={tech.icon} alt={tech.name} style={{ width: 16, height: 16 }} />
                        <span style={{ fontSize: 13, color: tech.color, fontWeight: 500 }}>{tech.name}</span>
                      </div>
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
