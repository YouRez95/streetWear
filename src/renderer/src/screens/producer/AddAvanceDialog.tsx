import DatePicker from '@renderer/components/datePicker'
import { Alert, AlertDescription } from '@renderer/components/ui/alert'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Textarea } from '@renderer/components/ui/textarea'
import { useCreateAvanceClient } from '@renderer/hooks/useClients'
import { useCreateAvanceFaconnier } from '@renderer/hooks/useFaconnier'
import { useCreateAvanceStylist } from '@renderer/hooks/useStylist'
import { cn } from '@renderer/lib/utils'
import { AlertCircle, ChevronDown, HandCoins, Info } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type AddAvanceDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedId: string
  selectedBonId: string
  useCreateAvanceHook: () =>
    | ReturnType<typeof useCreateAvanceFaconnier>
    | ReturnType<typeof useCreateAvanceStylist>
    | ReturnType<typeof useCreateAvanceClient>
  type: 'faconnier' | 'stylist' | 'client'
}

const options = ['cash', 'bank', 'cheque']

const paymentMethodMap: Record<string, string> = {
  cash: 'Espèces',
  cheque: 'Chèque',
  bank: 'Virement bancaire'
}

const initialAvanceData = {
  amount: 0,
  method: 'cash',
  description: '',
  createdAt: new Date().toISOString(),
  passagerName: ''
}

export default function AddAvanceDialog({
  open,
  setOpen,
  selectedId,
  selectedBonId,
  useCreateAvanceHook,
  type
}: AddAvanceDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { mutate: createAvance, isPending } = useCreateAvanceHook()
  const [avanceData, setAvanceData] = useState(initialAvanceData)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoize isPassagerClient check
  const isPassagerClient = useMemo(
    () => type === 'client' && selectedId === 'passager',
    [type, selectedId]
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Handle input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAvanceData({ ...avanceData, [e.target.name]: e.target.value })
      setError(null)
    },
    [avanceData]
  )

  // Handle method selection
  const handleMethodSelect = useCallback(
    (method: string) => {
      setAvanceData({ ...avanceData, method })
      setIsDropdownOpen(false)
      setError(null)
    },
    [avanceData]
  )

  // Reset form
  const resetForm = useCallback(() => {
    setAvanceData(initialAvanceData)
    setError(null)
    setIsDropdownOpen(false)
  }, [])

  // Handle dialog close
  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        resetForm()
      }
    },
    [setOpen, resetForm]
  )

  // Validate form
  const validateForm = useCallback((): string | null => {
    if (avanceData.amount <= 0 || !avanceData.amount) {
      return "Le montant de l'avance est requis et doit être supérieur à 0"
    }

    if (avanceData.method === '' || !avanceData.method) {
      return 'La méthode de paiement est requise'
    }

    if (isPassagerClient && !avanceData.passagerName.trim()) {
      return 'Le nom du passager est requis'
    }

    return null
  }, [avanceData, isPassagerClient])

  // Handle form submission
  const handleSubmitAvance = useCallback(() => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    createAvance(
      {
        stylistId: type === 'stylist' ? selectedId : undefined,
        faconnierId: type === 'faconnier' ? selectedId : undefined,
        clientId: type === 'client' ? selectedId : undefined,
        bonId: selectedBonId,
        amount: Number(avanceData.amount),
        method: avanceData.method,
        description: avanceData.description,
        createdAt: avanceData.createdAt,
        passagerName: avanceData.passagerName
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            setError(data.message || 'Une erreur est survenue')
            return
          }
          setOpen(false)
          resetForm()
        },
        onError: () => setError("Échec de l'ajout de l'avance. Veuillez réessayer.")
      }
    )
  }, [validateForm, createAvance, type, selectedId, selectedBonId, avanceData, setOpen, resetForm])

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isPending) {
        e.preventDefault()
        handleSubmitAvance()
      }
    },
    [handleSubmitAvance, isPending]
  )

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="bg-foreground min-w-[700px] max-w-2xl rounded-xl shadow-lg"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">Ajouter une avance</span>
          </DialogTitle>
          <DialogDescription className="text-background/70">
            Enregistrez une nouvelle avance pour le bon sélectionné
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date and Passager Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="avance-date" className="text-background text-sm font-medium">
                Date de l'avance
              </Label>
              <DatePicker
                setFormData={setAvanceData}
                date={avanceData.createdAt}
                label="createdAt"
              />
            </div>

            {/* Passager Name (Conditional) */}
            {isPassagerClient && (
              <div className="space-y-2">
                <Label htmlFor="passager-name" className="text-background text-sm font-medium">
                  Nom du passager <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="passager-name"
                  name="passagerName"
                  placeholder="Entrez le nom du passager"
                  value={avanceData.passagerName || ''}
                  onChange={handleChange}
                  className="border-background/30 focus:border-background/50 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Amount and Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="avance-amount" className="text-background text-sm font-medium">
                Montant (dh) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="avance-amount"
                name="amount"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={avanceData.amount || ''}
                onChange={handleChange}
                className="border-background/30 focus:border-background/50 transition-colors"
              />
            </div>

            {/* Payment Method Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="avance-method" className="text-background text-sm font-medium">
                Méthode de paiement <span className="text-red-500">*</span>
              </Label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  name="method"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    'w-full border border-background/30 text-sm flex justify-between items-center p-2.5 rounded-md',
                    'hover:border-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                    !avanceData.method && 'text-background/50'
                  )}
                >
                  <span>{paymentMethodMap[avanceData.method] || 'Sélectionner une méthode'}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-foreground border border-background/30 rounded-md mt-1 z-50 shadow-lg overflow-hidden">
                    {options.map((option) => (
                      <div
                        key={option}
                        className={cn(
                          'p-2.5 hover:bg-background/10 cursor-pointer transition-colors text-sm',
                          avanceData.method === option && 'bg-background/5 font-medium'
                        )}
                        onClick={() => handleMethodSelect(option)}
                      >
                        {paymentMethodMap[option] || option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="avance-description" className="text-background text-sm font-medium">
              Description{' '}
              <span className="text-background/60 font-normal text-xs">(Optionnel)</span>
            </Label>
            <Textarea
              id="avance-description"
              name="description"
              placeholder="Ajoutez des détails supplémentaires sur cette avance..."
              value={avanceData.description || ''}
              onChange={handleChange}
              className="border-background/30 focus:border-background/50 transition-colors resize-none min-h-[100px]"
            />
            <p className="text-xs text-background/60 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Cette information sera visible dans les détails de l'avance
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-1.5">{error}</AlertDescription>
          </Alert>
        )}

        {/* Footer */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end pt-4 border-t border-background/10">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="border border-background/30 hover:bg-background/5"
              disabled={isPending}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button onClick={handleSubmitAvance} disabled={isPending} className="min-w-[140px]">
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enregistrement...
              </>
            ) : (
              <>
                <HandCoins className="w-4 h-4 mr-2" />
                Ajouter l'avance
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
