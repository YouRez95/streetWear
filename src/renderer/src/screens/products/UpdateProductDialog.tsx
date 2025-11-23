import { DialogClose } from '@radix-ui/react-dialog'
import productLogo from '@renderer/assets/icons/products-icon.svg'
import DatePicker from '@renderer/components/datePicker'
import { Button } from '@renderer/components/ui/button'
// Remove Checkbox import
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
import { useUpdateProduct } from '@renderer/hooks/useProduct'
import { getImageUrl, validateProductForm } from '@renderer/utils'
import { Package, Ruler, Scale, Upload } from 'lucide-react' // Remove PackageCheck
import { useEffect, useState } from 'react'

type UpdateProductDialogProps = {
  product: Product | null
  open: boolean
  setOpen: (open: boolean) => void
}

const initialFormData: CreateProductInput & {
  id: string
} = {
  id: '',
  name: '',
  description: '',
  reference: '',
  totalQty: 0,
  productImage: null,
  fileName: null,
  createdAt: new Date().toISOString(),
  poids: 0,
  metrage: 0
}

export default function UpdateProductDialog({ product, open, setOpen }: UpdateProductDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const updateProductMutation = useUpdateProduct()

  useEffect(() => {
    if (product && open) {
      setFormData({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        reference: product.reference || '',
        totalQty: product.totalQty || 0,
        productImage: null,
        fileName: null,
        createdAt: product.createdAt || new Date().toISOString(),
        poids: product.poids || 0,
        metrage: product.metrage || 0
      })

      if (product.productImage) {
        setImageUrl(product.productImage)
      } else {
        setImageUrl(null)
      }
      setImagePreview(null)
    }
  }, [product, open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (error) setError(null)
    const { name, value, type } = e.target
    const parsedValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value
    setFormData({ ...formData, [name]: parsedValue })
  }

  // Remove handleCheckboxChange function

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

    updateProductMutation.mutate(
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
      setImageUrl(null)
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (!product) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <img
              src={productLogo}
              alt="product-logo"
              className="w-10 h-10 bg-background p-2 rounded-lg"
            />
            <p className="text-2xl font-bagel">Mettre à jour le produit</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations et l'image du produit.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          {/* Product Reference */}
          <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label htmlFor="reference" className="text-base font-semibold">
              Référence du produit
            </Label>
            <Input
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Entrer la référence du produit"
              className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
            />
          </div>

          {/* Product Information & Image */}
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
              <h1 className="text-base font-semibold">Informations du produit</h1>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Entrer le nom du produit"
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
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Entrer la description du produit"
                  className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50 flex-1"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col max-h-[300px]">
              <Label
                htmlFor="productImage"
                className="text-base flex flex-col gap-4 h-full p-2 bg-muted-foreground rounded-lg overflow-hidden"
              >
                <span className="font-semibold">Image du produit</span>
                <div className="flex items-center gap-2 cursor-pointer justify-center flex-1 rounded-lg overflow-hidden">
                  {!imagePreview && <Upload className="w-5 h-5" />}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="object-cover w-full h-full max-h-"
                    />
                  )}
                  {imageUrl && (
                    <img
                      src={getImageUrl(imageUrl)}
                      alt="Product Preview"
                      className="object-cover w-full h-full max-h-"
                    />
                  )}
                </div>
              </Label>
              <Input
                id="productImage"
                name="productImage"
                type="file"
                placeholder="Enter Product Image"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Product Stock - Simplified */}
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

              {/* Remove the isReady checkbox section entirely */}
            </div>
          </div>

          {/* Poids et Métrage */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
              <Label htmlFor="poids" className="text-base font-semibold flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Poids (kg)
              </Label>
              <Input
                id="poids"
                name="poids"
                placeholder="Poids en kilogrammes"
                type="number"
                step="0.01"
                min="0"
                className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                value={formData.poids}
                onChange={handleChange}
              />
              <p className="text-xs text-background/60">
                Optionnel - laissez vide si non applicable
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
              <Label htmlFor="metrage" className="text-base font-semibold flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Métrage (m)
              </Label>
              <Input
                id="metrage"
                name="metrage"
                placeholder="Longueur en mètres"
                type="number"
                step="0.01"
                min="0"
                className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
                value={formData.metrage}
                onChange={handleChange}
              />
              <p className="text-xs text-background/60">
                Optionnel - laissez vide si non applicable
              </p>
            </div>
          </div>

          <div className="text-base text-destructive">
            {error && <p className="text-destructive">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" className="w-fit">
              Mettre à jour le produit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
