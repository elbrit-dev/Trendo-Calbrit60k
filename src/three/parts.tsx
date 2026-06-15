import { useMemo } from 'react'
import * as THREE from 'three'

export const COLORS = {
  navy: '#0B2545',
  marine: '#e11b22', // Elbrit brand red
  sage: '#2E8B57',
  light: '#eef2f7',
  bond: '#9fb6cf',
  bondDark: '#3f6286',
}

export type AtomDef = {
  key: string
  pos: [number, number, number]
  r: number
  color: string
  emissive?: number
}
export type BondDef = { key: string; a: [number, number, number]; b: [number, number, number] }

export function Atom({ pos, r, color, emissive = 0 }: Omit<AtomDef, 'key'>) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <sphereGeometry args={[r, 48, 48]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.28}
        emissive={color}
        emissiveIntensity={emissive}
      />
    </mesh>
  )
}

export function Bond({
  a,
  b,
  color = COLORS.bond,
  radius = 0.055,
}: {
  a: [number, number, number]
  b: [number, number, number]
  color?: string
  radius?: number
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...a)
    const end = new THREE.Vector3(...b)
    const dir = new THREE.Vector3().subVectors(end, start)
    const len = dir.length()
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    )
    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      quaternion: [q.x, q.y, q.z, q.w] as [number, number, number, number],
      length: len,
    }
  }, [a, b])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 18]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
    </mesh>
  )
}

// --- Hero molecule structure (abstract ball-and-stick) ----------------------
export function buildHeroMolecule(): { atoms: AtomDef[]; bonds: BondDef[] } {
  const atoms: AtomDef[] = []
  const bonds: BondDef[] = []
  const ringR = 1.7
  const ring: [number, number, number][] = []

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
    const p: [number, number, number] = [Math.cos(angle) * ringR, Math.sin(angle) * ringR, 0]
    ring.push(p)
    atoms.push({ key: `r${i}`, pos: p, r: 0.34, color: COLORS.marine })
  }
  for (let i = 0; i < 6; i++) {
    bonds.push({ key: `rb${i}`, a: ring[i], b: ring[(i + 1) % 6] })
  }

  const hub: [number, number, number] = [0, 0, 0.25]
  atoms.push({ key: 'hub', pos: hub, r: 0.52, color: COLORS.navy })
  ;[0, 2, 4].forEach((i) => bonds.push({ key: `hb${i}`, a: hub, b: ring[i] }))

  const top: [number, number, number] = [0, 2.7, 0.3]
  const bot: [number, number, number] = [0, -2.7, -0.3]
  atoms.push({ key: 'top', pos: top, r: 0.4, color: COLORS.navy, emissive: 0 })
  atoms.push({ key: 'bot', pos: bot, r: 0.4, color: COLORS.navy, emissive: 0 })
  bonds.push({ key: 'tb1', a: ring[1], b: top })
  bonds.push({ key: 'tb2', a: ring[2], b: top })
  bonds.push({ key: 'bb1', a: ring[4], b: bot })
  bonds.push({ key: 'bb2', a: ring[5], b: bot })

  ring.forEach((p, i) => {
    const out: [number, number, number] = [p[0] * 1.5, p[1] * 1.5, p[2]]
    atoms.push({ key: `h${i}`, pos: out, r: 0.16, color: COLORS.light })
    bonds.push({ key: `hbo${i}`, a: p, b: out })
  })

  return { atoms, bonds }
}

// --- Small molecule used in the floating background fields ------------------
const MINI_SATELLITES: [number, number, number][] = [
  [0.62, 0.42, 0.2],
  [-0.5, 0.34, -0.42],
  [0.12, -0.62, 0.34],
]

export function MiniMolecule({ core, accent }: { core: string; accent: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          color={core}
          roughness={0.3}
          metalness={0.1}
          emissive={core}
          emissiveIntensity={0.18}
        />
      </mesh>
      {MINI_SATELLITES.map((p, i) => (
        <group key={i}>
          <Bond a={[0, 0, 0]} b={p} color={accent} radius={0.035} />
          <mesh position={p}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial
              color={accent}
              roughness={0.3}
              metalness={0.1}
              emissive={accent}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
