import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@renderer/components/ui/hover-card'
import { useWeekRecords } from '@renderer/hooks/useWorkers'
import { useWorkerStore } from '@renderer/store'
import { formatIndex } from '@renderer/utils'
import { Check, HandCoins, Info, Pencil, Trash, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DeleteRecordDialog } from './DeleteRecordDialog'
import EditRecordDialog from './EditRecordDialog'
import { PaymentModal } from './PaymentModal'

export type WorkerRecordEdit = {
  id: string
  name: string
  lundi: number
  lundiSupp: number
  mardi: number
  mardiSupp: number
  mercredi: number
  mercrediSupp: number
  jeudi: number
  jeudiSupp: number
  vendredi: number
  vendrediSupp: number
  samedi: number
  samediSupp: number
  description: string | null
  avance: number
}

type WorkersTableProps = {
  setNextWeekId: React.Dispatch<React.SetStateAction<string>>
  setPrevWeekId: React.Dispatch<React.SetStateAction<string>>
}

export const WorkersTable = ({ setNextWeekId, setPrevWeekId }: WorkersTableProps) => {
  const { weekId, workplaceId } = useWorkerStore()
  const { data, isPending, isError } = useWeekRecords(weekId, workplaceId)
  const [editingRecord, setEditingRecord] = useState<WorkerRecordEdit | null>(null)
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null)
  const [deleteRecordName, setDeleteRecordName] = useState<string | null>(null)

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean
    recordId: string | null
    reste: number | null
    type: 'pay' | 'undo'
    workerName: string | null
  }>({
    open: false,
    recordId: null,
    reste: null,
    workerName: null,
    type: 'pay'
  })

  useEffect(() => {
    if (!data) return

    setNextWeekId(data.nextWeekId ?? '')
    setPrevWeekId(data.prevWeekId ?? '')
  }, [data, setNextWeekId, setPrevWeekId])

  if (!weekId || !workplaceId) {
    return (
      <div className="text-background/50 text-center my-10">
        Veuillez sélectionner un atelier et une semaine
      </div>
    )
  }

  if (isPending) return <div className="p-4 text-sm">Loading...</div>
  if (isError || !data) return <div className="p-4 text-sm text-red-500">Failed to load data</div>

  const records = data.records || []

  return (
    <>
      <div className="overflow-auto rounded-lg border border-background/35">
        <Table className="w-full border-collapse text-base">
          {/* Table Header */}
          <TableHeader>
            <TableRow className="border border-background/35 divide-x divide-background/35">
              <TableHead className="text-background/65 min-w-10">N</TableHead>
              <TableHead className="text-background/65 min-w-[120px]">Nom</TableHead>
              <TableHead className="text-background/65 min-w-[80px]">Salaire</TableHead>
              <TableHead className="text-background/65 min-w-[70px]">S. jour</TableHead>
              <TableHead className="text-background/65 min-w-[70px]">S. heure</TableHead>
              <TableHead colSpan={6} className="p-0 min-w-[300px]">
                <div className="flex flex-col w-full">
                  <div className="border-b border-background/35 text-center text-background/65 py-2 px-4">
                    Les Jours
                  </div>
                  <div className="grid grid-cols-6 divide-x divide-background/35">
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Lu</div>
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Ma</div>
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Me</div>
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Je</div>
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Ve</div>
                    <div className="text-center text-background/65 py-2 px-2 min-w-[50px]">Sa</div>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[70px]">H. supp</TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">
                T. heures
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[90px]">
                T. Salaire
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">Avance</TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">Reste</TableHead>
              <TableHead className="text-background/65 text-right w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={16} className="text-center p-4 text-background/65">
                  No records found.
                </TableCell>
              </TableRow>
            )}
            {records.map((rec, index) => {
              const dailyRate = rec.salaireHebdomadaire / 6
              const hourlyRate = dailyRate / 9.5
              const extraHours =
                rec.lundiSupp +
                rec.mardiSupp +
                rec.mercrediSupp +
                rec.jeudiSupp +
                rec.vendrediSupp +
                rec.samediSupp
              const normalHours =
                rec.lundi + rec.mardi + rec.mercredi + rec.jeudi + rec.vendredi + rec.samedi
              const totalHours = normalHours + extraHours
              const totalSalaire = totalHours * hourlyRate
              const reste = totalSalaire - rec.avance
              return (
                <TableRow
                  key={rec.id}
                  className={`border border-background/35 divide-x divide-background/35 hover:bg-background/5 ${rec.isPaid ? '' : 'bg-destructive/5'}`}
                >
                  <TableCell className="font-medium w-10">{formatIndex(index)}</TableCell>
                  <TableCell className="font-medium">{rec.worker.name}</TableCell>
                  <TableCell className="text-right">{rec.salaireHebdomadaire} dh</TableCell>
                  <TableCell className="text-right">{dailyRate.toFixed(0)} dh</TableCell>
                  <TableCell className="text-right">{hourlyRate.toFixed(0)} dh</TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.lundi}</span>
                  </TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.mardi}</span>
                  </TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.mercredi}</span>
                  </TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.jeudi}</span>
                  </TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.vendredi}</span>
                  </TableCell>
                  <TableCell className="text-center py-3 px-2 min-w-[50px]">
                    <span className="inline-block min-w-[30px]">{rec.samedi}</span>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{extraHours}</TableCell>
                  <TableCell className="text-center font-semibold">{totalHours}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {totalSalaire.toFixed(0)} dh
                  </TableCell>
                  <TableCell className="text-right">{rec.avance} dh</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {rec.isPaid ? '0.00' : reste.toFixed(0)} dh
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex justify-end gap-1">
                      {/* Edit Record Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border text-secondary hover:text-secondary border-secondary/40 hover:bg-secondary/10 p-2 rounded-lg"
                        onClick={() =>
                          setEditingRecord({
                            avance: rec.avance,
                            name: rec.worker.name,
                            id: rec.id,
                            jeudi: rec.jeudi,
                            jeudiSupp: rec.jeudiSupp,
                            lundi: rec.lundi,
                            lundiSupp: rec.lundiSupp,
                            mardiSupp: rec.mardiSupp,
                            mercrediSupp: rec.mercrediSupp,
                            vendrediSupp: rec.vendrediSupp,
                            samediSupp: rec.samediSupp,
                            mardi: rec.mardi,
                            mercredi: rec.mercredi,
                            samedi: rec.samedi,
                            vendredi: rec.vendredi,
                            description: rec.description
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {/* Delete Record Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border text-red-500 hover:text-red-500 border-red-500/40 hover:bg-red-500/10 p-2 rounded-lg"
                        onClick={() => {
                          setDeleteRecordId(rec.id)
                          setDeleteRecordName(rec.worker.name)
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      {/* Payement button */}

                      {reste > 0 && (
                        <>
                          {!rec.isPaid ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="border text-red-500 hover:text-red-500 border-red-500/40 hover:bg-red-500/10 p-2 rounded-lg"
                              onClick={() =>
                                setPaymentModal({
                                  open: true,
                                  recordId: rec.id,
                                  reste: reste,
                                  workerName: rec.worker.name,
                                  type: 'pay'
                                })
                              }
                            >
                              <HandCoins className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="relative group">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="border text-green-600 border-green-500/40 bg-green-500/10 p-2 rounded-lg transition-all duration-200 group-hover:opacity-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute inset-0 border text-orange-500 hover:text-orange-500 border-orange-500/40 hover:bg-orange-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                onClick={() =>
                                  setPaymentModal({
                                    open: true,
                                    recordId: rec.id,
                                    reste: reste,
                                    workerName: rec.worker.name,
                                    type: 'undo'
                                  })
                                }
                              >
                                <Undo2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Info Hover Card - only show if description exists */}
                      {rec.description && (
                        <HoverCard>
                          <HoverCardTrigger className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                            <Info className="w-4 h-4" />
                          </HoverCardTrigger>
                          <HoverCardContent className="text-left mr-4 text-sm font-normal">
                            {rec.description}
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editingRecord && (
        <EditRecordDialog editingRecord={editingRecord} setEditingRecord={setEditingRecord} />
      )}

      {deleteRecordId && deleteRecordName && (
        <DeleteRecordDialog
          recordName={deleteRecordName}
          setRecordName={setDeleteRecordName}
          recordId={deleteRecordId}
          setRecordId={setDeleteRecordId}
        />
      )}

      <PaymentModal
        open={paymentModal.open}
        recordId={paymentModal.recordId}
        reste={paymentModal.reste}
        type={paymentModal.type}
        workerName={paymentModal.workerName}
        onClose={() =>
          setPaymentModal({
            open: false,
            workerName: null,
            recordId: null,
            reste: null,
            type: 'pay'
          })
        }
      />
    </>
  )
}
