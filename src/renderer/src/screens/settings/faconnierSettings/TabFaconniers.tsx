import { LoadingSuspense } from '@renderer/components/loading'
import { Input } from '@renderer/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { Suspense, useState } from 'react'
import { CreateFaconnierDialog } from './CreateFaconnierDialog'
import { TableFaconniers } from './TableFaconniers'

export default function TabFaconniers() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Faconniers</h1>
          <p className="">Manage your faconniers</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <SearchIcon className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Search User"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating User */}
          <CreateFaconnierDialog />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableFaconniers searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </>
  )
}
