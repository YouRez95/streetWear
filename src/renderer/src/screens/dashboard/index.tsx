import { useUserStore } from '@renderer/store'
import CashFlowChart from './CashFlowChart'
import ClientsOutstandingCard from './ClientsOutstandingCard'
import FaconnierOutstandingCard from './FaconnierOutstandingCard'
import { LastFiveSeasonSales } from './LastFiveSeasonSales'
import { OpenBonsFaconnierCard } from './OpenBonsFaconnier'
import SeasonRevenueCard from './SeasonRevenue'
import TopClientsBar from './TopClientsBar'
import { TopProductsTrend } from './TopProductsTrend'
import { OpenBonsClientCard } from './openBonsClient'

export default function Dashboard() {
  const { activeSeason } = useUserStore()
  return (
    <div className="flex flex-col gap-3 min-h-[calc(100vh-100px)] bg-foreground rounded-xl w-full p-3">
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <SeasonRevenueCard />
        <OpenBonsFaconnierCard />
        <FaconnierOutstandingCard />
        <OpenBonsClientCard />
        <ClientsOutstandingCard />
      </div>
      <div className="flex justify-start gap-4">
        <TopProductsTrend activeSeasonName={activeSeason?.name} />
        <LastFiveSeasonSales activeSeasonName={activeSeason?.name} />
      </div>

      <div className="flex justify-start gap-4">
        <CashFlowChart />
        <TopClientsBar />
      </div>
    </div>
  )
}
