import { getFromStore } from '@/store/store'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolated is not enabled. Please enable it in your main process.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    onForceLogout: (callback: any) => ipcRenderer.on('force-logout', () => callback()),
    getFromStore: (...args: Parameters<typeof getFromStore>) =>
      ipcRenderer.invoke('getFromStore', ...args),
    loginUser: (...args: Parameters<LoginUser>) => ipcRenderer.invoke('loginUser', ...args),
    logoutUser: (...args: Parameters<LogoutUser>) => ipcRenderer.invoke('logoutUser', ...args),
    getUsers: (...args: Parameters<GetUsers>) => ipcRenderer.invoke('getUsers', ...args),
    createUser: (...args: Parameters<CreateUser>) => ipcRenderer.invoke('createUser', ...args),
    deleteUser: (...args: Parameters<DeleteUser>) => ipcRenderer.invoke('deleteUser', ...args),
    updateUser: (...args: Parameters<UpdateUser>) => ipcRenderer.invoke('updateUser', ...args),
    getFaconniers: (...args: Parameters<GetFaconniers>) =>
      ipcRenderer.invoke('getFaconniers', ...args),
    createFaconnier: (...args: Parameters<CreateFaconnier>) =>
      ipcRenderer.invoke('createFaconnier', ...args),
    deleteFaconnier: (...args: Parameters<DeleteFaconnier>) =>
      ipcRenderer.invoke('deleteFaconnier', ...args),
    updateFaconnier: (...args: Parameters<UpdateFaconnier>) =>
      ipcRenderer.invoke('updateFaconnier', ...args),
    updateFaconnierStatus: (...args: Parameters<UpdateFaconnierStatus>) =>
      ipcRenderer.invoke('updateFaconnierStatus', ...args),
    getClients: (...args: Parameters<GetClients>) => ipcRenderer.invoke('getClients', ...args),
    createClient: (...args: Parameters<CreateClient>) =>
      ipcRenderer.invoke('createClient', ...args),
    deleteClient: (...args: Parameters<DeleteClient>) =>
      ipcRenderer.invoke('deleteClient', ...args),
    updateClient: (...args: Parameters<UpdateClient>) =>
      ipcRenderer.invoke('updateClient', ...args),
    updateClientStatus: (...args: Parameters<UpdateClientStatus>) =>
      ipcRenderer.invoke('updateClientStatus', ...args),
    getSeasons: (...args: Parameters<GetSeasons>) => ipcRenderer.invoke('getSeasons', ...args),
    createSeason: (...args: Parameters<CreateSeason>) =>
      ipcRenderer.invoke('createSeason', ...args),
    deleteSeason: (...args: Parameters<DeleteSeason>) =>
      ipcRenderer.invoke('deleteSeason', ...args),
    updateSeason: (...args: Parameters<UpdateSeason>) =>
      ipcRenderer.invoke('updateSeason', ...args),
    getProducts: (...args: Parameters<GetProducts>) => ipcRenderer.invoke('getProducts', ...args),
    createProduct: (...args: Parameters<CreateProduct>) =>
      ipcRenderer.invoke('createProduct', ...args),
    updateProduct: (...args: Parameters<UpdateProduct>) =>
      ipcRenderer.invoke('updateProduct', ...args),
    deleteProduct: (...args: Parameters<DeleteProduct>) =>
      ipcRenderer.invoke('deleteProduct', ...args),
    getActiveFaconniers: (...args: Parameters<GetActiveFaconniers>) =>
      ipcRenderer.invoke('getActiveFaconniers', ...args),
    createBonFaconnier: (...args: Parameters<CreateBonFaconnier>) =>
      ipcRenderer.invoke('createBonFaconnier', ...args),
    createOrderFaconnier: (...args: Parameters<CreateOrderFaconnier>) =>
      ipcRenderer.invoke('createOrderFaconnier', ...args),
    getAllProductsStatus: (...args: Parameters<GetAllProductsStatus>) =>
      ipcRenderer.invoke('getAllProductsStatus', ...args),
    getOrdersFaconnier: (...args: Parameters<GetOrdersFaconnier>) =>
      ipcRenderer.invoke('getOrdersFaconnier', ...args),
    createAvanceFaconnier: (...args: Parameters<CreateAvanceFaconnier>) =>
      ipcRenderer.invoke('createAvanceFaconnier', ...args),
    getFaconnierSummary: (...args: Parameters<GetFaconnierSummary>) =>
      ipcRenderer.invoke('getFaconnierSummary', ...args),
    updateOrderQuantityReturned: (...args: Parameters<UpdateOrderQuantityReturned>) =>
      ipcRenderer.invoke('updateOrderQuantityReturned', ...args),
    deleteAvanceFaconnier: (...args: Parameters<DeleteAvanceFaconnier>) =>
      ipcRenderer.invoke('deleteAvanceFaconnier', ...args),
    deleteOrderFaconnier: (...args: Parameters<DeleteOrderFaconnier>) =>
      ipcRenderer.invoke('deleteOrderFaconnier', ...args),
    toggleBonFaconnier: (...args: Parameters<ToggleBonFaconnier>) =>
      ipcRenderer.invoke('toggleBonFaconnier', ...args),
    deleteBonFaconnier: (...args: Parameters<DeleteBonFaconnier>) =>
      ipcRenderer.invoke('deleteBonFaconnier', ...args),
    getGeneralSettings: (...args: Parameters<GetGeneralSettings>) =>
      ipcRenderer.invoke('getGeneralSettings', ...args)
  })
} catch (error) {
  console.error('Failed to expose context:', error)
}
