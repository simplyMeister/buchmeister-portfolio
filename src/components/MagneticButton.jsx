import { useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function MagneticButton({ children, distance = 40 }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY

    // If mouse is within distance, pull the button
    const distanceToCenter = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    
    if (distanceToCenter < distance) {
      x.set(deltaX * 0.4)
      y.set(deltaY * 0.4)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
        display: 'inline-flex'
      }}
    >
      {children}
    </motion.div>
  )
}
