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
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Textarea } from '@renderer/components/ui/textarea'
import {
  useActiveStylists,
  useCreateBonStylist,
  useCreateOrderStylist
} from '@renderer/hooks/useStylist'
import { useUserStore } from '@renderer/store'
import { AlertCircle, Calculator, Calendar, PlusIcon, Scissors, Tag } from 'lucide-react'
import { useState } from 'react'
import SearchableDropdown from './SearchableDropDown'

type TransferProductStylistDialogProps = {
  product: Product
  transferTo: 'stylist' | null
  open: boolean
  setOpen: (open: boolean) => void
}

type SelectedStylist = GetActiveStylistsResponse['stylists'][0]

type FormData = {
  stylistId: string | null
  transferQuantity: number
  priceByUnit: number
  bon_number: number | null
  date: string
  description?: string
}

export default function TransferProductStylistDialog({
  product,
  open,
  setOpen
}: TransferProductStylistDialogProps) {
  const { mutate: createBonStylist } = useCreateBonStylist()
  const { activeSeason } = useUserStore()
  const [error, setError] = useState<string | null>(null)
  const [selectStylist, setSelectStylist] = useState<SelectedStylist>()
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null)
  const { data: activeStylists } = useActiveStylists()
  const [formData, setFormData] = useState<FormData>({
    stylistId: null,
    transferQuantity: product.ProductStatus.raw_in_stock,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
    description: ''
  })
  const { mutate: createOrderStylist } = useCreateOrderStylist()

  const closeDialog = () => {
    setOpen(false)
    setFormData({
      stylistId: null,
      transferQuantity: product.ProductStatus.raw_in_stock,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
      description: ''
    })
    setError(null)
    setSelectStylist(undefined)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (error) setError(null)
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleTransfer = () => {
    if (!formData.stylistId) {
      setError('Veuillez sélectionner un stylist')
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
    setError(null)

    createOrderStylist(
      {
        stylistId: formData.stylistId,
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
    if (activeSeason && selectStylist?.id) {
      createBonStylist(selectStylist.id, {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setSelectStylist((prevStylist) => {
            if (!prevStylist) return prevStylist
            return {
              ...prevStylist,
              BonsStyleTrait: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: 'OPEN'
                },
                ...prevStylist.BonsStyleTrait
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
            Transférer au Stylist
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Transférer "{product.name}" à un stylist. Stock matière première disponible:{' '}
            <span className="font-semibold text-secondary">{availableQuantity} unités</span>
          </DialogDescription>
        </DialogHeader>

        {/* Product Summary */}
        <div className="bg-background/5 rounded-lg p-4 mb-6">
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
          {/* Stylist Selection and Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="stylist-select"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Stylist
              </Label>
              <SearchableDropdown
                items={activeStylists?.stylists || []}
                selectedItem={selectStylist}
                onSelect={(stylist) => {
                  setSelectStylist(stylist)
                  const firstBonNumber = stylist.BonsStyleTrait[0]?.bon_number || null
                  setSelectBonNumber(firstBonNumber)
                  setFormData((prevData) => ({
                    ...prevData,
                    stylistId: stylist.id,
                    bon_number: firstBonNumber
                  }))
                }}
                placeholder="Sélectionner un stylist"
                displayValue={(stylist) => stylist.name}
                displayLabel={(stylist) => (
                  <div className="flex items-center gap-2">
                    <span>{stylist.name}</span>
                    <Badge variant="outline" className="bg-gray-100 text-gray-700">
                      {stylist.type}
                    </Badge>
                  </div>
                )}
                searchFields={['name', 'type']}
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
          {selectStylist && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Numéro de bon</Label>
              <div className="flex gap-3">
                <SearchableDropdown
                  items={selectStylist.BonsStyleTrait}
                  selectedItem={selectStylist.BonsStyleTrait.find(
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
          {/* <div className="text-sm text-gray-600">
            {selectStylist && (
              <div className="flex items-center gap-2">
                <span>Stylist: {selectStylist.name}</span>
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  {selectStylist.type}
                </Badge>
              </div>
            )}
          </div> */}
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
                !formData.stylistId
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
