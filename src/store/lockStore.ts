import { create } from 'zustand'

interface LockStore {
  isLocked: boolean
  pinRequired: boolean
  lock: (pinRequired?: boolean) => void
  unlock: () => void
}

export const useLockStore = create<LockStore>((set) => ({
  isLocked: false,
  pinRequired: false,
  lock: (pinRequired = true) => set({ isLocked: true, pinRequired }),
  unlock: () => {
    ;(window as any).cryogram?.notifyUnlock?.()
    set({ isLocked: false, pinRequired: false })
  },
}))
