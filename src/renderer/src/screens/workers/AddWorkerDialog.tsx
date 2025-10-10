import { Button } from '@/components/ui/button'
import { useCreateWeekRecord } from '@renderer/hooks/useWorkers'
import { useWorkerStore } from '@renderer/store'
import { LucideUserPlus2, X } from 'lucide-react'
import { useState } from 'react'
import SelectWorkerFilter from './SelectWorkerFilter'

export default function AddWorkerDialog() {
  const { weekId, workplaceId } = useWorkerStore()
  const { mutate: createWeekRecordMutation, isPending } = useCreateWeekRecord()
  const [workerId, setWorkerId] = useState('')
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    if (!workerId) return
    createWeekRecordMutation(
      { weekId, workplaceId, workerId },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            setOpen(false)
            setWorkerId('')
          }
        }
      }
    )
  }

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(true)
          setWorkerId('')
        }}
      >
        <LucideUserPlus2 className="w-6 h-6 text-foreground" />
        <span className="text-foreground font-medium">Ajouter un nouvel employé</span>
      </Button>

      {/* Custom dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-xl bg-foreground p-6 shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-background/70 hover:text-background"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="text-lg font-semibold text-background">Ajouter un employé</h2>
            <p className="mt-1 text-sm text-background/70">
              Sélectionnez un employé pour cette semaine.
            </p>

            {/* Worker selector */}
            <div className="mt-4">
              <SelectWorkerFilter value={workerId} onValueChange={setWorkerId} />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="ghost"
                className="border border-background/35"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="button" disabled={!workerId || isPending} onClick={handleSave}>
                {isPending ? 'Enregistrement…' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
