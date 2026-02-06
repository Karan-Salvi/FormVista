import { useEffect, useRef, useCallback } from 'react'

interface ConfettiProps {
  isActive: boolean
  duration?: number
  particleCount?: number
}

interface Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'square' | 'circle' | 'triangle'
}

const colors = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
]

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 150,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef<number>(0)

  const createParticle = useCallback((canvasWidth: number): Particle => {
    const shapes: Array<'square' | 'circle' | 'triangle'> = [
      'square',
      'circle',
      'triangle',
    ]
    return {
      x: Math.random() * canvasWidth,
      y: -20,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }
  }, [])

  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, particle: Particle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color

      switch (particle.shape) {
        case 'square':
          ctx.fillRect(
            -particle.size / 2,
            -particle.size / 2,
            particle.size,
            particle.size
          )
          break
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -particle.size / 2)
          ctx.lineTo(particle.size / 2, particle.size / 2)
          ctx.lineTo(-particle.size / 2, particle.size / 2)
          ctx.closePath()
          ctx.fill()
          break
      }

      ctx.restore()
    },
    []
  )

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(canvas.width)
    )

    startTimeRef.current = Date.now()

    const animate = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const elapsed = Date.now() - startTimeRef.current
      const fadeStart = duration * 0.7

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(particle => {
        // Update position
        particle.x += particle.velocityX
        particle.y += particle.velocityY
        particle.velocityY += 0.1 // gravity
        particle.velocityX *= 0.99 // air resistance
        particle.rotation += particle.rotationSpeed

        // Fade out towards the end
        if (elapsed > fadeStart) {
          particle.opacity = Math.max(
            0,
            1 - (elapsed - fadeStart) / (duration - fadeStart)
          )
        }

        // Draw particle
        drawParticle(ctx, particle)

        // Keep particle if still visible
        return particle.y < canvas.height + 50 && particle.opacity > 0
      })

      if (elapsed < duration || particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [isActive, particleCount, createParticle, drawParticle, duration])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-100"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
