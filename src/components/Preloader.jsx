import { useState, useEffect } from 'react'

const WORDS = ['Developer', 'Designer', 'Creator']
const COLUMNS = 5

export default function Preloader({ onComplete }) {
  const [step, setStep] = useState(1)
  const [slideUp, setSlideUp] = useState(false)
  const [hideText, setHideText] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  // Wait for page to fully load before starting the word animation
  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoaded(true)
    } else {
      const handleLoad = () => setIsLoaded(true)
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return // Don't start until loaded

    if (step <= WORDS.length) {
      const timer = setTimeout(() => setStep(s => s + 1), 600) // Slower sequential appearance
      return () => clearTimeout(timer)
    } else {
      // Hide text and slide up when words are done
      setHideText(true)
      
      setTimeout(() => {
        setSlideUp(true)
        setTimeout(onComplete, 1200) // Wait for staggered columns to finish
      }, 500) // Longer delay before sliding up out of view
    }
  }, [step, isLoaded, onComplete])

  return (
    <>
      {/* Background Staggered Columns */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '100vh',
              background: '#000',
              transform: slideUp ? 'translateY(-100vh)' : 'translateY(0)',
              transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
              transitionDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      {/* Centered Text */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: hideText ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        <h1
          style={{
            fontFamily: '"Satoshi", "Inter", sans-serif',
            fontSize: 'clamp(24px, 4vw, 42px)',
            fontWeight: 500,
            color: '#ffffff',
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {WORDS.map((word, index) => {
            const isVisible = index < step
            return (
              <span
                key={word}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  whiteSpace: 'pre',
                  display: 'inline-block'
                }}
              >
                {word}.{' '}
              </span>
            )
          })}
        </h1>
      </div>
    </>
  )
}
