import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { MiniMolecule, COLORS } from './parts'
import { useInView } from './util'

type Variant = 'light' | 'dark'

// Fixed seed layout (no Math.random → stable across renders).
const SEEDS: { pos: [number, number, number]; scale: number; speed: number }[] = [
  { pos: [-4.2, 1.8, -2], scale: 1.05, speed: 1.2 },
  { pos: [3.8, 2.4, -3], scale: 0.8, speed: 1.6 },
  { pos: [4.6, -1.6, -1.5], scale: 1.15, speed: 1.0 },
  { pos: [-3.6, -2.2, -2.5], scale: 0.9, speed: 1.4 },
  { pos: [0.4, 3.0, -4], scale: 0.7, speed: 1.8 },
  { pos: [-1.2, -0.4, -1], scale: 1.25, speed: 0.9 },
  { pos: [2.2, 0.2, -2.8], scale: 0.65, speed: 1.5 },
]

function Drift({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04
  })
  return <group ref={ref}>{children}</group>
}

export default function SceneBackdrop({ variant }: { variant: Variant }) {
  const dark = variant === 'dark'
  const core = dark ? COLORS.marine : '#c9d6e6'
  const accent = dark ? COLORS.light : COLORS.marine
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className="h-full w-full">
    <Canvas
      frameloop={inView ? 'always' : 'never'}
      camera={{ position: [0, 0, 9], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      aria-hidden
    >
      <ambientLight intensity={dark ? 0.45 : 0.85} />
      <directionalLight position={[4, 5, 6]} intensity={dark ? 0.7 : 1} />
      {dark && <pointLight position={[0, 0, 5]} intensity={26} color="#e11b22" distance={22} />}

      <Drift>
        {SEEDS.map((s, i) => (
          <Float
            key={i}
            position={s.pos}
            speed={s.speed}
            rotationIntensity={1.1}
            floatIntensity={1.3}
          >
            <group scale={s.scale}>
              <MiniMolecule core={core} accent={accent} />
            </group>
          </Float>
        ))}
      </Drift>

      <fog attach="fog" args={[dark ? '#0B2545' : '#ffffff', 7, 17]} />
    </Canvas>
    </div>
  )
}
