import { LoadingSuspense } from '@renderer/components/loading'
import { Input } from '@renderer/components/ui/input'
import { Search } from 'lucide-react'
import { Suspense, useState } from 'react'
import { CreateUserDialog } from './CreateUserDialog'
import TableUsers from './TableUsers'

export default function TabUsers() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Permissions des utilisateurs</h1>
          <p className="">Gérer qui a accès à votre système</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un utilisateur"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating User */}
          <CreateUserDialog />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableUsers searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </>
  )
}
