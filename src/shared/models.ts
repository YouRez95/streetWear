type LoginFormType = {
  email: string
  password: string
}

type UserData = {
  id: string
  name: string
  email: string
  role: string
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

type CreateSeasonInput = Omit<SeasonData, 'id' | 'createdAt'>
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
}

type Product = {
  id: string
  name: string
  description?: string
  reference: string
  totalQty: number
  type: 'طبعة' | 'طرزة' | 'طبعة_طرزة'
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
}

type GetProductsParams = {
  page: number
  limit: number
  search: string
  seasonId: string
}

type GetProductsResponse = {
  status: 'success' | 'failed'
  message: string
  products: Product[]
  currentPage: number
  totalPages: number
}

type CreateProductInput = Omit<
  Product,
  'id' | 'createdAt' | 'ProductStatus' | 'productImage' | 'FaconnierOrderItems'
> & {
  productImage: ArrayBuffer | null
  fileName: string | null
}

type CreateProductResponse = {
  status: 'success' | 'failed'
  message: string
  product?: Product
}

type UpdateProductInput = Omit<
  Product,
  'createdAt' | 'ProductStatus' | 'productImage' | 'FaconnierOrderItems'
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

type CreateOrderFaconnierInput = {
  productId: string
  bon_number: number
  seasonId: string
  faconnierId: string
  priceByUnit: number
  transferQuantity: number
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

type GetAllProductsStatusResponse = {
  status: 'success' | 'failed'
  message: string
  totalProducts: number
  totalStatusResult: ProductStatus
}

type OrderProduct = {
  type: 'PRODUCT'
  id: string
  order_status: 'IN_PROGRESS' | 'COMPLETED'
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
}

type CreateAvanceFaconnierInput = {
  seasonId: string
  faconnierId: string
  bonId: string
  amount: number
  method: string
  description: string
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

type UpdateOrderQuantityReturnedResponse = {
  status: 'success' | 'failed'
  message: string
  order?: OrderFaconnierData
}

type DeleteAvanceFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  avance?: Omit<OrderAvance, 'type'>
}

type DeleteOrderFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  order?: Omit<OrderProduct, 'type'>
}

type ToggleBonFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonFaconnierData
}

type DeleteBonFaconnierResponse = {
  status: 'success' | 'failed'
  message: string
  bon?: BonFaconnierData
}

type GeneralSettings = {
  status: 'success' | 'failed'
  message: string
  settings?: {
    faconnierActive: number
    faconnierInactive: number
    clientsActive: number
    clientsInactive: number
    tailorsActive: number
    tailorsInactive: number
    users: number
    seasons: number
  }
}
