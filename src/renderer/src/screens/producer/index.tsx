import { useState } from 'react'
import FaconnierContent from './FaconnierContent'
import FaconnierHeader from './FaconnierHeader'

export default function Producer() {
  const [openBon, setOpenBon] = useState(true)
  const [closedBon, setClosedBon] = useState(false)

  console.log('openBon', openBon)
  console.log('closedBon', closedBon)

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      {/* <ProductsHeader /> */}
      <FaconnierHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <FaconnierContent
              openBon={openBon}
              setOpenBon={setOpenBon}
              closedBon={closedBon}
              setClosedBon={setClosedBon}
            />
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto flex justify-center items-center">
          {/* <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} /> */}
          pagination depend on the size of the table
        </div>
      </div>
    </div>
  )
}
