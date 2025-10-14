import { Button } from '@/components/ui/button'
import { PaginationComponent } from '@renderer/components/pagination'
import { useWorkerStore, useYearStore } from '@renderer/store'
import { Calendar, ChevronDown, Clock } from 'lucide-react'
import { useState } from 'react'
import HeaderWorkerSummary from './HeaderWorker'
import HeaderWorkers from './HeaderWorkers'
import { WorkersFilter } from './WorkersFilter'
import { WorkersTable } from './WorkersTable'
import { WorkerRecordsTable } from './WorkersTableByWorker'
import { YearFilter } from './YearFilter'
import YearSummary from './YearSummary'

export default function Workers() {
  const { setWeekId, weekName, currentView, setCurrentView, currentViewInWeekly, workerId } =
    useWorkerStore()
  const { year, setYear } = useYearStore()
  const [nextWeekId, setNextWeekId] = useState('')
  const [prevWeekId, setPrevWeekId] = useState('')
  const [nextYear, setNextYear] = useState('')
  const [prevYear, setPrevYear] = useState('')
  const [totalYear, setTotalYear] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(20)

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-6 p-4">
      {/* Enhanced Header */}
      {!(currentViewInWeekly === 'workers' && currentView === 'weekly') ? (
        <HeaderWorkers totalYear={totalYear} />
      ) : (
        <HeaderWorkerSummary />
      )}

      <div className="flex-1 overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="min-h-full p-6">
            {currentView === 'weekly' ? (
              <>
                <WorkersFilter />
                {currentViewInWeekly === 'workplaces' ? (
                  <WorkersTable setNextWeekId={setNextWeekId} setPrevWeekId={setPrevWeekId} />
                ) : (
                  <WorkerRecordsTable
                    limit={limit}
                    page={page}
                    workerId={workerId}
                    setTotalPages={setTotalPages}
                  />
                )}
              </>
            ) : (
              <>
                <YearFilter totalYear={totalYear} />
                <YearSummary
                  setTotalYear={setTotalYear}
                  setNextYear={setNextYear}
                  setPrevYear={setPrevYear}
                />
              </>
            )}
          </div>
        </div>

        {/* Enhanced Navigation bar - only show for weekly view */}
        {currentView === 'weekly' && currentViewInWeekly === 'workplaces' && (
          <div className="h-18 bg-gradient-to-r from-gray-50 to-gray-100 sticky bottom-0 shrink-0 mt-auto border-t border-gray-200">
            <div className="flex justify-between items-center p-4">
              <Button
                variant="ghost"
                disabled={!prevWeekId}
                onClick={() => setWeekId(prevWeekId)}
                className="bg-secondary text-foreground hover:text-foreground font-medium hover:bg-secondary/90 transition-all duration-200 rounded-xl shadow-sm"
              >
                <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                Semaine précédente
              </Button>

              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Navigation hebdomadaire
              </div>

              <Button
                variant="outline"
                className="bg-secondary text-foreground hover:text-foreground font-medium hover:bg-secondary/90 transition-all duration-200 rounded-xl shadow-sm"
                disabled={!nextWeekId}
                onClick={() => setWeekId(nextWeekId)}
              >
                Semaine suivante
                <ChevronDown className="h-4 w-4 ml-2 -rotate-90" />
              </Button>
            </div>
          </div>
        )}

        {currentView === 'weekly' && currentViewInWeekly === 'workers' && (
          <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto">
            <PaginationComponent
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        )}

        {/* Enhanced Year navigation bar - only show for yearly view */}
        {currentView === 'yearly' && (
          <div className="h-18 bg-gradient-to-r from-blue-50 to-indigo-50 sticky bottom-0 shrink-0 mt-auto border-t border-blue-200">
            <div className="flex justify-between items-center p-4">
              <Button
                variant="outline"
                className="bg-secondary text-foreground hover:text-foreground font-medium hover:bg-secondary/90 transition-all duration-200 rounded-xl shadow-sm"
                disabled={!prevYear}
                onClick={() => setYear(prevYear)}
              >
                <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
                Année précédente
              </Button>

              <div className="hidden md:flex items-center gap-2 text-sm text-blue-500">
                <Calendar className="h-4 w-4" />
                Navigation annuelle
              </div>

              <Button
                variant="outline"
                className="bg-secondary text-foreground hover:text-foreground font-medium hover:bg-secondary/90 transition-all duration-200 rounded-xl shadow-sm"
                disabled={!nextYear}
                onClick={() => setYear(nextYear)}
              >
                Année suivante
                <ChevronDown className="h-4 w-4 ml-2 -rotate-90" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
