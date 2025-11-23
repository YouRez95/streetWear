import { useFaconnierSummary } from '@renderer/hooks/useFaconnier'
import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { CreditCard, PackageMinus, Send, Undo2, Wallet, Wallet2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-4 h-4" />,
  totalQuantityReturned: <Undo2 className="w-4 h-4" />,
  totalValueSent: <Wallet className="w-4 h-4" />,
  totalAdvances: <CreditCard className="w-4 h-4" />,
  totalQuantityRestants: <PackageMinus className="w-4 h-4" />,
  totalAvancesRestantes: <Wallet2 className="w-4 h-4" />
}

type Stat = {
  key:
    | 'totalQuantitySent'
    | 'totalQuantityReturned'
    | 'totalValueSent'
    | 'totalAdvances'
    | 'totalQuantityRestants'
    | 'totalAvancesRestantes'
  label: string
  value: string | number
  percentage?: number
}

export default function FaconnierHeader() {
  const { selectedFaconnierId, selectedBonId } = useUserStore()
  const { data: dataSummary } = useFaconnierSummary(selectedFaconnierId, selectedBonId)

  const totalSent = dataSummary?.summary?.totalQuantitySent || 0
  const totalReturned = dataSummary?.summary?.totalQuantityReturned || 0
  const totalValue = dataSummary?.summary?.totalValueSent || 0
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0
  const remainingQuantity = totalSent - totalReturned
  const remainingAmount = totalValue - totalAdvances

  const stats: Stat[] = [
    {
      key: 'totalQuantitySent',
      label: 'Envoyés',
      value: totalSent
    },
    {
      key: 'totalQuantityReturned',
      label: 'Retournés',
      value: totalReturned,
      percentage: totalSent > 0 ? (totalReturned / totalSent) * 100 : 0
    },
    {
      key: 'totalQuantityRestants',
      label: 'Restants',
      value: remainingQuantity,
      percentage: totalSent > 0 ? (remainingQuantity / totalSent) * 100 : 0
    },
    {
      key: 'totalValueSent',
      label: 'À payer',
      value: totalValue
    },
    {
      key: 'totalAdvances',
      label: 'Avances',
      value: totalAdvances,
      percentage: totalValue > 0 ? (totalAdvances / totalValue) * 100 : 0
    },
    {
      key: 'totalAvancesRestantes',
      label: 'Reste à payer',
      value: remainingAmount,
      percentage: totalValue > 0 ? (remainingAmount / totalValue) * 100 : 0
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
                stat.key === 'totalAvancesRestantes' && remainingAmount > 0
                  ? 'bg-secondary text-primary-foreground'
                  : stat.key === 'totalAvancesRestantes'
                    ? 'bg-secondary text-primary-foreground'
                    : stat.key === 'totalQuantityRestants' && remainingQuantity > 0
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
                  stat.key === 'totalQuantityReturned' && stat.percentage > 50
                    ? 'bg-red-100 text-red-700'
                    : stat.key === 'totalAvancesRestantes' && stat.percentage > 0
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                )}
              >
                {stat.percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-between gap-5">
            <p className="text-xs font-medium text-background uppercase tracking-wide">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-semibold text-gray-900">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              <span className="text-xs text-gray-500 font-medium">
                {stat.key.includes('Quantity') ? 'pcs' : 'Dhs'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
