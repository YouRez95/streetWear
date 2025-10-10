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
import { useCreateWorkPlace } from '@renderer/hooks/useWorkers'
import { useState } from 'react'
export function CreateWorkPlaceDialog() {
  const createWorkPlaceMutation = useCreateWorkPlace()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, address } = formData
    if (!name) {
      setError('Le nom est requis')
      return
    }

    // Call the API to create a new faconnier
    createWorkPlaceMutation.mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setFormData({
            name: '',
            address: ''
          })
          setOpen(false)
        }
      }
    )
  }

  function resetForm() {
    setOpen(false)
    setFormData({
      name: '',
      address: ''
    })
    setError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg"
          onClick={() => setOpen(true)}
        >
          <span>+</span>
          Ajouter un atelier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Créer un nouveau atelier</DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouveau atelier en remplissant les informations ci-dessous.
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
          {/* Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-left text-base">
              Adresse
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>
        </form>
        <DialogFooter className="flex items-center justify-between ">
          {error && (
            <div className="text-base text-destructive flex items-center gap-2 border border-destructive px-3 rounded-lg">
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
              Créer un atelier
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
