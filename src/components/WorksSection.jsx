import { useState, useRef, useEffect } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ecotech from '../assets/ecotech.png'
import personalsite from '../assets/personalsite.png'
import ping from '../assets/ping.png'
import ping2 from '../assets/ping2.png'
import portfolio from '../assets/portfolio.png'
import telegram from '../assets/telegram.png'
import wine from '../assets/wine.png'
import rceet from '../assets/rceet.png'
import titanic from '../assets/titanic.png'

const projects = [
  {
    name: 'Portfolio Page',
    desc: 'The initial portfolio website designed to showcase Buchi Onyeachonams capabilities as a Frontend Developer, highlighting technical skills, projects, and professional experience.',
    link: 'https://buchi-portfolio-weld.vercel.app/',
    linkLabel: 'Live Demo',
    linkIcon: 'external',
    image: portfolio,
    headerBg: 'rgba(34, 197, 94, 0.15)'
  },
  {
    name: 'Protocol Bot',
    desc: 'A telegram bot that assists provosts of an office to carry out administrative duties with respect to duty segregation and attendance taking and process overview summarization',
    link: '#',
    linkLabel: 'Github',
    linkIcon: 'github',
    image: telegram,
    headerBg: 'rgba(168, 85, 247, 0.15)'
  },
  {
    name: 'Eco-tech',
    desc: 'A personal project focused on leveraging technology to promote environmental sustainability. Ecotech explores innovative digital solutions to reduce ecological impact',
    link: '#',
    linkLabel: 'Live Demo',
    linkIcon: 'external',
    image: ecotech,
    headerBg: 'rgba(59, 130, 246, 0.15)'
  },
  {
    name: 'PingSite-Sheraton',
    desc: 'A web application designed to collect and store IP addresses, execute ping requests, and deliver real-time feedback to users on connection success or failure.',
    link: '#',
    linkLabel: 'Github',
    linkIcon: 'github',
    image: ping2,
    headerBg: 'rgba(236, 72, 153, 0.15)'
  },
  {
    name: 'Wine Cultivar',
    desc: 'A model that predicts the cultivar of wine based on chemical properties of the wine',
    link: '#',
    linkLabel: 'Live Demo',
    linkIcon: 'external',
    image: wine,
    headerBg: 'rgba(234, 179, 8, 0.15)'
  },
  {
    name: 'Rceet Technologies',
    desc: 'A web application Founded with a vision to transfrom education through technology. Rceet tech delivers  comprehensive educational solutions that bridge traditional learning with modern digital and global requirements.',
    link: 'https://rceettech.com/',
    linkLabel: 'Github',
    linkIcon: 'github',
    placeholderBg: 'linear-gradient(135deg, #e8eaf6 0%, #9fa8da 50%, #5c6bc0 100%)',
    image: rceet,
    headerBg: 'rgba(99, 102, 241, 0.15)'
  },
  {
    name: 'Titanic Model',
    desc: 'A model that predicts the survival of passengers on the Titanic based on certain attributes of the passengers',
    link: '#',
    linkLabel: 'Live Demo',
    linkIcon: 'external',
    image: titanic,
    headerBg: 'rgba(239, 68, 68, 0.15)'
  },
]

const highlightPhrases = [
  { phrase: "Buchi Onyeachonams capabilities", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "Frontend Developer", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "technical skills", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "professional experience", color: "rgba(236, 72, 153, 0.2)" },
  { phrase: "telegram bot", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "provosts", color: "rgba(234, 179, 8, 0.2)" },
  { phrase: "duty segregation", color: "rgba(236, 72, 153, 0.2)" },
  { phrase: "attendance takking", color: "rgba(239, 68, 68, 0.2)" },
  { phrase: "environmental sustainability", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "Ecotech", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "innovative digital solutions", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "ecological impact", color: "rgba(234, 179, 8, 0.2)" },
  { phrase: "IP addresses", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "ping requests", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "real-time feedback", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "connection success", color: "rgba(234, 179, 8, 0.2)" },
  { phrase: "wine", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "chemical properties", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "cultivar", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "transfrom education", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "comprehensive educational solutions", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "digital and global requirements", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "survival of passengers", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "Titanic", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "certain attributes", color: "rgba(59, 130, 246, 0.2)" }
]

function HighlightedText({ text }) {
  let parts = [text]
  highlightPhrases.forEach(({ phrase, color }) => {
    let newParts = []
    parts.forEach(part => {
      if (typeof part === 'string') {
        const split = part.split(new RegExp(`(${phrase})`, 'g'))
        split.forEach(s => {
          if (s === phrase) {
            newParts.push(<span key={Math.random()} style={{ backgroundColor: color, padding: '1px 4px', borderRadius: '4px', color: 'inherit' }}>{s}</span>)
          } else if (s !== '') {
            newParts.push(s)
          }
        })
      } else {
        newParts.push(part)
      }
    })
    parts = newParts
  })
  return <>{parts}</>
}

export default function WorksSection({ isMobile }) {
  return (
    <section style={{ padding: isMobile ? '60px 24px' : '100px 48px' }}>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="font-serif"
        style={{
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 400,
          color: '#eab308',
          marginBottom: 64,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          willChange: 'transform, opacity'
        }}
      >
        Selected Works
      </motion.h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '32px' : '24px 48px', 
        alignItems: 'start' 
      }}>
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.name} 
            project={project}
            offset={!isMobile && index % 2 !== 0} 
            isMobile={isMobile}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, offset, isMobile, index }) {
  const ref = useRef(null)

  // Motion values for 3D tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth return and movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  // Transform coordinates to rotation angles (max 10 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

  // Hover state for scaling and shadow
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!ref.current || isMobile) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  // Calculate stagger delay based on column (0 for left, 1 for right) to create the ripple effect
  const staggerDelay = isMobile ? 0 : (index % 2) * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: staggerDelay 
      }}
      style={{ 
        marginTop: offset ? 40 : 0,
        marginBottom: isMobile ? 0 : 12,
        perspective: 1000
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          background: project.image ? 'transparent' : project.placeholderBg,
          height: isMobile ? 260 : 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: 12, // Reduced from 20
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isHovered && !isMobile ? 1.03 : 1,
          boxShadow: 'none',
          transition: 'scale 0.3s ease',
          transformStyle: 'preserve-3d',
          cursor: 'pointer'
        }}
      >
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block'
            }} 
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: 0.7,
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 12,
              fontFamily: '"Satoshi", "Inter", sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {project.placeholderLabel}
            </span>
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
          borderRadius: 6,
          padding: '3px 8px',
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}>
            {project.name === 'Protocol Bot' ? 'telegram bot' : 'Web app'}
          </span>
        </div>
      </motion.div>

      <h3
        className="font-serif"
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: 16,
          letterSpacing: '-0.01em',
          display: 'flex'
        }}
      >
        <span style={{ 
          backgroundColor: project.headerBg, 
          padding: '2px 10px', 
          borderRadius: '6px',
          lineHeight: 1.2
        }}>
          {project.name}
        </span>
      </h3>
      <p style={{ 
        fontSize: 14, 
        color: 'var(--muted)', 
        lineHeight: 1.65, 
        marginBottom: 20, 
        fontFamily: '"Satoshi", "Inter", sans-serif',
        maxWidth: '45ch'
      }}>
        <HighlightedText text={project.desc} />
      </p>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 6, 
          fontSize: 13, 
          color: '#eab308', 
          textDecoration: 'none', 
          fontFamily: '"Satoshi", "Inter", sans-serif', 
          transition: 'filter 0.2s',
          fontWeight: 600
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.8)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'none'}
      >
        {project.linkIcon === 'github' ? <Github size={14} /> : <ExternalLink size={14} />}
        {project.linkLabel}
      </a>
    </motion.div>
  )
}
