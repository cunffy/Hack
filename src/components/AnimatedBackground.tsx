import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const SPACING = 46
    const DOT_R = 1.05

    const draw = () => {
      t += 0.007
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const W = canvas.width
      const H = canvas.height
      const cols = Math.ceil(W / SPACING) + 1
      const rows = Math.ceil(H / SPACING) + 1
      const maxDist = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2)

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const px = x * SPACING
          const py = y * SPACING
          const dx = px - W / 2
          const dy = py - H / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const proximity = 1 - dist / maxDist

          // Two overlapping wave pulses — one cyan, one purple
          const wave1 = Math.sin(dist * 0.011 - t * 1.5) * 0.5 + 0.5
          const wave2 = Math.sin(dist * 0.009 - t * 0.9 + Math.PI * 0.7) * 0.5 + 0.5

          const alphaCyan   = (0.04 + wave1 * 0.1 * proximity + proximity * 0.04)
          const alphaPurple = (0.02 + wave2 * 0.07 * proximity) * (1 - proximity * 0.5)

          const clamped1 = Math.min(alphaCyan, 0.22)
          const clamped2 = Math.min(alphaPurple, 0.12)

          // Cyan dot
          ctx.beginPath()
          ctx.arc(px, py, DOT_R, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,212,255,${clamped1})`
          ctx.fill()

          // Purple tint overlay for cross-toned effect
          if (clamped2 > 0.01) {
            ctx.beginPath()
            ctx.arc(px, py, DOT_R, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(187,136,255,${clamped2})`
            ctx.fill()
          }
        }
      }

      // Central cyan radial glow
      const gA1 = 0.022 + Math.sin(t * 0.6) * 0.01
      const g1 = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.42)
      g1.addColorStop(0, `rgba(0,212,255,${gA1})`)
      g1.addColorStop(0.55, `rgba(0,212,255,${gA1 * 0.25})`)
      g1.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, W, H)

      // Off-centre purple accent glow (bottom-right quadrant)
      const gA2 = 0.012 + Math.sin(t * 0.4 + 1.2) * 0.006
      const g2 = ctx.createRadialGradient(W * 0.75, H * 0.65, 0, W * 0.75, H * 0.65, W * 0.35)
      g2.addColorStop(0, `rgba(187,136,255,${gA2})`)
      g2.addColorStop(1, 'rgba(187,136,255,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, W, H)

      // Slow scan line
      const scanY = ((t * 26) % (H * 2)) - H * 0.25
      const scanG = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80)
      scanG.addColorStop(0, 'rgba(0,212,255,0)')
      scanG.addColorStop(0.5, 'rgba(0,212,255,0.018)')
      scanG.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = scanG
      ctx.fillRect(0, scanY - 80, W, 160)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  )
}
