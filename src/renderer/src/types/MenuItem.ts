type MenuItemRole =
  | 'undo'
  | 'redo'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'pasteAndMatchStyle'
  | 'delete'
  | 'selectAll'
  | 'reload'
  | 'forceReload'
  | 'toggleDevTools'
  | 'resetZoom'
  | 'zoomIn'
  | 'zoomOut'
  | 'toggleSpellChecker'
  | 'togglefullscreen'
  | 'window'
  | 'minimize'
  | 'close'
  | 'help'
  | 'about'
  | 'services'
  | 'hide'
  | 'hideOthers'
  | 'unhide'
  | 'quit'
  | 'showSubstitutions'
  | 'toggleSmartQuotes'
  | 'toggleSmartDashes'
  | 'toggleTextReplacement'
  | 'startSpeaking'
  | 'stopSpeaking'
  | 'zoom'
  | 'front'
  | 'appMenu'
  | 'fileMenu'
  | 'editMenu'
  | 'viewMenu'
  | 'shareMenu'
  | 'recentDocuments'
  | 'toggleTabBar'
  | 'selectNextTab'
  | 'selectPreviousTab'
  | 'mergeAllWindows'
  | 'clearRecentDocuments'
  | 'moveTabToNewWindo'
  | 'windowMenu'

type MenuItemType = 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio'

interface MenuCallbackType {
  context: 'main' | 'renderer'
  event: string
  payload?: unknown
}

export interface MenuItem {
  type: MenuItemType
  label?: string
  sublabel?: string
  accelerator?: string
  icon?: string
  enabled?: boolean
  visible?: boolean
  checked?: boolean
  role?: MenuItemRole
  callback?: MenuCallbackType
}
