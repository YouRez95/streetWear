import { useStylistSummary } from '@renderer/hooks/useStylist'
import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { CreditCard, HandCoins, List, Send, Wallet, Wallet2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-4 h-4" />,
  totalOrderItems: <List className="w-4 h-4" />,
  totalValueSent: <Wallet className="w-4 h-4" />,
  totalAdvances: <HandCoins className="w-4 h-4" />,
  totalAvancesRestantes: <Wallet2 className="w-4 h-4" />,
  totalPaid: <CreditCard className="w-4 h-4" />
}

type Stat = {
  key:
    | 'totalOrderItems'
    | 'totalQuantitySent'
    | 'totalValueSent'
    | 'totalAdvances'
    | 'totalAvancesRestantes'
    | 'totalPaid'
  label: string
  value: string | number
  percentage?: number
}

export default function StylistHeader() {
  const { selectedStylistId, selectedStylistBonId } = useUserStore()
  const { data: dataSummary } = useStylistSummary(selectedStylistId, selectedStylistBonId)

  const totalValue = dataSummary?.summary?.totalValueSent || 0
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0
  const remaining = totalValue - totalAdvances
  const percentPaid = totalValue > 0 ? (totalAdvances / totalValue) * 100 : 0

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
      key: 'totalValueSent',
      label: 'Total',
      value: totalValue
    },
    {
      key: 'totalPaid',
      label: 'Payé',
      value: totalAdvances,
      percentage: percentPaid
    },
    {
      key: 'totalAvancesRestantes',
      label: 'Reste à payer',
      value: remaining,
      percentage: totalValue > 0 ? (remaining / totalValue) * 100 : 0
    },
    {
      key: 'totalAdvances',
      label: 'Avances',
      value: totalAdvances,
      percentage: percentPaid
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
                stat.key === 'totalAvancesRestantes' && remaining > 0
                  ? 'bg-secondary text-primary-foreground'
                  : stat.key === 'totalAvancesRestantes'
                    ? 'bg-secondary text-primary-foreground'
                    : stat.key === 'totalPaid' && percentPaid >= 100
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
                  stat.percentage >= 100
                    ? 'bg-green-100 text-green-700'
                    : stat.percentage > 50
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                )}
              >
                {stat.percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-background uppercase tracking-wide">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-semibold text-background">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              <span className="text-xs text-gray-500 font-medium">
                {stat.key === 'totalQuantitySent'
                  ? 'pcs'
                  : stat.key === 'totalOrderItems'
                    ? 'cmd'
                    : 'Dhs'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
