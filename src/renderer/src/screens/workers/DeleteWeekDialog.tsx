import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteWeek } from '@renderer/hooks/useWorkers'
import { useWorkerStore } from '@renderer/store'
import { AlertTriangle, Calendar, CalendarX, Clock, Trash } from 'lucide-react'
import { useState } from 'react'

type DeleteWeekDialogProps = {
  weekName: string | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteWeekDialog({ weekName, open, setOpen }: DeleteWeekDialogProps) {
  const { weekId, workplaceId, setWeekId } = useWorkerStore()
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')
  const { mutate: deleteWeekMutation, isPending } = useDeleteWeek()

  const REQUIRED_CODE = 'SUPPRIMER'

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase()
    setConfirmationCode(value)
    if (error) setError('')
  }

  async function handleConfirmDeletion() {
    if (!confirmationCode.trim()) {
      setError('Veuillez saisir le code de confirmation')
      return
    }

    if (confirmationCode !== REQUIRED_CODE) {
      setError('Code de confirmation incorrect. Tapez "SUPPRIMER" pour confirmer.')
      return
    }

    setError('')

    deleteWeekMutation(
      { weekId, workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            setOpen(false)
            setConfirmationCode('')
            setWeekId(data.nextWeekId || '')
          }
        },
        onError: () => {
          setError('Une erreur est survenue lors de la suppression. Veuillez réessayer.')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="w-4 h-4 mr-2" />
          <span>Supprimer cette semaine</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px] bg-white border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
            <CalendarX className="w-8 h-8 text-red-600" />
          </div>

          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Supprimer la semaine
          </DialogTitle>

          <DialogDescription className="text-center text-gray-600 text-base leading-relaxed">
            Vous êtes sur le point de supprimer définitivement cette semaine de travail et tous les
            enregistrements d'heures associés.
            {weekName && (
              <span className="block mt-2 font-medium text-gray-800">
                <Calendar className="w-4 h-4 inline mr-1" />
                Semaine : {weekName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium space-y-2">
            <div>
              <strong>ATTENTION - Action irréversible :</strong>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Toutes les données de cette semaine seront perdues</li>
              <li>Tous les enregistrements d'heures associés seront supprimés</li>
              <li>Les rapports et statistiques liés ne seront plus disponibles</li>
              <li>Cette action ne peut pas être annulée</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation-code" className="text-base font-medium text-gray-700">
              Pour confirmer, tapez <span className="font-bold text-red-600">{REQUIRED_CODE}</span>{' '}
              ci-dessous :
            </Label>
            <Input
              id="confirmation-code"
              value={confirmationCode}
              onChange={handleCodeChange}
              placeholder="Tapez SUPPRIMER pour confirmer"
              className="text-base h-12 border-2 focus:border-red-400 focus:ring-red-200"
              disabled={isPending}
              autoComplete="off"
            />
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 h-11 text-base font-medium border-2 hover:bg-gray-50"
              disabled={isPending}
            >
              <Clock className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            className="flex-1 h-11 text-base font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            onClick={handleConfirmDeletion}
            disabled={isPending || confirmationCode !== REQUIRED_CODE}
          >
            <CalendarX className="w-4 h-4 mr-2" />
            {isPending ? 'Suppression en cours...' : 'Supprimer la semaine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
