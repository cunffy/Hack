import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        partition?: string
        useragent?: string
        allowpopups?: boolean
        preload?: string
        nodeintegration?: boolean
        webpreferences?: string
      }
    }
  }
}
