import { useEffect, useRef } from 'react'

type RGB = { r: number; g: number; b: number }
type Vec = { x: number; y: number }

// Brand palette — navy-900 and marine-600 (Elbrit red).
const BRAND_COLORS: RGB[] = [
  { r: 11, g: 37, b: 69 },
  { r: 193, g: 20, b: 26 },
]

// Particles fade out into the white background when killed.
const WHITE: RGB = { r: 255, g: 255, b: 255 }

class Particle {
  pos: Vec = { x: 0, y: 0 }
  vel: Vec = { x: 0, y: 0 }
  acc: Vec = { x: 0, y: 0 }
  target: Vec = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor: RGB = { r: 255, g: 255, b: 255 }
  targetColor: RGB = { r: 255, g: 255, b: 255 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const distance = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y)
    if (distance < this.closeEnoughTarget) proximityMult = distance / this.closeEnoughTarget

    const towards = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y }
    const mag = Math.hypot(towards.x, towards.y)
    if (mag > 0) {
      towards.x = (towards.x / mag) * this.maxSpeed * proximityMult
      towards.y = (towards.y / mag) * this.maxSpeed * proximityMult
    }

    const steer = { x: towards.x - this.vel.x, y: towards.y - this.vel.y }
    const steerMag = Math.hypot(steer.x, steer.y)
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce
      steer.y = (steer.y / steerMag) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2.5, 2.5)
  }

  kill(width: number, height: number) {
    if (this.isKilled) return
    const p = randomEdgePos(width / 2, height / 2, (width + height) / 2, width, height)
    this.target.x = p.x
    this.target.y = p.y
    this.startColor = blend(this.startColor, this.targetColor, this.colorWeight)
    this.targetColor = WHITE
    this.colorWeight = 0
    this.isKilled = true
  }
}

function blend(a: RGB, b: RGB, w: number): RGB {
  return { r: a.r + (b.r - a.r) * w, g: a.g + (b.g - a.g) * w, b: a.b + (b.b - a.b) * w }
}

function randomEdgePos(x: number, y: number, mag: number, w: number, h: number): Vec {
  const rx = Math.random() * w
  const ry = Math.random() * h
  const dir = { x: rx - x, y: ry - y }
  const m = Math.hypot(dir.x, dir.y)
  if (m > 0) {
    dir.x = (dir.x / m) * mag
    dir.y = (dir.y / m) * mag
  }
  return { x: x + dir.x, y: y + dir.y }
}

interface Props {
  words: string[]
  /** Frames each word stays before morphing to the next (~60fps). */
  holdFrames?: number
  className?: string
}

export default function ParticleTextEffect({ words, holdFrames = 260, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef(0)
  const wordRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1100
    canvas.height = 420
    const ctx = canvas.getContext('2d')!

    const pixelSteps = 6

    const nextWord = (word: string) => {
      const off = document.createElement('canvas')
      off.width = canvas.width
      off.height = canvas.height
      const octx = off.getContext('2d')!

      // Fit the font to the canvas width.
      let fontSize = 150
      octx.font = `bold ${fontSize}px Arial`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      while (octx.measureText(word).width > canvas.width * 0.88 && fontSize > 24) {
        fontSize -= 4
        octx.font = `bold ${fontSize}px Arial`
      }
      octx.fillStyle = 'white'
      octx.fillText(word, canvas.width / 2, canvas.height / 2)

      const pixels = octx.getImageData(0, 0, canvas.width, canvas.height).data
      const newColor = BRAND_COLORS[wordRef.current % BRAND_COLORS.length]
      const particles = particlesRef.current
      let pi = 0

      const idxs: number[] = []
      for (let i = 0; i < pixels.length; i += pixelSteps * 4) idxs.push(i)
      for (let i = idxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[idxs[i], idxs[j]] = [idxs[j], idxs[i]]
      }

      for (const idx of idxs) {
        if (pixels[idx + 3] <= 0) continue
        const x = (idx / 4) % canvas.width
        const y = Math.floor(idx / 4 / canvas.width)

        let particle: Particle
        if (pi < particles.length) {
          particle = particles[pi]
          particle.isKilled = false
          pi++
        } else {
          particle = new Particle()
          const rp = randomEdgePos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2, canvas.width, canvas.height)
          particle.pos.x = rp.x
          particle.pos.y = rp.y
          particle.maxSpeed = Math.random() * 6 + 4
          particle.maxForce = particle.maxSpeed * 0.05
          particle.particleSize = Math.random() * 6 + 6
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025
          particles.push(particle)
        }

        particle.startColor = blend(particle.startColor, particle.targetColor, particle.colorWeight)
        particle.targetColor = newColor
        particle.colorWeight = 0
        particle.target.x = x
        particle.target.y = y
      }

      for (let i = pi; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height)
    }

    const animate = () => {
      const particles = particlesRef.current
      // White trailing fade — leaves a soft comet trail on the light hero.
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.move()
        p.draw(ctx)
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
          particles.splice(i, 1)
        }
      }

      frameRef.current++
      if (frameRef.current % holdFrames === 0) {
        wordRef.current = (wordRef.current + 1) % words.length
        nextWord(words[wordRef.current])
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    nextWord(words[0])
    animate()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      particlesRef.current = []
      frameRef.current = 0
      wordRef.current = 0
    }
  }, [words, holdFrames])

  return (
    <canvas
      ref={canvasRef}
      aria-label={words.join(', ')}
      role="img"
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )
}
