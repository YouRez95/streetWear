import { PaginationComponent } from '@renderer/components/pagination'
import { useCallback, useState } from 'react'
import { DeleteProductDialog } from './DeleteProductDialog'
import ProductSearch from './ProductSearch'
import ProductsHeader from './ProductsHeader'
import ProductsTable from './ProductsTable'
import TransferProductClientDialog from './TransferProductClientDialog'
import TransferProductFaconnierDialog from './TransferProductFaconnierDialog'
import TransferProductStylistDialog from './TransferProductStylistDialog'
import UpdateProductDialog from './UpdateProductDialog'
import ViewProductSheet from './ViewProductSheet'

export default function Products() {
  const [openSheet, setOpenSheet] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(200)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedTransferTo, setSelectedTransferTo] = useState<
    'faconnier' | 'client' | 'stylist' | null
  >(null)
  const [openTransferDialogFaconnier, setOpenTransferDialogFaconnier] = useState(false)
  const [openTransferDialogClient, setOpenTransferDialogClient] = useState(false)
  const [openTransferDialogStylist, setOpenTransferDialogStylist] = useState(false)
  const [date, setDate] = useState<'asc' | 'desc'>('asc')

  const handleSetOpenSheet = useCallback((open: boolean) => setOpenSheet(open), [])
  const handleSetOpenEditDialog = useCallback((open: boolean) => setOpenEditDialog(open), [])
  const handleSetOpenDeleteDialog = useCallback((open: boolean) => setOpenDeleteDialog(open), [])
  const handleSetSelectedProduct = useCallback(
    (product: Product | null) => setSelectedProduct(product),
    []
  )
  const handleSetSelectedTransferTo = useCallback(
    (transferTo: 'faconnier' | 'client' | 'stylist' | null) => setSelectedTransferTo(transferTo),
    []
  )
  const handleSetOpenTransferDialogFaconnier = useCallback(
    (open: boolean) => setOpenTransferDialogFaconnier(open),
    []
  )
  const handleSetOpenTransferDialogClient = useCallback(
    (open: boolean) => setOpenTransferDialogClient(open),
    []
  )
  const handleSetOpenTransferDialogStylist = useCallback(
    (open: boolean) => setOpenTransferDialogStylist(open),
    []
  )
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      <ProductsHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <ProductSearch setSearch={setSearch} search={search} />
            <ProductsTable
              setOpenSheet={handleSetOpenSheet}
              search={search}
              date={date}
              setDate={setDate}
              page={page}
              setTotalPages={setTotalPages}
              limit={limit}
              setOpenEditDialog={handleSetOpenEditDialog}
              setOpenDeleteDialog={handleSetOpenDeleteDialog}
              setSelectedProduct={handleSetSelectedProduct}
              setSelectedTransferTo={handleSetSelectedTransferTo}
              setOpenTransferDialogFaconnier={handleSetOpenTransferDialogFaconnier}
              setOpenTransferDialogClient={handleSetOpenTransferDialogClient}
              setOpenTransferDialogStylist={handleSetOpenTransferDialogStylist}
            />
            {/* {selectedProduct && ( */}
            <ViewProductSheet
              product={selectedProduct}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
            />
            {/* )} */}

            <UpdateProductDialog
              product={selectedProduct}
              open={openEditDialog}
              setOpen={setOpenEditDialog}
            />

            <DeleteProductDialog
              product={selectedProduct}
              open={openDeleteDialog}
              setOpen={setOpenDeleteDialog}
            />

            {selectedProduct && selectedTransferTo === 'faconnier' && (
              <TransferProductFaconnierDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogFaconnier}
                setOpen={setOpenTransferDialogFaconnier}
              />
            )}

            {selectedProduct && selectedTransferTo === 'client' && (
              <TransferProductClientDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogClient}
                setOpen={setOpenTransferDialogClient}
              />
            )}

            {selectedProduct && selectedTransferTo === 'stylist' && (
              <TransferProductStylistDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogStylist}
                setOpen={setOpenTransferDialogStylist}
              />
            )}
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto">
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
    </div>
  )
}
