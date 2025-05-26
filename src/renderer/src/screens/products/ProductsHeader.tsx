import { useGetAllProductsStatus } from '@renderer/hooks/useProduct'
import { cn } from '@renderer/lib/utils'
import { PackageCheck, PackageOpen, PackageSearch, PackageX, UserCheck2 } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  total: <PackageSearch className="w-6 h-6 text-muted-foreground" />,
  stock: <PackageX className="w-6 h-6 text-muted-foreground" />,
  faconnier: <PackageOpen className="w-6 h-6 text-muted-foreground" />,
  ready: <PackageCheck className="w-6 h-6 text-muted-foreground" />,
  client: <UserCheck2 className="w-6 h-6 text-muted-foreground" />
}

type Stat = {
  key: 'total' | 'stock' | 'faconnier' | 'ready' | 'client'
  label: string
  value: string | number
  percentage: number
}

export default function ProductsHeader() {
  // const [stats, setStats] = useState<Stat[]>([])
  const { data, isLoading, isError } = useGetAllProductsStatus()

  const totalPcs =
    (data?.totalStatusResult.raw_in_stock || 0) +
    (data?.totalStatusResult.quantity_at_faconnier || 0) +
    (data?.totalStatusResult.quantity_ready || 0) +
    (data?.totalStatusResult.quantity_with_client || 0)

  const stats: Stat[] = [
    {
      key: 'total',
      label: 'Total des produits',
      value: data?.totalProducts || 0,
      percentage: 0
    },
    {
      key: 'stock',
      label: 'En stock (brut)',
      value: data?.totalStatusResult.raw_in_stock || 0,
      percentage: ((data?.totalStatusResult.raw_in_stock || 0) / totalPcs) * 100 || 0
    },
    {
      key: 'faconnier',
      label: 'Au faconnier',
      value: data?.totalStatusResult.quantity_at_faconnier || 0,
      percentage: ((data?.totalStatusResult.quantity_at_faconnier || 0) / totalPcs) * 100 || 0
    },
    {
      key: 'ready',
      label: 'Prêt',
      value: data?.totalStatusResult.quantity_ready || 0,
      percentage: ((data?.totalStatusResult.quantity_ready || 0) / totalPcs) * 100 || 0
    },
    {
      key: 'client',
      label: 'Avec le client',
      value: data?.totalStatusResult.quantity_with_client || 0,
      percentage: ((data?.totalStatusResult.quantity_with_client || 0) / totalPcs) * 100 || 0
    }
  ]

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {stats.map((stat) => {
        return (
          <div
            key={stat.key}
            className="flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24"
          >
            <div className="p-3 bg-secondary rounded-full">{iconMap[stat.key]}</div>
            <div className="flex flex-col gap-0">
              <p className="text-base text-primary/90">{stat.label}</p>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold font-bagel">
                  {stat.value} {stat.key === 'total' ? 'produits' : 'pcs'}
                </p>
                {stat.key !== 'total' && (
                  <div
                    className={cn(
                      'flex items-center gap-1 p-1 px-3 rounded-full text-sm font-medium',
                      stat.percentage > 0
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    <span>{stat.percentage.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
