import { motion, useReducedMotion } from 'framer-motion'

// Abstract stylised molecule — no stock photography.
// Hexagonal ring with bonded nodes in navy / teal / emerald.
export default function MoleculeGraphic({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Abstract molecular structure representing cardio-reno-metabolic science"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fdecec" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="210" cy="190" r="190" fill="url(#halo)" />

      {/* Bonds */}
      <g stroke="#b9cce0" strokeWidth="2.5">
        <line x1="210" y1="90" x2="296" y2="140" />
        <line x1="296" y1="140" x2="296" y2="240" />
        <line x1="296" y1="240" x2="210" y2="290" />
        <line x1="210" y1="290" x2="124" y2="240" />
        <line x1="124" y1="240" x2="124" y2="140" />
        <line x1="124" y1="140" x2="210" y2="90" />
        <line x1="210" y1="190" x2="210" y2="90" />
        <line x1="210" y1="190" x2="296" y2="240" />
        <line x1="210" y1="190" x2="124" y2="240" />
        <line x1="210" y1="290" x2="210" y2="360" />
        <line x1="124" y1="140" x2="58" y2="110" />
        <line x1="296" y1="140" x2="362" y2="110" />
      </g>

      {/* Outer nodes */}
      {[
        [296, 140],
        [296, 240],
        [124, 240],
        [124, 140],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={`o-${i}`}
          cx={cx}
          cy={cy}
          r="13"
          fill="#ffffff"
          stroke="#e11b22"
          strokeWidth="2.5"
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 200, damping: 16 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Accent terminal nodes */}
      {[
        [210, 90, '#0B2545'],
        [210, 360, '#0B2545'],
        [58, 110, '#ef7c80'],
        [362, 110, '#ef7c80'],
      ].map(([cx, cy, fill], i) => (
        <motion.circle
          key={`t-${i}`}
          cx={cx as number}
          cy={cy as number}
          r="9"
          fill={fill as string}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 220, damping: 15 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Central hub */}
      <motion.circle
        cx="210"
        cy="190"
        r="22"
        fill="#0B2545"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        style={{ transformOrigin: '210px 190px' }}
      />
      <circle cx="210" cy="190" r="22" fill="none" stroke="#e11b22" strokeWidth="2" opacity="0.5" />
    </svg>
  )
}
