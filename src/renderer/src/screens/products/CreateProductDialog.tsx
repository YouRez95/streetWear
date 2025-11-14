import { DialogClose } from '@radix-ui/react-dialog'
import productLogo from '@renderer/assets/icons/products-icon.svg'
import DatePicker from '@renderer/components/datePicker'
import { Button } from '@renderer/components/ui/button'
import { Checkbox } from '@renderer/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Textarea } from '@renderer/components/ui/textarea'
import { useCreateProduct } from '@renderer/hooks/useProduct'
import { validateProductForm } from '@renderer/utils'
import { AlertTriangle, Package, PackageCheck, Ruler, Scale, Upload } from 'lucide-react'
import { useState } from 'react'

type CreateProductDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const initialFormData: CreateProductInput = {
  name: '',
  description: '',
  reference: '',
  totalQty: 0,
  isReady: false,
  productImage: null,
  fileName: null,
  createdAt: new Date().toISOString(),
  poids: 0,
  metrage: 0
}

export default function CreateProductDialog({ open, setOpen }: CreateProductDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const createProductMutation = useCreateProduct()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (error) setError(null)
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (error) setError(null)
    setFormData({ ...formData, isReady: checked })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorMessage = validateProductForm(formData)
    if (errorMessage) {
      setError(errorMessage)
      return
    }

    const buffer = image ? await image.arrayBuffer() : null
    const productPayload = {
      ...formData,
      productImage: buffer,
      fileName: image?.name || null
    }

    console.log('Submitting product:', productPayload)

    createProductMutation.mutate(
      { productData: productPayload },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setFormData(initialFormData)
          setImage(null)
          setImagePreview(null)
          setOpen(false)
        }
      }
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground min-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <img
              src={productLogo}
              alt="logo-produit"
              className="w-10 h-10 bg-background p-2 rounded-lg"
            />
            <p className="text-2xl font-bagel">Créer un produit</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Ce produit sera ajouté à votre saison active.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Référence du produit */}
          <div className="flex flex-col gap-2 bg-muted-foreground p-3 rounded-lg shadow-sm">
            <Label htmlFor="reference" className="text-base font-semibold">
              Référence du produit
            </Label>
            <Input
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Entrez la référence du produit"
              className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
            />
          </div>

          {/* Informations & Image */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-3 bg-muted-foreground p-3 rounded-lg shadow-sm">
              <h1 className="text-base font-semibold">Informations du produit</h1>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Entrez le nom du produit"
                  className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-base font-medium">
                  Date
                </Label>
                <DatePicker setFormData={setFormData} date={formData.createdAt} label="createdAt" />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Entrez la description du produit"
                  className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50 min-h-[100px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <Label
                htmlFor="productImage"
                className="text-base flex flex-col gap-3 h-full p-3 bg-muted-foreground rounded-lg shadow-sm overflow-hidden cursor-pointer hover:bg-muted-foreground/90 transition-colors"
              >
                <span className="font-semibold">Image du produit</span>
                <div className="flex items-center justify-center flex-1 rounded-lg overflow-hidden border-2 border-dashed border-background/30 hover:border-background/50 transition-colors min-h-[250px]">
                  {!imagePreview ? (
                    <div className="flex flex-col items-center gap-2 text-background/60">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Cliquer pour ajouter</span>
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Aperçu du produit"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </Label>
              <Input
                id="productImage"
                name="productImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Stock Section with Ready Status */}
          <div className="bg-muted-foreground p-4 rounded-lg shadow-sm">
            <h1 className="text-base font-semibold mb-3">Gestion des stocks</h1>
            <div className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-2">
                <Label htmlFor="totalQty" className="text-base font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Quantité totale
                </Label>
                <Input
                  id="totalQty"
                  name="totalQty"
                  placeholder="Quantité totale"
                  type="number"
                  min="0"
                  className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                  value={formData.totalQty}
                  onChange={handleChange}
                />
                <p className="text-xs text-background/60">Quantité totale du produit</p>
              </div>

              <div className="flex-1 flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border border-background/20">
                  <Checkbox
                    id="isReady"
                    checked={formData.isReady}
                    onCheckedChange={handleCheckboxChange}
                    className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="isReady"
                      className="text-base font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4" />
                      Stock prêt
                    </Label>
                    <p className="text-xs text-background/60 mt-1">
                      Cochez si la totalité du stock est disponible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Poids et Métrage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 bg-muted-foreground p-3 rounded-lg shadow-sm">
              <Label htmlFor="poids" className="text-base font-semibold flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Poids (kg)
              </Label>
              <Input
                id="poids"
                name="poids"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                value={formData.poids || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-background/60">
                Optionnel - laissez vide si non applicable
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-muted-foreground p-3 rounded-lg shadow-sm">
              <Label htmlFor="metrage" className="text-base font-semibold flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Métrage (m)
              </Label>
              <Input
                id="metrage"
                name="metrage"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                value={formData.metrage || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-background/60">
                Optionnel - laissez vide si non applicable
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="border border-background/50 hover:bg-background/10"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-fit min-w-[140px]"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? 'Création...' : 'Créer le produit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
