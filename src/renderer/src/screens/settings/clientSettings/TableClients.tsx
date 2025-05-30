import { LoadingSuspense } from '@renderer/components/loading'
import { PaginationComponent } from '@renderer/components/pagination'
import { useClients } from '@renderer/hooks/useClients'
import { useDebounce } from '@uidotdev/usehooks'
import { Suspense, useEffect, useState } from 'react'
import { DeleteClientDialog } from './DeleteClientDialog'
import LazyTableClients from './LazyTableClients'
import { UpdateClientDialog } from './UpdateClientDialog'

type TableClientsProps = {
  searchTerm: string
}

export const TableClients = ({ searchTerm }: TableClientsProps) => {
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null)
  const [dialogType, setDialogType] = useState<'update' | 'delete' | null>(null)
  const [open, setOpen] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const {
    data: clientsResponse,
    isLoading,
    isError,
    error
  } = useClients(page, limit, debouncedSearchTerm)

  useEffect(() => {
    if (clientsResponse?.totalPages) {
      setTotalPages(clientsResponse.totalPages)
    }
  }, [clientsResponse])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  const openDialog = (client: ClientData, type: 'update' | 'delete') => {
    setSelectedClient(client)
    setDialogType(type)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setSelectedClient(null)
    setDialogType(null)
  }

  return (
    <>
      {isLoading && <p className="text-background/50">Chargement...</p>}

      {error && <p className="text-background/50">Erreur lors de la récupération des clients</p>}
      {!isLoading && !error && clientsResponse && clientsResponse.clients.length === 0 && (
        <p className="text-background/50">Aucun client trouvé</p>
      )}

      {!isLoading && !error && clientsResponse && clientsResponse.clients.length > 0 && (
        <Suspense fallback={<LoadingSuspense />}>
          <LazyTableClients clients={clientsResponse.clients} openDialog={openDialog} />
        </Suspense>
      )}
      {open && selectedClient && dialogType === 'update' && (
        <UpdateClientDialog open={open} closeDialog={closeDialog} client={selectedClient} />
      )}
      {open && selectedClient && dialogType === 'delete' && (
        <DeleteClientDialog
          open={open}
          closeDialog={closeDialog}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
        />
      )}
      <div className="absolute bottom-10">
        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  )
}
