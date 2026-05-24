import { motion } from 'framer-motion'

export function Desktop() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Subtle CG watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.016 }}
      >
        <div
          className="text-[22vw] font-black"
          style={{ fontFamily: '"JetBrains Mono", monospace', color: '#00d4ff', letterSpacing: '0.1em' }}
        >
          CG
        </div>
      </div>

      {/* Bottom-left status */}
      <motion.div
        className="absolute bottom-24 left-8 flex items-center gap-3 text-xs"
        style={{ color: 'rgba(78,93,110,0.5)', fontFamily: '"JetBrains Mono", monospace' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ letterSpacing: '0.12em' }}>ALL SYSTEMS OPERATIONAL</span>
      </motion.div>
    </div>
  )
}
