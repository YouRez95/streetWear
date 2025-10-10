import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { loginUser, logoutUser } from './services/auth'
import { downloadBon, downloadExcelBon } from './services/bons'
import {
  createAvanceClient,
  createBonClient,
  createClient,
  createMultipleOrdersClient,
  createOrderClient,
  deleteAvanceClient,
  deleteBonClient,
  deleteClient,
  deleteOrderClient,
  getActiveClients,
  getClients,
  getClientSummary,
  getOrdersClient,
  toggleBonClient,
  updateClient,
  updateClientStatus,
  updateOrderClient
} from './services/clients'
import { getGeneralSettings, getRetardOrdersFaconnier, getSummary } from './services/dashboard'
import {
  cancelOrderFaconnier,
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
  updateFaconnierStatus,
  updateOrderFaconnier
} from './services/producer'
import {
  createProduct,
  deleteProduct,
  getAllProductsStatus,
  getProducts,
  updateProduct
} from './services/products'
import {
  createOrderClientFromReturnStock,
  deleteClientReturnStock,
  getReturnStock,
  getSummaryReturnStock,
  updateClientReturnStock
} from './services/returnStock'
import {
  createSeason,
  deleteSeason,
  getSeasons,
  toggleSeason,
  updateSeason
} from './services/seasons'
import {
  createAvanceStylist,
  createBonStylist,
  createOrderStylist,
  createStylist,
  deleteAvanceStylist,
  deleteBonStylist,
  deleteOrderStylist,
  deleteStylist,
  getActiveStylists,
  getOrdersStylist,
  getStylists,
  getStylistSummary,
  toggleBonStylist,
  updateOrderStylist,
  updateStylist,
  updateStylistStatus
} from './services/stylists'
import { createUser, deleteUser, getUsers, updateUser } from './services/users'
import {
  createWeek,
  createWeekRecord,
  createWorker,
  createWorkPlace,
  deleteWeek,
  deleteWeekRecord,
  deleteWorker,
  deleteWorkplace,
  getSummaryWorker,
  getSummaryWorkers,
  getWeekRecords,
  getWeeksByCursor,
  getWorkerRecords,
  getWorkers,
  getWorkersCursor,
  getWorkPlaces,
  getWorkPlacesByCursor,
  getYearsByCursor,
  getYearSummary,
  updateWeek,
  updateWeekRecord,
  updateWeekRecordPayment,
  updateWorker,
  updateWorkerStatus,
  updateWorkplace
} from './services/workers'
import { getFromStore } from './store/store'
import { setMainWindow } from './utils/windowManager'

// const reactDevToolsPath = path.join(
//   os.homedir(),
//   '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.1.1_0'
// )

// app.commandLine.appendSwitch('ignore-gpu-blacklist')
// app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('disable-features', 'msHighDpiScaling')
app.commandLine.appendSwitch('high-dpi-support', '1')
app.commandLine.appendSwitch('force-device-scale-factor', '1')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1500,
    width: 1500,
    height: 1000,
    minHeight: 1000,
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

  // Create Stylist IPC
  ipcMain.handle('createStylist', async (_, ...args: Parameters<CreateStylist>) =>
    createStylist(...args)
  )

  // Get Stylists IPC
  ipcMain.handle('getStylists', async (_, ...args: Parameters<GetStylists>) => getStylists(...args))

  // Update Stylist Status IPC
  ipcMain.handle('updateStylistStatus', async (_, ...args: Parameters<UpdateStylistStatus>) =>
    updateStylistStatus(...args)
  )

  // Update Stylist IPC
  ipcMain.handle('updateStylist', async (_, ...args: Parameters<UpdateStylist>) =>
    updateStylist(...args)
  )

  // Get active stylists IPC
  ipcMain.handle('getActiveStylists', async (_, ...args: Parameters<GetActiveStylists>) =>
    getActiveStylists(...args)
  )

  // Create Bon Stylist IPC
  ipcMain.handle('createBonStylist', async (_, ...args: Parameters<CreateBonStylist>) =>
    createBonStylist(...args)
  )

  // Create Order Stylist IPC
  ipcMain.handle('createOrderStylist', async (_, ...args: Parameters<CreateOrderStylist>) =>
    createOrderStylist(...args)
  )

  // Get Orders Stylist IPC
  ipcMain.handle('getOrdersStylist', async (_, ...args: Parameters<GetOrdersStylist>) =>
    getOrdersStylist(...args)
  )

  // Delete Order Stylist IPC
  ipcMain.handle('deleteOrderStylist', async (_, ...args: Parameters<DeleteOrderStylist>) =>
    deleteOrderStylist(...args)
  )

  // Update Order Stylist IPC
  ipcMain.handle('updateOrderStylist', async (_, ...args: Parameters<UpdateOrderStylist>) =>
    updateOrderStylist(...args)
  )

  // Delete Stylist IPC
  ipcMain.handle('deleteStylist', async (_, ...args: Parameters<DeleteStylist>) =>
    deleteStylist(...args)
  )

  // Toggle Bon Stylist IPC
  ipcMain.handle('toggleBonStylist', async (_, ...args: Parameters<ToggleBonStylist>) =>
    toggleBonStylist(...args)
  )

  // Delete Bon Stylist IPC
  ipcMain.handle('deleteBonStylist', async (_, ...args: Parameters<DeleteBonStylist>) =>
    deleteBonStylist(...args)
  )

  // Delete Avance Stylist IPC
  ipcMain.handle('deleteAvanceStylist', async (_, ...args: Parameters<DeleteAvanceStylist>) =>
    deleteAvanceStylist(...args)
  )

  // Create Avance Stylist IPC
  ipcMain.handle('createAvanceStylist', async (_, ...args: Parameters<CreateAvanceStylist>) =>
    createAvanceStylist(...args)
  )

  // Get Stylist Summary IPC
  ipcMain.handle('getStylistSummary', async (_, ...args: Parameters<GetStylistSummary>) =>
    getStylistSummary(...args)
  )

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

  // Get Active Clients IPC
  ipcMain.handle('getActiveClients', async (_, ...args: Parameters<GetActiveClients>) =>
    getActiveClients(...args)
  )

  // Create Bon Client IPC
  ipcMain.handle('createBonClient', async (_, ...args: Parameters<CreateBonClient>) =>
    createBonClient(...args)
  )

  // Create Order Client IPC
  ipcMain.handle('createOrderClient', async (_, ...args: Parameters<CreateOrderClient>) =>
    createOrderClient(...args)
  )

  // Create Multiple Orders Client IPC
  ipcMain.handle(
    'createMultipleOrdersClient',
    async (_, ...args: Parameters<CreateMultipleOrdersClient>) =>
      createMultipleOrdersClient(...args)
  )

  // Get Orders Client IPC
  ipcMain.handle('getOrdersClient', async (_, ...args: Parameters<GetOrdersClient>) =>
    getOrdersClient(...args)
  )

  // Create Avance Client IPC
  ipcMain.handle('createAvanceClient', async (_, ...args: Parameters<CreateAvanceClient>) =>
    createAvanceClient(...args)
  )

  // Get Client Summary IPC
  ipcMain.handle('getClientSummary', async (_, ...args: Parameters<GetClientSummary>) =>
    getClientSummary(...args)
  )

  // Delete Bon Client IPC
  ipcMain.handle('deleteBonClient', async (_, ...args: Parameters<DeleteBonClient>) =>
    deleteBonClient(...args)
  )

  // Delete Order Client IPC
  ipcMain.handle('deleteOrderClient', async (_, ...args: Parameters<DeleteOrderClient>) =>
    deleteOrderClient(...args)
  )

  // Delete Avance Client IPC
  ipcMain.handle('deleteAvanceClient', async (_, ...args: Parameters<DeleteAvanceClient>) =>
    deleteAvanceClient(...args)
  )

  // Toggle Bon Client IPC
  ipcMain.handle('toggleBonClient', async (_, ...args: Parameters<ToggleBonClient>) =>
    toggleBonClient(...args)
  )

  // Update Order Client IPC
  ipcMain.handle('updateOrderClient', async (_, ...args: Parameters<UpdateOrderClient>) =>
    updateOrderClient(...args)
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

  // Toggle Season
  ipcMain.handle('toggleSeason', async (_, ...args: Parameters<ToggleSeason>) =>
    toggleSeason(...args)
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

  // cancelOrderFaconnier IPC
  ipcMain.handle('cancelOrderFaconnier', async (_, ...args: Parameters<CancelOrderFaconnier>) =>
    cancelOrderFaconnier(...args)
  )

  // Update Order Quantity Returned IPC
  ipcMain.handle('updateOrderFaconnier', async (_, ...args: Parameters<UpdateOrderFaconnier>) =>
    updateOrderFaconnier(...args)
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

  // Download Bon IPC
  ipcMain.handle('downloadBon', async (_, ...args: Parameters<DownloadBon>) => downloadBon(...args))

  // Download Excel Bon IPC
  ipcMain.handle('downloadExcelBon', async (_, ...args: Parameters<DownloadExcelBon>) =>
    downloadExcelBon(...args)
  )

  // Get Summary IPC
  ipcMain.handle('getSummary', async (_, ...args: Parameters<GetSummary>) => getSummary(...args))

  // Get Retard Orders Faconnier IPC
  ipcMain.handle(
    'getRetardOrdersFaconnier',
    async (_, ...args: Parameters<GetRetardOrdersFaconnier>) => getRetardOrdersFaconnier(...args)
  )

  // Get return stock
  ipcMain.handle('getReturnStock', async (_, ...args: Parameters<GetReturnStock>) =>
    getReturnStock(...args)
  )

  // Delete return stock
  ipcMain.handle(
    'deleteClientReturnStock',
    async (_, ...args: Parameters<DeleteClientReturnStock>) => deleteClientReturnStock(...args)
  )

  // Update return stock
  ipcMain.handle(
    'updateClientReturnStock',
    async (_, ...args: Parameters<UpdateClientReturnStock>) => updateClientReturnStock(...args)
  )

  // Get summary return stock
  ipcMain.handle('getSummaryReturnStock', async (_, ...args: Parameters<GetSummaryReturnStock>) =>
    getSummaryReturnStock(...args)
  )

  // Create Order return stock
  ipcMain.handle(
    'createOrderClientFromReturnStock',
    async (_, ...args: Parameters<CreateOrderClientFromReturnStock>) =>
      createOrderClientFromReturnStock(...args)
  )

  // Create Workplace IPC
  ipcMain.handle('createWorkPlace', async (_, ...args: Parameters<CreateWorkPlace>) =>
    createWorkPlace(...args)
  )

  // Get Workplace IPC
  ipcMain.handle('getWorkPlaces', async (_, ...args: Parameters<GetWorkPlaces>) =>
    getWorkPlaces(...args)
  )

  // Get Workplace By Cursor IPC
  ipcMain.handle('getWorkplacesByCursor', async (_, ...args: Parameters<GetWorkPlacesByCursor>) =>
    getWorkPlacesByCursor(...args)
  )

  // Update workplace
  ipcMain.handle('updateWorkplace', async (_, ...args: Parameters<UpdateWorkplace>) =>
    updateWorkplace(...args)
  )

  // Delete workplace
  ipcMain.handle('deleteWorkplace', async (_, ...args: Parameters<DeleteWorkplace>) =>
    deleteWorkplace(...args)
  )

  // create worker
  ipcMain.handle('createWorker', async (_, ...args: Parameters<CreateWorker>) =>
    createWorker(...args)
  )
  // get workers
  ipcMain.handle('getWorkers', async (_, ...args: Parameters<GetWorkers>) => getWorkers(...args))

  // update workers
  ipcMain.handle('updateWorker', async (_, ...args: Parameters<UpdateWorker>) =>
    updateWorker(...args)
  )

  // delete worker
  ipcMain.handle('deleteWorker', async (_, ...args: Parameters<DeleteWorker>) =>
    deleteWorker(...args)
  )

  // get worker by cursor
  ipcMain.handle('getWorkersCursor', async (_, ...args: Parameters<GetWorkersByCursor>) =>
    getWorkersCursor(...args)
  )

  //update Worker Status
  ipcMain.handle('updateWorkerStatus', async (_, ...args: Parameters<UpdateWorkerStatus>) =>
    updateWorkerStatus(...args)
  )

  // Get weeks ipc
  ipcMain.handle('getWeeksByCursor', async (_, ...args: Parameters<GetWeeksByCursor>) =>
    getWeeksByCursor(...args)
  )

  // Get weeks ipc
  ipcMain.handle('createWeek', async (_, ...args: Parameters<CreateWeek>) => createWeek(...args))

  // Get weeks ipc
  ipcMain.handle('updateWeek', async (_, ...args: Parameters<UpdateWeek>) => updateWeek(...args))

  // Get weeks ipc
  ipcMain.handle('deleteWeek', async (_, ...args: Parameters<DeleteWeek>) => deleteWeek(...args))

  // Get Week Records IPC
  ipcMain.handle('getWeekRecords', async (_, ...args: Parameters<GetWeekRecords>) =>
    getWeekRecords(...args)
  )

  // Update Week Record IPC
  ipcMain.handle('updateWeekRecord', async (_, ...args: Parameters<UpdateWeekRecord>) =>
    updateWeekRecord(...args)
  )

  ipcMain.handle(
    'updateWeekRecordPayment',
    async (_, ...args: Parameters<UpdateWeekRecordPayment>) => updateWeekRecordPayment(...args)
  )

  // Delete Week Record IPC
  ipcMain.handle('deleteWeekRecord', async (_, ...args: Parameters<DeleteWeekRecord>) =>
    deleteWeekRecord(...args)
  )

  // Create Week Record IPC
  ipcMain.handle('createWeekRecord', async (_, ...args: Parameters<CreateWeekRecord>) =>
    createWeekRecord(...args)
  )

  // Get year Summary worker IPC
  ipcMain.handle('getYearSummary', async (_, ...args: Parameters<GetYearSummary>) =>
    getYearSummary(...args)
  )

  // Get Years By Cursor IPC
  ipcMain.handle('getYearsByCursor', async (_, ...args: Parameters<GetYearByCursor>) =>
    getYearsByCursor(...args)
  )

  // get summary
  ipcMain.handle('getSummaryWorkers', async (_, ...args: Parameters<GetSummaryWorkers>) =>
    getSummaryWorkers(...args)
  )

  ipcMain.handle('getWorkerRecords', async (_, ...args: Parameters<GetWorkerRecords>) =>
    getWorkerRecords(...args)
  )

  ipcMain.handle('getSummaryWorker', async (_, ...args: Parameters<GetSummaryWorker>) =>
    getSummaryWorker(...args)
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
