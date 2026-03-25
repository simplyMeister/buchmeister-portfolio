import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const experiences = [
  {
    role: "Network Assistant Intern",
    company: "Sheraton Hotels & Resorts",
    date: "2025 - Present",
    dateColor: "#22c55e",
    desc: "A Network Analyst at Sheraton Hotels responsible for maintaining, monitoring, and optimizing the hotel's network infrastructure to ensure high availability, security, and performance. Key duties include troubleshooting connectivity issues, managing network devices and configurations, supporting secure guest and internal network access, and implementing upgrades to enhance system reliability. Actively collaborates with IT teams to uphold service quality and support business operations across the facility.",
    tech: [".bat", "Opera"]
  },
  {
    role: "Front-End Developer",
    company: "Ecotech(CEO)",
    date: "2024 - present",
    dateColor: "#3b82f6",
    desc: "Designed and developed user interfaces for web applications. Created wireframes, prototypes, and implemented responsive designs. Focused on building scalable and maintainable codebases for modern web apps.",
    tech: ["Figma", "HTML", "CSS"]
  },
  {
    role: "Frontend Developer",
    company: "ICOC ikorodu.",
    date: "2025 - Present",
    dateColor: "#22c55e",
    desc: "Developed and maintained a responsive church website to enhance community engagement, streamline event updates, and provide easy access to sermons and livestreams. Integrated user-friendly interfaces and mobile-first designs to ensure accessibility across all devices. Collaborated with church leadership to align digital features with ministry goals and improve overall user experience.",
    tech: ["HTML", "CSS", "JavaScript"]
  },
  {
    role: "Software Specialist Intern",
    company: "21st Century Evolutions Systems",
    date: "May - September 2025",
    dateColor: "#f59e0b",
    desc: "Worked as a software specialist Intern providing software solutions and IT services to the in-house team and key stakeholders and clients as well. Majorly involving in systems documentation, testing, peer reviews and also providing technical support to the team.",
    tech: ["VITE", "React", "Tailwind CSS", "Wordpress","teams"]
  },
  {
    role: "Frontend Developer and IT engineer",
    company: "Rccet Technologies",
    date: "2025 - Present",
    dateColor: "#22c55e",
    desc: "Developed and maintained a responsive business website to enhance community activities. Collaborated with the team to align digital features with business goals and improve overall user experience. Focused on performance optimization and modern UI/UX principles.",
    tech: ["React", "Tailwind CSS", "Framer-Motion"]
  }
]

const highlightPhrases = [
  { phrase: "Sheraton Hotels", color: "rgba(56, 224, 118, 0.2)" },
  { phrase: "performance", color: "rgba(87, 196, 127, 0.2)" },
  { phrase: "responsive designs", color: "rgba(236, 72, 153, 0.2)"  },
  { phrase: "maintainable codebases", color: "rgba(195, 214, 24, 0.2)" },
  { phrase: "Created wireframes", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "community engagement", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: " streamline event updates", color: "rgba(19, 103, 212, 0.2)" },
  { phrase: "software specialist Intern", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: " in-house team", color: "rgba(236, 72, 153, 0.2)" },
  { phrase: "key stakeholders", color: "rgba(135, 197, 34, 0.2)" },
  { phrase: "clients ", color: "rgba(135, 197, 34, 0.2)" },
  { phrase: "systems documentation", color: "rgba(58, 131, 86, 0.2)" },
  { phrase: "testing", color: "rgba(90, 128, 104, 0.2)" },
  { phrase: "peer reviews", color: "rgba(53, 103, 122, 0.2)" },
  { phrase: "technical support", color: "rgba(4, 150, 58, 0.2)" },
  { phrase: "responsive business website", color: "rgba(35, 134, 71, 0.2)" },
  { phrase: "business goals", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "easy access to sermons and livestreams", color: "rgba(136, 86, 66, 0.2)" },
  { phrase: "church leadership", color: "rgba(62, 95, 74, 0.2)" },
  { phrase: "troubleshooting", color: "rgba(239, 68, 68, 0.2)" },
  { phrase: "upgrades to enhance system reliability", color: "rgba(236, 72, 153, 0.2)" },
  { phrase: "Ecotech(CEO)", color: "rgba(234, 179, 8, 0.2)" },
  { phrase: "Rccet Technologies", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "church website", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "software solutions", color: "rgba(6, 182, 212, 0.2)" }
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

const TECH_MAP = {
  "Python": { color: "#3776AB", bg: "rgba(55, 118, 171, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "TypeScript": { color: "#3178C6", bg: "rgba(49, 120, 198, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript": { color: "#b45309", bg: "rgba(180, 83, 9, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React": { color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "HTML": { color: "#E34F26", bg: "rgba(227, 79, 38, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  "CSS": { color: "#1572B6", bg: "rgba(21, 114, 182, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Tailwind CSS": { color: "#06B6D4", bg: "rgba(6, 182, 212, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  "Figma": { color: "#F24E1E", bg: "rgba(242, 78, 30, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  "VITE": { color: "#646CFF", bg: "rgba(100, 108, 255, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
  "Wordpress": { color: "#21759B", bg: "rgba(33, 117, 155, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  "teams": { color: "#6264A7", bg: "rgba(98, 100, 167, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftteams/microsoftteams-original.svg" },
  "Framer-Motion": { color: "#0055FF", bg: "rgba(0, 85, 255, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framerjs/framerjs-original.svg" },
  ".bat": { color: "#4EAA25", bg: "rgba(78, 170, 37, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
  "Opera": { color: "#FF1B2D", bg: "rgba(255, 27, 45, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg" }
}

function SidebarCard({ children, accent, isMobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: '24px', // Increased padding
        width: isMobile ? '100%' : '100%',
        maxWidth: isMobile ? 'none' : 320,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.02)',
        position: 'relative',
        overflow: 'hidden',
        alignSelf: 'start'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: 2, 
        height: '100%', 
        background: accent,
        opacity: 0.5
      }} />
      {children}
    </motion.div>
  )
}

export default function ExperienceSection({ isMobile }) {
  const containerRef = useRef(null)

  const SIDEBAR_CONTENT = [
    // 1. Sheraton
    (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 8, height: 8 }}>
            <div className="pulse-circle" style={{ background: '#22c55e' }} />
            <div style={{ position: 'absolute', inset: 0, background: '#22c55e', borderRadius: '50%', opacity: 0.8 }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live @ Sheraton</span>
        </div>
        <div style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="140" height="100" viewBox="0 0 140 100">
            {[
              { x: 70, y: 20, label: 'Core' },
              { x: 30, y: 70, label: 'vLAN' },
              { x: 110, y: 70, label: 'Guest' }
            ].map((node, i) => (
              <g key={i}>
                <motion.circle cx={node.x} cy={node.y} r="5" fill="#22c55e" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 * i }} />
                <text x={node.x} y={node.y + 15} fontSize="9" fill="var(--muted)" textAnchor="middle">{node.label}</text>
              </g>
            ))}
            <motion.path d="M70,20 L30,70 M70,20 L110,70 M30,70 L110,70" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
          </svg>
        </div>
      </div>
    ),
    // 2. Ecotech
    (
      <>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Technical Leadership</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Frontend Architecture', value: 90, color: '#61DAFB' },
            { label: 'System Design', value: 75, color: '#3b82f6' }
          ].map(skill => (
            <div key={skill.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, color: 'var(--muted)' }}>
                <span>{skill.label}</span>
                <span>{skill.value}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(128,128,128,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.value}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: skill.color }} />
              </div>
            </div>
          ))}
        </div>
      </>
    ),
    // 3. ICOC
    (
      <>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Core Domains</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Community Web', 'Accessibility', 'UX Principles', 'Mobile-First'].map(tag => (
            <span key={tag} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)' }}>{tag}</span>
          ))}
        </div>
      </>
    ),
    // 4. 21st Century
    (
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="80" height="80" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(128,128,128,0.1)" strokeWidth="3" />
          <motion.circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="65 35" strokeDashoffset="25" initial={{ strokeDasharray: "0 100" }} whileInView={{ strokeDasharray: "65 35" }} transition={{ duration: 1 }} />
          <text x="18" y="21" fontSize="9" fill="var(--text)" textAnchor="middle" fontWeight="bold">65%</text>
        </svg>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            <span>IT Solutions</span>
          </div>
          <div style={{ fontSize: 10, marginTop: 4 }}>High-stake deliverables</div>
        </div>
      </div>
    ),
    // 5. Rceet
    (
      <>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 16 }}>Learning Velocity</span>
        <div style={{ height: 160, width: '100%', marginTop: 24, background: 'rgba(234, 179, 8, 0.03)', borderRadius: 16, padding: '20px' }}>
          <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
            <motion.path
              d="M0,70 Q30,30 60,60 T120,40 T180,60 T220,15" // Adjusted coordinates to prevent clipping
              fill="none"
              stroke="#eab308"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </svg>
        </div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Current Growth</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#eab308' }}>+18% / mo</span>
        </div>
      </>
    )
  ]

  const cardAccents = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#eab308"]

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        padding: isMobile ? '60px 24px' : '100px 48px',
        maxWidth: 1400,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Horizontal Header */}
      <div style={{ marginBottom: isMobile ? 40 : 80 }}>
        <h2 className="font-serif" style={{ 
          fontSize: 'clamp(40px, 8vw, 100px)', 
          fontWeight: 400, 
          color: '#22c55e', 
          lineHeight: 1,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Experience
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 80 : 120 }}>
        {experiences.map((exp, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column-reverse' : 'row', // Reverse mobile to put text first
            gap: isMobile ? 32 : 80,
            alignItems: 'flex-start'
          }}>
            {/* Left Column: Creative Card (Hidden on mobile top, shown below text) */}
            {!isMobile && (
              <div style={{ width: 320, flexShrink: 0 }}>
                <SidebarCard accent={cardAccents[i]} isMobile={isMobile}>
                  {SIDEBAR_CONTENT[i]}
                </SidebarCard>
              </div>
            )}

            {/* Right Column: Experience Text */}
            <div style={{ flex: 1 }}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{exp.role}</h3>
                  <span style={{ color: 'var(--muted)' }}>—</span>
                  <span style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>{exp.company}</span>
                </div>
                
                <div style={{ fontSize: 14, color: exp.dateColor || 'var(--muted)', marginBottom: 24, fontFamily: 'monospace', fontWeight: 600 }}>
                  {exp.date}
                </div>

                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)', marginBottom: 28, maxWidth: '65ch' }}>
                  <HighlightedText text={exp.desc} />
                </p>

                <div style={{ display: 'flex', gap: '8px 12px', flexWrap: 'wrap' }}>
                  {exp.tech.map(tech => {
                    const data = TECH_MAP[tech] || { color: 'var(--text)', bg: 'rgba(128,128,128,0.1)' }
                    return (
                      <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 14px', borderRadius: 10, border: `1px solid ${data.color}20`, color: data.color, background: data.bg, fontWeight: 600 }}>
                        {data.icon && <img src={data.icon} alt={tech} style={{ width: 14, height: 14 }} />}
                        {tech}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
              
              {/* Visual for mobile only (Placed below text) */}
              {isMobile && (
                <div style={{ marginTop: 32 }}>
                  <SidebarCard accent={cardAccents[i]} isMobile={isMobile}>
                    {SIDEBAR_CONTENT[i]}
                  </SidebarCard>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
