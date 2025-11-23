import { LoadingSuspense } from '@renderer/components/loading'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Switch } from '@renderer/components/ui/switch'
import SelectWorkplaceFilter from '@renderer/screens/workers/SelectWorkplaceFilter'
import { FunnelPlus, Search } from 'lucide-react'
import { Suspense, useState } from 'react'
import { CreateWorkerDialog } from './CreateWorkerDialog'
import TableWorker from './TableWorkers'
// import { CreateUserDialog } from './CreateUserDialog'
// import TableUsers from './TableUsers'

export default function TabWorkers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [active, setActive] = useState<string[]>(['Actif'])
  const [workplaceId, setWorkplaceId] = useState<string>('')

  const handleTypeChange = (type: string, checked: boolean) => {
    setActive((prev) => {
      if (checked) {
        if (!prev.includes(type)) {
          return [...prev, type]
        }
        return prev
      } else {
        if (prev.length === 2) {
          return prev.filter((t) => t !== type)
        } else {
          const otherType = type === 'Actif' ? 'Inactif' : 'Actif'
          return [otherType]
        }
      }
    })
  }

  const handleChangeWorkplaceFilter = (value: string) => {
    setWorkplaceId(value)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Employés</h1>
          <p className="">Gérer vos employés</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un employé"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <SelectWorkplaceFilter value={workplaceId} onValueChange={handleChangeWorkplaceFilter} />

          {/* Dialog for creating User */}
          <CreateWorkerDialog />

          <Popover>
            <PopoverTrigger>
              <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border border-background/50 rounded-md p-2 hover:bg-background/10 transition" />
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-4 mr-5">
              <div className="text-base font-semibold mb-2">Filter Stylist</div>
              <div className="border-b border-background/20 mb-3" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Switch
                    id="Actif"
                    checked={active.includes('Actif')}
                    onCheckedChange={(checked) => handleTypeChange('Actif', checked)}
                    disabled={false}
                  />
                  <Label htmlFor="Actif" className="text-sm font-medium">
                    Actif
                  </Label>
                </div>
                <div className="flex items-center justify-between">
                  <Switch
                    id="Inactif"
                    checked={active.includes('Inactif')}
                    onCheckedChange={(checked) => handleTypeChange('Inactif', checked)}
                    disabled={false}
                  />
                  <Label htmlFor="Inactif" className="text-sm font-medium">
                    Inactif
                  </Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableWorker searchTerm={searchTerm} active={active} workplaceId={workplaceId} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </div>
  )
}
