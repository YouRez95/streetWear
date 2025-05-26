import revenueIcon from '@/assets/icons/revenue-icon.svg'

const season = 'Spring 2025'
const revenue = 386450

export default function SeasonRevenueCard() {
  return (
    <div className="flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24">
      <div className="p-3 bg-secondary rounded-full">
        <img src={revenueIcon} alt="cash" className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-lg font-semibold">Chiffre d'affaires</h3>
        <p className="text-3xl font-bold tracking-tight font-bagel">
          {revenue.toLocaleString('fr-MA')} <span className="text-base font-medium">DH</span>
        </p>
      </div>
    </div>
  )
}
