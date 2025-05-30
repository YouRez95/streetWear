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
import { useCreateAvanceFaconnier } from '@renderer/hooks/useFaconnier'
import { cn } from '@renderer/lib/utils'
import { ChevronDown, HandCoins } from 'lucide-react'
import { useState } from 'react'

type AddAvanceDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedFaconnierId: string
  selectedBonId: string
}

const options = ['cash', 'bank', 'cheque']

export default function AddAvanceDialog({
  open,
  setOpen,
  selectedFaconnierId,
  selectedBonId
}: AddAvanceDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { mutate: createAvanceFaconnier } = useCreateAvanceFaconnier()
  const [avanceData, setAvanceData] = useState({
    amount: 0,
    method: 'cash',
    description: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAvanceData({ ...avanceData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmitAvance = () => {
    // Validation
    if (avanceData.amount === 0 || !avanceData.amount) {
      setError('Avance amount is required')
      return
    }

    if (avanceData.method === '' || !avanceData.method) {
      setError('Avance method is required')
      return
    }

    // Submit avance
    setError(null)
    console.log('submit avance')
    createAvanceFaconnier(
      {
        faconnierId: selectedFaconnierId,
        bonId: selectedBonId,
        amount: Number(avanceData.amount),
        method: avanceData.method,
        description: avanceData.description
      },
      {
        onSuccess: (data) => {
          if (data.status === 'failed') {
            return
          }
          setOpen(false)
          setAvanceData({ amount: 0, method: '', description: '' })
        },
        onError: () => setError('Failed to add avance. Please try again.')
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setAvanceData({ amount: 0, method: 'cash', description: '' })
          setError(null)
        }
      }}
    >
      <DialogContent className="bg-foreground min-w-[700px] space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandCoins className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Ajouter une avance</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Ajouter une avance au bon sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="avance-amount" className="w-[200px]">
              Montant
            </Label>
            <Input
              type="number"
              id="avance-amount"
              name="amount"
              placeholder="Montant de l'avance"
              value={avanceData.amount || ''}
              onChange={handleChange}
              className="border-background/50 border text-background placeholder:text-background/50"
            />
          </div>

          <div className="relative flex items-center gap-2 flex-1">
            <Label htmlFor="avance-method" className="w-[100px]">
              Méthode
            </Label>
            <button
              type="button"
              name="method"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md placeholder:text-background/50"
            >
              {avanceData.method.charAt(0).toUpperCase() + avanceData.method.slice(1) ||
                'Sélectionner une méthode'}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 w-[calc(100%-80px)] bg-foreground border border-background/50 rounded-md mt-1 z-50">
                {options.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-background/10 cursor-pointer"
                    onClick={() => {
                      setAvanceData({ ...avanceData, method: option as any })
                      setIsDropdownOpen(false)
                      setError(null)
                    }}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="avance-description" className="w-[140px]">
            Description
          </Label>
          <Textarea
            id="avance-description"
            name="description"
            placeholder="Description"
            value={avanceData.description || ''}
            onChange={handleChange}
            className="border-background/50 border placeholder:text-background/50 resize-none"
          />
        </div>

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
            <Button onClick={handleSubmitAvance}>Ajouter l'avance</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
