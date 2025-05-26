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

// Products Types
type GetProducts = (getProductData: GetProductsParams) => Promise<GetProductsResponse>
type CreateProduct = (
  productData: CreateProductInput,
  seasonId: string
) => Promise<CreateProductResponse>

type UpdateProduct = (
  productData: UpdateProductInput,
  seasonId: string
) => Promise<UpdateProductResponse>

type DeleteProduct = (productId: string, seasonId: string) => Promise<DeleteProductResponse>

type GetActiveFaconniers = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveFaconniersResponse>

type CreateBonFaconnier = (bonData: CreateBonFaconnierInput) => Promise<CreateBonFaconnierResponse>

type CreateOrderFaconnier = (
  orderData: CreateOrderFaconnierInput
) => Promise<CreateOrderFaconnierResponse>

type GetAllProductsStatus = (seasonId: string) => Promise<GetAllProductsStatusResponse>
type GetOrdersFaconnier = (
  seasonId: string,
  faconnierId: string,
  bonId: string
) => Promise<GetOrdersFaconnierResponse>

type CreateAvanceFaconnier = (
  avanceData: CreateAvanceFaconnierInput
) => Promise<CreateAvanceFaconnierResponse>

type GetFaconnierSummary = (
  seasonId: string,
  faconnierId: string,
  bonId: string
) => Promise<GetFaconnierSummaryResponse>

type DeleteAvanceFaconnier = (avanceId: string) => Promise<DeleteAvanceFaconnierResponse>

type UpdateOrderQuantityReturned = (
  orderId: string,
  quantityReturned: number
) => Promise<UpdateOrderQuantityReturnedResponse>

type DeleteOrderFaconnier = (orderId: string) => Promise<DeleteOrderFaconnierResponse>

type ToggleBonFaconnier = (
  bonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonFaconnierResponse>

type DeleteBonFaconnier = (bonId: string) => Promise<DeleteBonFaconnierResponse>

// Dashboard Types
type GetGeneralSettings = () => Promise<GeneralSettings>
