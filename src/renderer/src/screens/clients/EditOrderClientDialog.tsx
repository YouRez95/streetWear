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
import { Textarea } from '@renderer/components/ui/textarea'
import { useUpdateOrderClient } from '@renderer/hooks/useClients'
import { cn } from '@renderer/lib/utils'
import { AlertCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

type OpenEditDialog = {
  open: boolean
  orderId: string
  quantity_returned: number
  quantity_sent: number
  price_by_unit: number
  date: string
  passagerName: string
  avance: number
  description: string
}

type EditOrderClientDialogProps = {
  openEditDialog: OpenEditDialog
  onClose: (open: OpenEditDialog) => void
  clientId: string
  bonId: string
}

type FormData = {
  quantity_sent: number
  newQuantityReturned: number
  price_by_unit: number
  date: string
  passagerName?: string
  avance: number
  description: string
}

const initialFormData: FormData = {
  quantity_sent: 0,
  newQuantityReturned: 0,
  price_by_unit: 0,
  date: new Date().toISOString(),
  passagerName: '',
  avance: 0,
  description: ''
}

const initialDialogState: OpenEditDialog = {
  open: false,
  orderId: '',
  quantity_returned: 0,
  quantity_sent: 0,
  price_by_unit: 0,
  date: '',
  passagerName: '',
  avance: 0,
  description: ''
}

export function EditOrderClientDialog({
  openEditDialog,
  onClose,
  clientId,
  bonId
}: EditOrderClientDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [error, setError] = useState<string | null>(null)

  const { mutate: updateOrderClient, isPending } = useUpdateOrderClient()

  const {
    open,
    orderId,
    quantity_returned,
    quantity_sent,
    price_by_unit,
    date,
    passagerName,
    avance,
    description
  } = openEditDialog

  /** Derived state */
  const isPassagerView = clientId === 'passager'

  const totalPrice = formData.quantity_sent * formData.price_by_unit
  const totalQuantityReturned = quantity_returned + formData.newQuantityReturned
  const isQuantitySentDisabled = quantity_returned > 0

  /** Sync dialog data on open */
  useEffect(() => {
    if (!open) return

    setFormData({
      quantity_sent,
      newQuantityReturned: 0,
      price_by_unit,
      date,
      passagerName: passagerName || '',
      avance,
      description: description || ''
    })
    setError(null)
  }, [open])

  /** Input handler */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(null)
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  /** Validation */
  const validateForm = (): string | null => {
    if (formData.quantity_sent <= 0) return 'La quantité envoyée doit être supérieure à 0'
    if (formData.newQuantityReturned < 0) return 'La quantité retournée ne peut pas être négative'
    if (totalQuantityReturned > formData.quantity_sent)
      return 'La quantité retournée totale ne peut pas dépasser la quantité envoyée'
    if (!formData.date) return 'Veuillez sélectionner une date'
    if (formData.price_by_unit <= 0) return 'Le prix unitaire doit être supérieur à 0'
    if (isPassagerView && !formData.passagerName) return 'Le nom du client passager est requis'

    return null
  }

  /** Reset & close dialog */
  const resetDialog = () => {
    setFormData(initialFormData)
    setError(null)
    onClose(initialDialogState)
  }

  /** Submit handler */
  const handleEditOrder = () => {
    const validationError = validateForm()
    if (validationError) return setError(validationError)

    const payload = {
      ...formData,
      description: formData.description.trim() || undefined
    }

    if (!isPassagerView) delete payload.passagerName

    updateOrderClient(
      {
        bonId,
        clientId,
        orderId,
        formData: payload
      },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            resetDialog()
          } else {
            setError(data.message || 'Une erreur est survenue')
          }
        },
        onError: () => setError('Une erreur est survenue lors de la mise à jour')
      }
    )
  }

  /** Allow pressing Enter */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isPending) {
      e.preventDefault()
      handleEditOrder()
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
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

        {/* --- CONTENT --- */}
        <div className="space-y-6 py-4">
          {/* --- ORDER DETAILS --- */}
          <OrderDetailsSection
            formData={formData}
            handleFormChange={handleFormChange}
            isQuantitySentDisabled={isQuantitySentDisabled}
            passagerName={passagerName}
            isPassagerView={isPassagerView}
            totalPrice={totalPrice}
            quantity_returned={quantity_returned}
            date={formData.date}
            setFormData={setFormData}
          />

          <div className="border-t border-background/20" />

          {/* --- RETURNS --- */}
          <ReturnsSection
            formData={formData}
            handleFormChange={handleFormChange}
            totalQuantityReturned={totalQuantityReturned}
            quantity_returned={quantity_returned}
          />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="pt-1.5">{error}</AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" disabled={isPending}>
              Annuler
            </Button>
          </DialogClose>
          <Button onClick={handleEditOrder} disabled={isPending} className="min-w-[140px]">
            {isPending ? 'Modification…' : 'Modifier la commande'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OrderDetailsSection({
  formData,
  handleFormChange,
  isQuantitySentDisabled,
  passagerName,
  isPassagerView,
  totalPrice,
  date,
  setFormData
}: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-background/90 uppercase tracking-wide">
        Détails de la commande
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantity Sent */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium flex items-center gap-2">
            Quantité envoyée
            {isQuantitySentDisabled && (
              <span className="text-xs text-orange-500">(Non modifiable)</span>
            )}
          </Label>
          <Input
            name="quantity_sent"
            type="number"
            disabled={isQuantitySentDisabled}
            value={formData.quantity_sent}
            onChange={handleFormChange}
            className={cn(isQuantitySentDisabled && 'bg-muted cursor-not-allowed')}
          />
          {isQuantitySentDisabled && (
            <p className="text-xs text-background/60 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5" />
              La quantité ne peut pas être modifiée car des retours existent
            </p>
          )}
        </div>

        {/* Price by Unit */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium">Prix unitaire (dh)</Label>
          <Input
            name="price_by_unit"
            type="number"
            step="0.01"
            value={formData.price_by_unit}
            onChange={handleFormChange}
          />
        </div>

        {/* Total price */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium">Total (dh)</Label>
          <Input readOnly value={totalPrice.toFixed(2)} className="bg-muted font-semibold" />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium">Date</Label>
          <DatePicker date={date} setFormData={setFormData} />
        </div>
      </div>

      {/* Passager inputs */}
      {isPassagerView && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-background text-sm font-medium">Nom du passager</Label>
            <Input
              name="passagerName"
              value={formData.passagerName}
              onChange={handleFormChange}
              placeholder={passagerName || 'Nom du client'}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-background text-sm font-medium">Nouvelle avance (dh)</Label>
            <Input
              name="avance"
              type="number"
              value={formData.avance}
              onChange={handleFormChange}
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Description (optionnel)</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          className="resize-none h-11"
        />
      </div>
    </div>
  )
}

function ReturnsSection({
  formData,
  handleFormChange,
  totalQuantityReturned,
  quantity_returned
}: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-background/90 uppercase tracking-wide">
        Gestion des retours
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* New returned qty */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium">Nouvelle quantité retournée</Label>
          <Input
            type="number"
            name="newQuantityReturned"
            value={formData.newQuantityReturned}
            onChange={handleFormChange}
            min="0"
            max={formData.quantity_sent - quantity_returned}
          />
        </div>

        {/* Total */}
        <div className="space-y-2">
          <Label className="text-background text-sm font-medium">Total quantité retournée</Label>
          <Input readOnly value={totalQuantityReturned} className="bg-muted font-semibold" />
        </div>
      </div>
    </div>
  )
}
