type LoginUser = (userCreadentials: LoginFormType) => Promise<{
  status: 'success' | 'failed'
  message: string | { field: string; message: string }[]
  user?: UserData
}>

type LogoutUser = () => Promise<{
  status: 'success' | 'failed'
  message: string
}>

type GetUsers = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: 'success' | 'failed'
  message: string
  users: UserData[]
  currentPage: number
  totalPages: number
}>

// TYPES FOR USER

type CreateUser = (userData: CreateUserInput) => Promise<CreateUserResponse>

type DeleteUser = (userId: string) => Promise<CreateUserResponse>

type UpdateUser = (userData: UpdateUserInput) => Promise<CreateUserResponse>

// TYPES FOR STYLIST

type GetStylists = (
  type: string[],
  page: number,
  limit: number,
  searchTerm: string
) => Promise<{
  status: 'success' | 'failed'
  message: string
  stylists: StylistData[]
  currentPage: number
  totalPages: number
}>

type CreateStylist = (stylistData: CreateStylistInput) => Promise<CreateStylistResponse>

type UpdateStylist = (stylistData: UpdateStylistInput) => Promise<CreateStylistResponse>

type UpdateStylistStatus = (stylistId: string, status: boolean) => Promise<CreateStylistResponse>

type DeleteStylist = (stylistId: string) => Promise<CreateStylistResponse>

// TYPES FOR FACONNIER

type GetFaconniers = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: 'success' | 'failed'
  message: string
  faconniers: FaconnierData[]
  currentPage: number
  totalPages: number
}>

type CreateFaconnier = (userData: CreateFaconnierInput) => Promise<CreateFaconnierResponse>

type DeleteFaconnier = (faconnierId: string) => Promise<CreateFaconnierResponse>

type UpdateFaconnier = (userData: UpdateFaconnierInput) => Promise<CreateFaconnierResponse>

type UpdateFaconnierStatus = (
  faconnierId: string,
  status: boolean
) => Promise<CreateFaconnierResponse>

// TYPES FOR CLIENT

type GetClients = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: 'success' | 'failed'
  message: string
  clients: ClientData[]
  currentPage: number
  totalPages: number
}>

type CreateClient = (userData: CreateClientInput) => Promise<CreateClientResponse>

type DeleteClient = (clientId: string) => Promise<CreateClientResponse>

type UpdateClient = (userData: UpdateClientInput) => Promise<CreateClientResponse>

type UpdateClientStatus = (clientId: string, status: boolean) => Promise<CreateClientResponse>

// TYPES FOR Season
type GetSeasons = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: 'success' | 'failed'
  message: string
  seasons: FullSeasonData[]
  currentPage: number
  totalPages: number
}>

type CreateSeason = (seasonData: CreateSeasonInput) => Promise<CreateSeasonResponse>
type DeleteSeason = (seasonId: string) => Promise<CreateSeasonResponse>
type UpdateSeason = (seasonData: UpdateSeasonInput) => Promise<CreateSeasonResponse>
type ToggleSeason = (seasonId: string) => Promise<CreateSeasonResponse>

// Products Types
type GetProducts = (getProductData: GetProductsParams) => Promise<GetProductsResponse>

type GetReturnStock = (getReturnStockData: GetReturnStockParams) => Promise<GetReturnStockResponse>

type CreateProduct = (
  productData: CreateProductInput,
  seasonId: string
) => Promise<CreateProductResponse>

type UpdateProduct = (
  productData: UpdateProductInput,
  seasonId: string
) => Promise<UpdateProductResponse>

type DeleteProduct = (productId: string, seasonId: string) => Promise<DeleteProductResponse>

type DeleteClientReturnStock = (
  clientReturnId: string,
  seasonId: string
) => Promise<DeleteClientReturnStockResponse>

type UpdateClientReturnStock = (
  UpdateClientReturnData: UpdateClientReturnStockInput
) => Promise<DeleteClientReturnStockResponse>

type GetSummaryReturnStock = (seasonId: string) => Promise<GetSummaryReturnStockResponse>

type CreateOrderClientFromReturnStock = (
  orderClientData: CreateOrderClientInput
) => Promise<CreateOrderClientFromReturnStockResponse>

type GetActiveFaconniers = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveFaconniersResponse>

type GetActiveStylists = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveStylistsResponse>

type GetActiveClients = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveClientsResponse>

type CreateAvanceStylist = (
  avanceData: CreateAvanceStylistInput
) => Promise<CreateAvanceStylistResponse>

type CreateBonFaconnier = (bonData: CreateBonFaconnierInput) => Promise<CreateBonFaconnierResponse>

type CreateBonStylist = (bonData: CreateBonStylistInput) => Promise<CreateBonStylistResponse>

type CreateBonClient = (bonData: CreateBonClientInput) => Promise<CreateBonClientResponse>

type CreateOrderFaconnier = (
  orderData: CreateOrderFaconnierInput
) => Promise<CreateOrderFaconnierResponse>

type CreateOrderStylist = (
  orderData: CreateOrderStylistInput
) => Promise<CreateOrderStylistResponse>

type CreateOrderClient = (orderData: CreateOrderClientInput) => Promise<CreateOrderClientResponse>

type CreateMultipleOrdersClient = (
  ordersData: CreateMultipleOrdersClientInput & { seasonId: string }
) => Promise<CreateMultipleOrderClientResponse>

type GetAllProductsStatus = (seasonId: string) => Promise<GetAllProductsStatusResponse>
type GetOrdersFaconnier = (
  seasonId: string,
  faconnierId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersFaconnierResponse>

type GetOrdersStylist = (
  seasonId: string,
  stylistId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersStylistResponse>

type GetOrdersClient = (
  seasonId: string,
  clientId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersClientResponse>

type CreateAvanceFaconnier = (
  avanceData: CreateAvanceFaconnierInput
) => Promise<CreateAvanceFaconnierResponse>

type CreateAvanceClient = (
  avanceData: CreateAvanceClientInput
) => Promise<CreateAvanceClientResponse>

type GetFaconnierSummary = (
  seasonId: string,
  faconnierId: string,
  bonId: string
) => Promise<GetFaconnierSummaryResponse>

type GetStylistSummary = (
  seasonId: string,
  stylistId: string,
  bonId: string
) => Promise<GetStylistSummaryResponse>

type GetClientSummary = (
  seasonId: string,
  clientId: string,
  bonId: string
) => Promise<GetClientSummaryResponse>

type DeleteAvanceFaconnier = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceFaconnierResponse>

type DeleteAvanceStylist = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceStylistResponse>

type DeleteAvanceClient = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceClientResponse>

type UpdateOrderFaconnier = (
  updateOrderFaconnierData: UpdateOrderFaconnierInput
) => Promise<UpdateOrderFaconnierResponse>

type UpdateOrderStylist = (
  updateOrderStylistData: UpdateOrderStylistInput
) => Promise<UpdateOrderStylistResponse>

type UpdateOrderClient = (
  updateOrderClientData: UpdateOrderClientInput
) => Promise<UpdateOrderClientResponse>

type DeleteOrderFaconnier = (
  orderId: string,
  seasonId: string
) => Promise<DeleteOrderFaconnierResponse>

type DeleteOrderStylist = (orderId: string, seasonId: string) => Promise<DeleteOrderStylistResponse>

type DeleteOrderClient = (orderId: string, seasonId: string) => Promise<DeleteOrderClientResponse>

type ToggleBonFaconnier = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonFaconnierResponse>

type ToggleBonStylist = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonStylistResponse>

type ToggleBonClient = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonClientResponse>

type DeleteBonFaconnier = (bonId: string, seasonId: string) => Promise<DeleteBonFaconnierResponse>

type DeleteBonStylist = (bonId: string, seasonId: string) => Promise<DeleteBonStylistResponse>

type DeleteBonClient = (bonId: string, seasonId: string) => Promise<DeleteBonClientResponse>

// Dashboard Types
type GetGeneralSettings = () => Promise<GeneralSettings>

type GetSummary = (seasonId: string) => Promise<GetSummaryResponse>

type GetRetardOrdersFaconnier = (seasonId: string) => Promise<GetRetardOrdersFaconnierResponse>

type DownloadBon = (buffer: ArrayBuffer, defaultName: string) => Promise<void>

type DownloadExcelBon = (bonId: string, type: 'faconnier' | 'stylist' | 'client') => Promise<void>
