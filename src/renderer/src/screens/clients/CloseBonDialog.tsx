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
import { useClientSummary, useToggleBonClient } from '@renderer/hooks/useClients'
import { cn } from '@renderer/lib/utils'
import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'

type CloseBonDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedClientId: string
  selectedBonId: string
  setSelectedBonId: (bonId: string) => void
}

export const CloseBonDialog = ({
  open,
  setOpen,
  selectedClientId,
  selectedBonId,
  setSelectedBonId
}: CloseBonDialogProps) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { data: dataSummary } = useClientSummary(selectedClientId, selectedBonId)
  const [remise, setRemise] = useState<number | ''>('')
  const { mutate: toggleBonClient } = useToggleBonClient()

  // Reset and initialize when dialog opens or data changes
  useEffect(() => {
    if (open) {
      // Reset code and error when dialog opens
      setCode('')
      setError('')

      // Set remise from dataSummary if available
      if (dataSummary?.summary?.remise !== undefined && dataSummary?.summary?.remise !== null) {
        setRemise(dataSummary.summary.remise)
      } else {
        setRemise('')
      }
    }
  }, [open, dataSummary?.summary?.remise])

  function showMessage() {
    if (
      dataSummary?.summary?.totalAdvances !== undefined &&
      dataSummary?.summary?.totalValueSent !== undefined &&
      dataSummary.summary.totalValueSent - dataSummary.summary.totalAdvances > 0
    ) {
      return (
        <div className="bg-destructive/15 border border-destructive/30 rounded-lg p-3">
          <p className="text-destructive font-medium text-sm">
            ⚠️ Ce bon n'est pas complet. Êtes-vous sûr de vouloir le fermer ?
          </p>
        </div>
      )
    }

    return (
      <div className="bg-success/15 border border-success/30 rounded-lg p-3">
        <p className="text-success font-medium text-sm">
          ✓ Le bon est complet. Vous pouvez le fermer.
        </p>
      </div>
    )
  }

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value)
    setError('')
  }

  function handleChangeRemise(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === '') {
      setRemise('')
    } else {
      const parsed = parseFloat(value)
      if (!isNaN(parsed) && parsed >= 0) {
        setRemise(parsed)
      }
    }
  }

  function handleCloseBon() {
    if (!code) {
      setError('Le code est requis')
      return
    }

    if (code.toUpperCase() !== 'FERMER') {
      setError('Le code est incorrect')
      return
    }

    setError('')
    toggleBonClient(
      {
        bonId: selectedBonId,
        openBon: false,
        closeBon: true,
        remise: remise === '' ? undefined : remise
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setSelectedBonId('')
          setCode('')
          setRemise('')
          setError('')
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCode('')
          setError('')
          setRemise('')
          setOpen(false)
        }
      }}
    >
      <DialogContent className="bg-foreground rounded-xl p-6 shadow-lg border max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className=" bg-destructive rounded-full">
              <Lock className="text-white p-1" />
            </div>
            <DialogTitle className="text-xl font-semibold">Fermer le bon</DialogTitle>
          </div>
          <DialogDescription className="text-background/80 text-base leading-relaxed">
            Pour confirmer la fermeture du bon, veuillez saisir le code de confirmation.
          </DialogDescription>
          {showMessage()}
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code" className="text-base font-medium text-background">
                Code de confirmation
              </Label>
              <Input
                id="code"
                value={code}
                onChange={handleChangeCode}
                placeholder="Saisir 'FERMER' pour confirmer"
                className="h-11 border-background/30 focus:border-destructive/50 transition-colors placeholder:text-background/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="remise" className="text-base font-medium text-background">
                Remise (Dhs)
              </Label>
              <div className="relative">
                <Input
                  id="remise"
                  value={remise}
                  onChange={handleChangeRemise}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  className="h-11 border-background/30 focus:border-primary/50 transition-colors pl-3 pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-background/60 text-sm">
                  Dhs
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter
          className={cn(
            'flex flex-col sm:flex-row gap-3 pt-2',
            error ? 'justify-between items-start sm:items-center' : 'justify-end'
          )}
        >
          {error && (
            <div className="flex-1">
              <p className="text-destructive font-medium text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            </div>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="flex-1 border sm:flex-none border-background/30 text-background hover:bg-background/10 h-11"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              variant={'destructive'}
              onClick={handleCloseBon}
              className="flex-1 sm:flex-none h-11 font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Confirmer la fermeture
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
