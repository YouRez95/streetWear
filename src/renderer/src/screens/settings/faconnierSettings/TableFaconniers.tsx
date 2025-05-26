import { PaginationComponent } from '@renderer/components/pagination'
import { useFaconniers } from '@renderer/hooks/useFaconnier'
import { useDebounce } from '@uidotdev/usehooks'
import { Suspense, useEffect, useState } from 'react'
import { DeleteFaconnierDialog } from './DeleteFaconnierDialog'
import LazyTableFaconniers from './LazyTableFaconniers'
import { UpdateFaconnierDialog } from './UpdateFaconnierDialog'

type TableFaconniersProps = {
  searchTerm: string
}

export const TableFaconniers = ({ searchTerm }: TableFaconniersProps) => {
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedFaconnier, setSelectedFaconnier] = useState<FaconnierData | null>(null)
  const [dialogType, setDialogType] = useState<'update' | 'delete' | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [open, setOpen] = useState(false)

  const {
    data: faconniersResponse,
    isLoading,
    isError,
    error
  } = useFaconniers(page, limit, debouncedSearchTerm)
  useEffect(() => {
    if (faconniersResponse?.totalPages) {
      setTotalPages(faconniersResponse.totalPages)
    }
  }, [faconniersResponse])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  const openDialog = (faconnier: FaconnierData, type: 'update' | 'delete') => {
    setSelectedFaconnier(faconnier)
    setDialogType(type)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setSelectedFaconnier(null)
    setDialogType(null)
  }

  if (isLoading) return <p className="text-background/50">Loading...</p>

  if (isError || faconniersResponse?.status === 'failed')
    return <p className="text-background/50">Erreur lors de la récupération des faconniers</p>

  return (
    <>
      {!isLoading && !error && faconniersResponse && faconniersResponse.faconniers.length === 0 && (
        <p className="text-background/50">Aucun faconnier trouvé</p>
      )}

      {!isLoading && !error && faconniersResponse && faconniersResponse.faconniers.length > 0 && (
        <Suspense fallback={<p className="text-background/50">Loading...</p>}>
          <LazyTableFaconniers faconniers={faconniersResponse.faconniers} openDialog={openDialog} />
        </Suspense>
      )}
      {open && selectedFaconnier && dialogType === 'update' && (
        <UpdateFaconnierDialog
          open={open}
          closeDialog={closeDialog}
          faconnier={selectedFaconnier}
        />
      )}
      {open && selectedFaconnier && dialogType === 'delete' && (
        <DeleteFaconnierDialog
          open={open}
          closeDialog={closeDialog}
          faconnierId={selectedFaconnier.id}
          faconnierName={selectedFaconnier.name}
        />
      )}
      <div className="absolute bottom-10">
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  )
}
