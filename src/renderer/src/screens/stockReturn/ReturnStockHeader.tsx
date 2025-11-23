import { useGetSummaryReturnStock } from '@renderer/hooks/useReturnStock'
import { cn } from '@renderer/lib/utils'
import { PackageCheck, PackageOpen, PackageSearch, PackageX, UserCheck2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  total: <PackageCheck className="w-4 h-4" />,
  available: <PackageOpen className="w-4 h-4" />,
  used: <PackageX className="w-4 h-4" />,
  clients: <UserCheck2 className="w-4 h-4" />,
  topProduct: <PackageSearch className="w-4 h-4" />
}

type Stat = {
  key: 'total' | 'available' | 'used' | 'clients' | 'topProduct'
  label: string
  value: string | number
  percentage?: number
  rawValue?: number
}

export default function ReturnStockHeader() {
  const { data, isLoading } = useGetSummaryReturnStock()

  const initialData = {
    totalReturned: 0,
    available: 0,
    used: 0,
    clientCount: 0,
    topProduct: 'Unknown - 0 pcs'
  }

  if (data?.summary) {
    const { total, available, used, clientCount, topProduct } = data.summary
    initialData.totalReturned = total || 0
    initialData.available = available || 0
    initialData.used = used || 0
    initialData.clientCount = clientCount || 0
    initialData.topProduct = topProduct || 'Unknown - 0 pcs'
  }

  const { totalReturned, available, used, clientCount, topProduct } = initialData

  const stats: Stat[] = [
    {
      key: 'total',
      label: 'Total retournés',
      value: totalReturned,
      rawValue: totalReturned
    },
    {
      key: 'available',
      label: 'Disponible',
      value: available,
      rawValue: available,
      percentage: totalReturned > 0 ? (available / totalReturned) * 100 : 0
    },
    {
      key: 'used',
      label: 'Utilisée',
      value: used,
      rawValue: used,
      percentage: totalReturned > 0 ? (used / totalReturned) * 100 : 0
    },
    {
      key: 'clients',
      label: 'Clients',
      value: clientCount,
      rawValue: clientCount
    },
    {
      key: 'topProduct',
      label: 'Top produit',
      value: topProduct
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-3 border border-gray-100 min-h-[80px] animate-pulse"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-10 h-5 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="relative bg-white rounded-lg p-3 shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200 group min-h-[80px]"
        >
          {/* Icon with contextual background */}
          <div className="flex items-start justify-between mb-2">
            <div className={cn('p-2 rounded-lg bg-secondary text-primary-foreground')}>
              {iconMap[stat.key]}
            </div>

            {/* Percentage badge */}
            {stat.percentage !== undefined && (
              <div
                className={cn(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  stat.key === 'available' && 'bg-green-100 text-green-700',
                  stat.key === 'used' && 'bg-amber-100 text-amber-700'
                )}
              >
                {stat.percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.label}
            </p>

            {stat.key === 'topProduct' ? (
              // Special handling for top product with truncation
              <div className="space-y-1">
                <p
                  className="text-sm font-semibold text-gray-900 truncate"
                  title={String(stat.value)}
                >
                  {String(stat.value).split(' - ')[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {String(stat.value).split(' - ')[1] || '0 pcs'}
                </p>
              </div>
            ) : (
              // Standard numeric values
              <div className="flex items-baseline gap-1">
                <p className="text-lg font-semibold text-gray-900">
                  {typeof stat.rawValue === 'number' ? stat.rawValue.toLocaleString() : stat.value}
                </p>
                <span className="text-xs text-gray-500 font-medium">
                  {stat.key === 'clients' ? 'clients' : 'pcs'}
                </span>
              </div>
            )}
          </div>

          {/* Progress bar for availability/usage stats */}
          {(stat.key === 'available' || stat.key === 'used') && stat.percentage !== undefined && (
            <div className="absolute bottom-2 left-3 right-3">
              <div className={cn('h-1 rounded-full bg-gray-100 overflow-hidden')}>
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    stat.key === 'available' && 'bg-green-500',
                    stat.key === 'used' && 'bg-amber-500'
                  )}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
