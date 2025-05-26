import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@renderer/components/ui/button'

type TransferProductClientDialogProps = {
  product: Product
  transferTo: 'client' | null
  open: boolean
  setOpen: (open: boolean) => void
}

export default function TransferProductClientDialog({
  product,
  transferTo,
  open,
  setOpen
}: TransferProductClientDialogProps) {
  console.log(product, transferTo, open, setOpen)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground text-background">
        <DialogHeader>
          <DialogTitle>Êtes-vous sûr?</DialogTitle>
          <DialogDescription>Transférer ce produit au client.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Transférer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
