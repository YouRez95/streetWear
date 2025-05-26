import { useFaconnierSummary } from '@renderer/hooks/useFaconnier'
import { cn } from '@renderer/lib/utils'
import { useUserStore } from '@renderer/store'
import { CreditCard, Send, Undo2, Wallet } from 'lucide-react'
import { JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-6 h-6 text-muted-foreground" />,
  totalQuantityReturned: <Undo2 className="w-6 h-6 text-muted-foreground" />,
  totalValueSent: <Wallet className="w-6 h-6 text-muted-foreground" />,
  totalAdvances: <CreditCard className="w-6 h-6 text-muted-foreground" />
}

type Stat = {
  key: 'totalQuantitySent' | 'totalQuantityReturned' | 'totalValueSent' | 'totalAdvances'
  label: string
  value: string | number
  percentage: number
}

// type FaconnierHeaderProps = {
//   selectedFaconnierId: string
//   selectedBonId: string
// }

export default function FaconnierHeader() {
  const { selectedFaconnierId, selectedBonId } = useUserStore()
  const { data: dataSummary } = useFaconnierSummary(selectedFaconnierId, selectedBonId)
  const stats: Stat[] = [
    {
      key: 'totalQuantitySent',
      label: 'Quantité totale envoyée',
      value: dataSummary?.summary?.totalQuantitySent || 0,
      percentage: 0
    },
    {
      key: 'totalQuantityReturned',
      label: 'Quantité totale retournée',
      value: dataSummary?.summary?.totalQuantityReturned || 0,
      percentage:
        ((dataSummary?.summary?.totalQuantityReturned || 0) /
          (dataSummary?.summary?.totalQuantitySent || 0)) *
          100 || 0
    },
    {
      key: 'totalValueSent',
      label: 'Montant total à payer',
      value: dataSummary?.summary?.totalValueSent || 0,
      percentage: 0
    },
    {
      key: 'totalAdvances',
      label: 'Total avances',
      value: dataSummary?.summary?.totalAdvances || 0,
      percentage:
        ((dataSummary?.summary?.totalAdvances || 0) / (dataSummary?.summary?.totalValueSent || 0)) *
          100 || 0
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
                  {stat.value}{' '}
                  {stat.key === 'totalQuantitySent' || stat.key === 'totalQuantityReturned'
                    ? 'pcs'
                    : 'dhs'}
                </p>
                {stat.key !== 'totalQuantitySent' && stat.key !== 'totalValueSent' && (
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
