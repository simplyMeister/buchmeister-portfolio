import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useScroll, useSpring, motion, AnimatePresence } from 'framer-motion'

const HeroSection = lazy(() => import('./components/HeroSection'))
const AboutSection = lazy(() => import('./components/AboutSection'))
const ExperienceSection = lazy(() => import('./components/ExperienceSection'))
const EducationSection = lazy(() => import('./components/EducationSection'))
const WorksSection = lazy(() => import('./components/WorksSection'))
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'))
const ContactSection = lazy(() => import('./components/ContactSection'))

const PHASES = [
  {
    verb: 'change',
    bgClass: 'bg-action-green',
    hex: '#22c55e',
    startHex: '#22c55e',
    endHex: '#a855f7', // Purple complementary
    actions: ['live', 'act', 'think', 'move']
  },
  {
    verb: 'inspires',
    bgClass: 'bg-action-pink',
    hex: '#ec4899',
    startHex: '#ec4899',
    endHex: '#06b6d4', // Cyan complementary
    actions: ['interact', 'socialize', 'feel', 'operate']
  },
  {
    verb: 'postulate',
    bgClass: 'bg-action-gold',
    hex: '#eab308',
    startHex: '#eab308',
    endHex: '#6366f1', // Indigo complementary
    actions: ['plan', 'strategize', 'work', 'win']
  }
]
import Preloader from './components/Preloader'
import BenModal from './components/benModal'
import MagneticButton from './components/MagneticButton'
import resumeFile from './assets/Buchi_Onyeachonam_Resume.pdf'

import { Palette, CheckCircle } from 'lucide-react'

import { 
  HeroSkeleton, 
  AboutSkeleton, 
  WorksSkeleton, 
  TestimonialsSkeleton, 
  ContactSkeleton,
  ExperienceSkeleton,
  EducationSkeleton
} from './components/Skeletons'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [benModalOpen, setBenModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState('light') // light, dark, aurora
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleDownload = () => {
    console.log("Download triggered")
    setShowToast(true)
    
    // Create a hidden link and click it to trigger download
    const link = document.createElement('a')
    link.href = resumeFile // We'll need to pass resumeFile to App or handle it in About
    link.download = "Buchi_Onyeachonam_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => setShowToast(false), 4000)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const [phaseIndex, setPhaseIndex] = useState(0)
  const [actionIndex, setActionIndex] = useState(0)

  useEffect(() => {
    const actionInterval = setInterval(() => {
      setActionIndex(i => {
        if (i === PHASES[phaseIndex].actions.length - 1) {
          setPhaseIndex(p => (p + 1) % PHASES.length)
          return 0
        }
        return i + 1
      })
    }, 4000)
    return () => clearInterval(actionInterval)
  }, [phaseIndex])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {benModalOpen && <BenModal onClose={() => setBenModalOpen(false)} />}
      
      {/* Theme Selector UI */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
        
        {/* Theme Menu */}
        {themeMenuOpen && (
          <div 
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 8,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              animation: 'fadeIn 0.2s ease'
            }}
          >
            {['light', 'aurora'].map(t => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t)
                  setThemeMenuOpen(false)
                }}
                style={{
                  background: theme === t ? 'rgba(128, 128, 128, 0.1)' : 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  textTransform: 'capitalize',
                  fontFamily: '"Satoshi", "Inter", sans-serif',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => { if (theme !== t) e.currentTarget.style.background = 'rgba(128, 128, 128, 0.05)' }}
                onMouseLeave={e => { if (theme !== t) e.currentTarget.style.background = 'transparent' }}
              >
                {t} Theme
              </button>
            ))}
          </div>
        )}

        {/* Theme Toggle Button */}
        <MagneticButton distance={80}>
          <button 
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            title="Change Theme"
          >
            <Palette size={20} />
          </button>
        </MagneticButton>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--accent)',
          transformOrigin: '0%',
          zIndex: 10000,
          scaleX
        }}
      />

      <div 
        className="grid-bg" 
        style={{ 
          minHeight: '100vh', 
          position: 'relative',
          '--grid-start': `${PHASES[phaseIndex].startHex}38`,
          '--grid-end': `${PHASES[phaseIndex].endHex}38`,
          transition: 'background-image 0.5s ease, --grid-start 0.8s ease, --grid-end 0.8s ease'
        } }
      >
        {/* Animated Aurora Background (only visible in aurora theme) */}
        <div className="aurora-bg" />
        
        {/* Edge vignette */}
        <div className="vignette" />

        {/* Main content */}
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            maxWidth: 1200, 
            margin: '0 auto',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(40px)' : 'translateY(0)',
            transition: 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: loading ? 'none' : 'auto',
          }}
        >
          <Suspense fallback={<HeroSkeleton isMobile={isMobile} />}>
            <HeroSection 
              setBenModalOpen={setBenModalOpen} 
              isMobile={isMobile} 
              phaseIndex={phaseIndex}
              actionIndex={actionIndex}
              PHASES={PHASES}
            />
          </Suspense>
          <Suspense fallback={<AboutSkeleton isMobile={isMobile} />}>
            <AboutSection 
              setBenModalOpen={setBenModalOpen} 
              isMobile={isMobile} 
              onDownload={handleDownload}
            />
          </Suspense>
          <Suspense fallback={<ExperienceSkeleton isMobile={isMobile} />}>
            <ExperienceSection isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<EducationSkeleton isMobile={isMobile} />}>
            <EducationSection isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<WorksSkeleton isMobile={isMobile} />}>
            <WorksSection isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<TestimonialsSkeleton isMobile={isMobile} />}>
            <TestimonialsSection isMobile={isMobile} />
          </Suspense>
          <Suspense fallback={<ContactSkeleton isMobile={isMobile} />}>
            <ContactSection setBenModalOpen={setBenModalOpen} isMobile={isMobile} />
          </Suspense>
        </div>
      </div>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 100000,
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 16,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              maxWidth: isMobile ? 'calc(100vw - 64px)' : 400,
              color: '#1a1a1a',
            }}
          >
            <div 
              style={{ 
                background: 'var(--accent)', 
                color: 'white', 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Download Started!</h4>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#4b5563', lineHeight: 1.4 }}>
                Thank you for downloading my resume. I look forward to connecting with you!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
