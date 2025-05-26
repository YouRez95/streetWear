import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import { Button } from '@renderer/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@renderer/components/ui/hover-card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { useOrdersFaconnier } from '@renderer/hooks/useFaconnier'
import { useUserStore } from '@renderer/store'
import { formatDateToDDMMYYYY, getImageUrl } from '@renderer/utils'
import { Info, Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { DeleteAvanceDialog } from './DeleteAvanceDialog'
import { DeleteOrderFaconnierDialog } from './DeleteOrderFaconnierDialog'
import { EditOrderFaconnierDialog } from './EditOrderFaconnierDialog'

export default function FaconnierTable() {
  const { selectedFaconnierId, selectedBonId } = useUserStore()
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: '',
    quantity_returned: 0,
    quantity_sent: 0
  })
  const [openDeleteOrderDialog, setOpenDeleteOrderDialog] = useState({
    open: false,
    orderId: '',
    reference: ''
  })
  const [openDeleteAvanceDialog, setOpenDeleteAvanceDialog] = useState({
    open: false,
    avanceId: '',
    amount: 0
  })

  const { data, isLoading } = useOrdersFaconnier(selectedFaconnierId, selectedBonId)
  console.log('data from faconnier table', data)

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos produits récents.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="text-background w-[150px] font-semibold">Référence</TableHead>
            <TableHead className="text-background w-[200px] font-semibold">Modèle</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Date</TableHead>
            <TableHead className="text-background w-[170px] font-semibold">
              Quantité envoyée
            </TableHead>
            <TableHead className="text-background w-[190px] font-semibold">
              Quantité retournée
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Prix unitaire</TableHead>
            <TableHead className="text-background w-[150px] font-semibold">Total</TableHead>
            <TableHead className="text-background w-[150px] font-semibold text-center">
              Statut
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Chargement...
              </TableCell>
            </TableRow>
          ) : selectedFaconnierId === '' || selectedBonId === '' ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Sélectionner un faconnier et un bon pour voir votre tableau
              </TableCell>
            </TableRow>
          ) : data?.status === 'failed' ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                {data.message}
              </TableCell>
            </TableRow>
          ) : data && data.orders.length > 0 ? (
            data.orders.map((order) =>
              order.type === 'PRODUCT' ? (
                <TableRow key={order.id}>
                  <TableCell>{order.reference}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(order.productImage, 'product')}
                        alt={order.id}
                        className="w-14 h-14 rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.src = defaultProductImage
                        }}
                      />
                      <span className="text-lg">{order.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYY(order.createdAt)}</TableCell>
                  <TableCell>{order.quantity_sent}</TableCell>
                  <TableCell>{order.quantity_returned}</TableCell>
                  <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
                  <TableCell>
                    {((order.quantity_sent || 0) * (order.unit_price || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.order_status === 'IN_PROGRESS' ? (
                      <span className="text-foreground bg-destructive rounded-full px-2 py-1 font-bold">
                        En cours
                      </span>
                    ) : (
                      <span className="text-foreground bg-success rounded-full px-3 py-1.5 font-bold">
                        Terminé
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-5 space-x-3">
                    {order.order_status === 'IN_PROGRESS' ? (
                      <Button
                        onClick={() =>
                          setOpenEditDialog({
                            open: true,
                            orderId: order.id,
                            quantity_returned: order.quantity_returned,
                            quantity_sent: order.quantity_sent
                          })
                        }
                        variant="ghost"
                        className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    ) : null}
                    <Button
                      onClick={() =>
                        setOpenDeleteOrderDialog({
                          open: true,
                          orderId: order.id,
                          reference: order.reference
                        })
                      }
                      variant="ghost"
                      className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={order.id} className="bg-yellow-100 hover:bg-yellow-200 h-[55px]">
                  <TableCell colSpan={2} className="font-bold">
                    Avance
                  </TableCell>
                  <TableCell className="font-bold" colSpan={4}>
                    {formatDateToDDMMYYYY(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-left font-bold">
                    {order.amount?.toFixed(2)} dh
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {order.method.charAt(0).toUpperCase() + order.method.slice(1)}
                  </TableCell>
                  <TableCell className="text-right pr-5 font-bold flex justify-end gap-3 relative">
                    {order.description && (
                      <HoverCard>
                        <HoverCardTrigger className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                          <Info className="w-4 h-4" />
                        </HoverCardTrigger>
                        <HoverCardContent className="text-left mr-4 text-sm font-normal">
                          {order.description}
                        </HoverCardContent>
                      </HoverCard>
                    )}
                    <Button
                      variant="ghost"
                      className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                      onClick={() =>
                        setOpenDeleteAvanceDialog({
                          open: true,
                          avanceId: order.id,
                          amount: order.amount
                        })
                      }
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Aucun produit trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditOrderFaconnierDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderFaconnierDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceDialog
        faconnierId={selectedFaconnierId}
        bonId={selectedBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  )
}
