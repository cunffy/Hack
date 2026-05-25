import { motion } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'

export function Desktop() {
  const hasWindows = useWindowStore(s => s.windows.some(w => !w.minimized))

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Subtle CG watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.014 }}
      >
        <div
          className="font-black"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '22vw',
            color: '#00d4ff',
            letterSpacing: '0.08em',
          }}
        >
          CG
        </div>
      </div>

      {/* Empty state hint — fades out once any app is open */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-32"
        animate={{ opacity: hasWindows ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="text-sm font-medium"
            style={{
              color: 'rgba(255,255,255,0.22)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            Open an app from the dock below
          </div>
          {/* Subtle down arrow */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom-left system status */}
      <motion.div
        className="absolute left-6 flex items-center gap-2 text-xs"
        style={{ bottom: 88, color: 'rgba(78,93,110,0.45)', fontFamily: '"JetBrains Mono", monospace' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: '#00ff88', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ letterSpacing: '0.1em', fontSize: 10 }}>ALL SYSTEMS OPERATIONAL</span>
      </motion.div>
    </div>
  )
}
