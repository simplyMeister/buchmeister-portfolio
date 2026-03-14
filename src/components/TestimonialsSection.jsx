import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Mr Akan.',
    role: 'IT Director · Sheraton Hotels',
    quote: 'A Person that is reliable and gets the job done for any task',
  },
  {
    name: 'Demilade O.',
    role: 'Software Team · 21st CESL',
    quote: 'Someone willing to take on any challenge by learning and adapting to new things and making the most out of what he has been given',
  },
  {
    name: 'Raphael A.',
    role: 'Team Lead · Rceet Technologies',
    quote: 'He brings innovation to the team in a very impressive way. He is good at what he does',
  },
  {
    name: 'Dr. Tochi N.',
    role: 'CEO · Rceet Technologies',
    quote: 'Such a wonderful personality to have around. Always delivers on promises',
  },
  {
    name: 'Banjo Arewa',
    role: 'Mentor',
    quote: 'He is a lovely person to be around. He is very passionate about what he does and always willing to learn new things',
  },
]

const highlightPhrases = [
  { phrase: "reliable", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "gets the job done", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "take on any challenge", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "learning and adapting", color: "rgba(56, 189, 248, 0.2)" },
  { phrase: "most out of what he has been given", color: "rgba(234, 179, 8, 0.2)" },
  { phrase: "innovation", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "impressive way", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "good at what he does", color: "rgba(59, 130, 246, 0.2)" },
  { phrase: "wonderful personality", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "delivers on promises", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "lovely person", color: "rgba(34, 197, 94, 0.2)" },
  { phrase: "passionate", color: "rgba(168, 85, 247, 0.2)" },
  { phrase: "willing to learn", color: "rgba(59, 130, 246, 0.2)" }
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

function TestimonialCard({ t, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ marginBottom: 48 }}
    >
      {/* Decorative " mark */}
      <div style={{
        fontFamily: '"Lora", "Georgia", serif',
        fontSize: 36,
        color: '#c7d2fe',
        lineHeight: 1,
        marginBottom: 4,
        userSelect: 'none',
      }}>
        &ldquo;
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: '"Lora", "Georgia", serif',
        fontSize: 'clamp(15px, 1.8vw, 20px)',
        fontWeight: 400,
        color: 'var(--text)',
        lineHeight: 1.55,
        marginBottom: 20,
        letterSpacing: '-0.01em',
      }}>
        <HighlightedText text={t.quote} />
      </p>

      {/* Attribution */}
      <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text)',
          fontFamily: '"Satoshi", "Inter", sans-serif',
          marginBottom: 2,
        }}>
          {t.name}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--muted)',
          fontFamily: '"Satoshi", "Inter", sans-serif',
        }}>
          {t.role}
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection({ isMobile }) {
  const col1 = testimonials.filter((_, i) => i % 2 === 0)
  const col2 = testimonials.filter((_, i) => i % 2 !== 0)

  return (
    <section style={{ padding: isMobile ? '60px 24px' : '80px 48px', position: 'relative' }}>
      {isMobile ? (
        <>
          {/* Mobile: heading then all testimonials stacked */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ marginBottom: 40 }}
          >
            <h2 className="font-serif" style={{
              fontSize: 'clamp(36px, 10vw, 56px)',
              fontWeight: 400,
              color: '#a855f7',
              marginBottom: 12,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>
              What People Say
            </h2>
            <div style={{ width: 32, height: 2, background: 'var(--text)', marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: '"Satoshi", "Inter", sans-serif' }}>
              Kind words from people I've had the honour of working with.
            </p>
          </motion.div>
          {testimonials.map((t, i) => <TestimonialCard key={t.name} t={t} i={i} />)}
        </>
      ) : (
        /* Desktop: 3-column — heading | col1 testimonials | col2 testimonials (offset) */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0 48px',
          alignItems: 'start',
        }}>
          {/* Left: Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'sticky', top: 80 }}
          >
            <h2 className="font-serif" style={{
              fontSize: 'clamp(36px, 4vw, 64px)',
              fontWeight: 400,
              color: '#a855f7',
              marginBottom: 16,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}>
              What People Say
            </h2>
            <div style={{ width: 32, height: 2, background: 'var(--text)', marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: '"Satoshi", "Inter", sans-serif', maxWidth: '28ch' }}>
              Kind words from people I've had the honour of working with.
            </p>
          </motion.div>

          {/* Middle column */}
          <div>
            {col1.map((t, i) => <TestimonialCard key={t.name} t={t} i={i * 2} />)}
          </div>

          {/* Right column — offset downward */}
          <div style={{ paddingTop: 80 }}>
            {col2.map((t, i) => <TestimonialCard key={t.name} t={t} i={i * 2 + 1} />)}
          </div>
        </div>
      )}
    </section>
  )
}
