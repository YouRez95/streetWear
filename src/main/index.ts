import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { loginUser, logoutUser } from './services/auth'
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
  updateClientStatus
} from './services/clients'
import { getGeneralSettings } from './services/dashboard'
import {
  createAvanceFaconnier,
  createBonFaconnier,
  createFaconnier,
  createOrderFaconnier,
  deleteAvanceFaconnier,
  deleteBonFaconnier,
  deleteFaconnier,
  deleteOrderFaconnier,
  getActiveFaconniers,
  getFaconniers,
  getFaconnierSummary,
  getOrdersFaconnier,
  toggleBonFaconnier,
  updateFaconnier,
  updateFaconnierStatus
} from './services/producer'
import {
  createProduct,
  deleteProduct,
  getAllProductsStatus,
  getProducts,
  updateOrderQuantityReturned,
  updateProduct
} from './services/products'
import { createSeason, deleteSeason, getSeasons, updateSeason } from './services/seasons'
import { createUser, deleteUser, getUsers, updateUser } from './services/users'
import { getFromStore } from './store/store'
import { setMainWindow } from './utils/windowManager'

// const reactDevToolsPath = path.join(
//   os.homedir(),
//   '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.1_0'
// )

// app.commandLine.appendSwitch('ignore-gpu-blacklist')
// app.commandLine.appendSwitch('enable-gpu-rasterization')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    title: 'Sweet Wear',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true // make renderer process separate from main process
    }
  })

  setMainWindow(mainWindow)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // await session.defaultSession.loadExtension(reactDevToolsPath)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // async function testServer() {
  //   try {
  //     const response = await fetch(SERVER_URL)
  //     const data = await response.json()
  //     console.log('Server response:', data)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

  // Login User IPC
  ipcMain.handle('loginUser', (_, ...args: Parameters<LoginUser>) => loginUser(...args))

  // Logout User IPC
  ipcMain.handle('logoutUser', async (_, ...args: Parameters<LogoutUser>) => logoutUser(...args))

  // Store IPC
  // ipcMain.handle('setToStore', (_, ...args: Parameters<typeof setToStore>) => setToStore(...args))
  ipcMain.handle('getFromStore', (_, ...args: Parameters<typeof getFromStore>) =>
    getFromStore(...args)
  )

  // Get Users IPC
  ipcMain.handle('getUsers', async (_, ...args: Parameters<GetUsers>) => getUsers(...args))
  // Create User IPC
  ipcMain.handle('createUser', async (_, ...args: Parameters<CreateUser>) => createUser(...args))

  // Delete User IPC
  ipcMain.handle('deleteUser', async (_, ...args: Parameters<DeleteUser>) => deleteUser(...args))

  // Update User IPC
  ipcMain.handle('updateUser', async (_, ...args: Parameters<UpdateUser>) => updateUser(...args))

  // Get Faconniers IPC
  ipcMain.handle('getFaconniers', async (_, ...args: Parameters<GetFaconniers>) =>
    getFaconniers(...args)
  )
  // Create Faconnier IPC
  ipcMain.handle('createFaconnier', async (_, ...args: Parameters<CreateFaconnier>) =>
    createFaconnier(...args)
  )

  // Delete Faconnier IPC
  ipcMain.handle('deleteFaconnier', async (_, ...args: Parameters<DeleteFaconnier>) =>
    deleteFaconnier(...args)
  )

  // Update Faconnier IPC
  ipcMain.handle('updateFaconnier', async (_, ...args: Parameters<UpdateFaconnier>) =>
    updateFaconnier(...args)
  )

  // Update Faconnier Status IPC
  ipcMain.handle('updateFaconnierStatus', async (_, ...args: Parameters<UpdateFaconnierStatus>) =>
    updateFaconnierStatus(...args)
  )

  // Get Clients IPC
  ipcMain.handle('getClients', async (_, ...args: Parameters<GetClients>) => getClients(...args))

  // Create Client IPC
  ipcMain.handle('createClient', async (_, ...args: Parameters<CreateClient>) =>
    createClient(...args)
  )
  // Delete Client IPC
  ipcMain.handle('deleteClient', async (_, ...args: Parameters<DeleteClient>) =>
    deleteClient(...args)
  )
  // Update Client IPC
  ipcMain.handle('updateClient', async (_, ...args: Parameters<UpdateClient>) =>
    updateClient(...args)
  )

  // Update Client Status IPC
  ipcMain.handle('updateClientStatus', async (_, ...args: Parameters<UpdateClientStatus>) =>
    updateClientStatus(...args)
  )

  // Get Seasons IPC
  ipcMain.handle('getSeasons', async (_, ...args: Parameters<GetSeasons>) => getSeasons(...args))
  // Create Season IPC
  ipcMain.handle('createSeason', async (_, ...args: Parameters<CreateSeason>) =>
    createSeason(...args)
  )
  // Delete Season IPC
  ipcMain.handle('deleteSeason', async (_, ...args: Parameters<DeleteSeason>) =>
    deleteSeason(...args)
  )
  // Update Season IPC
  ipcMain.handle('updateSeason', async (_, ...args: Parameters<UpdateSeason>) =>
    updateSeason(...args)
  )

  // Get Products IPC
  ipcMain.handle('getProducts', async (_, ...args: Parameters<GetProducts>) => getProducts(...args))

  // Create Product IPC
  ipcMain.handle('createProduct', async (_, ...args: Parameters<CreateProduct>) =>
    createProduct(...args)
  )

  // Update Product IPC
  ipcMain.handle('updateProduct', async (_, ...args: Parameters<UpdateProduct>) =>
    updateProduct(...args)
  )

  // Delete Product IPC
  ipcMain.handle('deleteProduct', async (_, ...args: Parameters<DeleteProduct>) =>
    deleteProduct(...args)
  )

  // Get All Products Status IPC
  ipcMain.handle('getAllProductsStatus', async (_, ...args: Parameters<GetAllProductsStatus>) =>
    getAllProductsStatus(...args)
  )

  // Get Active Faconniers IPC
  ipcMain.handle('getActiveFaconniers', async (_, ...args: Parameters<GetActiveFaconniers>) =>
    getActiveFaconniers(...args)
  )

  // Create Bon Faconnier IPC
  ipcMain.handle('createBonFaconnier', async (_, ...args: Parameters<CreateBonFaconnier>) =>
    createBonFaconnier(...args)
  )

  // Create Order Faconnier IPC
  ipcMain.handle('createOrderFaconnier', async (_, ...args: Parameters<CreateOrderFaconnier>) =>
    createOrderFaconnier(...args)
  )

  // Get Orders Faconnier IPC
  ipcMain.handle('getOrdersFaconnier', async (_, ...args: Parameters<GetOrdersFaconnier>) =>
    getOrdersFaconnier(...args)
  )

  // Create Avance Faconnier IPC
  ipcMain.handle('createAvanceFaconnier', async (_, ...args: Parameters<CreateAvanceFaconnier>) =>
    createAvanceFaconnier(...args)
  )

  // Get Faconnier Summary IPC
  ipcMain.handle('getFaconnierSummary', async (_, ...args: Parameters<GetFaconnierSummary>) =>
    getFaconnierSummary(...args)
  )

  // Update Order Quantity Returned IPC
  ipcMain.handle(
    'updateOrderQuantityReturned',
    async (_, ...args: Parameters<UpdateOrderQuantityReturned>) =>
      updateOrderQuantityReturned(...args)
  )

  // Delete Avance Faconnier IPC
  ipcMain.handle('deleteAvanceFaconnier', async (_, ...args: Parameters<DeleteAvanceFaconnier>) =>
    deleteAvanceFaconnier(...args)
  )

  // Delete Order Faconnier IPC
  ipcMain.handle('deleteOrderFaconnier', async (_, ...args: Parameters<DeleteOrderFaconnier>) =>
    deleteOrderFaconnier(...args)
  )

  // Toggle Bon Faconnier IPC
  ipcMain.handle('toggleBonFaconnier', async (_, ...args: Parameters<ToggleBonFaconnier>) =>
    toggleBonFaconnier(...args)
  )

  // Delete Bon Faconnier IPC
  ipcMain.handle('deleteBonFaconnier', async (_, ...args: Parameters<DeleteBonFaconnier>) =>
    deleteBonFaconnier(...args)
  )

  // Get General Settings IPC
  ipcMain.handle('getGeneralSettings', async (_, ...args: Parameters<GetGeneralSettings>) =>
    getGeneralSettings(...args)
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
