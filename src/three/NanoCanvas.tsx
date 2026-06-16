import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useInView } from './util'

// A stylised HydroX nanoparticle: warm D3 core, lipophilic layer, translucent
// hydrophilic shell, with small particles dispersing around it.
function Nanoparticle() {
  const group = useRef<THREE.Group>(null)
  const orbit = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2
    if (orbit.current) orbit.current.rotation.z += delta * 0.35
  })

  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        const radius = 2.5 + (i % 3) * 0.35
        return {
          pos: [Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(a * 2) * 0.6] as [number, number, number],
          r: 0.06 + (i % 3) * 0.02,
        }
      }),
    [],
  )

  return (
    <group ref={group}>
      {/* D3 core */}
      <mesh>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshPhysicalMaterial
          color="#f7bd59"
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          emissive="#f7941d"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Lipophilic layer */}
      <mesh>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshStandardMaterial color="#38b2e8" transparent opacity={0.28} roughness={0.4} />
      </mesh>

      {/* Hydrophilic shell (lightweight transparent material — no transmission pass) */}
      <mesh>
        <sphereGeometry args={[1.85, 48, 48]} />
        <meshStandardMaterial color="#6ecbf4" transparent opacity={0.14} roughness={0.1} depthWrite={false} />
      </mesh>
      {/* Shell rim wireframe for definition */}
      <mesh>
        <sphereGeometry args={[1.87, 22, 22]} />
        <meshBasicMaterial color="#a6def9" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Dispersing motes */}
      <group ref={orbit}>
        {motes.map((m, i) => (
          <mesh key={i} position={m.pos}>
            <sphereGeometry args={[m.r, 20, 20]} />
            <meshStandardMaterial color="#1f9fd6" emissive="#1f9fd6" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function NanoCanvas() {
  const [ref, inView] = useInView<HTMLDivElement>()
  // On touch devices, drop OrbitControls — it forces touch-action:none and traps
  // vertical scroll over the canvas. The nanoparticle still spins on its own via
  // the useFrame rotation + Float, and the page scrolls normally.
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
  return (
    <div ref={ref} className="h-full w-full touch-pan-y">
    <Canvas frameloop={inView ? 'always' : 'never'} camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} style={{ touchAction: 'pan-y' }} aria-hidden>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#38b2e8" distance={18} />
      <pointLight position={[0, 0, 4]} intensity={14} color="#f7bd59" distance={12} />

      <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.7}>
        <Nanoparticle />
      </Float>

      {!isTouch && (
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      )}
    </Canvas>
    </div>
  )
}
