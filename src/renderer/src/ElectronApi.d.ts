import type { AppMenuItem } from './types/AppMenuItem'

interface ElectronApi {
  on: (event: string, callback: Function) => void
  minimize: () => void
  maximize: () => void
  restore: () => void
  exit: () => void
  context: (menu: AppMenuItem[], payload?: any) => void
  set: (key: string, value: unknown) => void
  get: (key: string) => Promise<unknown>
}

export declare global {
  interface Window {
    api: ElectronApi
  }
}
