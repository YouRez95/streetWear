import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import DatePicker from '@renderer/components/datePicker'
import { Alert, AlertDescription } from '@renderer/components/ui/alert'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useUpdateOrderFaconnier } from '@renderer/hooks/useFaconnier'
import { cn } from '@renderer/lib/utils'
import { AlertCircle, Info } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

type OpenEditDialog = {
  open: boolean
  orderId: string
  quantity_returned: number
  quantity_sent: number
  price_by_unit: number
  date: string
}

type EditOrderFaconnierDialogProps = {
  openEditDialog: OpenEditDialog
  onClose: (open: OpenEditDialog) => void
  faconnierId: string
  bonId: string
}

type FormData = {
  quantity_sent: number
  newQuantityReturned: number
  price_by_unit: number
  date: string
}

const initialFormData: FormData = {
  quantity_sent: 0,
  newQuantityReturned: 0,
  price_by_unit: 0,
  date: new Date().toISOString()
}

const initialDialogState: OpenEditDialog = {
  open: false,
  orderId: '',
  quantity_returned: 0,
  quantity_sent: 0,
  price_by_unit: 0,
  date: ''
}

export function EditOrderFaconnierDialog({
  openEditDialog,
  onClose,
  faconnierId,
  bonId
}: EditOrderFaconnierDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const { mutate: updateOrderFaconnier, isPending } = useUpdateOrderFaconnier()

  const { open, orderId, quantity_returned, quantity_sent, price_by_unit, date } = openEditDialog

  // Memoize computed values
  const totalPrice = useMemo(
    () => formData.quantity_sent * formData.price_by_unit,
    [formData.quantity_sent, formData.price_by_unit]
  )

  const totalQuantityReturned = useMemo(
    () => quantity_returned + formData.newQuantityReturned,
    [quantity_returned, formData.newQuantityReturned]
  )

  const isQuantitySentDisabled = useMemo(() => quantity_returned > 0, [quantity_returned])

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        quantity_sent: quantity_sent,
        newQuantityReturned: 0,
        price_by_unit: price_by_unit,
        date: date
      })
      setError(null)
    }
  }, [open, quantity_sent, price_by_unit, date])

  // Handle form input changes
  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }, [])

  // Validate form data
  const validateForm = useCallback((): string | null => {
    if (formData.quantity_sent <= 0) {
      return 'La quantité envoyée doit être supérieure à 0'
    }

    if (formData.newQuantityReturned < 0) {
      return 'La quantité retournée ne peut pas être négative'
    }

    if (formData.newQuantityReturned + quantity_returned > formData.quantity_sent) {
      return 'La quantité retournée totale ne peut pas dépasser la quantité envoyée'
    }

    if (!formData.date) {
      return 'Veuillez sélectionner une date'
    }

    if (formData.price_by_unit <= 0) {
      return 'Le prix unitaire doit être supérieur à 0'
    }

    return null
  }, [formData, quantity_returned])

  // Handle form submission
  const handleEditOrder = useCallback(() => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    updateOrderFaconnier(
      {
        bonId,
        faconnierId,
        orderId,
        formData
      },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            onClose(initialDialogState)
            setFormData(initialFormData)
            setError(null)
          } else if (data.status === 'failed') {
            setError(data.message || 'Une erreur est survenue')
          }
        },
        onError: (error) => {
          setError('Une erreur est survenue lors de la mise à jour')
          console.error('Update error:', error)
        }
      }
    )
  }, [validateForm, formData, updateOrderFaconnier, bonId, faconnierId, orderId, onClose])

  // Handle dialog close
  const handleClose = useCallback(() => {
    setFormData(initialFormData)
    setError(null)
    onClose(initialDialogState)
  }, [onClose])

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isPending) {
        e.preventDefault()
        handleEditOrder()
      }
    },
    [handleEditOrder, isPending]
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl bg-foreground rounded-xl p-6 shadow-lg border"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">Modifier la commande</DialogTitle>
          <DialogDescription className="text-sm text-background/70">
            Modifiez les détails de votre commande ci-dessous
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-background/90 uppercase tracking-wide">
              Détails de la commande
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantity Sent */}
              <div className="space-y-2">
                <Label
                  htmlFor="quantity-sent"
                  className="text-background text-sm font-medium flex items-center gap-2 mb-3"
                >
                  Quantité envoyée
                  {isQuantitySentDisabled && (
                    <span className="text-xs text-orange-500 font-normal">(Non modifiable)</span>
                  )}
                </Label>
                <Input
                  name="quantity_sent"
                  id="quantity-sent"
                  className={cn(
                    'border-background/30 focus:border-background/50 transition-colors placeholder:text-background/50',
                    isQuantitySentDisabled && 'bg-muted cursor-not-allowed'
                  )}
                  type="number"
                  min="1"
                  value={formData.quantity_sent || ''}
                  onChange={handleFormChange}
                  disabled={isQuantitySentDisabled}
                  placeholder="Entrez la quantité"
                />
                {isQuantitySentDisabled && (
                  <p className="text-xs text-background/60 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>
                      La quantité ne peut pas être modifiée car des retours ont déjà été enregistrés
                    </span>
                  </p>
                )}
              </div>

              {/* Price by Unit */}
              <div className="space-y-2">
                <Label htmlFor="price-by-unit" className="text-background text-sm font-medium">
                  Prix unitaire (dh)
                </Label>
                <Input
                  name="price_by_unit"
                  id="price-by-unit"
                  className="border-background/30 focus:border-background/50 transition-colors"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_by_unit || ''}
                  onChange={handleFormChange}
                  placeholder="0.00"
                />
              </div>

              {/* Total Price (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="total-price" className="text-background text-sm font-medium">
                  Total (dh)
                </Label>
                <Input
                  name="total_price"
                  id="total-price"
                  className="border-background/30 bg-muted font-semibold"
                  type="text"
                  readOnly
                  value={totalPrice.toFixed(2)}
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-background text-sm font-medium">
                  Date de la commande
                </Label>
                <div className="w-full">
                  <DatePicker setFormData={setFormData} date={formData.date} />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-background/20" />

          {/* Returns Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-background/90 uppercase tracking-wide">
              Gestion des retours
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Quantity Returned */}
              <div className="space-y-2">
                <Label
                  htmlFor="new-quantity-returned"
                  className="text-background text-sm font-medium"
                >
                  Nouvelle quantité retournée
                </Label>
                <Input
                  type="number"
                  name="newQuantityReturned"
                  id="new-quantity-returned"
                  className="border-background/30 focus:border-background/50 transition-colors"
                  onChange={handleFormChange}
                  value={formData.newQuantityReturned || ''}
                  min="0"
                  max={formData.quantity_sent - quantity_returned}
                  placeholder="0"
                />
                <p className="text-xs text-background/60">
                  Cette quantité sera ajoutée aux retours précédents
                </p>
              </div>

              {/* Total Quantity Returned (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="total-returned" className="text-background text-sm font-medium">
                  Total quantité retournée
                </Label>
                <Input
                  type="text"
                  id="total-returned"
                  className="border-background/30 bg-muted font-semibold"
                  readOnly
                  value={totalQuantityReturned}
                />
                <p className="text-xs text-background/60">
                  Précédent: {quantity_returned} + Nouveau: {formData.newQuantityReturned}
                </p>
              </div>
            </div>

            {/* Return Warning */}
            {totalQuantityReturned > 0 && totalQuantityReturned <= formData.quantity_sent && (
              <Alert className="bg-orange-50 border-orange-200">
                <AlertDescription className="text-orange-800 mt-1.5">
                  <strong>Quantité restante:</strong>{' '}
                  {formData.quantity_sent - totalQuantityReturned} unité(s)
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="pt-1.5">{error}</AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="border border-background/30 hover:bg-background/5"
              disabled={isPending}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button onClick={handleEditOrder} disabled={isPending} className="min-w-[140px]">
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Modification...
              </>
            ) : (
              'Modifier la commande'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
