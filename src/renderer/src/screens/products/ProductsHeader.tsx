import { Progress } from '@/components/ui/progress'
import { useGetAllProductsStatus } from '@renderer/hooks/useProduct'
import { PackageCheck, PackageOpen, PackageSearch, PackageX, UserCheck2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  total: <PackageSearch className="w-4 h-4" />,
  stock: <PackageX className="w-4 h-4" />,
  faconnier: <PackageOpen className="w-4 h-4" />,
  ready: <PackageCheck className="w-4 h-4" />,
  client: <UserCheck2 className="w-4 h-4" />
}

type Stat = {
  key: 'total' | 'stock' | 'faconnier' | 'ready' | 'client'
  label: string
  value: number
  subValue?: number
  subLabel?: string
  percentage?: number
}

export default function ProductsHeader() {
  const { data, isLoading } = useGetAllProductsStatus()

  const totalPcs =
    (data?.totalStatusResult.raw_in_stock || 0) +
    (data?.totalStatusResult.quantity_at_faconnier || 0) +
    (data?.totalStatusResult.quantity_ready || 0) +
    (data?.totalStatusResult.quantity_with_client || 0) +
    (data?.totalStatusResult.quantity_returned_client || 0)

  const stats: Stat[] = [
    {
      key: 'total',
      label: 'Total',
      value: data?.totalProducts || 0,
      subValue: totalPcs,
      subLabel: 'pièces'
    },
    {
      key: 'stock',
      label: 'Stock brut',
      value: data?.totalStatusResult.raw_in_stock || 0,
      percentage: ((data?.totalStatusResult.raw_in_stock || 0) / totalPcs) * 100
    },
    {
      key: 'faconnier',
      label: 'Façonnier',
      value: data?.totalStatusResult.quantity_at_faconnier || 0,
      percentage: ((data?.totalStatusResult.quantity_at_faconnier || 0) / totalPcs) * 100
    },
    {
      key: 'ready',
      label: 'Prêt',
      value: data?.totalStatusResult.quantity_ready || 0,
      percentage: ((data?.totalStatusResult.quantity_ready || 0) / totalPcs) * 100
    },
    {
      key: 'client',
      label: 'Client',
      value: data?.totalStatusResult.quantity_with_client || 0,
      percentage: ((data?.totalStatusResult.quantity_with_client || 0) / totalPcs) * 100
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
            <div
              className={`
                p-2 rounded-lg
                bg-secondary text-primary-foreground
              `}
            >
              {iconMap[stat.key]}
            </div>

            {/* Percentage badge */}
            {stat.percentage !== undefined && (
              <div
                className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${stat.percentage > 50 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                `}
              >
                {stat.percentage.toFixed(0)}%
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-background uppercase tracking-wide">
              {stat.label}
            </p>

            <div className="flex items-baseline gap-1">
              <p className="text-lg font-semibold text-gray-900">{stat.value.toLocaleString()}</p>
              <span className="text-xs text-gray-500 font-medium">
                {stat.key === 'total' ? 'prod' : 'pcs'}
              </span>
            </div>
          </div>

          {/* Sub value for total */}
          {stat.subValue !== undefined && (
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">{stat.subLabel}:</span>
              <span className="text-xs font-semibold text-gray-700">
                {stat.subValue.toLocaleString()} pcs
              </span>
            </div>
          )}
          {/* Progress bar for distribution stats */}
          {stat.percentage !== undefined && stat.key !== 'total' && (
            <div className="absolute bottom-2 left-3 right-3">
              <Progress
                value={stat.percentage}
                className="h-1"
                indicatorClassName={`
                  ${stat.key === 'stock' ? 'bg-gray-400' : ''}
                  ${stat.key === 'faconnier' ? 'bg-purple-500' : ''}
                  ${stat.key === 'ready' ? 'bg-green-500' : ''}
                  ${stat.key === 'client' ? 'bg-amber-500' : ''}
                `}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
