import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Textarea } from '@renderer/components/ui/textarea'
import { useCreateSeason } from '@renderer/hooks/useSeason'
import { useState } from 'react'

type CreateSeassonDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateSeassonDialog({ open, setOpen }: CreateSeassonDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const createSeasonMutation = useCreateSeason()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { name, description } = formData
    if (!name) {
      setError('Name is required')
      return
    }

    // Call the API to create a new season
    console.log('Creating new season:', formData)
    createSeasonMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === 'failed') {
          return
        }
        setFormData({
          name: '',
          description: ''
        })
        setOpen(false)
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (error) setError(null)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription className="text-background/80">
            Create a new Session by filling in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="text-left text-base">
              Session name (*)
            </Label>
            <Input
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Session name"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-left text-base">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              placeholder="description"
              onChange={handleChange}
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          <div className="text-base text-destructive">
            {error && <p className="text-destructive">{error}</p>}
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="text-base mr-2 border-2">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="text-base" onClick={handleSubmit}>
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
