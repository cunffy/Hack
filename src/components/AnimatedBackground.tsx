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

    // Grid dots
    const SPACING = 44
    const DOT_R = 1.1

    const draw = () => {
      t += 0.008
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cols = Math.ceil(canvas.width / SPACING) + 1
      const rows = Math.ceil(canvas.height / SPACING) + 1

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const px = x * SPACING
          const py = y * SPACING

          // Distance from center for radial glow influence
          const dx = px - canvas.width / 2
          const dy = py - canvas.height / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2)

          // Ripple wave from center
          const wave = Math.sin(dist * 0.012 - t * 1.4) * 0.5 + 0.5
          const proximity = 1 - dist / maxDist

          const alpha = 0.07 + wave * 0.12 * proximity + proximity * 0.06

          ctx.beginPath()
          ctx.arc(px, py, DOT_R, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 212, 255, ${Math.min(alpha, 0.28)})`
          ctx.fill()
        }
      }

      // Central radial glow
      const gAlpha = 0.025 + Math.sin(t * 0.7) * 0.012
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.45
      )
      grad.addColorStop(0, `rgba(0, 212, 255, ${gAlpha})`)
      grad.addColorStop(0.5, `rgba(0, 212, 255, ${gAlpha * 0.3})`)
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Slow scan line
      const scanY = ((t * 28) % (canvas.height * 2)) - canvas.height * 0.3
      const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60)
      scanGrad.addColorStop(0, 'rgba(0,212,255,0)')
      scanGrad.addColorStop(0.5, 'rgba(0,212,255,0.025)')
      scanGrad.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 60, canvas.width, 120)

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
      style={{ opacity: 1 }}
    />
  )
}
