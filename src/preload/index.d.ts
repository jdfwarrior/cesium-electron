import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      on: (event: string, callback: (_: Event, payload: unknown[]) => void) => void
      minimize: () => void
      maximize: () => void
      restore: () => void
      exit: () => void
      context: (menu: unknown[], payload: unknown) => void
    }
  }
}
