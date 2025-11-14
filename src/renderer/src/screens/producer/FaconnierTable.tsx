import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
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
import { useOrdersFaconnier } from '@renderer/hooks/useFaconnier'
import { downloadBon } from '@renderer/services/bonsService'
import { useUserStore } from '@renderer/store'
import { formatDateToDDMMYYYY, getImageUrl } from '@renderer/utils'
import { useDebounce } from '@uidotdev/usehooks'
import { ArrowUpDown, Download, Info, Pencil, Trash } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { DeleteAvanceDialog } from './DeleteAvanceDialog'
import { DeleteOrderFaconnierDialog } from './DeleteOrderFaconnierDialog'
import { EditOrderFaconnierDialog } from './EditOrderFaconnierDialog'

const paymentMethodMap: Record<string, string> = {
  cash: 'Espèces',
  cheque: 'Chèque',
  bank: 'Virement bancaire'
}

type FaconnierTableProps = {
  search: string
  page: number
  setTotalPages: (totalPages: number) => void
  limit: number
  date: 'asc' | 'desc'
  setDate: (date: 'asc' | 'desc') => void
  selectedFaconnier?: GetActiveFaconniersResponse['faconniers'][0]
  selectedBon?: GetActiveFaconniersResponse['faconniers'][0]['BonsFaconnier'][0]
}

// Status badge component
const StatusBadge = memo(({ status }: { status: string }) => {
  if (status === 'IN_PROGRESS') {
    return (
      <span className="text-foreground bg-destructive rounded-full px-2 py-1 font-bold">
        En cours
      </span>
    )
  }
  if (status === 'COMPLETED') {
    return (
      <span className="text-foreground bg-success rounded-full px-3 py-1.5 font-bold">Terminé</span>
    )
  }
  if (status === 'CANCELED') {
    return (
      <span className="text-foreground bg-secondary/65 rounded-full px-3 py-1.5 font-bold">
        Annulé
      </span>
    )
  }
  return null
})

// Memoized row components
const ProductOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedFaconnier,
    onEdit,
    onDelete,
    onDownload
  }: {
    order: any
    selectedBon?: any
    selectedFaconnier?: any
    onEdit: (order: any) => void
    onDelete: (order: any) => void
    onDownload: (order: any) => void
  }) => (
    <TableRow>
      <TableCell>{order.reference}</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(order.productImage, 'product')}
            alt={order.id}
            className="w-14 h-14 rounded-lg"
            onError={(e) => {
              const target = e.currentTarget
              target.src = defaultProductImage
            }}
          />
          <span className="text-lg">{order.productName}</span>
        </div>
      </TableCell>
      <TableCell>{formatDateToDDMMYYYY(order.createdAt)}</TableCell>
      <TableCell>{order.quantity_sent}</TableCell>
      <TableCell>{order.quantity_returned}</TableCell>
      <TableCell>{order.quantity_sent - order.quantity_returned}</TableCell>
      <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
      <TableCell>{((order.quantity_sent || 0) * (order.unit_price || 0)).toFixed(2)}</TableCell>
      <TableCell className="text-center">
        <StatusBadge status={order.order_status} />
      </TableCell>
      <TableCell className="text-right pr-5 space-x-3">
        {/* Download order */}
        {selectedBon?.bon_number && selectedFaconnier?.name && (
          <Button
            variant="ghost"
            className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
            onClick={() => onDownload(order)}
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
        {/* Edit order */}
        <Button
          onClick={() => onEdit(order)}
          variant="ghost"
          className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        {/* Delete order */}
        <Button
          onClick={() => onDelete(order)}
          variant="ghost"
          className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
)

const AvanceOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedFaconnier,
    onDeleteAvance,
    onDownload
  }: {
    order: any
    selectedBon?: any
    selectedFaconnier?: any
    onDeleteAvance: (order: any) => void
    onDownload: (order: any) => void
  }) => (
    <TableRow key={order.id} className="bg-yellow-100 hover:bg-yellow-200 h-[55px]">
      <TableCell colSpan={2} className="font-bold">
        Avance
      </TableCell>
      <TableCell className="font-bold" colSpan={5}>
        {formatDateToDDMMYYYY(order.createdAt)}
      </TableCell>
      <TableCell className="text-left font-bold">{order.amount?.toFixed(2)} dh</TableCell>
      <TableCell className="text-center font-bold w-[200px]">
        {paymentMethodMap[order.method] || 'N/A'}
      </TableCell>
      <TableCell className="text-right pr-5 font-bold flex justify-end gap-3 relative">
        {/* Download avance */}
        {selectedBon?.bon_number && selectedFaconnier?.name && (
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

// Memoized state components
const LoadingRow = memo(() => (
  <TableRow>
    <TableCell colSpan={10} className="text-center">
      Chargement...
    </TableCell>
  </TableRow>
))

const EmptyRow = memo(() => (
  <TableRow>
    <TableCell colSpan={10} className="text-center">
      Sélectionner un faconnier et un bon pour voir votre tableau
    </TableCell>
  </TableRow>
))

const FailedRow = memo(({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={10} className="text-center">
      {message}
    </TableCell>
  </TableRow>
))

const NoDataRow = memo(() => (
  <TableRow>
    <TableCell colSpan={10} className="text-center">
      Aucun produit trouvé.
    </TableCell>
  </TableRow>
))

function FaconnierTableComponent({
  search,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
  selectedFaconnier,
  selectedBon
}: FaconnierTableProps) {
  const { selectedFaconnierId, selectedBonId } = useUserStore()
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: '',
    quantity_returned: 0,
    quantity_sent: 0,
    price_by_unit: 0,
    date: ''
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
  const { data, isLoading } = useOrdersFaconnier(selectedFaconnierId, selectedBonId, {
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
      quantity_returned: order.quantity_returned,
      quantity_sent: order.quantity_sent,
      price_by_unit: order.unit_price,
      date: order.createdAt
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
      if (selectedBon?.bon_number && selectedFaconnier?.name) {
        downloadBon({
          faconnier: selectedFaconnier.name,
          bon_number: selectedBon.bon_number,
          ...order,
          quantity: order.quantity_sent,
          returned: order.quantity_returned,
          passagerName: null
        })
      }
    },
    [selectedBon, selectedFaconnier]
  )

  const handleDateSort = useCallback(() => {
    setDate(date === 'asc' ? 'desc' : 'asc')
  }, [date, setDate])

  // Render table content based on state
  const renderTableContent = () => {
    if (isLoading) {
      return <LoadingRow />
    }

    if (selectedFaconnierId === '' || selectedBonId === '') {
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
            selectedFaconnier={selectedFaconnier}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onDownload={handleDownload}
          />
        ) : (
          <AvanceOrderRow
            key={order.id}
            order={order}
            selectedBon={selectedBon}
            selectedFaconnier={selectedFaconnier}
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
            <TableHead className="text-background w-[170px] font-semibold">Q. envoyée</TableHead>
            <TableHead className="text-background w-[190px] font-semibold">Q. retournée</TableHead>
            <TableHead className="text-background w-[190px] font-semibold">Q. restante</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Prix unitaire</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Total</TableHead>
            <TableHead className="text-background w-[150px] font-semibold text-center">
              Statut
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">{renderTableContent()}</TableBody>
      </Table>

      <EditOrderFaconnierDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderFaconnierDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  )
}

// Export the memoized component
export default memo(FaconnierTableComponent)
