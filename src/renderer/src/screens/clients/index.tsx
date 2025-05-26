import { useState } from 'react'
import ClientsContent from './ClientsContent'
import ClientsHeader from './ClientsHeader'

export default function Clients() {
  const [openBon, setOpenBon] = useState(true)
  const [closedBon, setClosedBon] = useState(false)
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      <ClientsHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <ClientsContent
              openBon={openBon}
              setOpenBon={setOpenBon}
              closedBon={closedBon}
              setClosedBon={setClosedBon}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
