import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TrendingUpDown } from 'lucide-react'
import { useState } from 'react'

type TransferProductDropDownProps = {
  product: Product
  setSelectedProduct: (product: any) => void
  setSelectedTransferTo: (transferTo: 'faconnier' | 'client' | null) => void
  setOpenTransferDialogFaconnier: (open: boolean) => void
  setOpenTransferDialogClient: (open: boolean) => void
}

export default function TransferProductDropDown({
  setSelectedProduct,
  setSelectedTransferTo,
  setOpenTransferDialogFaconnier,
  setOpenTransferDialogClient,
  product
}: TransferProductDropDownProps) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TrendingUpDown className="w-7 h-7 cursor-pointer text-secondary/70 border border-secondary/50 rounded-md p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-base font-semibold flex items-center justify-center">
          Transférer un produit
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-base flex items-center justify-center cursor-pointer"
          onClick={() => {
            setSelectedProduct(product)
            setSelectedTransferTo('faconnier')
            setOpenTransferDialogFaconnier(true)
            setOpen(false)
          }}
        >
          Faconnier
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base flex items-center justify-center cursor-pointer"
          onClick={() => {
            setSelectedProduct(product)
            setSelectedTransferTo('client')
            setOpenTransferDialogClient(true)
            setOpen(false)
          }}
        >
          Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
