import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogClose } from '@radix-ui/react-dialog'
import { useUpdateWorker } from '@renderer/hooks/useWorkers'
import { useEffect, useState } from 'react'
import WorkplaceSelect from './WorkplaceSelect'

type UpdateWorkerDialogProps = {
  worker: GetWorkersResponse | null
  open: boolean
  closeDialog: () => void
}

export function UpdateWorkerDialog({ worker, open, closeDialog }: UpdateWorkerDialogProps) {
  const updateWorkerMutation = useUpdateWorker()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    salaireHebdomadaire: '',
    workplaceId: ''
  })

  // Initialize form with worker data when dialog opens
  useEffect(() => {
    if (worker && open) {
      setFormData({
        id: worker.id,
        name: worker.name || '',
        phone: worker.phone || '',
        salaireHebdomadaire: worker.salaireHebdomadaire ? String(worker.salaireHebdomadaire) : '',
        workplaceId: worker.workplace.id || ''
      })
    }
  }, [worker, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleWorkplaceChange = (id: string) => {
    if (error) setError(null)
    setFormData({ ...formData, workplaceId: id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() === '') {
      setError('Le nom est requis')
      return
    }

    if (!formData.salaireHebdomadaire || Number(formData.salaireHebdomadaire) <= 0) {
      setError('Le salaire hebdomadaire est requis et doit être supérieur à 0')
      return
    }

    if (!formData.workplaceId) {
      setError('Le lieu de travail est requis')
      return
    }

    console.log('Form Data to submit:', formData)

    const workerData = {
      ...formData,
      salaireHebdomadaire: Number(formData.salaireHebdomadaire)
    }

    updateWorkerMutation.mutate(workerData, {
      onSuccess: (data) => {
        if (data.status === 'failed') return
        closeDialog()
      },
      onError: (error) => {
        setError(error.message || 'Une erreur est survenue lors de la mise à jour du worker')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Mettre à jour l&apos;employé</DialogTitle>
          <DialogDescription className="text-background/80">
            Modifier les informations de l&apos;employé ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left text-base">
              Nom (*)
            </Label>
            <Input
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-left text-base">
              Téléphone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Téléphone"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Salaire */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salaireHebdomadaire" className="text-left text-base">
              Salaire hebdomadaire (*)
            </Label>
            <Input
              id="salaireHebdomadaire"
              name="salaireHebdomadaire"
              type="number"
              value={formData.salaireHebdomadaire}
              onChange={handleChange}
              placeholder="Salaire"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Workplace */}
          <WorkplaceSelect
            handleWorkplaceChange={handleWorkplaceChange}
            workPlaceId={formData.workplaceId}
          />

          {/* Errors */}
          <div className="text-base text-destructive">
            {error && <p className="text-destructive">{error}</p>}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="text-base mr-2 border-2">
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="text-base"
            onClick={handleSubmit}
            disabled={updateWorkerMutation.isPending}
          >
            {updateWorkerMutation.isPending ? 'Mise à jour...' : 'Mettre à jour l’employé'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
