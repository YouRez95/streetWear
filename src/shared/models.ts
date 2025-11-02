type LoginFormType = {
  email: string
  password: string
}

type UserData = {
  id: string
  name: string
  email: string
  role: 'admin' | 'super admin'
  imageUrl: string | null
  phone: string | null
  address: string | null
  createdAt: string
}

type UserCreation = {
  name: string
  email: string
  password: string
  role: string
  phone?: string | null
  address?: string | null
}

type CreateUserResponse = {
  status: 'success' | 'failed'
  message: string
  user?: UserData
}
type CreateUserInput = UserCreation & { image: ArrayBuffer | null; fileName: string | null }

type UpdateUserInput = UserCreation & {
  id: string
  image: ArrayBuffer | null
  fileName: string | null
}

type StylistData = {
  id: string
  name: string
  phone: string | null
  address: string | null
  type: 'طباع' | 'طراز'
  active: boolean
  createdAt: string
}

type CreateStylistInput = Omit<StylistData, 'id' | 'createdAt'>

type UpdateStylistInput = Omit<StylistData, 'createdAt' | 'active'>

type CreateStylistResponse = {
  status: 'success' | 'failed'
  message: string
  stylist?: StylistData
}

type FaconnierData = {
  id: string
  name: string
  phone: string | null
  address: string | null
  createdAt: string
  active: boolean
}

type CreateFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  faconnier?: FaconnierData
}

type CreateFaconnierInput = Omit<FaconnierData, 'id' | 'createdAt'>
type UpdateFaconnierInput = Omit<FaconnierData, 'createdAt'>

type ClientData = {
  id: string
  name: string
  phone: string | null
  address: string | null
  createdAt: string
  active: boolean
}

type CreateClientInput = CreateFaconnierInput
type UpdateClientInput = UpdateFaconnierInput

type CreateClientResponse = {
  status: 'success' | 'failed'
  message: string
  client?: ClientData
}

type SeasonData = {
  id: string
  name: string
  description?: string
  createdAt: string
  isClosed: boolean
}

type FullSeasonData = SeasonData & {
  summary: {
    type: 'down' | 'up' | 'same' | null
    percentage: string | null
  }
  products: {
    totalProducts: number
    totalClient: number
    totalStock: number
  }
}

type CreateSeasonInput = Omit<SeasonData, 'id' | 'createdAt' | 'isClosed'>
type CreateSeasonResponse = {
  status: 'success' | 'failed'
  message: string
  season?: SeasonData
}

type UpdateSeasonInput = Omit<SeasonData, 'createdAt'>

type ProductStatus = {
  raw_in_stock: number
  quantity_at_faconnier: number
  quantity_ready: number
  quantity_with_client: number
  quantity_returned_client: number
}

type Product = {
  id: string
  name: string
  description?: string
  reference: string
  totalQty: number
  poids: number
  metrage: number
  type: 'طبعة' | 'طرزة' | 'طبعة_طرزة' | null
  productImage?: string
  createdAt: string
  ProductStatus: ProductStatus
  FaconnierOrderItems: Array<{
    id: string
    quantity_sent: number
    quantity_returned: number
    order_status: 'IN_PROGRESS' | 'COMPLETED'
    faconnierOrder: {
      createdAt: string
      faconnier: {
        id: string
        name: string
      }
      bon_number: {
        bon_number: number
        bonStatus: 'OPEN' | 'CLOSED'
      }
    }
  }>
  StyleTraitOrderItems: Array<{
    id: string
    quantity_sent: number
    unit_price: number
    createdAt: string
    styleTraitOrder: {
      styleTrait: {
        id: string
        name: string
        type: 'طباع' | 'طراز'
      }
      bon_number: {
        bon_number: number
        bonStatus: 'OPEN' | 'CLOSED'
      }
    }
  }>
}

type GetProductsParams = {
  page: number
  limit: number
  search: string
  date: string
  seasonId: string
}

type GetProductsResponse = {
  status: 'success' | 'failed'
  message: string
  products: Product[]
  currentPage: number
  totalPages: number
}

type ReturnStock = {
  id: string
  name: string
  reference: string
  description: string
  productImage: string
  stockInfo: {
    totalReturned: number
    availableForTransfer: number
    returns: {
      client: {
        id: string
        name: string
      }
      id: string
      quantity: number
      date: string
      bonNumber: number
    }[]
  }
}

type GetReturnStockParams = {
  page: number
  limit: number
  search: string
  seasonId: string
}

type GetReturnStockResponse = {
  status: 'success' | 'failed'
  message: string
  products: ReturnStock[]
  currentPage: number
  totalPages: number
}

type CreateProductInput = Omit<
  Product,
  'id' | 'ProductStatus' | 'productImage' | 'FaconnierOrderItems' | 'type' | 'StyleTraitOrderItems'
> & {
  productImage: ArrayBuffer | null
  fileName: string | null
  readyQty: number
}

type CreateProductResponse = {
  status: 'success' | 'failed'
  message: string
  product?: Product
}

type UpdateProductInput = Omit<
  Product,
  'ProductStatus' | 'productImage' | 'FaconnierOrderItems' | 'type' | 'StyleTraitOrderItems'
> & {
  productImage: ArrayBuffer | null
  fileName: string | null
}

type UpdateProductResponse = {
  status: 'success' | 'failed'
  message: string
  product?: Product
}

type DeleteProductResponse = {
  status: 'success' | 'failed'
  message: string
  product?: Product
}

type DeleteClientReturnStockResponse = {
  status: 'success' | 'failed'
  message: string
  data: {
    clientId: string
    bonId: string
  }
}

type GetSummaryReturnStockResponse = {
  status: 'success' | 'failed'
  message: string
  summary?: {
    total: number
    available: number
    used: number
    clientCount: number
    topProduct: string | null
  }
}

type CreateOrderClientFromReturnStockResponse = {
  status: 'success' | 'failed'
  message: string
  data?: {
    clientId: string
    bonId: string
  }
}

type UpdateClientReturnStockInput = {
  seasonId: string
  newQuantity: number
  clientReturnId: string
}

type GetActiveFaconniersResponse = {
  status: 'success' | 'failed'
  message: string
  faconniers: {
    id: string
    name: string
    BonsFaconnier: {
      id: string
      bon_number: number
      bonStatus: 'OPEN' | 'CLOSED'
    }[]
  }[]
}

type GetActiveStylistsResponse = {
  status: 'success' | 'failed'
  message: string
  stylists: {
    id: string
    name: string
    type: 'طباع' | 'طراز'
    BonsStyleTrait: {
      id: string
      bon_number: number
      bonStatus: 'OPEN' | 'CLOSED'
    }[]
  }[]
}

type GetActiveClientsResponse = {
  status: 'success' | 'failed'
  message: string
  clients: {
    id: string
    name: string
    BonsClients: {
      id: string
      bonStatus: 'OPEN' | 'CLOSED'
      bon_number: number
    }[]
  }[]
}

type CreateBonStylistInput = {
  seasonId: string
  stylistId: string
}

type BonStylistData = {
  id: string
  bon_number: number
  styleTraitId: string
  seasonId: string
  createdAt: string
}

type CreateBonStylistResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonStylistData
}

type BonFaconnierData = {
  id: string
  bon_number: number
  createdAt: string
  seasonId: string
  faconnierId: string
}

type CreateBonFaconnierInput = {
  seasonId: string
  faconnierId: string
}

type CreateBonFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonFaconnierData
}

type CreateBonClientInput = {
  seasonId: string
  clientId: string
}

type BonClientData = {
  id: string
  createdAt: Date
  updatedAt: Date
  seasonId: string
  bonStatus: 'OPEN' | 'CLOSED'
  bon_number: number
  clientId: string
}

type CreateBonClientResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonClientData
}

type CreateOrderStylistInput = {
  seasonId: string
  stylistId: string
  productId: string
  bon_number: number
  priceByUnit: number
  transferQuantity: number
  date: string
}

type OrderStylistData = {
  id: string
  createdAt: string
  updatedAt: string
  productId: string
  quantity_sent: number
  unit_price: number
  styleTraitOrderId: string
}

type CreateOrderStylistResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderStylistData
}

type CreateOrderFaconnierInput = {
  productId: string
  bon_number: number
  seasonId: string
  faconnierId: string
  priceByUnit: number
  transferQuantity: number
  date: string
}
type OrderFaconnierData = {
  id: string
  faconnierId: string
  seasonId: string
  bon_id: string
  createdAt: string
  updatedAt: string
}

type CreateOrderFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderFaconnierData
}

type CreateOrderClientInput = {
  seasonId: string
  clientId: string
  productId: string
  bon_number: number
  priceByUnit: number
  transferQuantity: number
  date: string
}

type CreateMultipleOrdersClientInput = {
  clientId: string
  bonNumber: number
  date: string
  products: {
    productId: string
    productName: string
    quantitySent: number
    priceByUnit: number
  }[]
}

type OrderClientData = {
  id: string
  createdAt: string
  updatedAt: string
  clientId: string
  seasonId: string
  bon_id: string
}

type CreateOrderClientResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderClientData
}

type CreateMultipleOrderClientResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderClientData[]
}

type GetAllProductsStatusResponse = {
  status: 'success' | 'failed'
  message: string
  totalProducts: number
  totalStatusResult: ProductStatus
  totalProductByPcs: number
}

type OrderProduct = {
  type: 'PRODUCT'
  id: string
  order_status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
  productId: string
  reference: string
  productName: string
  productImage: string
  quantity_sent: number
  quantity_returned: number
  unit_price: number
  createdAt: string
}

type OrderAvance = {
  type: 'AVANCE'
  id: string
  amount: number
  createdAt: string
  method: 'cash' | 'check' | 'bank'
  description: string
}

type GetOrdersFaconnierResponse = {
  status: string
  message: string
  orders: (OrderProduct | OrderAvance)[]
  totalPages: number
  currentPage: number
}

type GetOrdersStylistResponse = {
  status: string
  message: string
  orders: (OrderProduct | OrderAvance)[]
  totalPages: number
  currentPage: number
}

type OrderProductClient = Omit<
  OrderProduct,
  'quantity_returned' | 'order_status' | 'quantity_sent'
> & {
  quantity: number
  returned: number
}

type GetOrdersClientResponse = {
  status: string
  message: string
  orders: (OrderProductClient | OrderAvance)[]
  totalPages: number
  currentPage: number
}

type QueryParams = {
  page?: number
  limit?: number
  search?: string
  date?: 'asc' | 'desc'
}

type CreateAvanceStylistInput = {
  seasonId: string
  stylistId: string | undefined
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
}

type AvanceStylistData = {
  id: string
  styleTraitId: string
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
  updatedAt: string
}

type CreateAvanceStylistResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: AvanceStylistData
}
type CreateAvanceFaconnierInput = {
  seasonId: string
  faconnierId: string | undefined
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
}

type AvanceFaconnierData = {
  id: string
  faconnierId: string
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
  updatedAt: string
}

type CreateAvanceFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: AvanceFaconnierData
}

type CreateAvanceClientInput = {
  seasonId: string
  clientId: string | undefined
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
}

type AvanceClientData = {
  id: string
  clientId: string
  bonId: string
  amount: number
  method: string
  description: string
  createdAt: string
  updatedAt: string
}

type CreateAvanceClientResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: AvanceClientData
}

type GetFaconnierSummaryResponse = {
  status: 'success' | 'failed'
  message: string
  summary?: {
    totalQuantitySent: number
    totalQuantityReturned: number
    totalValueSent: number
    totalAdvances: number
  }
}

type GetStylistSummaryResponse = {
  status: 'success' | 'failed'
  message: string
  summary?: {
    totalQuantitySent: number
    totalValueSent: number
    totalAdvances: number
    totalOrderItems: number
  }
}

type GetClientSummaryResponse = {
  status: 'success' | 'failed'
  message: string
  summary?: {
    totalOrderItems: number
    totalQuantitySent: number
    totalQuantityReturned: number
    totalValueSent: number
    totalAdvances: number
    remise: number
  }
}

type UpdateOrderFaconnierInput = {
  bonId: string
  faconnierId: string
  seasonId: string
  orderId: string
  formData: {
    quantity_sent: number
    newQuantityReturned: number
    price_by_unit: number
    date: string
  }
}

type UpdateOrderStylistInput = {
  bonId: string
  stylistId: string
  seasonId: string
  orderId: string
  formData: {
    quantity_sent: number
    price_by_unit: number
    date: string
  }
}

type UpdateOrderClientInput = {
  bonId: string
  clientId: string
  seasonId: string
  orderId: string
  formData: {
    quantity_sent: number
    newQuantityReturned: number
    price_by_unit: number
    date: string
  }
}

type UpdateOrderFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderFaconnierData
}

type UpdateOrderStylistResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderStylistData
}

type UpdateOrderClientResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderClientData
}

type DeleteAvanceFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: Omit<OrderAvance, 'type'>
}

type DeleteAvanceStylistResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: Omit<OrderAvance, 'type'>
}

type DeleteAvanceClientResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: Omit<OrderAvance, 'type'>
}

type DeleteOrderFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  order?: Omit<OrderProduct, 'type'>
}

type DeleteOrderStylistResponse = {
  status: 'success' | 'failed'
  message: string
  order?: {
    id: string
    createdAt: Date
    updatedAt: Date
    productId: string
    quantity_sent: number
    unit_price: number
    styleTraitOrderId: string
  }
}

type DeleteOrderClientResponse = {
  status: 'success' | 'failed'
  message: string
  order?: {
    id: string
    createdAt: Date
    updatedAt: Date
    productId: string
    unit_price: number
    quantity: number
    returned: number
    clientOrderId: string
  }
}

type ToggleBonFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonFaconnierData
}

type ToggleBonStylistResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonStylistData
}

type ToggleBonClientInput = {
  bonId: string
  seasonId: string
  openBon: boolean
  closeBon: boolean
  remise?: number
}

type ToggleBonClientResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonClientData
}

type DeleteBonFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonFaconnierData
}

type DeleteBonStylistResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonStylistData
}

type DeleteBonClientResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonClientData
}

type GeneralSettings = {
  status: 'success' | 'failed'
  message: string
  settings?: {
    faconnierActive: number
    faconnierInactive: number
    clientsActive: number
    clientsInactive: number
    stylistsActive: number
    stylistsInactive: number
    users: number
    seasons: number
  }
}

type GetSummaryResponse = {
  status: 'success' | 'failed'
  message: string
  summary: {
    faconnier: {
      openBons: number
      closedBons: number
      totalAmount: number
      totalAmountAfterRemise: number
      totalAdvances: number
      totalRemise: number
      remainingAmount: number
    }
    client: {
      openBons: number
      closedBons: number
      totalAmount: number
      totalAmountAfterRemise: number
      totalAdvances: number
      totalRemise: number
      remainingAmount: number
    }
    stylist: {
      openBons: number
      closedBons: number
      totalAmount: number
      totalAmountAfterRemise: number
      totalAdvances: number
      totalRemise: number
      remainingAmount: number
    }
    totalSales: number
  }
}

type GetRetardOrdersFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  totalCount: number
  faconniers: {
    id: string
    reference: string
    productName: string
    faconnierName: string
    bonNumber: number
    quantityExpected: number
    quantityReturned: number
    delayDays: number
    productImage: string | null
  }[]
}

// Worker models
type WorkPlace = {
  id: string
  name: string
  address: string | null
  createdAt: string
}

type CreateWorkPlaceInput = {
  id: string
  name: string
  address: string | null
}

type CreateWorkPlaceResponse = {
  status: 'success' | 'failed'
  message: string
  workplace?: {
    id: string
    name: string
    address: string | null
    createdAt: string
    updatedAt: string
  }
}

type WorkerData = {
  id: string
  name: string
  phone: string | null
  workplaceId: string
  salaireHebdomadaire: number
  isActive: boolean
  createdAt: string
}

type GetWorkersResponse = {
  id: string
  name: string
  phone: string | null
  salaireHebdomadaire: number
  createdAt: string
  isActive: boolean
  workplace: {
    id: string
    name: string
  }
}

type CreateWorkerInput = Omit<WorkerData, 'id' | 'isActive' | 'createdAt'>

type UpdateWorkerInput = Omit<WorkerData, 'isActive' | 'createdAt'>

type CreateWorkerResponse = {
  status: 'success' | 'failed'
  message: string
  worker?: WorkerData
}

type Week = {
  id: string
  weekStart: string
  weekEnd: string
  weekNumber: number
  displayText: string
}

type CreateWeekResponse = {
  status: 'success' | 'failed'
  message: string
  week?: {
    weekStart: Date
    id: string
    createdAt: Date
    updatedAt: Date
    weekEnd: Date
  }
}

type DeleteWeekResponse = {
  status: 'success' | 'failed'
  message: string
  week?: {
    weekStart: Date
    id: string
    createdAt: Date
    updatedAt: Date
    weekEnd: Date
  }
  nextWeekId?: string | null
}

type WorkerRecord = {
  id: string
  workerId: string
  weekId: string
  lundi: number
  lundiSupp: number
  mardi: number
  mardiSupp: number
  mercredi: number
  mercrediSupp: number
  jeudi: number
  jeudiSupp: number
  vendredi: number
  vendrediSupp: number
  samedi: number
  samediSupp: number
  description: string | null
  salaireHebdomadaire: number
  avance: number
  isPaid: boolean
  worker: {
    id: string
    name: string
  }
}

type GetWeeksRecordsInput = {
  weekId: string
  workplaceId: string
}

type GetWeekRecordsResponse = {
  status: 'success' | 'failed'
  message: string
  records: WorkerRecord[]
  nextWeekId: string | null
  prevWeekId: string | null
}

type UpdateWeekRecordInput = {
  id: string
  lundi: number
  mardi: number
  mercredi: number
  jeudi: number
  vendredi: number
  samedi: number
  avance: number
}

type UpdateWeekRecordPaymentInput = {
  type: 'pay' | 'undo'
  recordId: string
}

type UpdateWeekRecordResponse = {
  status: 'success' | 'failed'
  message: string
  record?: WorkerRecord
}

type GetYearSummaryInput = {
  year: string
  workplaceId: string
}

type GetYearSummaryResponse = {
  status: 'success' | 'failed'
  message: string
  records?: {
    name: string
    weeks: any[]
    totalAmount: number
  }[]
  yearTotal?: number
  nextYear?: number | null
  prevYear?: number | null
  year?: number
}

type GetSummaryWorkersResponse = {
  status: 'success' | 'failed'
  message: string
  summary: {
    inactiveWorkers: number
    totalOvertimeHours: number
    totalRegularHours: number
    totalSpent: number
    totalWeeks: number
    totalWorkers: number
  }
}

type GetSummaryWorkerResponse = {
  status: 'success' | 'failed'
  message: string
  summary: {
    totalOvertimeHours: number
    totalRegularHours: number
    totalSpent: number
    totalWeeks: number
    totalAdvances: number
    workerName: string
  }
}

type SecondWorkerRecord = {
  id: string
  workerId: string
  weekId: string
  workplaceId: string
  worker: {
    name: string
  }
  lundi: number
  lundiSupp: number
  mardi: number
  mardiSupp: number
  mercredi: number
  mercrediSupp: number
  jeudi: number
  jeudiSupp: number
  vendredi: number
  vendrediSupp: number
  samedi: number
  samediSupp: number
  salaireHebdomadaire: number
  avance: number
  description: string | null
  week: Week
  workplace: Workplace
  weekNumber: number
  displayText: string
  isPaid: boolean
}

type Workplace = {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt: string
}

type PaginationMeta = {
  currentPage: number
  totalPages: number
  totalRecords: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

type GetWorkerRecordsResponse = {
  status: 'success' | 'error'
  message: string
  records: SecondWorkerRecord[]
  pagination: PaginationMeta
}

type OrderStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
type CancelOrderFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  order?: {
    id: string
    productId: string
    quantity_sent: number
    quantity_returned: number
    unit_price: number
    faconnierOrderId: string
    order_status: OrderStatus
  }
}
