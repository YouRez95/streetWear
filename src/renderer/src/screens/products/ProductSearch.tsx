import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'
import CreateProductDialog from './CreateProductDialog'

type ProductSearchProps = {
  setSearch: (search: string) => void
  search: string
}

export default function ProductSearch({ setSearch, search }: ProductSearchProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex justify-end items-center gap-2 mb-5">
      <div className="min-w-[300px] relative">
        <div className="absolute left-2 top-[50%] translate-y-[-50%]">
          <SearchIcon className="text-background/50" />
        </div>
        <Input
          className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
          placeholder="Rechercher un produit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        Créer un produit
      </Button>

      <CreateProductDialog open={open} setOpen={setOpen} />
    </div>
  )
}
