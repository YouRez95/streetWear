import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import ImagePreview from '@renderer/components/imagePreview/ImagePreview'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@renderer/components/ui/hover-card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { useOrdersClient } from '@renderer/hooks/useClients'
import { downloadBon, downloadDailyBon } from '@renderer/services/bonsService'
import { useUserStore } from '@renderer/store'
import { formatDateToDDMMYYYY } from '@renderer/utils'
import { useDebounce } from '@uidotdev/usehooks'
import { ArrowUpDown, ChevronDown, ChevronRight, Download, Info, Pencil, Trash } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { DeleteAvanceClientDialog } from './DeleteAvanceClientDialog'
import { DeleteOrderClientDialog } from './DeleteOrderClientDialog'
import { EditOrderClientDialog } from './EditOrderClientDialog'

const paymentMethodMap: Record<string, string> = {
  cash: 'Espèces',
  cheque: 'Chèque',
  bank: 'Virement bancaire'
}

type ClientsTableProps = {
  search: string
  page: number
  setTotalPages: (totalPages: number) => void
  limit: number
  date: 'asc' | 'desc'
  setDate: (date: 'asc' | 'desc') => void
  selectedClient?: GetActiveClientsResponse['clients'][0]
  selectedBon?: GetActiveClientsResponse['clients'][0]['BonsClients'][0]
}

// Memoized row components
const ProductOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedClient,
    selectedClientId,
    onEdit,
    onDelete,
    onDownload
  }: {
    order: any
    selectedBon?: any
    selectedClient?: any
    selectedClientId: string
    onEdit: (order: any) => void
    onDelete: (order: any) => void
    onDownload: (order: any) => void
  }) => {
    const notCompleted = (order.quantity - order.returned) * order.unit_price - (order.avance || 0)

    return (
      <TableRow
        className={`h-[55px] ${selectedClientId === 'passager' && notCompleted > 0 ? 'bg-red-200 hover:bg-red-200' : ''}`}
      >
        <TableCell className="font-medium">{order.reference}</TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            {/* <LazyLoadImage
              src={getImageUrl(order.productImage, 'product')}
              alt={order.id}
              effect="opacity"
              className="w-14 h-14 rounded-lg bg-gray-100 border"
              onError={(e) => {
                const target = e.currentTarget
                target.src = defaultProductImage
              }}
            /> */}
            <ImagePreview
              src={order.productImage}
              fallback={defaultProductImage}
              alt={order.id}
              className="w-14 h-14 rounded-lg bg-gray-100 border"
            />
            <span className="text-lg">{order.productName}</span>
          </div>
        </TableCell>
        {selectedClientId === 'passager' && (
          <TableCell className="font-medium">{order.passagerName || 'N/A'}</TableCell>
        )}
        <TableCell>{order.quantity}</TableCell>
        <TableCell>{order.returned}</TableCell>
        <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
        <TableCell>
          {((order.quantity - order.returned) * (order.unit_price || 0)).toFixed(2)} dh
        </TableCell>
        {selectedClientId === 'passager' && (
          <TableCell className="font-medium">
            <div className="flex items-center justify-center gap-1">
              <span>{order.avance || '0'} dh </span>
              {notCompleted > 0 && (
                <Badge variant={'destructive'} className="tex-sm text-white p-0.5">
                  ({-notCompleted})
                </Badge>
              )}
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className="flex items-center gap-3 justify-end">
            {selectedBon?.bon_number && selectedClient?.name && (
              <Download
                className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(order)
                }}
              />
            )}
            {order.description && (
              <HoverCard>
                <HoverCardTrigger className="p-1.5 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                  <Info className="w-4 h-4" />
                </HoverCardTrigger>
                <HoverCardContent className="text-left mr-4 text-sm font-normal">
                  {order.description}
                </HoverCardContent>
              </HoverCard>
            )}
            <Pencil
              className="w-7 h-7 cursor-pointer text-success border border-success/90 rounded-md p-1"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(order)
              }}
            />
            <Trash
              className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(order)
              }}
            />
          </div>
        </TableCell>
      </TableRow>
    )
  }
)

const AvanceOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedClient,
    selectedClientId,
    onDeleteAvance,
    onDownload
  }: {
    order: any
    selectedBon?: any
    selectedClient?: any
    selectedClientId: string
    onDeleteAvance: (order: any) => void
    onDownload: (order: any) => void
  }) => (
    <TableRow className="h-[55px] bg-yellow-50 hover:bg-yellow-100">
      <TableCell className="font-bold" colSpan={2}>
        💰 Avance
      </TableCell>
      {selectedClientId === 'passager' && (
        <TableCell className="font-bold">{order.passagerName || 'N/A'}</TableCell>
      )}
      <TableCell colSpan={2} className="font-medium">
        {paymentMethodMap[order.method] || 'N/A'}
      </TableCell>
      <TableCell colSpan={2} className="font-bold">
        {order.amount?.toFixed(2)} dh
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3 justify-end">
          {selectedBon?.bon_number && selectedClient?.name && (
            <Download
              className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1"
              onClick={(e) => {
                e.stopPropagation()
                onDownload(order)
              }}
            />
          )}
          {order.description && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1" />
              </HoverCardTrigger>
              <HoverCardContent className="text-left text-sm">{order.description}</HoverCardContent>
            </HoverCard>
          )}
          <Trash
            className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteAvance(order)
            }}
          />
        </div>
      </TableCell>
    </TableRow>
  )
)

const DateGroupRow = memo(
  ({
    dateGroup,
    selectedClientId,
    selectedBon,
    selectedClient,
    isExpanded,
    onToggleDate,
    onDownloadDaily,
    onEditOrder,
    onDeleteOrder,
    onDeleteAvance,
    onDownloadOrder
  }: {
    dateGroup: any
    selectedClientId: string
    selectedBon?: any
    selectedClient?: any
    isExpanded: boolean
    onToggleDate: (date: string) => void
    onDownloadDaily: (dateGroup: any) => void
    onEditOrder: (order: any) => void
    onDeleteOrder: (order: any) => void
    onDeleteAvance: (order: any) => void
    onDownloadOrder: (order: any) => void
  }) => {
    let totalAvances = 0
    let totalAmountExcludingAvances = 0

    if (selectedClientId === 'passager') {
      totalAvances = dateGroup.items
        .map((item: any) => (item.type === 'PRODUCT' ? item.avance || 0 : 0))
        .reduce((a: number, b: number) => a + b, 0)
      totalAmountExcludingAvances = Math.abs(dateGroup.totalAmount)
    } else {
      totalAvances = dateGroup.items
        .map((item: any) => (item.type === 'AVANCE' ? item.amount || 0 : 0))
        .reduce((a: number, b: number) => a + b, 0)
      totalAmountExcludingAvances = Math.abs(dateGroup.totalAmount - totalAvances)
    }

    return (
      <>
        {/* Date Header Row - Clickable */}
        <TableRow
          className={`h-[55px] hover:shadow-sm transition-all cursor-pointer `}
          onClick={() => onToggleDate(dateGroup.date)}
        >
          <TableCell className="font-medium">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </TableCell>
          <TableCell className="font-medium">{formatDateToDDMMYYYY(dateGroup.date)}</TableCell>
          <TableCell className="text-background/80">{dateGroup.totalQuantitySent}</TableCell>
          <TableCell className="text-background/80">{dateGroup.totalQuantityReturned}</TableCell>
          <TableCell className="text-background/80 font-semibold">
            {totalAmountExcludingAvances} dh
          </TableCell>
          <TableCell className="text-background/80 font-semibold">{totalAvances} dh</TableCell>
          <TableCell className="text-background/80 flex justify-end">
            <Download
              className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1"
              onClick={(e) => {
                e.stopPropagation()
                onDownloadDaily(dateGroup)
              }}
            />
          </TableCell>
        </TableRow>

        {/* Expanded Items - Nested Table */}
        {isExpanded && (
          <TableRow>
            <TableCell colSpan={selectedClientId === 'passager' ? 9 : 7} className="p-0">
              <div>
                <Table className="text-base w-full bg-muted-foreground">
                  <TableHeader className="text-background bg-tableHead border">
                    <TableRow className="text-base">
                      <TableHead className="text-background w-[150px]">Référence</TableHead>
                      <TableHead className="text-background w-[300px]">Modèle</TableHead>
                      {selectedClientId === 'passager' && (
                        <TableHead className="text-background w-[300px]">Client</TableHead>
                      )}
                      <TableHead className="text-background w-[150px]">Q. envoyée</TableHead>
                      <TableHead className="text-background w-[150px]">Q. retournée</TableHead>
                      <TableHead className="text-background w-[150px]">Prix unitaire</TableHead>
                      <TableHead className="text-background w-[150px]">Total</TableHead>
                      {selectedClientId === 'passager' && (
                        <TableHead className="text-background w-[150px]">Avance</TableHead>
                      )}
                      <TableHead className="text-background w-[200px] text-end">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateGroup.items.length === 0 && (
                      <TableRow className="h-[55px]">
                        <TableCell colSpan={7} className="text-center">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                    {dateGroup.items.map((order: any) =>
                      order.type === 'PRODUCT' ? (
                        <ProductOrderRow
                          key={order.id}
                          order={order}
                          selectedBon={selectedBon}
                          selectedClient={selectedClient}
                          selectedClientId={selectedClientId}
                          onEdit={onEditOrder}
                          onDelete={onDeleteOrder}
                          onDownload={onDownloadOrder}
                        />
                      ) : (
                        <AvanceOrderRow
                          key={order.id}
                          order={order}
                          selectedBon={selectedBon}
                          selectedClient={selectedClient}
                          selectedClientId={selectedClientId}
                          onDeleteAvance={onDeleteAvance}
                          onDownload={onDownloadOrder}
                        />
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </TableCell>
          </TableRow>
        )}
      </>
    )
  }
)

// Memoized state components
const LoadingRow = memo(() => (
  <TableRow>
    <TableCell colSpan={7} className="text-center">
      Chargement...
    </TableCell>
  </TableRow>
))

const EmptyRow = memo(() => (
  <TableRow>
    <TableCell colSpan={7} className="text-center">
      Sélectionner un client et un bon pour voir votre tableau
    </TableCell>
  </TableRow>
))

const FailedRow = memo(({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={7} className="text-center">
      {message}
    </TableCell>
  </TableRow>
))

const NoDataRow = memo(() => (
  <TableRow>
    <TableCell colSpan={7} className="text-center">
      Aucun produit trouvé.
    </TableCell>
  </TableRow>
))

function ClientsTableComponent({
  search,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
  selectedClient,
  selectedBon
}: ClientsTableProps) {
  const { selectedClientId, selectedClientBonId } = useUserStore()
  const [expandedDates, setExpandedDates] = useState<string | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: '',
    quantity_returned: 0,
    quantity_sent: 0,
    price_by_unit: 0,
    date: '',
    passagerName: '',
    avance: 0,
    description: ''
  })
  const [openDeleteOrderDialog, setOpenDeleteOrderDialog] = useState({
    open: false,
    orderId: '',
    reference: ''
  })
  const [openDeleteAvanceDialog, setOpenDeleteAvanceDialog] = useState({
    open: false,
    avanceId: '',
    amount: 0
  })

  const debouncedSearchTerm = useDebounce(search, 300)
  const { data, isLoading } = useOrdersClient(selectedClientId, selectedClientBonId, {
    page: page,
    limit: limit,
    search: debouncedSearchTerm,
    date: date
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages)
    }
  }, [data, setTotalPages])

  // Memoized event handlers
  const handleToggleDate = useCallback((dateKey: string) => {
    setExpandedDates((prev) => (prev === dateKey ? null : dateKey))
  }, [])

  const handleEditOrder = useCallback((order: any) => {
    setOpenEditDialog({
      open: true,
      orderId: order.id,
      quantity_returned: order.returned,
      quantity_sent: order.quantity,
      price_by_unit: order.unit_price,
      date: order.createdAt,
      passagerName: order.passagerName || '',
      avance: order.avance || 0,
      description: order.description || ''
    })
  }, [])

  const handleDeleteOrder = useCallback((order: any) => {
    setOpenDeleteOrderDialog({
      open: true,
      orderId: order.id,
      reference: order.reference
    })
  }, [])

  const handleDeleteAvance = useCallback((order: any) => {
    setOpenDeleteAvanceDialog({
      open: true,
      avanceId: order.id,
      amount: order.amount
    })
  }, [])

  const handleDownloadOrder = useCallback(
    (order: any) => {
      if (selectedBon?.bon_number && selectedClient?.name) {
        downloadBon({
          client: selectedClient.name,
          bon_number: selectedBon.bon_number,
          ...order,
          quantity: order.quantity
        })
      }
    },
    [selectedBon, selectedClient]
  )

  const handleDownloadDaily = useCallback((dateGroup: any) => {
    downloadDailyBon(dateGroup)
  }, [])

  const handleDateSort = useCallback(() => {
    setDate(date === 'asc' ? 'desc' : 'asc')
  }, [date, setDate])

  // Render table content based on state
  const renderTableContent = () => {
    if (isLoading) {
      return <LoadingRow />
    }

    if (selectedClientId === '' || selectedClientBonId === '') {
      return <EmptyRow />
    }

    if (data?.status === 'failed') {
      return <FailedRow message={data.message} />
    }

    if (data && data.orders.length > 0) {
      return data.orders.map((dateGroup: any) => (
        <DateGroupRow
          key={dateGroup.date}
          dateGroup={dateGroup}
          selectedClientId={selectedClientId}
          selectedBon={selectedBon}
          selectedClient={selectedClient}
          isExpanded={expandedDates === dateGroup.date}
          onToggleDate={handleToggleDate}
          onDownloadDaily={handleDownloadDaily}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onDeleteAvance={handleDeleteAvance}
          onDownloadOrder={handleDownloadOrder}
        />
      ))
    }

    return <NoDataRow />
  }

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos commandes récentes.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-background w-[200px] font-semibold">
              Date
              <Button variant="ghost" size="icon" onClick={handleDateSort}>
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead className="text-background w-[170px] font-semibold">Q. envoyée</TableHead>
            <TableHead className="text-background w-[190px] font-semibold">Q. retournée</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Total des commandes
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Total des avances
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold text-end">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">{renderTableContent()}</TableBody>
      </Table>

      <EditOrderClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  )
}

// Export the memoized component
export default memo(ClientsTableComponent)
