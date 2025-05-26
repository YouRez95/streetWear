import FaconnierContentHeader from './FaconnierContentHeader'
import FaconnierTable from './FaconnierTable'

type FaconnierContentProps = {
  openBon: boolean
  setOpenBon: (open: boolean) => void
  closedBon: boolean
  setClosedBon: (closed: boolean) => void
}

export default function FaconnierContent({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon
}: FaconnierContentProps) {
  return (
    <div>
      <div className="flex justify-between items-center min-h-[50px]">
        <FaconnierContentHeader
          openBon={openBon}
          setOpenBon={setOpenBon}
          closedBon={closedBon}
          setClosedBon={setClosedBon}
        />
      </div>
      <FaconnierTable />
    </div>
  )
}
