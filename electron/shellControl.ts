import { exec } from 'child_process'
import type { BrowserWindow } from 'electron'

let _win: BrowserWindow | null = null

export function setShellWindow(win: BrowserWindow): void {
  _win = win
}

export function pinToDesktopLayer(): void {
  if (!_win) return
  try {
    const nativeId = _win.getNativeWindowHandle().readUInt32LE(0)
    const xid = `0x${nativeId.toString(16)}`
    // below  = sit behind normal windows (desktop layer)
    // sticky = _NET_WM_STATE_STICKY viewport-sticky
    exec(`wmctrl -i -r ${xid} -b add,below,sticky 2>/dev/null || true`, () => {})
    // Also set _NET_WM_DESKTOP=0xffffffff — the proper EWMH way to appear on
    // ALL virtual workspaces. _NET_WM_STATE_STICKY alone is not always enough
    // in Openbox; this ensures the grey-screen on other desktops never returns.
    exec(`xprop -id ${xid} -f _NET_WM_DESKTOP 32c -set _NET_WM_DESKTOP 0xffffffff 2>/dev/null || true`, () => {})
  } catch {
    exec(
      "xdotool search --class 'cryogram' 2>/dev/null | head -1 | xargs -r -I{} sh -c " +
      "'wmctrl -i -r {} -b add,below,sticky && xprop -id {} -f _NET_WM_DESKTOP 32c -set _NET_WM_DESKTOP 0xffffffff'",
      () => {}
    )
  }
}

export function raiseShell(): void {
  _win?.setAlwaysOnTop(true, 'pop-up-menu')
  _win?.focus()
}

export function sinkShell(): void {
  _win?.setAlwaysOnTop(false)
  pinToDesktopLayer()
}

export function unpinShell(): void {
  _win?.setAlwaysOnTop(false)
}
