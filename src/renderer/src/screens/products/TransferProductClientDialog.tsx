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
  useActiveClients,
  useBonsClientPassager,
  useCreateBonClient,
  useCreateBonClientPassager,
  useCreateOrderClient
} from '@renderer/hooks/useClients'
import { useUserStore } from '@renderer/store'
import {
  AlertCircle,
  Calculator,
  Calendar,
  ChevronDown,
  PlusIcon,
  Tag,
  User,
  UserPlus
} from 'lucide-react'
import { useEffect, useState } from 'react'
import SearchableDropdown from './SearchableDropDown'

type TransferProductClientDialogProps = {
  product: Product
  transferTo: 'client' | null
  open: boolean
  setOpen: (open: boolean) => void
}

type SelectedClient = GetActiveClientsResponse['clients'][0]

type FormData = {
  clientId: string | null
  passagerName: string | null
  transferQuantity: number
  priceByUnit: number
  bon_number: number | null
  date: string | null
  clientType: 'regular' | 'passager'
  description?: string
}

export default function TransferProductClientDialog({
  product,
  open,
  setOpen
}: TransferProductClientDialogProps) {
  const { mutate: createBonClient } = useCreateBonClient()
  const { mutate: createBonClientForPassager } = useCreateBonClientPassager()
  const { activeSeason } = useUserStore()
  const [error, setError] = useState<string | null>(null)
  const [selectClient, setSelectClient] = useState<SelectedClient>()
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null)
  const { data: activeClients } = useActiveClients()
  const { data: bonClientPassager } = useBonsClientPassager()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false)
  const [bonsForPassager, setBonsForPassager] = useState<number[]>([])
  const [formData, setFormData] = useState<FormData>({
    clientId: null,
    passagerName: null,
    transferQuantity: product.ProductStatus.quantity_ready,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
    clientType: 'regular',
    description: ''
  })

  const { mutate: createOrderClient } = useCreateOrderClient()

  useEffect(() => {
    if (bonClientPassager && bonClientPassager.bons) {
      const bonNumbers = bonClientPassager.bons.map((bon) => bon.bon_number)
      setBonsForPassager(bonNumbers)
      setSelectBonNumber(bonNumbers[0])
    }
  }, [bonClientPassager])

  useEffect(() => {
    if (open) {
      setFormData({
        clientId: null,
        passagerName: null,
        transferQuantity: product.ProductStatus.quantity_ready,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
        clientType: 'regular',
        description: ''
      })
      setError(null)
      setSelectClient(undefined)
      setSelectBonNumber(null)
    }
  }, [open, product])

  const closeDialog = () => {
    setOpen(false)
    setFormData({
      clientId: null,
      passagerName: null,
      transferQuantity: product.ProductStatus.quantity_ready,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
      clientType: 'regular',
      description: ''
    })
    setError(null)
    setSelectClient(undefined)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (error) setError(null)
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleClientTypeChange = (type: 'regular' | 'passager') => {
    setFormData((prevData) => ({
      ...prevData,
      clientType: type,
      clientId: type === 'regular' ? prevData.clientId : null,
      passagerName: type === 'passager' ? prevData.passagerName : null,
      bon_number: null
    }))
    setSelectClient(undefined)
    setSelectBonNumber(null)
    setError(null)
  }

  const handleTransfer = () => {
    if (formData.clientType === 'regular' && !formData.clientId) {
      setError('Veuillez sélectionner un client')
      return
    }

    if (formData.clientType === 'passager' && !formData.passagerName?.trim()) {
      setError('Veuillez entrer le nom du client passager')
      return
    }

    if (formData.transferQuantity > product.ProductStatus.quantity_ready) {
      if (product.ProductStatus.quantity_ready === 0) {
        setError('Aucune unité disponible pour ce produit')
      } else {
        setError(
          'Vous ne pouvez transférer que ' + product.ProductStatus.quantity_ready + ' unités'
        )
      }
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

    const orderData = {
      clientId: formData.clientType === 'regular' ? formData.clientId : null,
      passagerName: formData.clientType === 'passager' ? formData.passagerName : null,
      productId: product.id,
      transferQuantity: Number(formData.transferQuantity),
      priceByUnit: Number(formData.priceByUnit),
      bon_number: Number(formData.bon_number),
      date: formData.date,
      description: formData.description
    }

    createOrderClient(orderData, {
      onSuccess: (data) => {
        if (data.status === 'failed') {
          return
        }
        closeDialog()
      }
    })
  }

  const handleAddBonNumber = () => {
    if (activeSeason && formData.clientType === 'regular' && selectClient?.id) {
      createBonClient(selectClient.id, {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setSelectClient((prevClient) => {
            if (!prevClient) return prevClient
            return {
              ...prevClient,
              BonsClients: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: 'OPEN'
                },
                ...prevClient.BonsClients
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
    } else {
      createBonClientForPassager(undefined, {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setBonsForPassager((prevBons) => [data.bon?.bon_number as number, ...prevBons])
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
  const availableQuantity = product.ProductStatus.quantity_ready

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className="min-w-[700px] max-w-2xl bg-white shadow-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
            <div className="p-2 bg-primary rounded-lg">
              <img src={productLogo} alt="product-logo" className="w-6 h-6 text-secondary" />
            </div>
            Transférer le produit
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Transférer "{product.name}" à un client. Stock disponible:{' '}
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
              <p className="text-sm text-gray-600">Stock disponible</p>
              <p className="text-lg font-bold text-secondary">{availableQuantity} unités</p>
            </div>
          </div>
        </div>

        {/* Client Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Type de client</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={formData.clientType === 'regular' ? 'default' : 'ghost'}
              className={`flex items-center gap-2 flex-1 ${
                formData.clientType === 'regular' ? 'bg-primary ' : 'border border-background/35'
              }`}
              onClick={() => handleClientTypeChange('regular')}
            >
              <User className="w-4 h-4" />
              Client Régulier
            </Button>
            <Button
              type="button"
              variant={formData.clientType === 'passager' ? 'default' : 'ghost'}
              className={`flex items-center gap-2 flex-1 ${
                formData.clientType === 'passager' ? 'bg-primary' : 'border border-background/35'
              }`}
              onClick={() => handleClientTypeChange('passager')}
            >
              <UserPlus className="w-4 h-4" />
              Client Passager
            </Button>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client-select" className="text-sm font-medium text-gray-700">
                {formData.clientType === 'regular' ? 'Sélectionner un client' : 'Nom du client'}
              </Label>
              {formData.clientType === 'regular' ? (
                <SearchableDropdown
                  items={activeClients?.clients || []}
                  placeholderInput="Rechercher un client..."
                  selectedItem={selectClient}
                  onSelect={(client) => {
                    setSelectClient(client)
                    const firstBonNumber = client.BonsClients[0]?.bon_number || null
                    setSelectBonNumber(firstBonNumber)
                    setFormData((prevData) => ({
                      ...prevData,
                      clientId: client.id,
                      bon_number: firstBonNumber
                    }))
                  }}
                  placeholder="Choisir un client"
                  displayValue={(client) => client.name}
                  searchFields={['name']}
                />
              ) : (
                <Input
                  name="passagerName"
                  placeholder="Entrez le nom complet du client"
                  value={formData.passagerName || ''}
                  onChange={handleFormChange}
                  className="w-full placeholder:text-background/50"
                />
              )}
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
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Numéro de bon</Label>
            <div className="flex gap-3">
              {formData.clientType === 'regular' && selectClient ? (
                <>
                  <SearchableDropdown
                    items={selectClient.BonsClients}
                    selectedItem={selectClient.BonsClients.find(
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
                    <p className="text-white">Nouveau bon</p>
                  </Button>
                </>
              ) : formData.clientType === 'passager' ? (
                <>
                  <div className="flex gap-2 relative flex-1">
                    <button
                      type="button"
                      onClick={() => setIsBonNumberOpen(!isBonNumberOpen)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center bg-white hover:bg-gray-50"
                    >
                      {selectBonNumber ? `Bon #${selectBonNumber}` : 'Sélectionner un bon'}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isBonNumberOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isBonNumberOpen && (
                      <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-50 max-h-48 overflow-y-auto shadow-lg">
                        {bonsForPassager.length === 0 ? (
                          <div className="p-3 text-gray-500 text-sm">Aucun bon disponible</div>
                        ) : (
                          bonsForPassager.map((bon) => (
                            <div
                              key={bon}
                              className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                              onClick={() => {
                                setSelectBonNumber(bon)
                                setIsBonNumberOpen(false)
                                setFormData((prevData) => ({
                                  ...prevData,
                                  bon_number: bon
                                }))
                              }}
                            >
                              Bon #{bon}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Button onClick={handleAddBonNumber} className="shrink-0">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    <p className="text-white">Nouveau bon</p>
                  </Button>
                </>
              ) : null}
            </div>
          </div>
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
            {formData.clientType === 'regular' && selectClient && (
              <span>Client: {selectClient.name}</span>
            )}
            {formData.clientType === 'passager' && formData.passagerName && (
              <span>Client: {formData.passagerName}</span>
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
                !formData.bon_number || formData.transferQuantity <= 0 || formData.priceByUnit <= 0
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
