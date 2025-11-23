import { Button } from '@renderer/components/ui/button'
import { useSummaryWorkers } from '@renderer/hooks/useWorkers'
import { useWorkerStore, useYearStore } from '@renderer/store'
import { Calendar, DollarSign, Table, TrendingUp, Users } from 'lucide-react'

export default function HeaderWorkers({ totalYear }: { totalYear: string | null }) {
  const {
    currentView,
    setCurrentView,
    weekName,
    workplaceId,
    weekId,
    currentViewInWeekly,
    setCurrentViewInWeekly
  } = useWorkerStore()
  const { year, workplaceId: workplaceIdYear } = useYearStore()

  const workplaceActive = currentView === 'weekly' ? workplaceId : workplaceIdYear

  const { data, isPending } = useSummaryWorkers({ weekId, workplaceId: workplaceActive })

  const summaryData = data?.summary || {
    totalWorkers: 0,
    inactiveWorkers: 0,
    totalRegularHours: 0,
    totalOvertimeHours: 0,
    totalSpent: 0,
    totalWeeks: 0,
    totalAdvances: 0,
    restApayer: 0
  }
  const totalWorkers = summaryData.totalWorkers
  const totalHours = summaryData.totalRegularHours + summaryData.totalOvertimeHours
  const totalSpent = summaryData.totalSpent
  const totalAdvances = summaryData.totalAdvances
  const totalRestApayer = summaryData.restApayer

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg border border-blue-500/30">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg translate-y-12 -translate-x-12"></div>

      <div className="relative px-4 py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg border border-white/30">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gestion des Travailleurs</h1>
              <p className="text-blue-100 text-xs">Gérez et suivez vos équipes</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/15 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
            <Button
              variant={currentView === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'weekly'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Table className="h-3 w-3" />
              Hebdo
            </Button>
            <Button
              variant={currentView === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('yearly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'yearly'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="h-3 w-3" />
              Annuel
            </Button>
          </div>
        </div>

        {/* Stats and Period Row */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4">
            {/* Period Indicator */}
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-white font-medium">
                {currentView === 'weekly'
                  ? `${weekName || 'Sélectionner semaine'}`
                  : `${year || 'Sélectionner année'}`}
              </p>
            </div>

            {/* Main KPI */}
            {currentView === 'yearly' && (
              <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5 border border-white/20">
                <DollarSign className="h-3 w-3 text-emerald-300" />
                <div>
                  <p className="text-xs text-blue-100">Coût annuel</p>
                  <p className="text-sm font-bold text-white">{isPending ? '...' : totalYear}</p>
                </div>
              </div>
            )}

            {currentView === 'weekly' && (
              <div className="flex items-center gap-4">
                {/* Employees */}
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-300" />
                  <div>
                    <p className="text-xs text-blue-100">Employés</p>
                    <p className="text-sm font-bold text-white">
                      {isPending ? '...' : totalWorkers}
                    </p>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-green-300" />
                  <div>
                    <p className="text-xs text-blue-100">Coût total</p>
                    <p className="text-sm font-bold text-white">
                      {isPending ? '...' : `${totalSpent.toFixed(0)} DHS`}
                    </p>
                  </div>
                </div>

                {/* Reste à payer */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-amber-300" />
                  <div>
                    <p className="text-xs text-blue-100">Reste à payer</p>
                    <p className="text-sm font-bold text-white">
                      {isPending ? '...' : `${totalRestApayer.toFixed(0)} DHS`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading and Additional Info */}
          <div className="flex items-center gap-3">
            {/* Additional weekly info */}
            {currentView === 'weekly' && data?.summary && !isPending && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-white/80 bg-white/10 rounded-full px-2 py-1">
                  {totalHours.toFixed(0)}h total
                </span>
                <span className="text-white/80 bg-white/10 rounded-full px-2 py-1">
                  {summaryData.totalRegularHours || 0}h rég.
                </span>
                <span className="text-white/80 bg-white/10 rounded-full px-2 py-1">
                  {summaryData.totalOvertimeHours || 0}h supp.
                </span>
              </div>
            )}

            {/* Loading indicator */}
            {isPending && (
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white"></div>
                <p className="text-xs text-white">Synchro...</p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary info row */}
        {currentView === 'weekly' && !isPending && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-white/70 text-xs bg-white/5 rounded-full px-2 py-1">
              Avances: {totalAdvances.toFixed(0)} DHS
            </span>
            <span className="text-white/70 text-xs bg-white/5 rounded-full px-2 py-1">
              Coût après avances: {(totalSpent - totalAdvances).toFixed(0)} DHS
            </span>
            {summaryData.totalWeeks > 0 && (
              <span className="text-white/70 text-xs bg-white/5 rounded-full px-2 py-1">
                {summaryData.totalWeeks} semaine{summaryData.totalWeeks > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
