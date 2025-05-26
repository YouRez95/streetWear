import { PaginationComponent } from '@renderer/components/pagination'
import { useState } from 'react'
import { DeleteProductDialog } from './DeleteProductDialog'
import ProductSearch from './ProductSearch'
import ProductsHeader from './ProductsHeader'
import ProductsTable from './ProductsTable'
import TransferProductClientDialog from './TransferProductClientDialog'
import TransferProductFaconnierDialog from './TransferProductFaconnierDialog'
import UpdateProductDialog from './UpdateProductDialog'
import ViewProductSheet from './ViewProductSheet'

export default function Products() {
  // WIP: Those States can be simplified to one state selectedProduct
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(15)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedTransferTo, setSelectedTransferTo] = useState<'faconnier' | 'client' | null>(null)
  const [openTransferDialogFaconnier, setOpenTransferDialogFaconnier] = useState(false)
  const [openTransferDialogClient, setOpenTransferDialogClient] = useState(false)
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      <ProductsHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <ProductSearch setSearch={setSearch} search={search} />
            <ProductsTable
              setViewProduct={setViewProduct}
              setOpenSheet={setOpenSheet}
              search={search}
              page={page}
              setTotalPages={setTotalPages}
              limit={limit}
              setUpdateProduct={setUpdateProduct}
              setOpenDialog={setOpenDialog}
              setDeleteProduct={setDeleteProduct}
              setOpenDeleteDialog={setOpenDeleteDialog}
              setSelectedProduct={setSelectedProduct}
              setSelectedTransferTo={setSelectedTransferTo}
              setOpenTransferDialogFaconnier={setOpenTransferDialogFaconnier}
              setOpenTransferDialogClient={setOpenTransferDialogClient}
            />
            {viewProduct && (
              <ViewProductSheet
                product={viewProduct}
                openSheet={openSheet}
                setOpenSheet={setOpenSheet}
              />
            )}
            {updateProduct && (
              <UpdateProductDialog
                product={updateProduct}
                open={openDialog}
                setOpen={setOpenDialog}
              />
            )}

            {deleteProduct && (
              <DeleteProductDialog
                product={deleteProduct}
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
              />
            )}

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
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto">
          <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}
