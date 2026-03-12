import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'

const row1Data = [
  { title: "BSC MIS", institution: "Covenant University", year: "2022-26", type: "edu", color: "#3B82F6" },
  { title: "Project Certification", institution: "Coursera", year: "2024", type: "cert", color: "#10B981" },
  { title: "Ethical Hacking", institution: "CISCO", year: "2025", type: "cert", color: "#EF4444" },
  { title: "IT Essentials", institution: "CISCO", year: "2023", type: "cert", color: "#F59E0B" },
  { title: "Prompt Engineering", institution: "OBtranslate", year: "2022", type: "cert", color: "#8B5CF6" }
]

const row2Data = [
  { title: "SSCE", institution: "Bencom College", year: "2022", type: "cert", color: "#FF9900" },
  { title: "Artificial Intelligence Training", institution: "Ace Writers Digital", year: "2025", type: "cert", color: "#F43F5E" },
  { title: "Educator Award", institution: "icoc", year: "2025", type: "edu", color: "#22C55E" },
  { title: "Frontend Development", institution: "Axia", year: "2024", type: "cert", color: "#61DAFB" },
  { title: "Web Development", institution: "Udemy", year: "2022", type: "cert", color: "#3178C6" }
]

const row3Data = [
  { title: "Project Certification", institution: "Coursera", year: "2024", type: "cert", color: "#10B981" },
  { title: "Ethical Hacking", institution: "CISCO", year: "2025", type: "cert", color: "#F59E0B" },
  { title: "IT Essentials", institution: "CISCO", year: "2023", type: "cert", color: "#EF4444" },
  { title: "Prompt Engineering", institution: "CISCO", year: "2023", type: "cert", color: "#F59E0B" },
  { title: "BSC MIS", institution: "Covenant University", year: "2022-26", type: "cert", color: "#8B5CF6" }
]
export default function EducationSection({ isMobile }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        padding: isMobile ? '60px 0' : '80px 0',
        overflow: 'hidden',
        background: 'rgba(128, 128, 128, 0.02)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 24px' : '0 48px' }}>
        <h2 className="font-serif" style={{ 
          fontSize: 'clamp(40px, 6vw, 80px)', 
          fontWeight: 400, 
          color: 'var(--text)', 
          marginBottom: 48,
          letterSpacing: '-0.02em',
        }}>
          Education & Certifications
        </h2>
      </div>

      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Row 1: Right to Left */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" } }}
          style={{ display: 'flex', gap: 40, width: 'max-content', willChange: 'transform' }}
        >
          {/* Render mapping twice for seamlessness */}
          {[...row1Data, ...row1Data].map((item, i) => <Badge key={i} item={item} />)}
        </motion.div>

        {/* Row 2: Left to Right */}
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 32, ease: "linear" } }}
          style={{ display: 'flex', gap: 40, width: 'max-content', willChange: 'transform' }}
        >
          {[...row2Data, ...row2Data].map((item, i) => <Badge key={i} item={item} />)}
        </motion.div>

        {/* Row 3: Right to Left */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 28, ease: "linear" } }}
          style={{ display: 'flex', gap: 40, width: 'max-content', willChange: 'transform' }}
        >
          {[...row3Data, ...row3Data].map((item, i) => <Badge key={i} item={item} />)}
        </motion.div>
      </div>
    </motion.section>
  )
}

function Badge({ item }) {
  const badgeColor = item.color || '#808080';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 24px',
        borderRadius: 12,
        background: `${badgeColor}33`, 
        border: `1.5px solid ${badgeColor}`, 
        whiteSpace: 'nowrap',
        boxShadow: `0 2px 8px ${badgeColor}10` // Simplified shadow for performance
      }}
    >
      <div style={{ 
        color: badgeColor, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)', // White background for the icon to make it pop
        width: 36,
        height: 36,
        borderRadius: 8,
        border: `1px solid ${badgeColor}30`
      }}>
        {item.type === 'edu' ? <GraduationCap size={18} /> : <Award size={18} />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{item.title}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{item.institution}</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{item.year}</span>
        </div>
      </div>
    </div>
  )
}

