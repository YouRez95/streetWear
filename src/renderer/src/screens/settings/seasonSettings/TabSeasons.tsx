import { LoadingSuspense } from '@renderer/components/loading'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Search } from 'lucide-react'
import { Suspense, useState } from 'react'
import CreateSeassonDialog from './CreateSeassonDialog'
import TableSeason from './TableSeason'

export default function TabSeasons() {
  // WIP: Import and export data
  const [searchTerm, setSearchTerm] = useState('')
  const [createSeassonDialogOpen, setCreateSeassonDialogOpen] = useState(false)

  return (
    <>
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Saisons</h1>
          <p className="">Gérer vos saisons</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Search Season"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg"
            onClick={() => setCreateSeassonDialogOpen(true)}
          >
            <span>+</span>
            Créer une saison
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableSeason searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>

      {createSeassonDialogOpen && (
        <CreateSeassonDialog open={createSeassonDialogOpen} setOpen={setCreateSeassonDialogOpen} />
      )}
    </>
  )
}
