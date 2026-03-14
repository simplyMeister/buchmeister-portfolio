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
  "JavaScript": { color: "#F7DF1E", bg: "rgba(247, 223, 30, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React": { color: "#61DAFB", bg: "rgba(97, 218, 251, 0.1)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
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

export default function ExperienceSection({ isMobile }) {
  const containerRef = useRef(null)

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        padding: isMobile ? '60px 24px' : '100px 48px',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'flex-start'
      }}>
        
        {/* Section Title */}
        <h2 className="font-serif" style={{ 
          fontSize: 'clamp(40px, 6vw, 80px)', 
          fontWeight: 400, 
          color: '#22c55e', 
          lineHeight: 1,
          letterSpacing: '-0.02em',
          width: isMobile ? '100%' : '35%',
          position: isMobile ? 'static' : 'sticky',
          top: 100
        }}>
          Experience
        </h2>

        {/* Experience List */}
        <div style={{ width: isMobile ? '100%' : '65%', display: 'flex', flexDirection: 'column', gap: 64 }}>
          {experiences.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{exp.role}</h3>
                <span style={{ color: 'var(--muted)' }}>—</span>
                <span style={{ fontSize: 16, color: 'var(--text)', fontWeight: 500 }}>{exp.company}</span>
              </div>
              
              <div style={{ 
                fontSize: 13, 
                color: exp.dateColor || 'var(--muted)', 
                marginBottom: 20, 
                fontFamily: 'monospace',
                fontWeight: 600
              }}>
                {exp.date}
              </div>

              <p style={{ 
                fontSize: 15, 
                lineHeight: 1.7, 
                color: 'var(--muted)', 
                marginBottom: 24,
                maxWidth: '65ch'
              }}>
                <HighlightedText text={exp.desc} />
              </p>

              <div style={{ display: 'flex', gap: '8px 12px', flexWrap: 'wrap' }}>
                {exp.tech.map(tech => {
                  const data = TECH_MAP[tech] || { color: 'var(--text)', bg: 'rgba(128,128,128,0.1)' }
                  return (
                    <div 
                      key={tech} 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12, 
                        padding: '4px 10px', 
                        borderRadius: 8, 
                        border: `1px solid ${data.color}20`,
                        color: data.color,
                        background: data.bg,
                        fontWeight: 600
                      }}
                    >
                      {data.icon && <img src={data.icon} alt={tech} style={{ width: 12, height: 12 }} />}
                      {tech}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}
