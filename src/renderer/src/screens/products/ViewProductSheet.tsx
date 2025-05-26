import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { getImageUrl } from '@renderer/utils'

type ViewProductSheetProps = {
  product: Product | null
  setOpenSheet: (open: boolean) => void
  openSheet: boolean
}

export default function ViewProductSheet({
  product,
  setOpenSheet,
  openSheet
}: ViewProductSheetProps) {
  if (!product) return null
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className="bg-foreground border">
        <SheetHeader>
          <SheetTitle className="text-background">Détails du produit</SheetTitle>
          <SheetDescription className="text-background text-base space-y-4">
            {product.description}
          </SheetDescription>
          <div className="text-background text-base space-y-4">
            <div className="flex flex-col gap-2">
              <img
                src={getImageUrl(product.productImage, 'product')}
                alt={product.name}
                className="w-full min-h-[200px] max-h-[500px] object-cover rounded-xl"
                onError={(e) => {
                  const target = e.currentTarget
                  target.src = defaultProductImage
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-semibold">Nom:</span> {product.name}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {product.type.replace('_', ' + ')}
              </p>
              <p>
                <span className="font-semibold">Total Quantité:</span> {product.totalQty}
              </p>
            </div>

            {/* Product Status */}
            <div>
              <p className="border border-background/50 w-full p-1 text-center text-base font-semibold bg-muted">
                Statut du produit
              </p>
              <div className="flex items-center">
                <p className="border border-background/50 w-2/3 p-1">Quantité en stock</p>
                <p className="border border-background/50 w-1/3 text-center p-1">
                  {product.ProductStatus.raw_in_stock}
                </p>
              </div>
              <div className="flex items-center">
                <p className="border border-background/50 w-2/3 p-1">Quantité au faconnier</p>
                <p className="border border-background/50 w-1/3 text-center p-1">
                  {product.ProductStatus.quantity_at_faconnier}
                </p>
              </div>
              <div className="flex items-center">
                <p className="border border-background/50 w-2/3 p-1">Quantité avec le client</p>
                <p className="border border-background/50 w-1/3 text-center p-1">
                  {product.ProductStatus.quantity_with_client}
                </p>
              </div>
              <div className="flex items-center">
                <p className="border border-background/50 w-2/3 p-1">Quantité prête</p>
                <p className="border border-background/50 w-1/3 text-center p-1">
                  {product.ProductStatus.quantity_ready}
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
