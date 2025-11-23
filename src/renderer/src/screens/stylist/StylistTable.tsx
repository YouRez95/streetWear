import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import ImagePreview from '@renderer/components/imagePreview/ImagePreview'
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
import { useOrdersStylist } from '@renderer/hooks/useStylist'
import { downloadBon } from '@renderer/services/bonsService'
import { useUserStore } from '@renderer/store'
import { formatDateToDDMMYYYY } from '@renderer/utils'
import { useDebounce } from '@uidotdev/usehooks'
import { ArrowUpDown, Download, Info, Pencil, Trash } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { DeleteAvanceStylistDialog } from './DeleteAvanceStylistDialog'
import { DeleteOrderStylistDialog } from './DeleteOrderStylistDialog'
import { EditOrderStylistDialog } from './EditOrderStylistDialog'

const paymentMethodMap: Record<string, string> = {
  cash: 'Espèces',
  cheque: 'Chèque',
  bank: 'Virement bancaire'
}

type StylistTableProps = {
  search: string
  page: number
  setTotalPages: (totalPages: number) => void
  limit: number
  date: 'asc' | 'desc'
  setDate: (date: 'asc' | 'desc') => void
  selectedStylist?: GetActiveStylistsResponse['stylists'][0]
  selectedBon?: GetActiveStylistsResponse['stylists'][0]['BonsStyleTrait'][0]
}

// Memoized row components to prevent unnecessary re-renders
const ProductOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedStylist,
    onEdit,
    onDelete,
    onDownload
  }: {
    order: OrderProduct
    selectedBon?: any
    selectedStylist?: any
    onEdit: (order: any) => void
    onDelete: (order: any) => void
    onDownload: (order: any) => void
  }) => (
    <TableRow>
      <TableCell>{order.reference}</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {/* <LazyLoadImage
            effect="opacity"
            src={getImageUrl(order.productImage, 'product')}
            alt={order.id}
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
      <TableCell>{formatDateToDDMMYYYY(order.createdAt)}</TableCell>
      <TableCell>{order.quantity_sent}</TableCell>
      <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
      <TableCell>{((order.quantity_sent || 0) * (order.unit_price || 0)).toFixed(2)}</TableCell>
      <TableCell className="pr-5">
        <div className=" flex justify-end items-center gap-2">
          {/* Download order */}
          {selectedBon?.bon_number && selectedStylist?.name && (
            <Button
              variant="ghost"
              size={'sm'}
              className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
              onClick={() => onDownload(order)}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {/* Description order */}
          {order.description && (
            <HoverCard>
              <HoverCardTrigger className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                <Info className="w-4 h-4" />
              </HoverCardTrigger>
              <HoverCardContent className="text-left mr-4 text-sm font-normal">
                {order.description}
              </HoverCardContent>
            </HoverCard>
          )}
          {/* Edit order */}
          <Button
            onClick={() => onEdit(order)}
            variant="ghost"
            size={'sm'}
            className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {/* Delete order */}
          <Button
            size={'sm'}
            onClick={() => onDelete(order)}
            variant="ghost"
            className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
)

const AvanceOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedStylist,
    onDeleteAvance,
    onDownload
  }: {
    order: OrderAvance
    selectedBon?: any
    selectedStylist?: any
    onDeleteAvance: (order: any) => void
    onDownload: (order: any) => void
  }) => (
    <TableRow key={order.id} className="bg-yellow-100 hover:bg-yellow-200 h-[55px]">
      <TableCell colSpan={2} className="font-bold">
        Avance
      </TableCell>
      <TableCell className="font-bold" colSpan={2}>
        {formatDateToDDMMYYYY(order.createdAt)}
      </TableCell>
      <TableCell className="font-bold text-left">
        {paymentMethodMap[order.method] || 'N/A'}
      </TableCell>
      <TableCell className="text-left font-bold">{order.amount?.toFixed(2)} dh</TableCell>
      <TableCell className="text-right pr-5 font-bold flex justify-end gap-3 relative">
        {/* Download avance */}
        {selectedBon?.bon_number && selectedStylist?.name && (
          <Button
            variant="ghost"
            className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
            onClick={() => onDownload(order)}
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
        {order.description && (
          <HoverCard>
            <HoverCardTrigger className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
              <Info className="w-4 h-4" />
            </HoverCardTrigger>
            <HoverCardContent className="text-left mr-4 text-sm font-normal">
              {order.description}
            </HoverCardContent>
          </HoverCard>
        )}
        <Button
          variant="ghost"
          className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
          onClick={() => onDeleteAvance(order)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
)

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
      Sélectionner un styliste et un bon pour voir votre tableau
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

function StylistTableComponent({
  search,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
  selectedStylist,
  selectedBon
}: StylistTableProps) {
  const { selectedStylistId, selectedStylistBonId } = useUserStore()
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: '',
    quantity_sent: 0,
    price_by_unit: 0,
    date: '',
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
  const { data, isLoading } = useOrdersStylist(selectedStylistId, selectedStylistBonId, {
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
  const handleEditOrder = useCallback((order: any) => {
    setOpenEditDialog({
      open: true,
      orderId: order.id,
      quantity_sent: order.quantity_sent,
      price_by_unit: order.unit_price,
      date: order.createdAt,
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

  const handleDownload = useCallback(
    (order: any) => {
      if (selectedBon?.bon_number && selectedStylist?.name) {
        downloadBon({
          stylist: selectedStylist.name,
          bon_number: selectedBon.bon_number,
          ...order,
          returned: order.quantity_returned,
          quantity: order.quantity_sent,
          passagerName: null
        })
      }
    },
    [selectedBon, selectedStylist]
  )

  const handleDateSort = useCallback(() => {
    setDate(date === 'asc' ? 'desc' : 'asc')
  }, [date, setDate])

  // Render conditions
  const renderTableContent = () => {
    if (isLoading) {
      return <LoadingRow />
    }

    if (selectedStylistId === '' || selectedStylistBonId === '') {
      return <EmptyRow />
    }

    if (data?.status === 'failed') {
      return <FailedRow message={data.message} />
    }

    if (data && data.orders.length > 0) {
      return data.orders.map((order) =>
        order.type === 'PRODUCT' ? (
          <ProductOrderRow
            key={order.id}
            order={order}
            selectedBon={selectedBon}
            selectedStylist={selectedStylist}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onDownload={handleDownload}
          />
        ) : (
          <AvanceOrderRow
            key={order.id}
            order={order}
            selectedBon={selectedBon}
            selectedStylist={selectedStylist}
            onDeleteAvance={handleDeleteAvance}
            onDownload={handleDownload}
          />
        )
      )
    }

    return <NoDataRow />
  }

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos produits récents.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="text-background w-[150px] font-semibold">Référence</TableHead>
            <TableHead className="text-background w-[200px] font-semibold">Modèle</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Date
              <Button variant="ghost" size="icon" onClick={handleDateSort}>
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead className="text-background w-[170px] font-semibold">
              Quantité envoyée
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Prix unitaire</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Total</TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">{renderTableContent()}</TableBody>
      </Table>

      <EditOrderStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  )
}

// Export the memoized component
export default memo(StylistTableComponent)
