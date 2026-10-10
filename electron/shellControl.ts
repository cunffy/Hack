import { exec } from 'child_process'
import type { BrowserWindow } from 'electron'

let _win: BrowserWindow | null = null

export function setShellWindow(win: BrowserWindow): void {
  _win = win
}

// Make the shell sticky on every virtual workspace WITHOUT forcing it into the
// _NET_WM_STATE_BELOW layer. The old design pinned the shell "below" so X11 apps
// always floated on top — but that also trapped every in-shell app (Terminal,
// Settings, …) permanently underneath native windows like Brave, with no way to
// raise them. We now let the shell participate in NORMAL stacking: clicking it
// (or Alt+Tab) raises it above X11 apps; focusing an X11 app raises that instead.
// Only the sticky / all-desktops state is kept, which is what prevents the grey
// screen when switching workspaces.
export function pinToDesktopLayer(): void {
  if (!_win) return
  try {
    const nativeId = _win.getNativeWindowHandle().readUInt32LE(0)
    const xid = `0x${nativeId.toString(16)}`
    // sticky = _NET_WM_STATE_STICKY (viewport-sticky). NO 'below' — see comment above.
    exec(`wmctrl -i -r ${xid} -b add,sticky 2>/dev/null || true`, () => {})
    // Remove any stale 'below' state left over from a previous build/run so the
    // shell can stack normally again.
    exec(`wmctrl -i -r ${xid} -b remove,below 2>/dev/null || true`, () => {})
    // _NET_WM_DESKTOP=0xffffffff — the proper EWMH way to appear on ALL virtual
    // workspaces. _NET_WM_STATE_STICKY alone is not always enough in Openbox.
    exec(`xprop -id ${xid} -f _NET_WM_DESKTOP 32c -set _NET_WM_DESKTOP 0xffffffff 2>/dev/null || true`, () => {})
  } catch {
    exec(
      "xdotool search --class 'cryogram' 2>/dev/null | head -1 | xargs -r -I{} sh -c " +
      "'wmctrl -i -r {} -b add,sticky && wmctrl -i -r {} -b remove,below && xprop -id {} -f _NET_WM_DESKTOP 32c -set _NET_WM_DESKTOP 0xffffffff'",
      () => {}
    )
  }
}

// Bring the shell to the front, above every X11 window (Brave, etc.). Used by
// Alt+Tab, Super+D and "open app" shortcuts so the dock/overlay is always
// reachable even when a fullscreen browser is covering the screen.
export function raiseShell(): void {
  if (!_win) return
  _win.setAlwaysOnTop(true, 'pop-up-menu')
  _win.moveTop()
  _win.focus()
}

// Drop the shell back into normal stacking so a subsequently-raised X11 window
// (e.g. Brave via wmctrl -ia) ends up on top of it. We do NOT push it to the
// 'below' layer — that's what previously trapped in-shell apps under Brave.
export function sinkShell(): void {
  if (!_win) return
  _win.setAlwaysOnTop(false)
  // Re-assert sticky/all-desktops (harmless, keeps workspace visibility).
  pinToDesktopLayer()
}

// Just drop always-on-top but keep the current stack position. After Alt+Tab to
// an in-shell app we use this so the shell stays exactly where it is (on top of
// Brave) rather than sinking behind it.
export function unpinShell(): void {
  _win?.setAlwaysOnTop(false)
}
