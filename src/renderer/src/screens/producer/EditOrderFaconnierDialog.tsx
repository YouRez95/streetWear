import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useUpdateOrderQuantityReturned } from '@renderer/hooks/useFaconnier'
import { cn } from '@renderer/lib/utils'
import { useState } from 'react'

type OpenEditDialog = {
  open: boolean
  orderId: string
  quantity_returned: number
  quantity_sent: number
}

type EditOrderFaconnierDialogProps = {
  openEditDialog: OpenEditDialog
  onClose: (open: OpenEditDialog) => void
  faconnierId: string
  bonId: string
}

export function EditOrderFaconnierDialog({
  openEditDialog,
  onClose,
  faconnierId,
  bonId
}: EditOrderFaconnierDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const { open, orderId, quantity_returned, quantity_sent } = openEditDialog
  const [newQuantityReturned, setNewQuantityReturned] = useState<number | null>(null)
  const { mutate: updateOrderQuantityReturned } = useUpdateOrderQuantityReturned()

  const handleEditQuantityReturned = () => {
    if (newQuantityReturned === null || newQuantityReturned === 0) {
      setError('Veuillez entrer une quantité')
      return
    }
    if (newQuantityReturned > quantity_sent) {
      setError('La quantité retournée ne peut être supérieure à la quantité envoyée')
      return
    }
    setError(null)

    // Call updateOrderFaconnier mutation
    const data = {
      orderId,
      quantity_returned: newQuantityReturned
    }
    console.log('data from edit order faconnier dialog', data)
    updateOrderQuantityReturned(
      {
        orderId,
        quantityReturned: newQuantityReturned,
        faconnierId,
        bonId
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          onClose({ open: false, orderId: '', quantity_returned: 0, quantity_sent: 0 })
          setNewQuantityReturned(null)
          setError(null)
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setNewQuantityReturned(null)
        setError(null)
        onClose({ open: false, orderId: '', quantity_returned: 0, quantity_sent: 0 })
      }}
    >
      <DialogContent className="max-w-2xl bg-foreground rounded-xl p-5 shadow-sm border">
        <DialogHeader>
          <DialogTitle>Modifier la quantité retournée</DialogTitle>
          <DialogDescription className="text-sm text-background/80">
            Cette quantité sera ajoutée à la quantité retournée précédente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <Label className="text-background text-base whitespace-nowrap">
              Quantité retournée
            </Label>
            <Input
              type="number"
              onChange={(e) => setNewQuantityReturned(Number(e.target.value))}
              value={newQuantityReturned || ''}
            />
          </div>

          <div className="flex gap-2 flex-col">
            <Label className="text-background text-base whitespace-nowrap">
              Total quantité retournée
            </Label>
            <Input type="number" readOnly value={quantity_returned + (newQuantityReturned || 0)} />
          </div>
        </div>

        <DialogFooter
          className={cn(
            'flex items-center',
            error ? 'justify-between sm:justify-between' : 'justify-end sm:justify-end'
          )}
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleEditQuantityReturned}>Modifier la quantité retournée</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
