import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { useInView } from './util'

const INDIA_SVG = '/assets/india-map-country-svgrepo-com.svg'
const FILL_COUNT = 9000 // dots scattered inside the map
const OUTLINE_STEP = 0.5 // spacing (SVG units) of dots along the border
const OUTLINE_JITTER = 1.4 // border band thickness

// Cursor interaction — a gentle local ripple, not a big hole.
const CURSOR_RADIUS = 1.1 // world units of influence around the pointer
const CURSOR_PUSH = 0.45 // how far dots nudge away from the pointer
const RETURN_EASE = 0.1 // how quickly dots settle back

// Soft round glow sprite for each particle.
function makeDotTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// India "woven" from light particles: a dense dotted outline + dots filling it,
// that scatter away from the cursor and settle back.
function IndiaParticles({ active }: { active: React.MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const data = useLoader(SVGLoader, INDIA_SVG)
  const dot = useMemo(makeDotTexture, [])
  const pick = useMemo(
    () => ({ ray: new THREE.Raycaster(), plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit: new THREE.Vector3() }),
    [],
  )

  const { points, homes } = useMemo(() => {
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p))

    // SVG Y points down → flip so India sits upright.
    const raw: number[] = [] // x, y pairs (SVG space)

    // 1) Outline: walk every contour + hole, drop evenly-spaced jittered dots.
    const addContour = (pts: THREE.Vector2[]) => {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        const b = pts[(i + 1) % pts.length]
        const steps = Math.max(1, Math.round(a.distanceTo(b) / OUTLINE_STEP))
        for (let s = 0; s < steps; s++) {
          const t = s / steps
          raw.push(
            a.x + (b.x - a.x) * t + (Math.random() - 0.5) * OUTLINE_JITTER,
            -(a.y + (b.y - a.y) * t) + (Math.random() - 0.5) * OUTLINE_JITTER,
          )
        }
      }
    }
    for (const s of shapes) {
      addContour(s.getPoints(64))
      for (const h of s.holes) addContour(h.getPoints(32))
    }
    const outlineCount = raw.length / 2

    // 2) Fill: scatter dots across the interior area.
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(new THREE.ShapeGeometry(shapes))).build()
    const temp = new THREE.Vector3()
    for (let i = 0; i < FILL_COUNT; i++) {
      sampler.sample(temp)
      raw.push(temp.x, -temp.y)
    }

    const total = raw.length / 2
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity
    for (let i = 0; i < total; i++) {
      const x = raw[i * 2]
      const y = raw[i * 2 + 1]
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const scale = 6.6 / Math.max(maxX - minX, maxY - minY)

    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    // Outline = darker red; fill = brighter red.
    const outA = new THREE.Color('#8e0f14')
    const outB = new THREE.Color('#b3141a')
    const fillA = new THREE.Color('#e11b22')
    const fillB = new THREE.Color('#f87277')
    const col = new THREE.Color()
    for (let i = 0; i < total; i++) {
      positions[i * 3] = (raw[i * 2] - cx) * scale
      positions[i * 3 + 1] = (raw[i * 2 + 1] - cy) * scale
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.55 // woven 3D depth
      if (i < outlineCount) col.copy(outA).lerp(outB, Math.random())
      else col.copy(fillA).lerp(fillB, Math.random() * 0.9)
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const bg = new THREE.BufferGeometry()
    bg.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    bg.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      map: dot,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false,
      sizeAttenuation: true,
    })
    // homes = the resting positions; live geometry gets pushed away from cursor.
    return { points: new THREE.Points(bg, mat), homes: positions.slice() }
  }, [data, dot])

  useFrame((state) => {
    const g = group.current
    if (!g) return

    // Gentle LEFT–RIGHT tilt only (no full spin).
    const idle = Math.sin(state.clock.elapsedTime * 0.5) * 0.22
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, idle + state.pointer.x * 0.4, 0.07)

    // Cursor → world point on the cloud plane, then into the group's local space.
    // Only when the pointer is actually over the canvas (no resting hole).
    pick.ray.setFromCamera(state.pointer, state.camera)
    const hit = pick.hit
    const ok = active.current && pick.ray.ray.intersectPlane(pick.plane, hit)
    if (ok) g.worldToLocal(hit)

    const arr = (points.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const r2 = CURSOR_RADIUS * CURSOR_RADIUS
    for (let i = 0; i < arr.length; i += 3) {
      let tx = homes[i]
      let ty = homes[i + 1]
      let tz = homes[i + 2]
      if (ok) {
        const dx = homes[i] - hit.x
        const dy = homes[i + 1] - hit.y
        const d2 = dx * dx + dy * dy
        if (d2 < r2) {
          const d = Math.sqrt(d2) || 0.0001
          const f = 1 - d / CURSOR_RADIUS // 1 at centre → 0 at edge
          const push = f * CURSOR_PUSH
          tx += (dx / d) * push
          ty += (dy / d) * push
          tz += f * 0.5 // slight pop toward the viewer
        }
      }
      arr[i] = THREE.MathUtils.lerp(arr[i], tx, RETURN_EASE)
      arr[i + 1] = THREE.MathUtils.lerp(arr[i + 1], ty, RETURN_EASE)
      arr[i + 2] = THREE.MathUtils.lerp(arr[i + 2], tz, RETURN_EASE)
    }
    points.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <primitive object={points} />
    </group>
  )
}

// Default export so it can be lazy-loaded (keeps three.js out of the initial bundle).
export default function HeroCanvas() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const active = useRef(false)
  return (
    <div
      ref={ref}
      className="h-full w-full"
      onPointerMove={() => (active.current = true)}
      onPointerLeave={() => (active.current = false)}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 9.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <IndiaParticles active={active} />
        </Suspense>
      </Canvas>
    </div>
  )
}
