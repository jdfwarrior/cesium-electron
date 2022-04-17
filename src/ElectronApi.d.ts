interface ElectronApi {
  on: (event: string, callback: Function) => void;
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  exit: () => void;
}

export declare global {
  interface Window {
    electron: ElectronApi;
  }
}
