import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteReturnStock } from '@renderer/hooks/useReturnStock'
import { AlertCircle, AlertTriangle, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'

type DeleteReturnStockProps = {
  open: boolean
  setOpen: (open: boolean) => void
  returnStock: ReturnStock
}

export function DeleteReturnStock({ open, setOpen, returnStock }: DeleteReturnStockProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { mutate: deleteReturnStockMutation, isPending } = useDeleteReturnStock()

  const handleChangeCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value)
    setError('')
  }, [])

  const handleDeleteProduct = useCallback(async () => {
    if (!code) {
      setError('Le code est requis')
      return
    }

    if (code.toUpperCase() !== 'SUPPRIMER') {
      setError('Le code est incorrect')
      return
    }
    setError('')

    deleteReturnStockMutation(returnStock.stockInfo.returnStockId, {
      onSuccess: (data) => {
        if (data.status === 'failed') {
          if (data.message === 'You cannot delete a return with quantity available') {
            setError(
              "Vous ne pouvez pas supprimer un retour avec une quantité disponible. Veuillez d'abord ajuster la quantité à zéro."
            )
          } else {
            setError(data.message)
          }
          return
        }
        setCode('')
        setError('')
        setOpen(false)
      },
      onError: (err: any) => {
        setError(err.message || 'Une erreur est survenue')
      }
    })
  }, [code, deleteReturnStockMutation, returnStock.stockInfo.returnStockId, setOpen])

  const handleClose = useCallback(() => {
    setCode('')
    setError('')
    setOpen(false)
  }, [setOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isPending && code) {
        e.preventDefault()
        handleDeleteProduct()
      }
    },
    [handleDeleteProduct, isPending, code]
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[600px] bg-white dark:bg-slate-900 rounded-2xl p-0 shadow-xl border-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Danger Header with gradient */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              Supprimer un retour
            </DialogTitle>
            <DialogDescription className="text-red-100 mt-2 text-base">
              Cette action est irréversible et supprimera définitivement ce retour
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Warning Alert */}
          <Alert className="bg-red-50 border-red-200 [&>svg]:text-red-400">
            <AlertTriangle className="h-5 w-5 text-background/40" />
            <AlertDescription className="text-red-800 dark:text-red-200 ml-2">
              <strong className="font-semibold">Attention :</strong> La suppression de ce retour est
              permanente. Toutes les données associées seront définitivement perdues.
            </AlertDescription>
          </Alert>

          {/* Return Stock Info */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Détails du retour à supprimer
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">ID:</span> {returnStock.stockInfo.returnStockId}
              </p>
              {/* Add more details if available in returnStock object */}
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label
              htmlFor="code"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              Confirmation requise
            </Label>
            <Input
              id="code"
              value={code}
              onChange={handleChangeCode}
              className="border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 h-11 text-base font-medium placeholder:text-background/50"
              placeholder="Tapez 'SUPPRIMER' pour confirmer"
              autoComplete="off"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pour confirmer, veuillez taper{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">SUPPRIMER</span> en
              majuscules
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="pt-1.5">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 dark:bg-slate-800 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 sm:justify-end border-t border-gray-200 dark:border-gray-700">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 h-11 px-6 font-medium transition-colors"
              disabled={isPending}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="h-11 px-8 font-semibold shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            onClick={handleDeleteProduct}
            disabled={isPending || !code}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
