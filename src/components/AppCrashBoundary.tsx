import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; appId?: string }
interface State { crashed: boolean; error: string }

export class AppCrashBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { crashed: false, error: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { crashed: true, error: error.message }
  }

  componentDidCatch(error: Error) {
    console.error(`[AppCrashBoundary] ${this.props.appId ?? 'unknown'}:`, error)
  }

  render() {
    if (!this.state.crashed) return this.props.children

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, background: 'rgba(8,12,20,0.9)', padding: 24 }}>
        <div style={{ fontSize: 40 }}>💥</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f87171' }}>App Crashed</div>
        {this.props.appId && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{this.props.appId}</div>
        )}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(248,113,113,0.08)', padding: '8px 14px', borderRadius: 8, maxWidth: 420, textAlign: 'center', wordBreak: 'break-all' }}>
          {this.state.error}
        </div>
        <button
          onClick={() => this.setState({ crashed: false, error: '' })}
          style={{ marginTop: 8, padding: '7px 20px', background: 'var(--cryo-accent)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
        >
          Reload App
        </button>
      </div>
    )
  }
}
