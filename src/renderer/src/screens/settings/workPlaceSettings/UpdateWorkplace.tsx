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
import { useUpdateWorkplace } from '@renderer/hooks/useWorkers'
import { useEffect, useState } from 'react'

type UpdateWorkplaceDialogProps = {
  workplace: WorkPlace
  open: boolean
  closeDialog: () => void
}

export function UpdateWorkplace({ workplace, open, closeDialog }: UpdateWorkplaceDialogProps) {
  const updateWorkplaceMutation = useUpdateWorkplace()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: ''
  })

  // Initialize form with workplace data when opened
  useEffect(() => {
    if (workplace && open) {
      setFormData({
        id: workplace.id,
        name: workplace.name || '',
        address: workplace.address || ''
      })
    }
  }, [workplace, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() === '') {
      setError('Le nom est requis')
      return
    }

    //console.log('Updating stylist with data:', stylistData)
    updateWorkplaceMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === 'failed') {
          return
        }
        closeDialog()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Mettre à jour l’atelier</DialogTitle>
          <DialogDescription className="text-background/80">
            Modifiez les informations de l’atelier ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Nom */}
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
              placeholder="Saisissez le nom de l’atelier"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Adresse */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-left text-base">
              Adresse
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Saisissez l’adresse de l’atelier"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>
        </form>
        <DialogFooter className="flex items-center justify-between">
          {error && (
            <div className="text-base text-destructive border border-destructive px-3 rounded">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          <div className="flex-1 justify-end flex">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="text-base mr-2 border-2">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" className="text-base" onClick={handleSubmit}>
              Mettre à jour l’atelier
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
