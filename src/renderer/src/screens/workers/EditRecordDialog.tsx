import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { useUpdateWeekRecord } from '@renderer/hooks/useWorkers'
import { useWorkerStore } from '@renderer/store'
import { useState } from 'react'
import { WorkerRecordEdit } from './WorkersTable'

type EditRecordDialogProps = {
  editingRecord: WorkerRecordEdit
  setEditingRecord: React.Dispatch<React.SetStateAction<WorkerRecordEdit | null>>
}

export default function EditRecordDialog({
  editingRecord,
  setEditingRecord
}: EditRecordDialogProps) {
  const { weekId, workplaceId } = useWorkerStore()
  const { mutate: updateWeekrecordMutation, isPending } = useUpdateWeekRecord()
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // List of required keys (hours & overtime + avance)
    const requiredKeys = [
      'lundi',
      'lundiSupp',
      'mardi',
      'mardiSupp',
      'mercredi',
      'mercrediSupp',
      'jeudi',
      'jeudiSupp',
      'vendredi',
      'vendrediSupp',
      'samedi',
      'samediSupp',
      'avance'
    ] as const

    // Find any missing key
    const missingKeys = requiredKeys.filter((key) => editingRecord[key] === undefined)
    if (missingKeys.length > 0) {
      setErrorMsg(
        `Veuillez entrer une valeur pour : ${missingKeys
          .map((k) => {
            if (k === 'avance') return 'avance'
            return k.replace('Supp', ' sup.')
          })
          .join(', ')} ou mettre 0 si aucun horaire / avance`
      )
      return
    }
    console.log('Submitting record:', editingRecord)
    setErrorMsg('')
    updateWeekrecordMutation(
      { recordData: editingRecord, weekId, workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            setEditingRecord(null)
          }
        }
      }
    )
  }

  return (
    <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
      <DialogContent className="bg-foreground">
        <DialogHeader>
          <DialogTitle>Modifier {editingRecord?.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4 text-sm text-background/70">
          Mettre à jour les heures travaillées pour chaque jour
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Days section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 pl-24">
              <span className="flex-1 text-xs font-medium uppercase tracking-wide text-background/60">
                Heures normales
              </span>
              <span className="flex-1 text-xs font-medium uppercase tracking-wide text-background/60">
                Heures sup.
              </span>
            </div>

            {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'].map((day) => (
              <div key={day} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="w-24 font-medium capitalize text-background/90">{day}</label>
                <div className="flex gap-2 w-full">
                  <Input
                    type="number"
                    className="flex-1 border-background/35"
                    min={0}
                    step="any"
                    value={editingRecord?.[day]?.toString() ?? ''}
                    onChange={(e) =>
                      setEditingRecord((prev) =>
                        prev
                          ? {
                              ...prev,
                              [day]: e.target.value === '' ? undefined : Number(e.target.value)
                            }
                          : prev
                      )
                    }
                  />
                  <Input
                    type="number"
                    className="flex-1 border-background/35"
                    min={0}
                    step="any"
                    value={
                      editingRecord?.[`${day}Supp` as keyof WorkerRecordEdit]?.toString() ?? ''
                    }
                    onChange={(e) =>
                      setEditingRecord((prev) =>
                        prev
                          ? {
                              ...prev,
                              [`${day}Supp`]:
                                e.target.value === '' ? undefined : Number(e.target.value)
                            }
                          : prev
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Avance section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <label className="w-24 font-medium text-background/90 ">Avance</label>
            <div className="w-full">
              <Input
                type="number"
                className="flex-1 border-background/35 placeholder:text-background/35"
                placeholder="Montant de l’avance"
                min={0}
                value={editingRecord?.avance?.toString() ?? ''}
                onChange={(e) =>
                  setEditingRecord((prev: any) => ({
                    ...prev,
                    avance: e.target.value === '' ? undefined : Number(e.target.value)
                  }))
                }
              />
            </div>
          </div>

          {/* Description section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <label className="w-24 font-medium text-background/90">Description</label>
            <div className="w-full">
              <textarea
                className="w-full p-2 border border-background/35 rounded-md  text-background placeholder:text-background/40"
                placeholder="Ajouter une description ou des notes..."
                value={editingRecord?.description ?? ''}
                onChange={(e) =>
                  setEditingRecord((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                rows={3}
              />
            </div>
          </div>
          <div>{errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}</div>

          {/* Footer */}
          <DialogFooter className="pt-4 border-t border-background/20">
            <Button
              type="button"
              variant="ghost"
              className="border"
              onClick={() => setEditingRecord(null)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
