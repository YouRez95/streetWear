import { useClientSummary } from '@renderer/hooks/useClients'
import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { CreditCard, List, Send, Undo2, Wallet, Wallet2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-4 h-4" />,
  totalQuantityReturned: <Undo2 className="w-4 h-4" />,
  totalValueSent: <Wallet className="w-4 h-4" />,
  totalAdvances: <CreditCard className="w-4 h-4" />,
  totalAvancesRestantes: <Wallet2 className="w-4 h-4" />,
  totalOrderItems: <List className="w-4 h-4" />
}

type Stat = {
  key:
    | 'totalQuantitySent'
    | 'totalQuantityReturned'
    | 'totalValueSent'
    | 'totalAdvances'
    | 'totalAvancesRestantes'
    | 'totalOrderItems'
  label: string
  value: string | number
  percentage?: number
}

export default function ClientsHeader() {
  const { selectedClientId, selectedClientBonId } = useUserStore()
  const { data: dataSummary } = useClientSummary(selectedClientId, selectedClientBonId)

  const totalValue = dataSummary?.summary?.totalValueSent || 0
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0
  const bonRemise = dataSummary?.summary?.remise || 0

  const stats: Stat[] = [
    {
      key: 'totalOrderItems',
      label: 'Commandes',
      value: dataSummary?.summary?.totalOrderItems || 0
    },
    {
      key: 'totalQuantitySent',
      label: 'Envoyés',
      value: dataSummary?.summary?.totalQuantitySent || 0
    },
    {
      key: 'totalQuantityReturned',
      label: 'Retournés',
      value: dataSummary?.summary?.totalQuantityReturned || 0,
      percentage:
        ((dataSummary?.summary?.totalQuantityReturned || 0) /
          (dataSummary?.summary?.totalQuantitySent || 1)) *
        100
    },
    {
      key: 'totalValueSent',
      label: 'À régler',
      value: totalValue
    },
    {
      key: 'totalAdvances',
      label: 'Avances',
      value: totalAdvances,
      percentage: (totalAdvances / (totalValue || 1)) * 100
    },
    {
      key: 'totalAvancesRestantes',
      label: 'Restant',
      value: totalValue - totalAdvances - bonRemise
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="relative bg-white rounded-lg p-3 shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200 group min-h-[80px]"
        >
          {/* Icon with subtle background */}
          <div className="flex items-start justify-between mb-2">
            <div
              className={cn(
                'p-2 rounded-lg',
                stat.key === 'totalAvancesRestantes' && totalValue - totalAdvances - bonRemise > 0
                  ? 'bg-secondary text-primary-foreground'
                  : stat.key === 'totalAvancesRestantes'
                    ? 'bg-secondary text-primary-foreground'
                    : 'bg-secondary text-primary-foreground'
              )}
            >
              {iconMap[stat.key]}
            </div>

            {/* Percentage badge - positioned top right */}
            {stat.percentage !== undefined && (
              <div
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  stat.percentage > 99.99
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                )}
              >
                {stat.percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-between gap-5">
            <p className="text-xs  font-medium text-background uppercase tracking-wide">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-semibold text-gray-900">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              <span className="text-xs text-gray-500 font-medium">
                {stat.key === 'totalQuantitySent' || stat.key === 'totalQuantityReturned'
                  ? 'pcs'
                  : stat.key === 'totalOrderItems'
                    ? 'cmd'
                    : 'Dhs'}
              </span>
            </div>
          </div>

          {/* Remise badge - positioned at bottom */}
          {stat.key === 'totalAvancesRestantes' && bonRemise > 0 && (
            <div className="absolute bottom-2 left-3 right-3">
              <div className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded text-center border border-green-200">
                Remise: {bonRemise} Dhs
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
