import { exec } from 'child_process'
import type { BrowserWindow } from 'electron'

let _win: BrowserWindow | null = null

export function setShellWindow(win: BrowserWindow): void {
  _win = win
}

// Sink Electron to the desktop layer — always below X11 apps.
// Adds _NET_WM_STATE_BELOW and sticky so it spans all virtual desktops.
export function pinToDesktopLayer(): void {
  exec(
    "xdotool search --class 'cryogram' 2>/dev/null | head -1 | xargs -r -I{} sh -c 'wmctrl -i -r {} -b add,below && wmctrl -i -r {} -b add,sticky'",
    () => {}
  )
}

// Temporarily raise Electron above all X11 windows (for the app switcher overlay).
export function raiseShell(): void {
  _win?.setAlwaysOnTop(true, 'pop-up-menu')
  _win?.focus()
}

// Remove always-on-top AND re-pin to desktop layer.
// Call this when switching to an X11 window or dismissing the switcher.
export function sinkShell(): void {
  _win?.setAlwaysOnTop(false)
  setTimeout(pinToDesktopLayer, 50)
}

// Remove always-on-top WITHOUT going back to below.
// Call this when switching to an internal Electron app so the user can see it.
// Electron will naturally drop to desktop layer when it loses focus next (blur handler).
export function unpinShell(): void {
  _win?.setAlwaysOnTop(false)
}
