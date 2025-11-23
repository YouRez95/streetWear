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
    toggleSeason: (...args: Parameters<ToggleSeason>) =>
      ipcRenderer.invoke('toggleSeason', ...args),
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
    updateOrderFaconnier: (...args: Parameters<UpdateOrderFaconnier>) =>
      ipcRenderer.invoke('updateOrderFaconnier', ...args),
    deleteAvanceFaconnier: (...args: Parameters<DeleteAvanceFaconnier>) =>
      ipcRenderer.invoke('deleteAvanceFaconnier', ...args),
    deleteOrderFaconnier: (...args: Parameters<DeleteOrderFaconnier>) =>
      ipcRenderer.invoke('deleteOrderFaconnier', ...args),
    toggleBonFaconnier: (...args: Parameters<ToggleBonFaconnier>) =>
      ipcRenderer.invoke('toggleBonFaconnier', ...args),
    deleteBonFaconnier: (...args: Parameters<DeleteBonFaconnier>) =>
      ipcRenderer.invoke('deleteBonFaconnier', ...args),
    getGeneralSettings: (...args: Parameters<GetGeneralSettings>) =>
      ipcRenderer.invoke('getGeneralSettings', ...args),
    createStylist: (...args: Parameters<CreateStylist>) =>
      ipcRenderer.invoke('createStylist', ...args),
    getStylists: (...args: Parameters<GetStylists>) => ipcRenderer.invoke('getStylists', ...args),
    updateStylistStatus: (...args: Parameters<UpdateStylistStatus>) =>
      ipcRenderer.invoke('updateStylistStatus', ...args),
    updateStylist: (...args: Parameters<UpdateStylist>) =>
      ipcRenderer.invoke('updateStylist', ...args),
    deleteStylist: (...args: Parameters<DeleteStylist>) =>
      ipcRenderer.invoke('deleteStylist', ...args),
    getActiveStylists: (...args: Parameters<GetActiveStylists>) =>
      ipcRenderer.invoke('getActiveStylists', ...args),
    createBonStylist: (...args: Parameters<CreateBonStylist>) =>
      ipcRenderer.invoke('createBonStylist', ...args),
    createOrderStylist: (...args: Parameters<CreateOrderStylist>) =>
      ipcRenderer.invoke('createOrderStylist', ...args),
    downloadBon: (...args: Parameters<DownloadBon>) => ipcRenderer.invoke('downloadBon', ...args),
    downloadExcelBon: (...args: Parameters<DownloadExcelBon>) =>
      ipcRenderer.invoke('downloadExcelBon', ...args),
    createAvanceStylist: (...args: Parameters<CreateAvanceStylist>) =>
      ipcRenderer.invoke('createAvanceStylist', ...args),
    getOrdersStylist: (...args: Parameters<GetOrdersStylist>) =>
      ipcRenderer.invoke('getOrdersStylist', ...args),
    updateOrderStylist: (...args: Parameters<UpdateOrderStylist>) =>
      ipcRenderer.invoke('updateOrderStylist', ...args),
    deleteOrderStylist: (...args: Parameters<DeleteOrderStylist>) =>
      ipcRenderer.invoke('deleteOrderStylist', ...args),
    deleteAvanceStylist: (...args: Parameters<DeleteAvanceStylist>) =>
      ipcRenderer.invoke('deleteAvanceStylist', ...args),
    toggleBonStylist: (...args: Parameters<ToggleBonStylist>) =>
      ipcRenderer.invoke('toggleBonStylist', ...args),
    deleteBonStylist: (...args: Parameters<DeleteBonStylist>) =>
      ipcRenderer.invoke('deleteBonStylist', ...args),
    getStylistSummary: (...args: Parameters<GetStylistSummary>) =>
      ipcRenderer.invoke('getStylistSummary', ...args),
    getActiveClients: (...args: Parameters<GetActiveClients>) =>
      ipcRenderer.invoke('getActiveClients', ...args),
    createBonClient: (...args: Parameters<CreateBonClient>) =>
      ipcRenderer.invoke('createBonClient', ...args),
    createOrderClient: (...args: Parameters<CreateOrderClient>) =>
      ipcRenderer.invoke('createOrderClient', ...args),
    createMultipleOrdersClient: (...args: Parameters<CreateMultipleOrdersClient>) =>
      ipcRenderer.invoke('createMultipleOrdersClient', ...args),
    getOrdersClient: (...args: Parameters<GetOrdersClient>) =>
      ipcRenderer.invoke('getOrdersClient', ...args),
    createAvanceClient: (...args: Parameters<CreateAvanceClient>) =>
      ipcRenderer.invoke('createAvanceClient', ...args),
    getClientSummary: (...args: Parameters<GetClientSummary>) =>
      ipcRenderer.invoke('getClientSummary', ...args),
    deleteBonClient: (...args: Parameters<DeleteBonClient>) =>
      ipcRenderer.invoke('deleteBonClient', ...args),
    deleteOrderClient: (...args: Parameters<DeleteOrderClient>) =>
      ipcRenderer.invoke('deleteOrderClient', ...args),
    deleteAvanceClient: (...args: Parameters<DeleteAvanceClient>) =>
      ipcRenderer.invoke('deleteAvanceClient', ...args),
    toggleBonClient: (...args: Parameters<ToggleBonClient>) =>
      ipcRenderer.invoke('toggleBonClient', ...args),
    updateOrderClient: (...args: Parameters<UpdateOrderClient>) =>
      ipcRenderer.invoke('updateOrderClient', ...args),
    getSummary: (...args: Parameters<GetSummary>) => ipcRenderer.invoke('getSummary', ...args),
    getRetardOrdersFaconnier: (...args: Parameters<GetRetardOrdersFaconnier>) =>
      ipcRenderer.invoke('getRetardOrdersFaconnier', ...args),
    getReturnStock: (...args: Parameters<GetReturnStock>) =>
      ipcRenderer.invoke('getReturnStock', ...args),
    deleteClientReturnStock: (...args: Parameters<DeleteClientReturnStock>) =>
      ipcRenderer.invoke('deleteClientReturnStock', ...args),
    deleteReturnStock: (...args: Parameters<DeleteReturnStock>) =>
      ipcRenderer.invoke('deleteReturnStock', ...args),
    updateClientReturnStock: (...args: Parameters<UpdateClientReturnStock>) =>
      ipcRenderer.invoke('updateClientReturnStock', ...args),
    getSummaryReturnStock: (...args: Parameters<GetSummaryReturnStock>) =>
      ipcRenderer.invoke('getSummaryReturnStock', ...args),
    createOrderClientFromReturnStock: (...args: Parameters<CreateOrderClientFromReturnStock>) =>
      ipcRenderer.invoke('createOrderClientFromReturnStock', ...args),
    createWorkPlace: (...args: Parameters<CreateWorkPlace>) =>
      ipcRenderer.invoke('createWorkPlace', ...args),
    getWorkPlaces: (...args: Parameters<GetWorkPlaces>) =>
      ipcRenderer.invoke('getWorkPlaces', ...args),
    getWorkplacesByCursor: (...args: Parameters<GetWorkPlacesByCursor>) =>
      ipcRenderer.invoke('getWorkplacesByCursor', ...args),
    updateWorkplace: (...args: Parameters<UpdateWorkplace>) =>
      ipcRenderer.invoke('updateWorkplace', ...args),
    deleteWorkplace: (...args: Parameters<DeleteWorkplace>) =>
      ipcRenderer.invoke('deleteWorkplace', ...args),
    createWorker: (...args: Parameters<CreateWorker>) =>
      ipcRenderer.invoke('createWorker', ...args),
    getWorkers: (...args: Parameters<GetWorkers>) => ipcRenderer.invoke('getWorkers', ...args),
    updateWorker: (...args: Parameters<UpdateWorker>) =>
      ipcRenderer.invoke('updateWorker', ...args),
    deleteWorker: (...args: Parameters<DeleteWorker>) =>
      ipcRenderer.invoke('deleteWorker', ...args),
    getWorkersCursor: (...args: Parameters<GetWorkersByCursor>) =>
      ipcRenderer.invoke('getWorkersCursor', ...args),
    updateWorkerStatus: (...args: Parameters<UpdateWorkerStatus>) =>
      ipcRenderer.invoke('updateWorkerStatus', ...args),
    getWeeksByCursor: (...args: Parameters<GetWeeksByCursor>) =>
      ipcRenderer.invoke('getWeeksByCursor', ...args),
    createWeek: (...args: Parameters<CreateWeek>) => ipcRenderer.invoke('createWeek', ...args),
    updateWeek: (...args: Parameters<UpdateWeek>) => ipcRenderer.invoke('updateWeek', ...args),
    deleteWeek: (...args: Parameters<DeleteWeek>) => ipcRenderer.invoke('deleteWeek', ...args),
    getWeekRecords: (...args: Parameters<GetWeekRecords>) =>
      ipcRenderer.invoke('getWeekRecords', ...args),
    updateWeekRecord: (...args: Parameters<UpdateWeekRecord>) =>
      ipcRenderer.invoke('updateWeekRecord', ...args),
    updateWeekRecordPayment: (...args: Parameters<UpdateWeekRecordPayment>) =>
      ipcRenderer.invoke('updateWeekRecordPayment', ...args),
    deleteWeekRecord: (...args: Parameters<DeleteWeekRecord>) =>
      ipcRenderer.invoke('deleteWeekRecord', ...args),
    createWeekRecord: (...args: Parameters<CreateWeekRecord>) =>
      ipcRenderer.invoke('createWeekRecord', ...args),
    getYearSummary: (...args: Parameters<GetYearSummary>) =>
      ipcRenderer.invoke('getYearSummary', ...args),
    getYearsByCursor: (...args: Parameters<GetYearByCursor>) =>
      ipcRenderer.invoke('getYearsByCursor', ...args),
    getSummaryWorkers: (...args: Parameters<GetSummaryWorkers>) =>
      ipcRenderer.invoke('getSummaryWorkers', ...args),
    getWorkerRecords: (...args: Parameters<GetWorkerRecords>) =>
      ipcRenderer.invoke('getWorkerRecords', ...args),
    getSummaryWorker: (...args: Parameters<GetSummaryWorker>) =>
      ipcRenderer.invoke('getSummaryWorker', ...args),
    cancelOrderFaconnier: (...args: Parameters<CancelOrderFaconnier>) =>
      ipcRenderer.invoke('cancelOrderFaconnier', ...args),
    createBonClientPassager: (...args: Parameters<CreateBonClientPassager>) =>
      ipcRenderer.invoke('createBonClientPassager', ...args),
    getBonsClientPassager: (...args: Parameters<GetBonsClientPassager>) =>
      ipcRenderer.invoke('getBonsClientPassager', ...args),
    getActiveClientsAndPassager: (...args: Parameters<GetActiveClients>) =>
      ipcRenderer.invoke('getActiveClientsAndPassager', ...args),
    getInfiniteProducts: (...args: Parameters<GetInfiniteProducts>) =>
      ipcRenderer.invoke('getInfiniteProducts', ...args),
    showContextMenu: () => ipcRenderer.invoke('show-context-menu'),
    downloadImage: (url: string) => ipcRenderer.invoke('download-image', url)
  })
} catch (error) {
  console.error('Failed to expose context:', error)
}
