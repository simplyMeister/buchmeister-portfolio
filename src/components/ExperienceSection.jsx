import { motion } from 'framer-motion'

const experiences = [
  {
    role: "Network Assistant Intern",
    company: "Sheraton Hotels & Resorts",
    date: "2025 - Present",
    desc: "A Network Analyst at Sheraton Hotels responsible for maintaining, monitoring, and optimizing the hotel's network infrastructure to ensure high availability, security, and performance. Key duties include troubleshooting connectivity issues, managing network devices and configurations, supporting secure guest and internal network access, and implementing upgrades to enhance system reliability. Actively collaborates with IT teams to uphold service quality and support business operations across the facility.",
    tech: [".bat", "Opera"]
  },
  {
    role: "Front-End Developer",
    company: "Ecotech(CEO)",
    date: "2024 - present",
    desc: "Designed and developed user interfaces for web applications. Created wireframes, prototypes, and implemented responsive designs.",
    tech: ["Figma", "HTML", "CSS"]
  },
  {
    role: "Frontend Developer",
    company: "ICOC ikorodu.",
    date: "2025 - Present",
    desc: "Developed and maintained a responsive church website to enhance community engagement, streamline event updates, and provide easy access to sermons and livestreams. Integrated user-friendly interfaces and mobile-first designs to ensure accessibility across all devices. Collaborated with church leadership to align digital features with ministry goals and improve overall user experience.",
    tech: ["HTML", "CSS", "JavaScript"]
  },
  {
    role: "Software Specialist Intern",
    company: "21st Century Evolutions Systems",
    date: "May - September 2025",
    desc: "Worked as a software specialist Intern providing software solutions and IT services to the in-house team and key stakeholders and clients as well. Majorly involving in systems documentation, testing, peer reviews and also providing technical support to the team.",
    tech: ["VITE", "React", "Tailwind CSS", "Wordpress","teams"]
  },
  {
    role: "Frontend Developer and IT engineer",
    company: "Rccet Technologies",
    date: "2025 - Present",
    desc: "Developed and maintained a responsive business website to enhance community activities. Collaborated with the team to align digital features with business goals and improve overall user experience.",
    tech: ["React", "Tailwind CSS", "Framer-Motion"]
  }


]

export default function ExperienceSection({ isMobile }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        padding: isMobile ? '60px 24px' : '100px 48px',
        maxWidth: 1200,
        margin: '0 auto',
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
              
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, fontFamily: 'monospace' }}>
                {exp.date}
              </div>

              <p style={{ 
                fontSize: 15, 
                lineHeight: 1.7, 
                color: 'var(--muted)', 
                marginBottom: 24,
                maxWidth: '65ch'
              }}>
                {exp.desc}
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {exp.tech.map(tech => (
                  <span 
                    key={tech} 
                    style={{ 
                      fontSize: 12, 
                      padding: '4px 12px', 
                      borderRadius: 999, 
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      background: 'transparent'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.section>
  )
}
