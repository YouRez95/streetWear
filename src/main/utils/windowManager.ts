import { BrowserWindow } from 'electron'

let mainWindow: BrowserWindow | null = null

export const setMainWindow = (win: BrowserWindow) => {
  mainWindow = win
}
export const getMainWindow = () => mainWindow
