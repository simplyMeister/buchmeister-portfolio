import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import WorksSection from './components/WorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import ContactSection from './components/ContactSection'
import Preloader from './components/Preloader'
import BenModal from './components/benModal'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [benModalOpen, setBenModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {benModalOpen && <BenModal onClose={() => setBenModalOpen(false)} />}
      
      <div 
        className="grid-bg" 
        style={{ 
          minHeight: '100vh', 
          position: 'relative',
        }}
      >
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
          <HeroSection setBenModalOpen={setBenModalOpen} isMobile={isMobile} />
          <AboutSection setBenModalOpen={setBenModalOpen} isMobile={isMobile} />
          <WorksSection isMobile={isMobile} />
          <TestimonialsSection isMobile={isMobile} />
          <ContactSection setBenModalOpen={setBenModalOpen} isMobile={isMobile} />
        </div>
      </div>
    </>
  )
}
