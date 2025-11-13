// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog'
// import { DialogClose } from '@radix-ui/react-dialog'
// import DatePicker from '@renderer/components/datePicker'
// import { Button } from '@renderer/components/ui/button'
// import { Input } from '@renderer/components/ui/input'
// import { Label } from '@renderer/components/ui/label'
// import { useUpdateOrderStylist } from '@renderer/hooks/useStylist'
// import { useEffect, useState } from 'react'

// type OpenEditDialog = {
//   open: boolean
//   orderId: string
//   quantity_sent: number
//   price_by_unit: number
//   date: string
// }

// type EditOrderStylistDialogProps = {
//   openEditDialog: OpenEditDialog
//   onClose: (open: OpenEditDialog) => void
//   stylistId: string
//   bonId: string
// }

// const initialFormData = {
//   quantity_sent: 0,
//   price_by_unit: 0,
//   date: new Date().toISOString()
// }

// export function EditOrderStylistDialog({
//   openEditDialog,
//   onClose,
//   stylistId,
//   bonId
// }: EditOrderStylistDialogProps) {
//   const [error, setError] = useState<string | null>(null)
//   const { open, orderId, quantity_sent, price_by_unit, date } = openEditDialog
//   const { mutate: updateOrderStylist } = useUpdateOrderStylist()
//   const [formData, setFormData] = useState(initialFormData)

//   useEffect(() => {
//     if (open) {
//       setFormData({
//         quantity_sent: quantity_sent,
//         price_by_unit: price_by_unit,
//         date: date
//       })
//     }
//   }, [open, bonId, stylistId])

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setError(null)
//     const { name, value, type } = e.target
//     setFormData({
//       ...formData,
//       [name]: type === 'number' ? Number(value) : value
//     })
//   }

//   const handleEditOrder = () => {
//     if (formData.quantity_sent <= 0) {
//       setError('La quantité envoyée doit être supérieure à 0')
//       return
//     }

//     if (!formData.date) {
//       setError('Veuillez entrer une date')
//       return
//     }

//     if (formData.price_by_unit <= 0) {
//       setError('Le prix par unité doit être supérieur à 0')
//       return
//     }

//     const finalData = {
//       orderId,
//       stylistId,
//       bonId,
//       formData: formData
//     }

//     setError(null)
//     updateOrderStylist(
//       {
//         bonId,
//         stylistId,
//         orderId,
//         formData
//       },
//       {
//         onSuccess: (data) => {
//           if (data.status === 'failed') {
//             return
//           }
//           onClose({
//             open: false,
//             orderId: '',
//             quantity_sent: 0,
//             price_by_unit: 0,
//             date: ''
//           })
//           setError(null)
//         }
//       }
//     )
//   }

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={() => {
//         setFormData(initialFormData)
//         setError(null)
//         onClose({
//           open: false,
//           orderId: '',
//           quantity_sent: 0,
//           price_by_unit: 0,
//           date: ''
//         })
//       }}
//     >
//       <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-0 shadow-xl border-0 overflow-hidden">
//         {/* Header with gradient background */}
//         <div className=" px-6 py-5">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-semibold">Modifier la commande</DialogTitle>
//             <DialogDescription className="text-background/50">
//               Ajustez les détails de votre commande ci-dessous
//             </DialogDescription>
//           </DialogHeader>
//         </div>

//         {/* Form content */}
//         <div className="px-6 py-6 space-y-6">
//           {/* Error Alert */}
//           {error && (
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 flex items-start gap-3">
//               <svg
//                 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
//             </div>
//           )}

//           {/* Quantity and Price Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* Quantity Sent */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="quantity-sent"
//                 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                   />
//                 </svg>
//                 Quantité envoyée
//               </Label>
//               <Input
//                 name="quantity_sent"
//                 id="quantity-sent"
//                 className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 h-11 text-base transition-colors"
//                 type="number"
//                 placeholder="0"
//                 value={formData.quantity_sent || ''}
//                 onChange={handleFormChange}
//               />
//             </div>

//             {/* Price by Unit */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="price-by-unit"
//                 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 Prix par unité
//               </Label>
//               <Input
//                 name="price_by_unit"
//                 id="price-by-unit"
//                 className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 h-11 text-base transition-colors"
//                 type="number"
//                 placeholder="0.00"
//                 value={formData.price_by_unit || ''}
//                 onChange={handleFormChange}
//               />
//             </div>
//           </div>

//           {/* Total and Date Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* Total Price - Highlighted */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="total-price"
//                 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                   />
//                 </svg>
//                 Total
//               </Label>
//               <div className="relative">
//                 <Input
//                   name="total_price"
//                   id="total-price"
//                   className="border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-9 text-base font-semibold text-gray-900 dark:text-white pr-12"
//                   type="number"
//                   readOnly
//                   value={formData.quantity_sent * formData.price_by_unit}
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium">
//                   DH
//                 </span>
//               </div>
//             </div>

//             {/* Date */}

//             <div className="flex items-center gap-2">
//               <Label htmlFor="date" className="text-background text-base whitespace-nowrap flex-1">
//                 Date:
//               </Label>
//               <div className="flex-1 w-full">
//                 <DatePicker setFormData={setFormData} date={date} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <DialogFooter className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
//           <DialogClose asChild>
//             <Button
//               variant="ghost"
//               className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 h-11 px-6 font-medium transition-colors"
//             >
//               Annuler
//             </Button>
//           </DialogClose>
//           <Button
//             onClick={handleEditOrder}
//             className="h-11 px-8 font-semibold shadow-sm transition-all hover:shadow-md"
//           >
//             Modifier la commande
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
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
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useUpdateOrderStylist } from '@renderer/hooks/useStylist'
import { cn } from '@renderer/lib/utils'
import { useEffect, useState } from 'react'

type OpenEditDialog = {
  open: boolean
  orderId: string
  quantity_sent: number
  price_by_unit: number
  date: string
}

type EditOrderStylistDialogProps = {
  openEditDialog: OpenEditDialog
  onClose: (open: OpenEditDialog) => void
  stylistId: string
  bonId: string
}

const initialFormData = {
  quantity_sent: 0,
  price_by_unit: 0,
  date: new Date().toISOString()
}
export function EditOrderStylistDialog({
  openEditDialog,
  onClose,
  stylistId,
  bonId
}: EditOrderStylistDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const { open, orderId, quantity_sent, price_by_unit, date } = openEditDialog
  // const [newQuantityReturned, setNewQuantityReturned] = useState<number | null>(null)
  const { mutate: updateOrderStylist } = useUpdateOrderStylist()
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (open) {
      setFormData({
        quantity_sent: quantity_sent,
        price_by_unit: price_by_unit,
        date: date
      })
    }
  }, [open, bonId, stylistId])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    })
  }

  const handleEditOrder = () => {
    if (formData.quantity_sent <= 0) {
      setError('La quantité envoyée doit être supérieure à 0')
      return
    }

    if (!formData.date) {
      setError('Veuillez entrer une date')
      return
    }

    if (formData.price_by_unit <= 0) {
      setError('Le prix par unité doit être supérieur à 0')
      return
    }

    const finalData = {
      orderId,
      stylistId,
      bonId,
      formData: formData
    }

    setError(null)
    //console.log('finalData from edit order stylist dialog', finalData)
    updateOrderStylist(
      {
        bonId,
        stylistId,
        orderId,
        formData
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          onClose({
            open: false,
            orderId: '',
            quantity_sent: 0,
            price_by_unit: 0,
            date: ''
          })
          setError(null)
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setFormData(initialFormData)
        setError(null)
        onClose({
          open: false,
          orderId: '',
          quantity_sent: 0,
          price_by_unit: 0,
          date: ''
        })
      }}
    >
      <DialogContent className="max-w-2xl bg-foreground rounded-xl p-5 shadow-sm border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Modifier la commande</DialogTitle>
          <DialogDescription className="text-background/50">
            Ajustez les détails de votre commande ci-dessous
          </DialogDescription>
        </DialogHeader>

        {/* Quantity sent and price by unit */}
        {/* Form content */}
        <div className="px-6 py-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          )}

          {/* Quantity and Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quantity Sent */}
            <div className="space-y-2">
              <Label
                htmlFor="quantity-sent"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Quantité envoyée
              </Label>
              <Input
                name="quantity_sent"
                id="quantity-sent"
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 h-11 text-base transition-colors"
                type="number"
                placeholder="0"
                value={formData.quantity_sent || ''}
                onChange={handleFormChange}
              />
            </div>

            {/* Price by Unit */}
            <div className="space-y-2">
              <Label
                htmlFor="price-by-unit"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Prix par unité
              </Label>
              <Input
                name="price_by_unit"
                id="price-by-unit"
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 h-11 text-base transition-colors"
                type="number"
                placeholder="0.00"
                value={formData.price_by_unit || ''}
                onChange={handleFormChange}
              />
            </div>
          </div>

          {/* Total and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Total Price - Highlighted */}
            <div className="space-y-2">
              <Label
                htmlFor="total-price"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Total
              </Label>
              <div className="relative">
                <Input
                  name="total_price"
                  id="total-price"
                  className="border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 h-9 text-base font-semibold text-gray-900 dark:text-white pr-12"
                  type="number"
                  readOnly
                  value={formData.quantity_sent * formData.price_by_unit}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  DH
                </span>
              </div>
            </div>
            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Date
              </Label>
              <div className="flex-1 w-full ">
                <DatePicker setFormData={setFormData} date={date} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <DialogFooter
          className={cn(
            'flex items-center',
            error ? 'justify-between sm:justify-between' : 'justify-end sm:justify-end'
          )}
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleEditOrder}>Modifier la commande</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
