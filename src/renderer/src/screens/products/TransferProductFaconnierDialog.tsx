import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import productLogo from '@renderer/assets/icons/products-icon.svg'
import DatePicker from '@renderer/components/datePicker'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import {
  useActiveFaconniers,
  useCreateBonFaconnier,
  useCreateOrderFaconnier
} from '@renderer/hooks/useFaconnier'
import { useUserStore } from '@renderer/store'
import { AlertCircle, Calculator, Calendar, Factory, PlusIcon, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import SearchableDropdown from './SearchableDropDown'

type TransferProductFaconnierDialogProps = {
  product: Product
  transferTo: 'faconnier' | null
  open: boolean
  setOpen: (open: boolean) => void
}

type SelectedFaconnier = GetActiveFaconniersResponse['faconniers'][0]

type FormData = {
  faconnierId: string | null
  transferQuantity: number
  priceByUnit: number
  bon_number: number | null
  date: string | null
  description: ''
}

export default function TransferProductFaconnierDialog({
  product,
  open,
  setOpen
}: TransferProductFaconnierDialogProps) {
  const { mutate: createBonFaconnier } = useCreateBonFaconnier()
  const { activeSeason } = useUserStore()
  const [error, setError] = useState<string | null>(null)
  const [selectFaconnier, setSelectFaconnier] = useState<SelectedFaconnier>()
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null)
  const { data: activeFaconniers } = useActiveFaconniers()
  const [formData, setFormData] = useState<FormData>({
    faconnierId: null,
    transferQuantity: product.ProductStatus.raw_in_stock,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
    description: ''
  })
  const { mutate: createOrderFaconnier } = useCreateOrderFaconnier()

  useEffect(() => {
    if (open) {
      setFormData({
        faconnierId: null,
        transferQuantity: product.ProductStatus.raw_in_stock,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
        description: ''
      })
      setError(null)
      setSelectFaconnier(undefined)
      setSelectBonNumber(null)
    }
  }, [open, product])

  const closeDialog = () => {
    setOpen(false)
    setFormData({
      faconnierId: null,
      transferQuantity: product.ProductStatus.raw_in_stock,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
      description: ''
    })
    setError(null)
    setSelectFaconnier(undefined)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (error) setError(null)
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleTransfer = () => {
    if (!formData.faconnierId) {
      setError('Veuillez sélectionner un faconnier')
      return
    }
    if (formData.transferQuantity > product.ProductStatus.raw_in_stock) {
      setError('Vous ne pouvez transférer que ' + product.ProductStatus.raw_in_stock + ' unités')
      return
    }
    if (formData.priceByUnit <= 0) {
      setError('Le prix par unité doit être supérieur à 0')
      return
    }
    if (formData.transferQuantity <= 0) {
      setError('La quantité de transfert doit être supérieure à 0')
      return
    }

    if (!formData.bon_number) {
      setError('Veuillez sélectionner un numéro de bon')
      return
    }

    if (!formData.date) {
      setError('Veuillez sélectionner une date')
      return
    }
    setError(null)

    createOrderFaconnier(
      {
        faconnierId: formData.faconnierId,
        productId: product.id,
        transferQuantity: Number(formData.transferQuantity),
        priceByUnit: Number(formData.priceByUnit),
        bon_number: Number(formData.bon_number),
        date: formData.date,
        description: formData.description
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          closeDialog()
        }
      }
    )
  }

  const handleAddBonNumber = () => {
    if (activeSeason && selectFaconnier?.id) {
      createBonFaconnier(selectFaconnier.id, {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setSelectFaconnier((prevFaconnier) => {
            if (!prevFaconnier) return prevFaconnier
            return {
              ...prevFaconnier,
              BonsFaconnier: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: 'OPEN'
                },
                ...prevFaconnier.BonsFaconnier
              ]
            }
          })
          setSelectBonNumber(data.bon?.bon_number as number)
          setFormData((prevData) => ({
            ...prevData,
            bon_number: data.bon?.bon_number as number
          }))
        }
      })
    }
  }

  const totalPrice = formData.transferQuantity * formData.priceByUnit
  const availableQuantity = product.ProductStatus.raw_in_stock

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className="min-w-[700px] max-w-2xl bg-white shadow-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
            <div className="p-2 bg-primary rounded-lg">
              <img src={productLogo} alt="product-logo" className="w-6 h-6" />
            </div>
            Transférer au Façonnier
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Transférer "{product.name}" à un façonnier. Stock matière première disponible:{' '}
            <span className="font-semibold text-secondary">{availableQuantity} unités</span>
          </DialogDescription>
        </DialogHeader>

        {/* Product Summary */}
        <div className="bg-background/5  rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">Référence: {product.reference}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stock matière première</p>
              <p className="text-lg font-bold text-secondary">{availableQuantity} unités</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Faconnier Selection and Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="faconnier-select"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Factory className="w-4 h-4" />
                Façonnier
              </Label>
              <SearchableDropdown
                items={activeFaconniers?.faconniers || []}
                selectedItem={selectFaconnier}
                onSelect={(faconnier) => {
                  setSelectFaconnier(faconnier)
                  const firstBonNumber = faconnier.BonsFaconnier[0]?.bon_number || null
                  setSelectBonNumber(firstBonNumber)
                  setFormData((prevData) => ({
                    ...prevData,
                    faconnierId: faconnier.id,
                    bon_number: firstBonNumber
                  }))
                }}
                placeholder="Sélectionner un façonnier"
                displayValue={(faconnier) => faconnier.name}
                searchFields={['name']}
              />
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date de transfert
              </Label>
              <DatePicker setFormData={setFormData} />
            </div>
          </div>

          {/* Quantity and Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-quantity" className="text-sm font-medium text-gray-700">
                Quantité
              </Label>
              <Input
                name="transferQuantity"
                id="transfer-quantity"
                type="number"
                min="1"
                max={availableQuantity}
                value={formData.transferQuantity}
                onChange={handleFormChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Max: {availableQuantity} unités</p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="price-by-unit"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Prix unitaire
              </Label>
              <Input
                name="priceByUnit"
                id="price-by-unit"
                type="number"
                step="0.01"
                min="0"
                value={formData.priceByUnit}
                onChange={handleFormChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="total-price"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Total
              </Label>
              <Input
                name="totalPrice"
                id="total-price"
                type="number"
                readOnly
                value={totalPrice}
                className="w-full bg-gray-50 font-semibold"
              />
              <p className="text-xs text-gray-500">Calcul automatique</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-primary">
              Description (optionnel)
            </Label>
            <Textarea
              name="description"
              id="description"
              value={formData.description || ''}
              onChange={handleFormChange}
              className="w-full border-background/30 placeholder:text-background/50 resize-none"
              placeholder="Ajouter une description..."
            />
          </div>

          {/* Bon Number Section */}
          {selectFaconnier && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Numéro de bon</Label>
              <div className="flex gap-3">
                <SearchableDropdown
                  items={selectFaconnier.BonsFaconnier}
                  selectedItem={selectFaconnier.BonsFaconnier.find(
                    (b) => b.bon_number === selectBonNumber
                  )}
                  onSelect={(bon) => {
                    setSelectBonNumber(bon.bon_number)
                    setFormData((prevData) => ({
                      ...prevData,
                      bon_number: bon.bon_number
                    }))
                  }}
                  placeholder="Sélectionner un bon"
                  displayValue={(bon) => `Bon #${bon.bon_number}`}
                  searchFields={['bon_number']}
                  className="flex-1"
                />
                <Button onClick={handleAddBonNumber} className="shrink-0">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <p className="text-white font-medium">Nouveau bon</p>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <DialogFooter className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button variant="ghost" className="min-w-24 border">
                Annuler
              </Button>
            </DialogClose>
            <Button
              onClick={handleTransfer}
              className="min-w-24 bg-primary"
              disabled={
                !formData.bon_number ||
                formData.transferQuantity <= 0 ||
                formData.priceByUnit <= 0 ||
                !formData.faconnierId
              }
            >
              Transférer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
