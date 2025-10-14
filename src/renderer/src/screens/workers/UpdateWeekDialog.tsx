import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog'
import { useUpdateWeek } from '@renderer/hooks/useWorkers'
import { useWorkerStore } from '@renderer/store'
import { parseWeekNameToDate } from '@renderer/utils'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

type UpdateWeekDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function toUTCDateString(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()
}

export default function UpdateWeekDialog({ open, setOpen }: UpdateWeekDialogProps) {
  const { workplaceId, weekId, weekName } = useWorkerStore()
  const [error, setError] = useState<string | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined)
  const { mutate: updateWeekMutation, isPending } = useUpdateWeek()

  // Generate 6 consecutive days starting from selected date
  const generateSelectedDays = (startDate: Date) => {
    const days: Date[] = []
    for (let i = 0; i < 6; i++) {
      const day = new Date(startDate)
      day.setDate(day.getDate() + i)
      days.push(day)
    }
    return days
  }

  const selectedDays = selectedStartDate ? generateSelectedDays(selectedStartDate) : []

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedStartDate(date)
    setError(null)
  }

  const handleSubmit = () => {
    if (!selectedStartDate) {
      setError('Veuillez sélectionner une date de début')
      return
    }

    if (selectedStartDate.getDay() !== 1) {
      setError('La date de début doit être un lundi')
      return
    }

    setError(null)
    updateWeekMutation(
      { weekId, weekStart: toUTCDateString(selectedStartDate), workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            setSelectedStartDate(undefined)
            setOpen(false)
          }
        }
      }
    )
  }

  useEffect(() => {
    if (open && weekName) {
      const startDate = parseWeekNameToDate(weekName)
      if (startDate) {
        setSelectedStartDate(startDate)
      }
    }
  }, [open, weekName])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          <span>Modifier une semaine</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-foreground">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <p className="text-2xl font-bagel">Modifier une semaine</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Choisissez une date de début. Les 6 jours suivants seront générés automatiquement, et la
            semaine sera créée pour le lieu de travail sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Calendar Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-muted-foreground p-4 rounded-lg">
              <CalendarComponent
                mode="single"
                selected={selectedStartDate}
                onSelect={handleDateSelect}
                className=""
                modifiers={{
                  selected: selectedDays
                }}
                modifiersStyles={{
                  selected: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))'
                  }
                }}
                classNames={{
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex w-full',
                  weekday: 'font-normal hover:bg-background/10 mx-auto rounded-md',
                  head_cell:
                    'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center',
                  row: 'flex w-full mt-2',
                  cell: 'text-center text-sm relative p-0 flex-1 focus-within:relative focus-within:z-20',
                  day: 'p-0.5 mx-0.5 font-normal hover:bg-background/10 mx-auto rounded-md',
                  day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
                  day_today: 'bg-accent text-accent-foreground',
                  day_outside: 'text-muted-foreground opacity-50',
                  day_disabled: 'text-muted-foreground opacity-50',
                  day_hidden: 'invisible'
                }}
              />
            </div>
          </div>

          {/* Selected Range Info */}
          {selectedStartDate && (
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-medium mb-2">Période sélectionnée (6 jours):</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Du:</strong> {formatDate(selectedDays[0])}
                </p>
                <p>
                  <strong>Au:</strong> {formatDate(selectedDays[5])}
                </p>
                <div className="mt-2">
                  <p className="font-medium mb-1">Jours inclus:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDays.map((day, index) => (
                      <span key={index} className="bg-primary/20 px-2 py-1 rounded text-xs">
                        {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-background/10">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/20 hover:bg-background/5">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} className="min-w-[120px]" disabled={!selectedStartDate}>
              Créer la période
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
