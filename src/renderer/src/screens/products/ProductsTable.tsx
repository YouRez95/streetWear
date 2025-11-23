import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ImagePreview from '@renderer/components/imagePreview/ImagePreview'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import { Progress } from '@renderer/components/ui/progress'
import { useProducts } from '@renderer/hooks/useProduct'
import { formatDateToDDMMYYYY } from '@renderer/utils'
import { useDebounce } from '@uidotdev/usehooks'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  Package,
  Palette,
  Pencil,
  Trash2,
  Users
} from 'lucide-react'
import { Fragment, memo, ReactNode, useEffect, useState } from 'react'
import TransferProductDropDown from './TransferProductDropDown'

type ProductsTableProps = {
  setOpenSheet: (open: boolean) => void
  search: string
  page: number
  setTotalPages: (totalPages: number) => void
  date: 'asc' | 'desc'
  setDate: (date: 'asc' | 'desc') => void
  limit: number
  setOpenEditDialog: (open: boolean) => void
  setOpenDeleteDialog: (open: boolean) => void
  setSelectedProduct: (product: any) => void
  setSelectedTransferTo: (transferTo: 'faconnier' | 'client' | 'stylist' | null) => void
  setOpenTransferDialogFaconnier: (open: boolean) => void
  setOpenTransferDialogClient: (open: boolean) => void
  setOpenTransferDialogStylist: (open: boolean) => void
}

export function getProductionStatus(product: Product): ReactNode {
  if (!product || !product.ProductStatus) return null

  const { quantity_at_faconnier, raw_in_stock } = product.ProductStatus
  const total = product.totalQty

  if (quantity_at_faconnier === 0 && raw_in_stock === total) {
    return (
      <Badge className="bg-[#F39C12] flex items-center justify-center hover:bg-[#F39C12] text-white h-7 text-[14px]">
        Non commencé
      </Badge>
    )
  }

  if (quantity_at_faconnier > 0) {
    return (
      <Badge className="bg-[#9B59B6] flex items-center justify-center hover:bg-[#9B59B6] text-white h-7 text-[14px]">
        En production
      </Badge>
    )
  }

  if (quantity_at_faconnier === 0 && raw_in_stock < total) {
    return (
      <Badge className="bg-[#B33771] flex items-center justify-center hover:bg-[#B33771] text-white h-7 text-[14px]">
        Retourné
      </Badge>
    )
  }

  return (
    <Badge className="bg-[#F39C12] flex items-center justify-center hover:bg-[#F39C12] text-white h-7 text-[14px]">
      Non commencé
    </Badge>
  )
}

export default memo(function ProductsTable({
  setOpenSheet,
  search,
  page,
  setTotalPages,
  limit,
  setOpenEditDialog,
  setOpenDeleteDialog,
  setSelectedProduct,
  setSelectedTransferTo,
  setOpenTransferDialogFaconnier,
  setOpenTransferDialogClient,
  setOpenTransferDialogStylist,
  date,
  setDate
}: ProductsTableProps) {
  const [nestedTable, setNestedTable] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<{
    [key: string]: 'clients' | 'faconniers' | 'stylists' | null
  }>({})

  const handleShowNestedTable = (id: string) => {
    setNestedTable((prev) => {
      if (prev === id) {
        // Clear expanded sections when closing
        setExpandedSection({})
        return null
      }
      return id
    })
  }

  const toggleSection = (productId: string, section: 'clients' | 'faconniers' | 'stylists') => {
    setExpandedSection((prev) => ({
      ...prev,
      [productId]: prev[productId] === section ? null : section
    }))
  }

  const debouncedSearchTerm = useDebounce(search, 300)
  const { data: productsData, isLoading } = useProducts(page, limit, debouncedSearchTerm, date)

  useEffect(() => {
    if (productsData) {
      setTotalPages(productsData.totalPages)
    }
  }, [productsData])

  if (isLoading) return <div>Chargement...</div>

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos produits récents.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Référence</TableHead>
            <TableHead className="text-background w-[300px] font-semibold">Modèle</TableHead>
            <TableHead className="text-background w-[200px] font-semibold">
              Date
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDate(date === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Quantité</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Type</TableHead>
            <TableHead className="text-background w-[250px] font-semibold">
              Progression (client)
            </TableHead>
            <TableHead className="text-background w-[190px] font-semibold text-center">
              Statut (faconnier)
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">
          {productsData?.products.length === 0 && (
            <TableRow className="h-[55px]">
              <TableCell colSpan={9} className="text-center">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          )}
          {productsData?.products.map((product) => (
            <Fragment key={product.id}>
              <TableRow
                className="h-[55px] hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleShowNestedTable(product.id)}
              >
                <TableCell className="font-medium">
                  {nestedTable === product.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.reference}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <ImagePreview
                      src={product.productImage}
                      fallback={defaultProductImage}
                      alt={product.id}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100 border"
                    />
                    <span className="text-lg">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-background/80">
                  {formatDateToDDMMYYYY(product.createdAt)}
                </TableCell>
                <TableCell className="text-background/80">{product.totalQty}</TableCell>
                <TableCell className="text-background/80">
                  {product.type ? (
                    <Badge className="bg-secondary">{product.type.replace('_', ' + ')}</Badge>
                  ) : (
                    '------'
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center gap-2 w-[90%]">
                    <Progress
                      className="w-[80%]"
                      value={(product.ProductStatus?.quantity_with_client * 100) / product.totalQty}
                    />
                    <span className="w-[15%]">
                      {(
                        (product.ProductStatus?.quantity_with_client * 100) /
                        product.totalQty
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center justify-center h-full">
                    {getProductionStatus(product)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 justify-end">
                    <Eye
                      className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                        setOpenSheet(true)
                      }}
                    />
                    <Pencil
                      className="w-7 h-7 cursor-pointer text-success border border-success/90 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                        setOpenEditDialog(true)
                      }}
                    />
                    <TransferProductDropDown
                      product={product}
                      setSelectedProduct={setSelectedProduct}
                      setSelectedTransferTo={setSelectedTransferTo}
                      setOpenTransferDialogFaconnier={setOpenTransferDialogFaconnier}
                      setOpenTransferDialogClient={setOpenTransferDialogClient}
                      setOpenTransferDialogStylist={setOpenTransferDialogStylist}
                    />
                    <Trash2
                      className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                        setOpenDeleteDialog(true)
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* EXPANDED NESTED VIEW */}
              {nestedTable === product.id && (
                <TableRow className="">
                  <TableCell colSpan={9} className="p-0 bg-muted/30">
                    <div className="p-4 space-y-3">
                      {/* CLIENT DISTRIBUTION SECTION */}
                      <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSection(product.id, 'clients')
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-800">
                              Distribution Clients
                            </span>
                            <Badge className="bg-blue-500 hover:bg-blue-500 text-white">
                              {product.ClientOrdersItems?.length || 0} clients
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Total:{' '}
                              {product.ClientOrdersItems?.reduce(
                                (sum, item) => sum + item.quantity - item.returned,
                                0
                              ) || 0}{' '}
                              pcs
                            </span>
                          </div>
                          {expandedSection[product.id] === 'clients' ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>

                        {expandedSection[product.id] === 'clients' && (
                          <div className="overflow-x-auto">
                            <Table className="text-base">
                              <TableHeader className="bg-muted">
                                <TableRow>
                                  <TableHead className="text-background/50">Client</TableHead>
                                  <TableHead className="text-background/50">N° Bon</TableHead>
                                  <TableHead className="text-background/50">Date</TableHead>
                                  <TableHead className="text-background/50">Quantité</TableHead>
                                  <TableHead className="text-background/50">Retourné</TableHead>
                                  <TableHead className="text-background/50">Statut Bon</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.ClientOrdersItems?.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={6}
                                      className="text-center py-8 text-background/50"
                                    >
                                      Aucune distribution client pour ce produit
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  product.ClientOrdersItems.map((item) => (
                                    <TableRow key={item.id} className="h-[50px]">
                                      <TableCell className="font-medium">
                                        {item.clientOrder.client ? (
                                          item.clientOrder.client.name
                                        ) : (
                                          <span>
                                            {item.passagerName} <small>(Passager)</small>
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        bon #{item.clientOrder.bon_number.bon_number}
                                      </TableCell>
                                      <TableCell>{formatDateToDDMMYYYY(item.createdAt)}</TableCell>
                                      <TableCell>
                                        <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 font-semibold">
                                          {item.quantity} pcs
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {/* <div className="flex items-center gap-2">
                                          <Progress
                                            className="w-20"
                                            value={(item.quantity * 100) / product.totalQty}
                                          />
                                          <span className="text-sm font-medium min-w-[45px]">
                                            {((item.quantity * 100) / product.totalQty).toFixed(1)}%
                                          </span>
                                        </div> */}
                                        <Badge className="bg-red-100 hover:bg-blue-100 text-red-700 font-semibold">
                                          {item.returned} pcs
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            item.clientOrder.bon_number.bonStatus === 'OPEN'
                                              ? 'bg-green-100 hover:bg-green-100 text-green-700'
                                              : 'bg-gray-100 hover:bg-gray-100 text-gray-700'
                                          }
                                        >
                                          {item.clientOrder.bon_number.bonStatus === 'OPEN'
                                            ? 'Ouvert'
                                            : 'Fermé'}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>

                      {/* FACONNIER ORDERS SECTION */}
                      <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSection(product.id, 'faconniers')
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-800">Commandes Faconnier</span>
                            <Badge className="bg-purple-500 hover:bg-purple-500 text-white">
                              {product.FaconnierOrderItems?.length || 0} commandes
                            </Badge>
                          </div>
                          {expandedSection[product.id] === 'faconniers' ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>

                        {expandedSection[product.id] === 'faconniers' && (
                          <div className="overflow-x-auto">
                            <Table className="text-base">
                              <TableHeader className="bg-muted">
                                <TableRow>
                                  <TableHead className="text-background/50">Faconnier</TableHead>
                                  <TableHead className="text-background/50">N° Bon</TableHead>
                                  <TableHead className="text-background/50">Date</TableHead>
                                  <TableHead className="text-background/50">Envoyé</TableHead>
                                  <TableHead className="text-background/50">Retourné</TableHead>
                                  <TableHead className="text-background/50">Restant</TableHead>
                                  <TableHead className="text-background/50">Statut Bon</TableHead>
                                  <TableHead className="text-background/50">
                                    Statut Commande
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.FaconnierOrderItems?.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={8}
                                      className="text-center py-8 text-background/50"
                                    >
                                      Aucune commande faconnier
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  product.FaconnierOrderItems?.map((item) => (
                                    <TableRow key={item.id} className="h-[50px]">
                                      <TableCell className="font-medium">
                                        {item.faconnierOrder.faconnier.name}
                                      </TableCell>
                                      <TableCell>
                                        bon #{item.faconnierOrder.bon_number.bon_number}
                                      </TableCell>
                                      <TableCell>{formatDateToDDMMYYYY(item.createdAt)}</TableCell>
                                      <TableCell>{item.quantity_sent}</TableCell>
                                      <TableCell>{item.quantity_returned}</TableCell>
                                      <TableCell className="font-semibold">
                                        {item.quantity_sent - item.quantity_returned}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            item.faconnierOrder.bon_number.bonStatus === 'OPEN'
                                              ? 'bg-green-100 hover:bg-green-100 text-green-700'
                                              : 'bg-gray-100 hover:bg-gray-100 text-gray-700'
                                          }
                                        >
                                          {item.faconnierOrder.bon_number.bonStatus === 'OPEN'
                                            ? 'Ouvert'
                                            : 'Fermé'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {item.quantity_sent !== item.quantity_returned ? (
                                          <Badge className="bg-orange-100 hover:bg-orange-100 text-orange-700">
                                            En cours
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-green-100 hover:bg-green-100 text-green-700">
                                            Terminé
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>

                      {/* STYLIST ORDERS SECTION */}
                      {product.StyleTraitOrderItems && product.StyleTraitOrderItems.length > 0 && (
                        <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSection(product.id, 'stylists')
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Palette className="w-5 h-5 text-amber-600" />
                              <span className="font-semibold text-gray-800">
                                Commandes Styliste
                              </span>
                              <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                                {product.StyleTraitOrderItems?.length || 0} commandes
                              </Badge>
                            </div>
                            {expandedSection[product.id] === 'stylists' ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {expandedSection[product.id] === 'stylists' && (
                            <div className="overflow-x-auto">
                              <Table className="text-base">
                                <TableHeader className="bg-muted">
                                  <TableRow>
                                    <TableHead className="text-background/50">Styliste</TableHead>
                                    <TableHead className="text-background/50">Type</TableHead>
                                    <TableHead className="text-background/50">N° Bon</TableHead>
                                    <TableHead className="text-background/50">Date</TableHead>
                                    <TableHead className="text-background/50">Quantité</TableHead>
                                    <TableHead className="text-background/50">
                                      Prix Unitaire
                                    </TableHead>
                                    <TableHead className="text-background/50">Total</TableHead>
                                    <TableHead className="text-background/50">Statut Bon</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {product.StyleTraitOrderItems?.map((item) => (
                                    <TableRow key={item.id} className="h-[50px]">
                                      <TableCell className="font-medium">
                                        {item.styleTraitOrder.styleTrait.name}
                                      </TableCell>
                                      <TableCell>
                                        <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700">
                                          {item.styleTraitOrder.styleTrait.type}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        bon #{item.styleTraitOrder.bon_number.bon_number}
                                      </TableCell>
                                      <TableCell>{formatDateToDDMMYYYY(item.createdAt)}</TableCell>
                                      <TableCell>{item.quantity_sent}</TableCell>
                                      <TableCell>{item.unit_price} DH</TableCell>
                                      <TableCell className="font-semibold">
                                        {item.quantity_sent * item.unit_price} DH
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={
                                            item.styleTraitOrder.bon_number.bonStatus === 'OPEN'
                                              ? 'bg-green-100 hover:bg-green-100 text-green-700'
                                              : 'bg-gray-100 hover:bg-gray-100 text-gray-700'
                                          }
                                        >
                                          {item.styleTraitOrder.bon_number.bonStatus === 'OPEN'
                                            ? 'Ouvert'
                                            : 'Fermé'}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  )
})
