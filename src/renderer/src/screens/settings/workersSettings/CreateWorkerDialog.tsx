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
// import { useCreateWorker } from '@renderer/hooks/useWorker'
import { useCreateWorker } from '@renderer/hooks/useWorkers'
import { useState } from 'react'
import WorkplaceSelect from './WorkplaceSelect'

export function CreateWorkerDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    salaireHebdomadaire: '',
    workPlaceId: ''
  })

  const createWorkerMutation = useCreateWorker()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleWorkplaceChange = (id: string) => {
    if (error) setError(null)
    setFormData({ ...formData, workPlaceId: id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, salaireHebdomadaire, workPlaceId } = formData

    if (!name) {
      setError('Le nom est requis')
      return
    }

    if (!salaireHebdomadaire || Number(salaireHebdomadaire) <= 0) {
      setError('Le salaire hebdomadaire est requis et doit être supérieur à 0')
      return
    }

    if (!workPlaceId) {
      setError('Le lieu de travail est requis')
      return
    }

    console.log('Form Data to submit:', formData)

    // Call the API to create a new worker
    createWorkerMutation.mutate(
      {
        ...formData,
        salaireHebdomadaire: Number(formData.salaireHebdomadaire),
        workplaceId: formData.workPlaceId
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') return
          setFormData({ name: '', phone: '', salaireHebdomadaire: '', workPlaceId: '' })
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg">
          <span>+</span>
          Ajouter un employé
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Créer un nouveau employé</DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouveau employé en remplissant les informations ci-dessous.
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
            workPlaceId={formData.workPlaceId}
          />
        </form>
        <DialogFooter className="flex justify-between items-center">
          {error && <p className="text-base text-destructive">{error}</p>}
          <div className="flex-1 flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="text-base mr-2 border-2">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" className="text-base" onClick={handleSubmit}>
              Ajouter l'employé
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
