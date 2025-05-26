declare global {
  interface Window {
    context: {
      onForceLogout: (callback: () => void) => void
      loginUser: LoginUser
      logoutUser: LogoutUser
      getFromStore: <K extends keyof StoreSchema>(key: K) => Promise<StoreSchema[K]>
      getUsers: GetUsers
      createUser: CreateUser
      deleteUser: DeleteUser
      updateUser: UpdateUser
      getFaconniers: GetFaconniers
      createFaconnier: CreateFaconnier
      deleteFaconnier: DeleteFaconnier
      updateFaconnierStatus: UpdateFaconnierStatus
      updateFaconnier: UpdateFaconnier
      getClients: GetClients
      createClient: CreateClient
      deleteClient: DeleteClient
      updateClient: UpdateClient
      updateClientStatus: UpdateClientStatus
      getSeasons: GetSeasons
      createSeason: CreateSeason
      deleteSeason: DeleteSeason
      updateSeason: UpdateSeason
      getProducts: GetProducts
      createProduct: CreateProduct
      updateProduct: UpdateProduct
      deleteProduct: DeleteProduct
      getAllProductsStatus: GetAllProductsStatus
      getActiveFaconniers: GetActiveFaconniers
      createBonFaconnier: CreateBonFaconnier
      createOrderFaconnier: CreateOrderFaconnier
      getOrdersFaconnier: GetOrdersFaconnier
      createAvanceFaconnier: CreateAvanceFaconnier
      getFaconnierSummary: GetFaconnierSummary
      updateOrderQuantityReturned: UpdateOrderQuantityReturned
      deleteAvanceFaconnier: DeleteAvanceFaconnier
      deleteOrderFaconnier: DeleteOrderFaconnier
      toggleBonFaconnier: ToggleBonFaconnier
      deleteBonFaconnier: DeleteBonFaconnier
      getGeneralSettings: GetGeneralSettings
    }
  }
}

export {}
