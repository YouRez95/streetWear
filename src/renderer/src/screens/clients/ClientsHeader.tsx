import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { Banknote, Package, Receipt, Wallet } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  totalQuantityOrdered: <Package className="w-6 h-6 text-muted-foreground" />,
  totalOrderValue: <Receipt className="w-6 h-6 text-muted-foreground" />,
  totalAdvancesReceived: <Wallet className="w-6 h-6 text-muted-foreground" />,
  remainingBalance: <Banknote className="w-6 h-6 text-muted-foreground" />
}

type Stat = {
  key: 'totalQuantityOrdered' | 'totalOrderValue' | 'totalAdvancesReceived' | 'remainingBalance'
  label: string
  value: string | number
  percentage: number
}

export default function ClientsHeader() {
  const { selectedClientId, selectedClientBonId } = useUserStore()
  // const { data: dataSummary } = useClientSummary(selectedClientId)
  const dataSummary = {
    summary: {
      totalQuantityOrdered: 100,
      totalOrderValue: 20,
      totalAdvancesReceived: 1000,
      remainingBalance: 50
    }
  }
  const stats: Stat[] = [
    {
      key: 'totalQuantityOrdered',
      label: 'Quantité totale commandée',
      value: dataSummary?.summary?.totalQuantityOrdered || 0,
      percentage: 0
    },
    {
      key: 'totalOrderValue',
      label: 'Montant total commandé',
      value: dataSummary?.summary?.totalOrderValue || 0,
      percentage:
        ((dataSummary?.summary?.totalOrderValue || 0) /
          (dataSummary?.summary?.totalQuantityOrdered || 0)) *
          100 || 0
    },
    {
      key: 'totalAdvancesReceived',
      label: 'Total avances',
      value: dataSummary?.summary?.totalAdvancesReceived || 0,
      percentage: 0
    },
    {
      key: 'remainingBalance',
      label: 'Solde restant',
      value: dataSummary?.summary?.remainingBalance || 0,
      percentage: 0
    }
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
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
                  {stat.value} {stat.key === 'totalQuantityOrdered' ? 'pcs' : 'dhs'}
                </p>
                {stat.key !== 'totalQuantityOrdered' && stat.key !== 'totalOrderValue' && (
                  <div
                    className={cn(
                      'flex items-center gap-1 p-1 px-3 mt-2 rounded-full text-sm font-medium',
                      stat.percentage > 99.99
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
