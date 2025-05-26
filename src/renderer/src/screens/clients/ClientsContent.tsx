import ClientsContentHeader from './ClientsContentHeader'
import ClientsTable from './ClientsTable'

type ClientsContentProps = {
  openBon: boolean
  setOpenBon: (open: boolean) => void
  closedBon: boolean
  setClosedBon: (closed: boolean) => void
}

export default function ClientsContent({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon
}: ClientsContentProps) {
  return (
    <div>
      <div className="flex justify-between items-center min-h-[50px]">
        <ClientsContentHeader
          openBon={openBon}
          setOpenBon={setOpenBon}
          closedBon={closedBon}
          setClosedBon={setClosedBon}
        />
      </div>
      <ClientsTable />
    </div>
  )
}
